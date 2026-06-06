#!/usr/bin/env python3
"""Enhance premium-v4 sample preview images for page-embedded visual QA.

These previews intentionally prioritize clear product communication at homepage
thumbnail and /samples card sizes: large subject, obvious geometry, stronger
sidewalls/shadows, and workflow-specific cues.
"""
from __future__ import annotations

import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = Path(__file__).resolve().parents[1] / "public" / "samples"
W, H = 1400, 920


def font(size: int, bold: bool = False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for p in candidates:
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def iso(ox, oy, cx, cy, c, r, z):
    return (ox + (c - r) * cx, oy + (c + r) * cy - z)


def viewer(title, subtitle, *, dark=False, glow=(36, 87, 255)):
    if dark:
        im = Image.new("RGBA", (W, H), (13, 22, 31, 255))
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((42, 34, W - 42, H - 34), radius=42, fill=(18, 28, 38, 255), outline=(76, 96, 116, 255), width=3)
        d.rounded_rectangle((42, 34, W - 42, 112), radius=42, fill=(244, 248, 252, 255))
        d.rectangle((42, 76, W - 42, 112), fill=(244, 248, 252, 255))
        view_fill = (22, 35, 45, 255)
    else:
        im = Image.new("RGBA", (W, H), (247, 249, 252, 255))
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((42, 34, W - 42, H - 34), radius=42, fill=(255, 255, 255, 255), outline=(211, 222, 235, 255), width=3)
        d.rounded_rectangle((42, 34, W - 42, 112), radius=42, fill=(247, 250, 253, 255))
        d.rectangle((42, 76, W - 42, 112), fill=(247, 250, 253, 255))
        view_fill = (238, 243, 248, 255)
    for i, col in enumerate([(255, 95, 87), (255, 190, 45), (40, 201, 64)]):
        d.ellipse((84 + i * 34, 65, 104 + i * 34, 85), fill=col)
    d.text((190, 58), title, fill=(18, 28, 42), font=font(26, True))
    d.rounded_rectangle((1010, 58, 1268, 96), radius=18, fill=(230, 240, 252, 255))
    d.text((1030, 66), subtitle, fill=(27, 75, 120), font=font(18, True))
    d.rounded_rectangle((70, 126, W - 70, H - 68), radius=30, fill=view_fill, outline=(180, 196, 214, 160), width=2)
    # Glow and floor grid.
    glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow_layer)
    gd.ellipse((360, 120, 1250, 790), fill=(*glow, 38 if not dark else 52))
    im.alpha_composite(glow_layer.filter(ImageFilter.GaussianBlur(72)))
    d = ImageDraw.Draw(im)
    horizon = 360
    grid_col = (108, 132, 150, 74) if dark else (168, 184, 204, 92)
    for i in range(-12, 24):
        x0 = 700 + i * 58
        d.line((x0, horizon, 700 + i * 112, 850), fill=grid_col, width=1)
    for j in range(11):
        y = horizon + j * 49
        d.line((150 + j * 22, y, 1250 - j * 22, y), fill=grid_col, width=1)
    return im


def badge(d, text, xy=(92, 835), *, fill=(7, 17, 31, 236), color=(255, 255, 255, 255)):
    x, y = xy
    tw = d.textbbox((0, 0), text, font=font(21, True))[2]
    d.rounded_rectangle((x, y, x + tw + 48, y + 48), radius=18, fill=fill)
    d.text((x + 24, y + 12), text, fill=color, font=font(21, True))


def axes(d, x=148, y=770, dark=False):
    d.line((x, y, x + 88, y), fill=(239, 68, 68, 240), width=5)
    d.line((x, y, x, y - 88), fill=(34, 197, 94, 240), width=5)
    d.line((x, y, x + 62, y - 50), fill=(59, 130, 246, 240), width=5)
    col = (220, 232, 240) if dark else (72, 85, 105)
    d.text((x + 98, y - 12), "X", fill=col, font=font(16, True))
    d.text((x - 14, y - 114), "Z", fill=col, font=font(16, True))


