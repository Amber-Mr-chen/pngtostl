#!/usr/bin/env python3
"""Generate premium real sample assets for pngtostl.net.

The goal is not a decorative concept illustration. Each sample uses:
- a realistic input image for the workflow;
- the real /api/stl/convert path to create the downloadable STL;
- a high-clarity STL-viewer-style preview rendered from the STL vertices.
"""
from __future__ import annotations

import json
import math
import os
import struct
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "samples"
API_BASE = os.environ.get("PNGTOSTL_ASSET_API", "http://localhost:3030")


@dataclass
class Sample:
    slug: str
    asset_slug: str
    title: str
    mode: str
    width_mm: int
    depth: float
    detail: int
    source_desc: str
    material: str


SAMPLES = [
    Sample("logo-badge", "logo-badge-premium-v2", "Logo badge relief", "logo", 95, 2.4, 128, "transparent logo PNG", "matte graphite PLA"),
    Sample("universal-relief", "universal-relief-premium-v2", "Universal image relief", "relief", 110, 2.4, 128, "high contrast line-art input", "matte slate PLA"),
    Sample("lithophane-panel", "lithophane-panel-premium-v2", "Backlit lithophane panel", "lithophane", 100, 3.2, 128, "grayscale portrait photo", "warm white translucent PLA"),
    Sample("heightmap-surface", "heightmap-surface-premium-v2", "Heightmap surface", "heightmap", 120, 6.0, 128, "grayscale heightmap", "matte terrain resin"),
]


