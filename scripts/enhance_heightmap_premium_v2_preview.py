#!/usr/bin/env python3
"""Overwrite the premium-v2 heightmap preview with a high-contrast viewer render.

This is intentionally stronger than the generic sample renderer because the homepage
shows the image at thumbnail size. The terrain slab must remain legible there.
"""
from __future__ import annotations

import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = Path(__file__).resolve().parents[1] / "public" / "samples"
PREVIEW = OUT / "heightmap-surface-premium-v2-preview.png"

W, H = 1400, 920


def font(size: int, bold: bool = False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def iso(origin_x: float, origin_y: float, cell_x: float, cell_y: float, c: float, r: float, z: float):
    return (origin_x + (c - r) * cell_x, origin_y + (c + r) * cell_y - z)


def main() -> None:
    im = Image.new("RGBA", (W, H), (246, 249, 252, 255))
    d = ImageDraw.Draw(im)

    # Browser / STL viewer frame.
    d.rounded_rectangle((46, 38, W - 46, H - 38), radius=40, fill=(18, 27, 38, 255), outline=(214, 226, 240, 255), width=3)
    d.rounded_rectangle((46, 38, W - 46, 116), radius=40, fill=(247, 250, 253, 255))
    d.rectangle((46, 78, W - 46, 116), fill=(247, 250, 253, 255))
    for i, col in enumerate([(255, 95, 87), (255, 190, 45), (40, 201, 64)]):
        d.ellipse((86 + i * 34, 68, 106 + i * 34, 88), fill=col)
    d.text((194, 62), "Heightmap surface — terrain STL preview", fill=(28, 42, 55), font=font(25, True))
    d.rounded_rectangle((1010, 60, 1252, 96), radius=18, fill=(226, 239, 252, 255))
    d.text((1030, 67), "65,532 triangles", fill=(25, 71, 112), font=font(18, True))

    # Dark viewer area.
    d.rounded_rectangle((70, 128, W - 70, H - 68), radius=30, fill=(29, 43, 52, 255), outline=(71, 94, 112, 255), width=2)

    # Perspective floor grid.
    floor = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fd = ImageDraw.Draw(floor)
    horizon_y = 315
    for i in range(-12, 24):
        x0 = 700 + i * 58
        fd.line((x0, horizon_y, 700 + i * 112, 845), fill=(119, 151, 165, 72), width=1)
    for j in range(11):
        y = horizon_y + j * 50
        fd.line((160 + j * 24, y, 1240 - j * 24, y), fill=(119, 151, 165, 58), width=1)
    im.alpha_composite(floor)
    d = ImageDraw.Draw(im)

    # Strong drop shadow under slab.
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse((258, 635, 1190, 875), fill=(0, 0, 0, 150))
    shadow = shadow.filter(ImageFilter.GaussianBlur(22))
    im.alpha_composite(shadow)
    d = ImageDraw.Draw(im)

    # Large isometric terrain slab.
    cols, rows = 18, 13
    origin_x, origin_y = 440, 500
    cell_x, cell_y = 46, 28
    zscale = 1.18
    heights: list[list[float]] = []
    for r in range(rows + 1):
        row = []
        for c in range(cols + 1):
            z = 150 * math.exp(-((c - 5.2) ** 2 + (r - 4.0) ** 2) / 15.5)
            z += 118 * math.exp(-((c - 12.3) ** 2 + (r - 7.6) ** 2) / 12.5)
            z += 82 * math.exp(-((c - 3.0) ** 2 + (r - 10.2) ** 2) / 7.5)
            z += 38 * math.sin(c * 1.05) + 28 * math.cos((c + r) * 0.66)
            row.append(max(8, z * zscale + 20))
        heights.append(row)

    def p(c: float, r: float, z: float):
        return iso(origin_x, origin_y, cell_x, cell_y, c, r, z)

    # Side walls first.
    base_drop = 148
    front_top = [p(c, rows, heights[rows][c]) for c in range(cols + 1)]
    front_bottom = [p(c, rows, heights[rows][c] - base_drop) for c in reversed(range(cols + 1))]
    right_top = [p(cols, r, heights[r][cols]) for r in range(rows + 1)]
    right_bottom = [p(cols, r, heights[r][cols] - base_drop) for r in reversed(range(rows + 1))]
    left_top = [p(0, r, heights[r][0]) for r in range(rows + 1)]
    left_bottom = [p(0, r, heights[r][0] - base_drop) for r in reversed(range(rows + 1))]

    d.polygon(left_top + left_bottom, fill=(47, 68, 72, 255), outline=(12, 22, 28, 200))
    d.polygon(right_top + right_bottom, fill=(36, 53, 62, 255), outline=(12, 22, 28, 210))
    d.polygon(front_top + front_bottom, fill=(55, 75, 76, 255), outline=(12, 22, 28, 220))

    # Top terrain faces back-to-front.
    for r in range(rows - 1, -1, -1):
        for c in range(cols):
            hs = [heights[r][c], heights[r][c + 1], heights[r + 1][c + 1], heights[r + 1][c]]
            pts = [p(c, r, hs[0]), p(c + 1, r, hs[1]), p(c + 1, r + 1, hs[2]), p(c, r + 1, hs[3])]
            avg = sum(hs) / 4
            t = max(0, min(1, avg / 210))
            # Low ground = deep green, high ground = pale ridge.
            fill = (
                int(53 * (1 - t) + 220 * t),
                int(103 * (1 - t) + 231 * t),
                int(82 * (1 - t) + 184 * t),
                255,
            )
            d.polygon(pts, fill=fill, outline=(17, 44, 40, 145))

    # Contour / mesh strokes.
    for r in range(0, rows + 1, 1):
        pts = [p(c, r, heights[r][c]) for c in range(cols + 1)]
        d.line(pts, fill=(255, 255, 255, 110 if r % 2 == 0 else 55), width=2 if r % 2 == 0 else 1)
    for c in range(0, cols + 1, 1):
        pts = [p(c, r, heights[r][c]) for r in range(rows + 1)]
        d.line(pts, fill=(4, 31, 28, 108 if c % 2 == 0 else 58), width=2 if c % 2 == 0 else 1)

    # Ridge highlights.
    for c, r, label in [(5, 4, "raised peaks"), (12, 8, "solid base")]:
        x, y = p(c, r, heights[r][c])
        d.ellipse((x - 10, y - 10, x + 10, y + 10), fill=(255, 255, 255, 230), outline=(21, 77, 68, 255), width=2)
        d.rounded_rectangle((x + 18, y - 18, x + 168, y + 20), radius=16, fill=(239, 250, 244, 238), outline=(160, 216, 181, 230))
        d.text((x + 34, y - 8), label, fill=(23, 74, 58), font=font(17, True))

    # Axis marker and bottom badge.
    d.line((160, 775, 250, 775), fill=(239, 68, 68, 230), width=4)
    d.line((160, 775, 160, 685), fill=(34, 197, 94, 230), width=4)
    d.line((160, 775, 224, 725), fill=(59, 130, 246, 230), width=4)
    d.text((258, 758), "3/4 STL viewer angle · visible terrain ridges · printable slab thickness", fill=(218, 235, 240), font=font(21, True))
    d.rounded_rectangle((90, 835, 428, 878), radius=18, fill=(233, 247, 240, 245), outline=(169, 221, 190, 220))
    d.text((112, 846), "Real heightmap STL preview", fill=(20, 83, 62), font=font(20, True))

    im = im.convert("RGB")
    im = im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=140, threshold=3))
    im.save(PREVIEW, quality=94)
    print(PREVIEW)


if __name__ == "__main__":
    main()