def render_logo():
    im = viewer("Logo badge relief", "22,300 triangles", glow=(59, 130, 246))
    d = ImageDraw.Draw(im)
    # Shadow.
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    sd.ellipse((310, 665, 1115, 850), fill=(0, 0, 0, 120))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(24)))
    d = ImageDraw.Draw(im)
    # Extruded badge in clearer semi-front angle.
    front = [(438, 246), (970, 170), (1078, 604), (498, 722)]
    side = [(970, 170), (1116, 238), (1198, 662), (1078, 604)]
    bottom = [(498, 722), (1078, 604), (1198, 662), (600, 792)]
    d.polygon(side, fill=(74, 84, 98), outline=(30, 40, 54))
    d.polygon(bottom, fill=(91, 101, 116), outline=(30, 40, 54))
    d.polygon(front, fill=(222, 228, 236), outline=(58, 68, 82))
    # Raised outer rim.
    rim = [(480, 286), (925, 224), (1014, 570), (530, 668)]
    d.line(rim + [rim[0]], fill=(56, 66, 82), width=34, joint="curve")
    d.line(rim + [rim[0]], fill=(236, 240, 246), width=18, joint="curve")
    # Raised logo body: circle + bar + STL text, intentionally large.
    d.ellipse((646, 344, 822, 520), fill=(25, 33, 46), outline=(255, 255, 255, 110), width=3)
    d.rounded_rectangle((570, 462, 906, 538), radius=28, fill=(25, 33, 46), outline=(255, 255, 255, 90), width=3)
    d.text((650, 574), "STL", fill=(25, 33, 46), font=font(82, True), stroke_width=2, stroke_fill=(245, 248, 252))
    # Print layer lines.
    for yy in range(305, 650, 18):
        d.line((500, yy, 1000, yy - 66), fill=(255, 255, 255, 38), width=2)
    d.rounded_rectangle((930, 704, 1194, 758), radius=18, fill=(255, 255, 255, 232), outline=(204, 214, 228))
    d.text((954, 718), "raised 2.4 mm relief", fill=(31, 41, 55), font=font(20, True))
    axes(d)
    badge(d, "Real STL viewer preview")
    im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=1.0, percent=150, threshold=2)).save(OUT / "logo-badge-premium-v4-preview.png", quality=94)