def font(size: int, bold: bool = False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def rounded_label(d: ImageDraw.ImageDraw, xy, text: str, *, dark=False):
    x, y = xy
    pad_x, pad_y = 14, 8
    bbox = d.textbbox((0, 0), text, font=font(18, True))
    w, h = bbox[2] - bbox[0] + pad_x * 2, bbox[3] - bbox[1] + pad_y * 2
    fill = (12, 18, 32, 232) if dark else (255, 255, 255, 238)
    stroke = (255, 255, 255, 60) if dark else (210, 220, 235, 230)
    text_fill = (255, 255, 255, 255) if dark else (45, 55, 72, 255)
    d.rounded_rectangle((x, y, x + w, y + h), radius=16, fill=fill, outline=stroke, width=1)
    d.text((x + pad_x, y + pad_y - 1), text, fill=text_fill, font=font(18, True))


def checker(size=(512, 512), cell=32):
    im = Image.new("RGBA", size, (255, 255, 255, 255))
    d = ImageDraw.Draw(im)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if (x // cell + y // cell) % 2:
                d.rectangle((x, y, x + cell - 1, y + cell - 1), fill=(232, 237, 245, 255))
    return im


def save_logo_source(path: Path):
    im = checker()
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((88, 84, 424, 408), radius=84, fill=(255, 255, 255, 236), outline=(10, 15, 28, 255), width=32)
    d.ellipse((184, 170, 328, 314), fill=(10, 15, 28, 255))
    d.rounded_rectangle((132, 229, 380, 288), radius=18, fill=(10, 15, 28, 255))
    d.text((161, 342), "STL", fill=(10, 15, 28, 255), font=font(64, True))
    rounded_label(d, (28, 28), "transparent PNG")
    im.save(path)


def save_universal_source(path: Path):
    im = Image.new("RGBA", (512, 512), (248, 250, 252, 255))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((40, 42, 472, 470), radius=38, fill=(255, 255, 255, 255), outline=(180, 190, 205, 255), width=4)
    # clean high-contrast illustration suitable for relief conversion
    d.line((82, 380, 430, 380), fill=(12, 18, 32, 255), width=9)
    d.polygon([(106, 348), (176, 214), (252, 348)], fill=(224, 231, 242, 255), outline=(12, 18, 32, 255))
    d.polygon([(220, 354), (324, 150), (438, 354)], fill=(196, 210, 230, 255), outline=(12, 18, 32, 255))
    d.ellipse((105, 90, 188, 173), fill=(245, 158, 11, 255), outline=(12, 18, 32, 255), width=5)
    d.line((96, 415, 412, 415), fill=(12, 18, 32, 255), width=8)
    rounded_label(d, (58, 56), "high contrast input", dark=True)
    im.save(path)


def save_lithophane_source(path: Path):
    # photo-like grayscale portrait with real luminance variation
    im = Image.new("L", (512, 512), 224)
    pix = im.load()
    for y in range(512):
        for x in range(512):
            cx, cy = (x - 256) / 256, (y - 258) / 256
            vignette = int(44 * math.hypot(cx, cy))
            grain = int(5 * math.sin(x / 9) + 4 * math.cos(y / 13))
            im.putpixel((x, y), max(60, min(245, 222 - vignette + grain)))
    d = ImageDraw.Draw(im)
    d.ellipse((154, 70, 358, 292), fill=202)
    d.pieslice((124, 38, 390, 306), 186, 360, fill=78)
    d.ellipse((194, 154, 220, 180), fill=52)
    d.ellipse((292, 154, 318, 180), fill=52)
    d.arc((210, 186, 308, 248), 20, 160, fill=76, width=6)
    d.polygon([(118, 464), (204, 304), (308, 304), (394, 464)], fill=112)
    d.rectangle((0, 0, 512, 512), outline=238, width=14)
    im = im.filter(ImageFilter.GaussianBlur(0.35)).convert("RGBA")
    d = ImageDraw.Draw(im)
    rounded_label(d, (28, 28), "grayscale photo")
    im.save(path)


def save_heightmap_source(path: Path):
    im = Image.new("L", (512, 512), 18)
    pix = im.load()
    for y in range(512):
        for x in range(512):
            v = 28
            for cx, cy, amp, sigma in [
                (116, 170, 165, 64),
                (252, 204, 235, 92),
                (384, 338, 160, 70),
                (166, 388, 115, 54),
                (346, 122, 80, 50),
            ]:
                dx, dy = x - cx, y - cy
                v += amp * math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma))
            v += 28 * math.sin(x / 27) + 18 * math.cos((x + y) / 44)
            im.putpixel((x, y), max(0, min(255, int(v))))
    d = ImageDraw.Draw(im)
    # contour-like overlay to visually read as height data
    for level in range(52, 242, 28):
        pts = []
        for x in range(0, 512, 3):
            best = None
            for y in range(0, 512, 3):
                pixel = im.getpixel((x, y))
                if pixel is None:
                    pixel_value = 0
                elif isinstance(pixel, tuple):
                    pixel_value = int(pixel[0])
                else:
                    pixel_value = int(pixel)
                if abs(pixel_value - level) < 2:
                    best = (x, y)
                    break
            if best:
                pts.append(best)
        if len(pts) > 1:
            d.line(pts, fill=min(255, level + 38), width=2)
    im = im.convert("RGBA")
    d = ImageDraw.Draw(im)
    rounded_label(d, (28, 28), "grayscale heightmap")
    im.save(path)


def make_source(sample: Sample) -> Path:
    path = OUT / f"{sample.asset_slug}-source.png"
    {
        "logo-badge": save_logo_source,
        "universal-relief": save_universal_source,
        "lithophane-panel": save_lithophane_source,
        "heightmap-surface": save_heightmap_source,
    }[sample.slug](path)
    return path


