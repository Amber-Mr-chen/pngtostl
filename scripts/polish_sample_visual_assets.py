#!/usr/bin/env python3
"""Polish public sample visuals for /samples.

This script keeps the generated STL downloads intact, but replaces the source and
preview PNGs with clearer user-facing visuals:
- source images look like real inputs for each workflow;
- preview images show a generated STL/CAD-style output with strong 3D cues;
- lithophane preview includes a backlit comparison cue;
- heightmap preview emphasizes terrain height rather than a flat icon.
"""
from __future__ import annotations

import math
import struct
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "samples"

SAMPLES = [
    ("logo-badge", "Logo badge relief", "logo", "17,940 triangles · generated STL"),
    ("universal-relief", "Universal image relief", "relief", "65,532 triangles · generated STL"),
    ("lithophane-panel", "Backlit lithophane panel", "lithophane", "65,532 triangles · generated STL"),
    ("heightmap-surface", "Heightmap surface", "heightmap", "65,532 triangles · generated STL"),
]


def font(size: int, bold: bool = False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for p in candidates:
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def checker(size=(512, 512), cell=32):
    im = Image.new("RGBA", size, (255, 255, 255, 255))
    d = ImageDraw.Draw(im)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if (x // cell + y // cell) % 2:
                d.rectangle((x, y, x + cell - 1, y + cell - 1), fill=(238, 242, 247, 255))
    return im


def save_logo_source(path: Path):
    im = checker()
    d = ImageDraw.Draw(im)
    # transparent-logo feel: dark mark floating on checkerboard
    d.rounded_rectangle((92, 82, 420, 410), radius=84, fill=(255, 255, 255, 232), outline=(15, 23, 42, 255), width=30)
    d.ellipse((184, 174, 328, 318), fill=(15, 23, 42, 255))
    d.rounded_rectangle((134, 232, 378, 286), radius=18, fill=(15, 23, 42, 255))
    d.text((164, 344), "STL", fill=(15, 23, 42, 255), font=font(62, True))
    d.rounded_rectangle((28, 28, 202, 78), radius=20, fill=(255,255,255,238))
    d.text((48, 44), "transparent PNG", fill=(71,85,105,255), font=font(18, True))
    im.save(path)


def save_universal_source(path: Path):
    im = Image.new("RGBA", (512, 512), (250, 252, 255, 255))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((42, 42, 470, 470), radius=36, fill=(255, 255, 255, 255), outline=(180, 190, 204, 255), width=4)
    # High-contrast line-art scene, not a generic image icon.
    d.line((86, 378, 426, 378), fill=(15, 23, 42, 255), width=10)
    d.polygon([(110, 340), (180, 214), (256, 340)], outline=(15, 23, 42, 255), fill=(226, 232, 240, 255))
    d.polygon([(230, 348), (322, 168), (430, 348)], outline=(15, 23, 42, 255), fill=(203, 213, 225, 255))
    d.ellipse((108, 98, 184, 174), fill=(245, 158, 11, 255), outline=(15,23,42,255), width=5)
    d.line((96, 408, 410, 408), fill=(15,23,42,255), width=8)
    d.rounded_rectangle((70, 54, 258, 98), radius=18, fill=(15,23,42,245))
    d.text((90, 68), "line art input", fill=(255,255,255,255), font=font(20, True))
    im.save(path)


def save_lithophane_source(path: Path):
    im = Image.new("L", (512, 512), 218)
    d = ImageDraw.Draw(im)
    # Photo-like grayscale portrait with visible highlights/shadows.
    for y in range(512):
        for x in range(512):
            vignette = int(32 * math.hypot((x - 256) / 256, (y - 260) / 256))
            im.putpixel((x, y), max(70, min(245, 220 - vignette)))
    d = ImageDraw.Draw(im)
    d.ellipse((154, 74, 358, 292), fill=198)   # face
    d.pieslice((128, 42, 386, 298), 185, 358, fill=82)  # hair
    d.ellipse((194, 154, 218, 178), fill=58)
    d.ellipse((294, 154, 318, 178), fill=58)
    d.arc((210, 184, 306, 246), 18, 160, fill=78, width=6)
    d.polygon([(122, 460), (206, 300), (306, 300), (390, 460)], fill=116)
    d.rectangle((0, 0, 512, 512), outline=236, width=16)
    im = im.filter(ImageFilter.GaussianBlur(0.45)).convert("RGBA")
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((28, 28, 226, 78), radius=20, fill=(255,255,255,238))
    d.text((48, 44), "grayscale photo", fill=(71,85,105,255), font=font(19, True))
    im.save(path)


def save_heightmap_source(path: Path):
    im = Image.new("L", (512, 512), 24)
    for y in range(512):
        for x in range(512):
            v = 30
            for cx, cy, amp, sigma in [
                (120, 170, 170, 70), (258, 210, 220, 95),
                (380, 340, 145, 68), (164, 386, 100, 52),
            ]:
                dx, dy = x-cx, y-cy
                v += amp * math.exp(-(dx*dx + dy*dy)/(2*sigma*sigma))
            v += 26 * math.sin(x/28) + 18 * math.cos((x+y)/46)
            im.putpixel((x, y), max(0, min(255, int(v))))
    d = ImageDraw.Draw(im)
    for level in range(58, 238, 32):
        # contour-like strokes where brightness is near the level
        pts = []
        for x in range(0, 512, 5):
            for y in range(0, 512, 5):
                raw_pixel = im.getpixel((x, y))
                if raw_pixel is None:
                    pixel = 0
                elif isinstance(raw_pixel, (int, float)):
                    pixel = int(raw_pixel)
                else:
                    pixel = int(raw_pixel[0])
                if abs(pixel - level) < 2:
                    pts.append((x, y))
        for x, y in pts[::3]:
            d.point((x, y), fill=min(255, level + 32))
    im = im.convert("RGBA")
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((28, 28, 226, 78), radius=20, fill=(255,255,255,238))
    d.text((48, 44), "grayscale heightmap", fill=(71,85,105,255), font=font(17, True))
    im.save(path)


def read_stl_vertices(path: Path):
    data = path.read_bytes()
    if len(data) < 84:
        return [], 0
    tri_count = struct.unpack_from("<I", data, 80)[0]
    if 84 + tri_count * 50 != len(data):
        return [], 0
    verts = []
    off = 84
    for _ in range(tri_count):
        off += 12
        for _ in range(3):
            verts.append(struct.unpack_from("<fff", data, off))
            off += 12
        off += 2
    return verts, tri_count


def project_vertices(verts, tri_limit=18000):
    xs = [v[0] for v in verts]; ys = [v[1] for v in verts]; zs = [v[2] for v in verts]
    cx, cy, cz = (min(xs)+max(xs))/2, (min(ys)+max(ys))/2, (min(zs)+max(zs))/2
    scale = max(max(xs)-min(xs), max(ys)-min(ys), max(zs)-min(zs), 1)
    tris = [verts[i:i+3] for i in range(0, len(verts), 3)]
    step = max(1, len(tris)//tri_limit)
    projected = []
    rz = -math.radians(34)
    rx = math.radians(60)
    for tri in tris[::step]:
        pts=[]; depth=0; height=0
        for x,y,z in tri:
            x=(x-cx)/scale; y=(y-cy)/scale; z=(z-cz)/scale
            x2=x*math.cos(rz)-y*math.sin(rz)
            y2=x*math.sin(rz)+y*math.cos(rz)
            y3=y2*math.cos(rx)-z*math.sin(rx)
            z3=y2*math.sin(rx)+z*math.cos(rx)
            pts.append((512+x2*760, 468+y3*760))
            depth += z3; height += z
        projected.append((depth/3, height/3, pts))
    projected.sort(key=lambda t: t[0])
    return projected


def render_preview(slug: str, title: str, mode: str, metrics: str):
    stl = OUT / f"{slug}.stl"
    verts, tri_count = read_stl_vertices(stl)
    if not verts:
        raise RuntimeError(f"Cannot read STL: {stl}")
    im = Image.new("RGBA", (1200, 820), (248,250,252,255))
    d = ImageDraw.Draw(im)
    # viewer grid
    for x in range(0, 1200, 40):
        d.line((x, 0, x, 820), fill=(226,232,240,145), width=1)
    for y in range(0, 820, 40):
        d.line((0, y, 1200, y), fill=(226,232,240,145), width=1)
    # Stronger mode-specific output cues.
    if mode == "lithophane":
        glow = Image.new("RGBA", im.size, (0,0,0,0))
        gd = ImageDraw.Draw(glow)
        gd.ellipse((520, 110, 1090, 720), fill=(255, 210, 122, 95))
        glow = glow.filter(ImageFilter.GaussianBlur(60))
        im.alpha_composite(glow)
    shadow = Image.new("RGBA", im.size, (0,0,0,0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse((270, 610, 930, 770), fill=(15,23,42,45))
    shadow = shadow.filter(ImageFilter.GaussianBlur(30))
    im.alpha_composite(shadow)
    d = ImageDraw.Draw(im)
    palette = {
        "logo": ((45, 62, 89), (118, 138, 166)),
        "relief": ((64, 93, 150), (154, 180, 214)),
        "lithophane": ((246, 238, 214), (188, 126, 72)),
        "heightmap": ((54, 93, 79), (142, 205, 170)),
    }[mode]
    for _depth, h, pts in project_vertices(verts):
        shade = max(-0.16, min(0.22, h))
        t = (shade + 0.16) / 0.38
        c0, c1 = palette
        fill = tuple(int(c0[i]*(1-t) + c1[i]*t) for i in range(3)) + (226,)
        outline = (255,255,255,36) if mode != "lithophane" else (255,246,224,60)
        d.polygon(pts, fill=fill, outline=outline)
    # Lithophane inset: explicit backlit cue.
    if mode == "lithophane":
        d.rounded_rectangle((786, 548, 1136, 754), radius=26, fill=(255, 246, 214, 238), outline=(249, 179, 79, 170), width=3)
        d.text((814, 572), "backlit view", fill=(126,64,12,255), font=font(22, True))
        d.text((814, 608), "thicker areas block more light", fill=(126,64,12,235), font=font(18))
        d.ellipse((982, 602, 1072, 708), fill=(94,49,23,180))
        d.polygon([(922,728),(992,626),(1068,728)], fill=(142,71,24,150))
    elif mode == "heightmap":
        # Add an explicit isometric terrain surface overlay so the sample reads as
        # a physical STL surface at homepage thumbnail size, not a blank white plane.
        terrain = Image.new("RGBA", im.size, (0, 0, 0, 0))
        td = ImageDraw.Draw(terrain)
        origin_x, origin_y = 240, 510
        cell_x, cell_y = 36, 20
        rows, cols = 11, 15
        heights = []
        for r in range(rows + 1):
            row = []
            for c in range(cols + 1):
                ridge = 72 * math.exp(-((c - 5.0) ** 2 + (r - 4.0) ** 2) / 18)
                ridge += 54 * math.exp(-((c - 10.5) ** 2 + (r - 7.0) ** 2) / 12)
                wave = 18 * math.sin(c * 0.9) + 14 * math.cos((c + r) * 0.7)
                row.append(ridge + wave)
            heights.append(row)

        def iso(c: int, r: int, h: float):
            x = origin_x + (c - r) * cell_x
            y = origin_y + (c + r) * cell_y - h
            return (x, y)

        for r in range(rows - 1, -1, -1):
            for c in range(cols):
                h00 = heights[r][c]
                h10 = heights[r][c + 1]
                h11 = heights[r + 1][c + 1]
                h01 = heights[r + 1][c]
                pts = [iso(c, r, h00), iso(c + 1, r, h10), iso(c + 1, r + 1, h11), iso(c, r + 1, h01)]
                avg = (h00 + h10 + h11 + h01) / 4
                t = max(0, min(1, avg / 120))
                fill = (
                    int(82 * (1 - t) + 166 * t),
                    int(111 * (1 - t) + 210 * t),
                    int(108 * (1 - t) + 176 * t),
                    236,
                )
                td.polygon(pts, fill=fill, outline=(255, 255, 255, 72))
        # front/side skirts make it feel like a printable solid, not a flat image.
        left_wall = [iso(0, rows, heights[rows][0]), iso(cols, rows, heights[rows][cols]), (origin_x + (cols - rows) * cell_x, 690), (origin_x - rows * cell_x, 690)]
        td.polygon(left_wall, fill=(63, 83, 96, 150))
        terrain = terrain.filter(ImageFilter.UnsharpMask(radius=1.0, percent=120, threshold=3))
        im.alpha_composite(terrain)
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((812, 562, 1138, 742), radius=24, fill=(255,255,255,232), outline=(148,163,184,180), width=2)
        d.text((840, 586), "white = high", fill=(15,23,42,255), font=font(22, True))
        d.text((840, 622), "black = low", fill=(71,85,105,255), font=font(19))
        for i in range(8):
            y=672+i*7
            d.line((842,y,1092,y+int(8*math.sin(i))), fill=(71,85,105,135), width=2)
    # title tag
    d.rounded_rectangle((38, 34, 500, 110), radius=22, fill=(255,255,255,238), outline=(226,232,240,220), width=2)
    d.text((62, 52), title, fill=(7,17,31,255), font=font(28, True))
    d.text((62, 84), metrics, fill=(79,91,107,255), font=font(17))
    # output label bottom
    d.rounded_rectangle((38, 728, 362, 780), radius=20, fill=(7,17,31,230))
    d.text((62, 744), "Generated STL preview", fill=(255,255,255,255), font=font(21, True))
    im.save(OUT / f"{slug}-preview.png")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    source_generators = {
        "logo-badge": save_logo_source,
        "universal-relief": save_universal_source,
        "lithophane-panel": save_lithophane_source,
        "heightmap-surface": save_heightmap_source,
    }
    for slug, title, mode, metrics in SAMPLES:
        source_generators[slug](OUT / f"{slug}-source.png")
        render_preview(slug, title, mode, metrics)
        print(f"polished {slug}")


if __name__ == "__main__":
    main()