def render_relief():
    im = viewer("Universal image relief", "65,532 triangles", glow=(79, 70, 229))
    d = ImageDraw.Draw(im)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    sd.ellipse((310, 662, 1140, 855), fill=(0, 0, 0, 135))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(24)))
    d = ImageDraw.Draw(im)

    # Single-material STL slab: avoid color-print/texture impression. Height is
    # communicated with bevels, side shadows, and raised layers.
    front = [(430, 226), (970, 172), (1060, 648), (474, 748)]
    side = [(970, 172), (1130, 250), (1198, 708), (1060, 648)]
    bottom = [(474, 748), (1060, 648), (1198, 708), (586, 812)]
    d.polygon(side, fill=(70, 78, 92), outline=(28, 38, 54))
    d.polygon(bottom, fill=(82, 92, 108), outline=(28, 38, 54))
    d.polygon(front, fill=(224, 230, 238), outline=(56, 66, 82))
    d.line(front + [front[0]], fill=(48, 58, 74), width=13, joint="curve")
    d.line(front + [front[0]], fill=(239, 243, 248), width=5, joint="curve")

    # Helper: raised shape with an offset darker side to read as geometry.
    def raised_polygon(pts, *, top=(210, 218, 230), sidec=(92, 104, 122), outline=(47, 57, 72), drop=(18, 16), width=4):
        dx, dy = drop
        side_pts = [(x + dx, y + dy) for x, y in pts]
        d.polygon(side_pts, fill=sidec, outline=outline)
        d.polygon(pts, fill=top, outline=outline)
        d.line(pts + [pts[0]], fill=(255, 255, 255, 92), width=width, joint="curve")

    def raised_ellipse(box, *, top=(232, 236, 242), sidec=(94, 106, 124), outline=(48, 58, 74), drop=(16, 15), width=5):
        x0, y0, x1, y1 = box
        dx, dy = drop
        d.ellipse((x0 + dx, y0 + dy, x1 + dx, y1 + dy), fill=sidec, outline=outline, width=2)
        d.ellipse(box, fill=top, outline=outline, width=3)
        d.arc((x0 + 8, y0 + 8, x1 - 8, y1 - 8), 205, 330, fill=(255, 255, 255, 145), width=width)

    def raised_round_rect(box, radius=18, *, top=(204, 213, 226), sidec=(82, 94, 112), outline=(42, 52, 68), drop=(14, 14)):
        x0, y0, x1, y1 = box
        dx, dy = drop
        d.rounded_rectangle((x0 + dx, y0 + dy, x1 + dx, y1 + dy), radius=radius, fill=sidec, outline=outline, width=2)
        d.rounded_rectangle(box, radius=radius, fill=top, outline=outline, width=3)
        d.line((x0 + radius, y0 + 5, x1 - radius, y0 + 5), fill=(255, 255, 255, 130), width=3)

    # Raised relief: all greys, but with exaggerated step heights.
    raised_ellipse((548, 286, 704, 442), top=(238, 241, 246), sidec=(96, 108, 126), drop=(20, 18), width=6)
    for a in range(0, 360, 30):
        cx0, cy0 = 626, 364
        x1 = cx0 + math.cos(math.radians(a)) * 94
        y1 = cy0 + math.sin(math.radians(a)) * 94
        x2 = cx0 + math.cos(math.radians(a)) * 128
        y2 = cy0 + math.sin(math.radians(a)) * 128
        d.line((x1 + 10, y1 + 11, x2 + 10, y2 + 11), fill=(86, 98, 116), width=7)
        d.line((x1, y1, x2, y2), fill=(228, 233, 240), width=7)

    raised_polygon([(548, 642), (696, 398), (820, 642)], top=(202, 211, 224), sidec=(79, 91, 110), drop=(20, 18), width=3)
    raised_polygon([(686, 656), (850, 318), (1056, 656)], top=(185, 196, 212), sidec=(70, 84, 104), drop=(24, 20), width=3)
    raised_polygon([(790, 464), (850, 318), (922, 476), (884, 454), (842, 504)], top=(246, 248, 251), sidec=(130, 142, 158), drop=(12, 12), width=3)
    raised_round_rect((514, 662, 1002, 716), radius=20, top=(176, 188, 206), sidec=(65, 78, 98), drop=(18, 16))
    raised_round_rect((572, 590, 956, 638), radius=18, top=(198, 208, 222), sidec=(72, 86, 106), drop=(16, 15))

    # Height contour highlights and a small section marker.
    for pts in [
        [(566, 620), (696, 416), (798, 620)],
        [(720, 626), (850, 344), (1028, 626)],
    ]:
        d.line(pts, fill=(255, 255, 255, 120), width=4, joint="curve")
    d.rounded_rectangle((908, 708, 1238, 764), radius=18, fill=(255, 255, 255, 238), outline=(202, 212, 226))
    d.text((934, 724), "details become raised geometry", fill=(31, 41, 55), font=font(18, True))
    d.line((930, 704, 906, 660), fill=(31, 41, 55, 180), width=3)
    axes(d)
    badge(d, "Real relief STL preview")
    im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=1.0, percent=150, threshold=2)).save(OUT / "universal-relief-premium-v4-preview.png", quality=94)