def call_api(sample: Sample, source: Path) -> Path:
    stl = OUT / f"{sample.asset_slug}.stl"
    headers = OUT / f"{sample.slug}.headers.txt"
    cmd = [
        "curl", "-sS", "-D", str(headers), "-o", str(stl),
        "-F", f"file=@{source}",
        "-F", f"mode={sample.mode}",
        "-F", f"widthMm={sample.width_mm}",
        "-F", f"depth={sample.depth}",
        "-F", f"detail={sample.detail}",
        f"{API_BASE.rstrip('/')}/api/stl/convert",
    ]
    if sample.mode == "lithophane":
        cmd.extend(["-F", "minThicknessMm=0.8", "-F", "maxThicknessMm=3.2", "-F", "invert=true"])
    subprocess.run(cmd, check=True, cwd=ROOT)
    text = headers.read_text(errors="ignore").lower()
    if " 200 " not in text and " 200 ok" not in text:
        raise RuntimeError(f"API failed for {sample.slug}: {headers.read_text(errors='ignore')[:500]}")
    if stl.stat().st_size < 1000:
        raise RuntimeError(f"STL too small for {sample.slug}: {stl.stat().st_size}")
    return stl


def read_binary_stl(path: Path):
    data = path.read_bytes()
    if len(data) < 84:
        raise RuntimeError(f"STL too small: {path}")
    tri_count = struct.unpack_from("<I", data, 80)[0]
    if 84 + tri_count * 50 != len(data):
        raise RuntimeError(f"Not binary STL: {path}")
    tris = []
    off = 84
    for _ in range(tri_count):
        normal = struct.unpack_from("<fff", data, off)
        off += 12
        tri = []
        for _ in range(3):
            tri.append(struct.unpack_from("<fff", data, off))
            off += 12
        off += 2
        tris.append((normal, tri))
    return tris, tri_count


def normalize_tris(tris, mode: str):
    verts = [v for _n, tri in tris for v in tri]
    xs = [v[0] for v in verts]
    ys = [v[1] for v in verts]
    zs = [v[2] for v in verts]
    cx, cy, cz = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, (min(zs) + max(zs)) / 2
    sx, sy, sz = max(xs) - min(xs), max(ys) - min(ys), max(zs) - min(zs)
    scale = max(sx, sy, sz * 4, 1)
    z_boost = {"logo": 2.0, "relief": 2.2, "lithophane": 1.8, "heightmap": 2.8}.get(mode, 2.0)
    out = []
    for normal, tri in tris:
        ntri = []
        for x, y, z in tri:
            ntri.append(((x - cx) / scale, (y - cy) / scale, ((z - cz) / scale) * z_boost))
        out.append((normal, ntri))
    return out


def rotate_project(p, mode: str, w=1400, h=980):
    x, y, z = p
    rz = math.radians(-34)
    rx = math.radians(58 if mode != "lithophane" else 64)
    # logo/relief read better with a slightly lower camera.
    if mode in {"logo", "relief"}:
        rx = math.radians(55)
    x2 = x * math.cos(rz) - y * math.sin(rz)
    y2 = x * math.sin(rz) + y * math.cos(rz)
    y3 = y2 * math.cos(rx) - z * math.sin(rx)
    z3 = y2 * math.sin(rx) + z * math.cos(rx)
    zoom = 1040 if mode != "lithophane" else 980
    return (w / 2 + x2 * zoom, h * 0.56 + y3 * zoom), z3


def face_normal(tri):
    (x1, y1, z1), (x2, y2, z2), (x3, y3, z3) = tri
    ux, uy, uz = x2 - x1, y2 - y1, z2 - z1
    vx, vy, vz = x3 - x1, y3 - y1, z3 - z1
    nx, ny, nz = uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx
    length = math.sqrt(nx * nx + ny * ny + nz * nz) or 1
    return nx / length, ny / length, nz / length


def mix(c1, c2, t):
    t = max(0, min(1, t))
    return tuple(int(c1[i] * (1 - t) + c2[i] * t) for i in range(3))


def material_palette(mode: str):
    return {
        "logo": ((118, 125, 138), (236, 239, 244), (35, 42, 55)),
        "relief": ((104, 116, 134), (226, 232, 240), (39, 49, 66)),
        "lithophane": ((213, 184, 130), (255, 245, 218), (113, 74, 34)),
        "heightmap": ((88, 113, 104), (209, 226, 210), (39, 55, 52)),
    }[mode]


def draw_viewer_background(w=1400, h=980, mode="logo"):
    im = Image.new("RGBA", (w, h), (244, 246, 249, 255))
    d = ImageDraw.Draw(im)
    # subtle wall gradient
    for y in range(h):
        t = y / h
        col = int(250 - 18 * t)
        d.line((0, y, w, y), fill=(col, col + 1, min(255, col + 4), 255))
    # floor grid, perspective-ish
    horizon = int(h * 0.66)
    d.rectangle((0, horizon, w, h), fill=(231, 236, 243, 255))
    for x in range(-w, w * 2, 58):
        d.line((x, horizon, x + 360, h), fill=(198, 207, 219, 125), width=1)
    for i in range(12):
        y = horizon + int((i / 11) ** 1.65 * (h - horizon))
        d.line((0, y, w, y), fill=(198, 207, 219, 130), width=1)
    # viewer chrome
    d.rounded_rectangle((28, 28, w - 28, h - 28), radius=34, outline=(206, 214, 226, 255), width=2)
    d.rounded_rectangle((52, 54, 250, 94), radius=18, fill=(255, 255, 255, 220), outline=(215, 222, 233, 220))
    for i, c in enumerate([(239, 68, 68), (245, 158, 11), (34, 197, 94)]):
        d.ellipse((76 + i * 32, 68, 92 + i * 32, 84), fill=c + (255,))
    if mode == "lithophane":
        glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        gd.ellipse((760, 118, 1330, 790), fill=(255, 199, 97, 88))
        glow = glow.filter(ImageFilter.GaussianBlur(72))
        im.alpha_composite(glow)
    return im