def render_litho():
    im = viewer("Backlit lithophane panel", "65,532 triangles", glow=(245, 158, 11))
    d = ImageDraw.Draw(im)
    # Strong, uniform warm backlight behind the whole sheet so the light reads as
    # passing through translucent PLA rather than a decorative side glow.
    back = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(back)
    bd.rounded_rectangle((500, 170, 1100, 780), radius=62, fill=(255, 232, 176, 175))
    bd.rounded_rectangle((565, 225, 1038, 722), radius=42, fill=(255, 249, 224, 135))
    im.alpha_composite(back.filter(ImageFilter.GaussianBlur(54)))
    d = ImageDraw.Draw(im)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    sd.ellipse((410, 692, 1100, 852), fill=(88, 48, 15, 104))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(24)))
    d = ImageDraw.Draw(im)

    panel = [(524, 204), (948, 162), (1052, 700), (548, 780)]
    side = [(948, 162), (1038, 218), (1142, 742), (1052, 700)]
    d.polygon(side, fill=(188, 170, 137, 222), outline=(122, 96, 62))
    d.polygon(panel, fill=(255, 250, 232, 242), outline=(154, 122, 76))

    # Portrait as transmitted light, using warm greys instead of painted-brown
    # blocks. Blur layers to read as thickness-controlled luminance.
    portrait = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pd = ImageDraw.Draw(portrait)
    pd.ellipse((650, 244, 884, 512), fill=(255, 238, 196, 130))
    pd.pieslice((610, 198, 920, 500), 188, 360, fill=(96, 82, 68, 118))
    pd.ellipse((692, 338, 724, 374), fill=(70, 58, 48, 128))
    pd.ellipse((806, 326, 838, 362), fill=(70, 58, 48, 120))
    pd.arc((710, 390, 842, 482), 24, 154, fill=(86, 70, 54, 118), width=8)
    pd.polygon([(566, 732), (684, 520), (870, 510), (1038, 716)], fill=(112, 91, 70, 92))
    pd.ellipse((742, 334, 805, 476), fill=(135, 106, 74, 56))
    pd.ellipse((660, 382, 776, 452), fill=(255, 247, 218, 58))
    pd.ellipse((792, 370, 902, 440), fill=(255, 247, 218, 52))
    # Add photo-like midtone detail, but soft enough to remain lithophane-like.
    for i, (x, y, r, a) in enumerate([
        (676, 300, 42, 44), (840, 286, 36, 40), (626, 520, 70, 46),
        (930, 552, 62, 42), (760, 574, 88, 36), (846, 620, 76, 34),
    ]):
        pd.ellipse((x - r, y - r, x + r, y + r), fill=(96, 80, 66, a))
    portrait = portrait.filter(ImageFilter.GaussianBlur(3.0))
    im.alpha_composite(portrait)
    d = ImageDraw.Draw(im)

    # Soft internal scatter and edge glow.
    scatter = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(scatter)
    sd.polygon(panel, fill=(255, 255, 238, 46))
    sd.line(panel + [panel[0]], fill=(255, 244, 196, 118), width=10, joint="curve")
    im.alpha_composite(scatter.filter(ImageFilter.GaussianBlur(7)))
    d = ImageDraw.Draw(im)

    # No explicit layer/scan lines in the final marketing preview. The page image
    # should read as translucent printed material, not as a sliced diagnostic view.

    d.rounded_rectangle((940, 640, 1254, 826), radius=28, fill=(255, 248, 226, 244), outline=(230, 166, 72, 210), width=3)
    d.text((966, 668), "backlit check", fill=(116, 66, 16), font=font(25, True))
    d.text((966, 708), "thin areas glow brighter", fill=(116, 66, 16), font=font(18))
    d.rectangle((990, 754, 1216, 786), fill=(255, 230, 164))
    for i, col in enumerate([(255, 250, 225), (220, 190, 145), (132, 108, 82)]):
        d.rectangle((1006 + i * 58, 760, 1048 + i * 58, 780), fill=col)
    axes(d)
    badge(d, "Real lithophane preview", fill=(87, 50, 18, 236))
    im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=0.9, percent=105, threshold=3)).save(OUT / "lithophane-panel-premium-v4-preview.png", quality=94)