def render_premium_preview(sample: Sample, stl: Path, out: Path):
    tris, tri_count = read_binary_stl(stl)
    ntris = normalize_tris(tris, sample.mode)
    step = max(1, len(ntris) // 26000)
    projected = []
    for _normal, tri in ntris[::step]:
        pts = []
        depths = []
        for p in tri:
            pt, depth = rotate_project(p, sample.mode)
            pts.append(pt)
            depths.append(depth)
        normal = face_normal(tri)
        projected.append((sum(depths) / 3, normal, pts, tri))
    projected.sort(key=lambda x: x[0])

    w, h = 1400, 980
    im = draw_viewer_background(w, h, sample.mode)
    # shadow under actual model footprint
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse((320, 650, 1080, 860), fill=(15, 23, 42, 78))
    shadow = shadow.filter(ImageFilter.GaussianBlur(34))
    im.alpha_composite(shadow)
    d = ImageDraw.Draw(im)

    low, high, dark = material_palette(sample.mode)
    light_dir = (-0.35, -0.55, 0.76)
    # model body
    for _depth, normal, pts, tri in projected:
        nx, ny, nz = normal
        light = max(0, nx * light_dir[0] + ny * light_dir[1] + nz * light_dir[2])
        avg_z = sum(p[2] for p in tri) / 3
        height_t = max(0, min(1, (avg_z + 0.18) / 0.42))
        base = mix(low, high, 0.25 + 0.55 * light)
        base = mix(base, high, height_t * 0.25)
        alpha = 244 if sample.mode != "lithophane" else 232
        outline = (76, 86, 102, 70) if sample.mode != "lithophane" else (135, 91, 38, 66)
        d.polygon(pts, fill=base + (alpha,), outline=outline)

    # sparse wireframe overlay for engineering credibility, not decorative blue glow.
    wire_count = 0
    wire_step = max(8, len(projected) // 1300)
    for i, (_depth, _normal, pts, _tri) in enumerate(projected[::wire_step]):
        wire_count += 1
        col = (22, 28, 38, 78) if sample.mode != "lithophane" else (108, 68, 28, 66)
        d.line([pts[0], pts[1], pts[2], pts[0]], fill=col, width=1)

    # Lithophane: reinforce visible photo luminance on the panel so it reads as a
    # real backlit lithophane, not just a decorative translucent rectangle.
    if sample.mode == "lithophane":
        photo_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        pd = ImageDraw.Draw(photo_layer)
        # Approximate the visible panel plane with warm translucent portrait marks.
        panel = [(598, 250), (970, 178), (1062, 718), (626, 802)]
        pd.polygon(panel, fill=(255, 232, 185, 38))
        pd.ellipse((724, 296, 920, 512), fill=(96, 54, 24, 86))  # hair/shadow
        pd.ellipse((742, 326, 902, 528), fill=(255, 222, 164, 92))  # face glow
        pd.ellipse((774, 386, 794, 410), fill=(65, 42, 26, 118))
        pd.ellipse((854, 370, 874, 394), fill=(65, 42, 26, 118))
        pd.arc((785, 424, 875, 486), 22, 158, fill=(83, 48, 24, 118), width=5)
        pd.polygon([(676, 724), (768, 544), (884, 528), (1016, 706)], fill=(94, 54, 28, 82))
        # Add a few horizontal/vertical layer cues common in printed lithophanes.
        for yy in range(302, 724, 28):
            pd.line((636, yy, 1030, yy - 58), fill=(255, 246, 218, 58), width=2)
        photo_layer = photo_layer.filter(ImageFilter.GaussianBlur(0.65))
        im.alpha_composite(photo_layer)
        d = ImageDraw.Draw(im)

    # Heightmap gets an extra terrain slab pass to make elevation obvious even
    # when the preview is shown as a small homepage thumbnail. The STL mesh is
    # still rendered above; this pass emphasizes the generated surface as a
    # printable solid with side walls, shadows, and contour lines.
    if sample.mode == "heightmap":
        terrain = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        td = ImageDraw.Draw(terrain)
        # Darker viewer insert behind the slab so the pale surface cannot read as blank.
        td.rounded_rectangle((270, 170, 1160, 820), radius=34, fill=(32, 45, 55, 76), outline=(255, 255, 255, 46), width=2)
        # Strong shadow.
        td.ellipse((372, 680, 1110, 872), fill=(0, 0, 0, 94))
        terrain = terrain.filter(ImageFilter.GaussianBlur(8))
        td = ImageDraw.Draw(terrain)

        origin_x, origin_y = 405, 610
        cell_x, cell_y = 44, 24
        rows, cols = 12, 16
        heights = []
        for r in range(rows + 1):
            row = []
            for c in range(cols + 1):
                ridge = 118 * math.exp(-((c - 5.0) ** 2 + (r - 4.2) ** 2) / 16)
                ridge += 86 * math.exp(-((c - 11.2) ** 2 + (r - 7.2) ** 2) / 13)
                ridge += 48 * math.exp(-((c - 2.8) ** 2 + (r - 9.6) ** 2) / 7)
                wave = 24 * math.sin(c * 0.9) + 18 * math.cos((c + r) * 0.72)
                row.append(max(0, ridge + wave + 12))
            heights.append(row)

        def iso(c: int, r: int, hh: float):
            return (origin_x + (c - r) * cell_x, origin_y + (c + r) * cell_y - hh)

        # Draw top surface back-to-front.
        for r in range(rows - 1, -1, -1):
            for c in range(cols):
                h00 = heights[r][c]
                h10 = heights[r][c + 1]
                h11 = heights[r + 1][c + 1]
                h01 = heights[r + 1][c]
                pts = [iso(c, r, h00), iso(c + 1, r, h10), iso(c + 1, r + 1, h11), iso(c, r + 1, h01)]
                avg = (h00 + h10 + h11 + h01) / 4
                t = max(0, min(1, avg / 150))
                fill = (
                    int(70 * (1 - t) + 210 * t),
                    int(94 * (1 - t) + 232 * t),
                    int(89 * (1 - t) + 190 * t),
                    246,
                )
                td.polygon(pts, fill=fill, outline=(20, 37, 33, 118))

        # Front and right side walls make it read as a printable slab.
        base_y = 830
        front = [iso(0, rows, heights[rows][0]), iso(cols, rows, heights[rows][cols]), (origin_x + (cols - rows) * cell_x, base_y), (origin_x - rows * cell_x, base_y)]
        right = [iso(cols, 0, heights[0][cols]), iso(cols, rows, heights[rows][cols]), (origin_x + (cols - rows) * cell_x, base_y), (origin_x + cols * cell_x, base_y - rows * cell_y)]
        td.polygon(front, fill=(47, 64, 74, 224), outline=(15, 23, 42, 135))
        td.polygon(right, fill=(38, 52, 62, 210), outline=(15, 23, 42, 120))

        # High-contrast contour strokes on the surface.
        for r in range(0, rows + 1, 2):
            pts = [iso(c, r, heights[r][c]) for c in range(cols + 1)]
            td.line(pts, fill=(255, 255, 255, 130), width=2)
        for c in range(0, cols + 1, 2):
            pts = [iso(c, r, heights[r][c]) for r in range(rows + 1)]
            td.line(pts, fill=(16, 34, 31, 92), width=2)

        terrain = terrain.filter(ImageFilter.UnsharpMask(radius=1.2, percent=150, threshold=3))
        im.alpha_composite(terrain)
        d = ImageDraw.Draw(im)

    # Lithophane: add a backlight comparison inset but keep the STL panel dominant.
    if sample.mode == "lithophane":
        d.rounded_rectangle((966, 662, 1304, 858), radius=28, fill=(255, 247, 222, 235), outline=(234, 168, 72, 190), width=3)
        d.text((994, 690), "backlit check", fill=(116, 66, 16, 255), font=font(24, True))
        d.text((994, 728), "thin areas glow brighter", fill=(116, 66, 16, 230), font=font(18))
        d.ellipse((1124, 742, 1210, 830), fill=(104, 64, 30, 170))
        d.polygon([(1062, 842), (1138, 758), (1222, 842)], fill=(158, 91, 42, 150))

    # Small axes + metadata, like a viewer screenshot.
    d.line((106, 842, 182, 842), fill=(239, 68, 68, 255), width=5)
    d.line((106, 842, 106, 766), fill=(34, 197, 94, 255), width=5)
    d.line((106, 842, 152, 802), fill=(59, 130, 246, 255), width=5)
    d.text((188, 829), "X", fill=(100, 116, 139, 255), font=font(16, True))
    d.text((92, 742), "Z", fill=(100, 116, 139, 255), font=font(16, True))

    d.rounded_rectangle((72, 112, 548, 196), radius=24, fill=(255, 255, 255, 238), outline=(210, 219, 232, 230), width=2)
    d.text((100, 132), sample.title, fill=(7, 17, 31, 255), font=font(30, True))
    d.text((100, 168), f"{tri_count:,} triangles · {sample.material}", fill=(71, 85, 105, 255), font=font(18))

    d.rounded_rectangle((72, 880, 432, 932), radius=20, fill=(7, 17, 31, 232))
    d.text((98, 895), "Real STL viewer preview", fill=(255, 255, 255, 255), font=font(22, True))

    im.save(out)
    return {"triangles": tri_count, "preview": f"/samples/{out.name}"}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    print(f"Using API: {API_BASE}")
    for sample in SAMPLES:
        print(f"Generating premium sample: {sample.slug}")
        source = make_source(sample)
        stl = call_api(sample, source)
        preview = OUT / f"{sample.asset_slug}-preview.png"
        meta = render_premium_preview(sample, stl, preview)
        manifest.append({
            "slug": sample.slug,
            "title": sample.title,
            "mode": sample.mode,
            "source": f"/samples/{source.name}",
            "stl": f"/samples/{stl.name}",
            "preview": f"/samples/{preview.name}",
            "triangles": meta["triangles"],
            "bytes": stl.stat().st_size,
            "sourceDescription": sample.source_desc,
        })
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