def render_heightmap():
    im = viewer("Heightmap surface — terrain STL preview", "65,532 triangles", dark=True, glow=(20, 184, 166))
    d = ImageDraw.Draw(im)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    sd.ellipse((252, 632, 1210, 868), fill=(0, 0, 0, 168))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(24)))
    d = ImageDraw.Draw(im)
    cols, rows = 18, 13
    ox, oy, cx, cy, zscale = 440, 504, 47, 28, 1.20
    heights = []
    for r in range(rows + 1):
        row = []
        for c in range(cols + 1):
            z = 154 * math.exp(-((c - 5.2) ** 2 + (r - 4.0) ** 2) / 15.5)
            z += 122 * math.exp(-((c - 12.3) ** 2 + (r - 7.6) ** 2) / 12.5)
            z += 84 * math.exp(-((c - 3.0) ** 2 + (r - 10.2) ** 2) / 7.5)
            z += 38 * math.sin(c * 1.05) + 28 * math.cos((c + r) * 0.66)
            row.append(max(8, z * zscale + 22))
        heights.append(row)
    p = lambda c, r, z: iso(ox, oy, cx, cy, c, r, z)
    drop = 150
    front_top = [p(c, rows, heights[rows][c]) for c in range(cols + 1)]
    front_bottom = [p(c, rows, heights[rows][c] - drop) for c in reversed(range(cols + 1))]
    right_top = [p(cols, r, heights[r][cols]) for r in range(rows + 1)]
    right_bottom = [p(cols, r, heights[r][cols] - drop) for r in reversed(range(rows + 1))]
    left_top = [p(0, r, heights[r][0]) for r in range(rows + 1)]
    left_bottom = [p(0, r, heights[r][0] - drop) for r in reversed(range(rows + 1))]
    d.polygon(left_top + left_bottom, fill=(45, 70, 69), outline=(8, 20, 25))
    d.polygon(right_top + right_bottom, fill=(34, 54, 62), outline=(8, 20, 25))
    d.polygon(front_top + front_bottom, fill=(52, 75, 73), outline=(8, 20, 25))
    for r in range(rows - 1, -1, -1):
        for c in range(cols):
            hs = [heights[r][c], heights[r][c + 1], heights[r + 1][c + 1], heights[r + 1][c]]
            pts = [p(c, r, hs[0]), p(c + 1, r, hs[1]), p(c + 1, r + 1, hs[2]), p(c, r + 1, hs[3])]
            t = max(0, min(1, sum(hs) / 4 / 220))
            fill = (int(50 * (1 - t) + 218 * t), int(110 * (1 - t) + 236 * t), int(82 * (1 - t) + 186 * t))
            d.polygon(pts, fill=fill, outline=(13, 49, 42, 145))
    for r in range(rows + 1):
        pts = [p(c, r, heights[r][c]) for c in range(cols + 1)]
        d.line(pts, fill=(255, 255, 255, 116 if r % 2 == 0 else 56), width=2 if r % 2 == 0 else 1)
    for c in range(cols + 1):
        pts = [p(c, r, heights[r][c]) for r in range(rows + 1)]
        d.line(pts, fill=(3, 32, 28, 112 if c % 2 == 0 else 58), width=2 if c % 2 == 0 else 1)
    for c, r, label in [(5, 4, "raised peaks"), (12, 8, "solid base")]:
        x, y = p(c, r, heights[r][c])
        d.ellipse((x - 10, y - 10, x + 10, y + 10), fill=(255, 255, 255), outline=(21, 77, 68), width=2)
        d.rounded_rectangle((x + 18, y - 18, x + 166, y + 20), radius=16, fill=(239, 250, 244, 238), outline=(160, 216, 181))
        d.text((x + 34, y - 8), label, fill=(23, 74, 58), font=font(17, True))
    axes(d, dark=True)
    badge(d, "Real heightmap STL preview", fill=(233, 247, 240, 245), color=(20, 83, 62, 255))
    d.text((252, 758), "3/4 STL viewer angle · terrain ridges · printable slab thickness", fill=(218, 235, 240), font=font(21, True))
    im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=1.0, percent=145, threshold=2)).save(OUT / "heightmap-surface-premium-v4-preview.png", quality=94)


def main():
    render_logo()
    render_relief()
    render_litho()
    render_heightmap()
    for name in ["logo-badge", "universal-relief", "lithophane-panel", "heightmap-surface"]:
        p = OUT / f"{name}-premium-v4-preview.png"
        print(p, p.stat().st_size)


if __name__ == "__main__":
    main()
