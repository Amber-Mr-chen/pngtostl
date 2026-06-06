#!/usr/bin/env python3
"""Generate real PNG->STL sample assets for pngtostl.net.

Creates:
- public/samples/<slug>-source.png
- public/samples/<slug>-preview.png
- public/samples/<slug>.stl
- public/samples/manifest.json

The STL files are generated through the real app API, then rendered locally into
static preview PNGs so the marketing/sample pages show actual generated output
instead of purely symbolic CSS mockups.
"""
from __future__ import annotations

import json
import math
import os
import struct
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "samples"
OUT.mkdir(parents=True, exist_ok=True)

API_BASE = os.environ.get("PNGTOSTL_ASSET_API", "http://localhost:3030")


@dataclass
class Sample:
    slug: str
    title: str
    mode: str
    width_mm: int
    depth: float
    detail: int
    source_desc: str


SAMPLES = [
    Sample("logo-badge", "Logo badge relief", "logo", 95, 2.4, 128, "transparent logo PNG"),
    Sample("universal-relief", "Universal image relief", "relief", 110, 2.4, 128, "high contrast illustration"),
    Sample("lithophane-panel", "Backlit lithophane panel", "lithophane", 100, 3.2, 128, "portrait-style photo"),
    Sample("heightmap-surface", "Heightmap surface", "heightmap", 120, 6.0, 128, "grayscale heightmap"),
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


def save_logo(path: Path):
    im = Image.new("RGBA", (512, 512), (255, 255, 255, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((92, 92, 420, 420), radius=82, fill=(255, 255, 255, 0), outline=(17, 24, 39, 255), width=34)
    d.ellipse((186, 186, 326, 326), fill=(17, 24, 39, 255))
    d.rectangle((132, 236, 380, 282), fill=(17, 24, 39, 255))
    d.text((165, 348), "STL", fill=(17, 24, 39, 255), font=font(58, True))
    im.save(path)


def save_universal(path: Path):
    im = Image.new("RGBA", (512, 512), (248, 250, 252, 255))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((54, 54, 458, 458), radius=42, fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=4)
    d.polygon([(106, 370), (188, 240), (250, 318), (328, 190), (430, 370)], fill=(30, 64, 175, 255))
    d.ellipse((126, 110, 210, 194), fill=(245, 158, 11, 255))
    d.rounded_rectangle((96, 382, 418, 414), radius=16, fill=(15, 23, 42, 255))
    d.text((118, 64), "relief source", fill=(71, 85, 105, 255), font=font(28, True))
    im.save(path)


def save_lithophane(path: Path):
    im = Image.new("RGBA", (512, 512), (255, 247, 237, 255))
    d = ImageDraw.Draw(im)
    # soft portrait-like light/dark fields
    for r in range(250, 0, -4):
        shade = int(255 - (250 - r) * 0.42)
        d.ellipse((256-r, 110-r//2, 256+r, 110+r*3//2), fill=(shade, max(210, shade-20), max(180, shade-45), 255))
    d.ellipse((178, 116, 334, 272), fill=(238, 196, 160, 255))
    d.ellipse((206, 166, 224, 184), fill=(91, 55, 39, 255))
    d.ellipse((288, 166, 306, 184), fill=(91, 55, 39, 255))
    d.arc((214, 186, 298, 242), start=15, end=165, fill=(91, 55, 39, 255), width=5)
    d.polygon([(150, 440), (212, 286), (300, 286), (366, 440)], fill=(124, 45, 18, 255))
    im = im.filter(ImageFilter.GaussianBlur(0.55))
    im.save(path)


def save_heightmap(path: Path):
    im = Image.new("L", (512, 512), 35)
    d = ImageDraw.Draw(im)
    for y in range(512):
        for x in range(512):
            v = 38
            for cx, cy, amp, sigma in [(140, 180, 150, 86), (300, 210, 190, 112), (370, 350, 120, 72), (170, 382, 90, 54)]:
                dx, dy = x-cx, y-cy
                v += amp * math.exp(-(dx*dx + dy*dy) / (2*sigma*sigma))
            v += 22 * math.sin(x / 34) + 14 * math.cos(y / 38)
            im.putpixel((x, y), max(0, min(255, int(v))))
    d = ImageDraw.Draw(im)
    for offset in range(-512, 512, 46):
        pts = []
        for x in range(0, 512, 8):
            y = x + offset + int(10*math.sin(x/22))
            if 0 <= y < 512:
                pts.append((x, y))
        if len(pts) > 1:
            d.line(pts, fill=120, width=2)
    im.convert("RGBA").save(path)


def make_source(sample: Sample) -> Path:
    path = OUT / f"{sample.slug}-source.png"
    if sample.slug == "logo-badge":
        save_logo(path)
    elif sample.slug == "universal-relief":
        save_universal(path)
    elif sample.slug == "lithophane-panel":
        save_lithophane(path)
    elif sample.slug == "heightmap-surface":
        save_heightmap(path)
    else:
        raise ValueError(sample.slug)
    return path


def call_api(sample: Sample, source: Path) -> Path:
    stl = OUT / f"{sample.slug}.stl"
    headers = OUT / f"{sample.slug}.headers.txt"
    mode = sample.mode
    cmd = [
        "curl", "-sS", "-D", str(headers), "-o", str(stl),
        "-F", f"file=@{source}",
        "-F", f"mode={mode}",
        "-F", f"widthMm={sample.width_mm}",
        "-F", f"depth={sample.depth}",
        "-F", f"detail={sample.detail}",
        f"{API_BASE.rstrip('/')}/api/stl/convert",
    ]
    if sample.mode == "lithophane":
        cmd.extend(["-F", "minThicknessMm=0.8", "-F", "maxThicknessMm=3.2", "-F", "invert=true"])
    subprocess.run(cmd, check=True, cwd=ROOT)
    header_text = headers.read_text(errors="ignore").lower()
    if " 200 " not in header_text and " 200 ok" not in header_text:
        raise RuntimeError(f"API failed for {sample.slug}: {headers.read_text(errors='ignore')[:500]}")
    if stl.stat().st_size < 1000:
        raise RuntimeError(f"STL too small for {sample.slug}: {stl.stat().st_size}")
    return stl


def read_stl_vertices(path: Path):
    data = path.read_bytes()
    verts = []
    if len(data) >= 84:
        tri_count = struct.unpack_from("<I", data, 80)[0]
        expected = 84 + tri_count * 50
        if expected == len(data):
            off = 84
            for _ in range(tri_count):
                off += 12
                for _ in range(3):
                    verts.append(struct.unpack_from("<fff", data, off))
                    off += 12
                off += 2
            return verts, tri_count
    # Minimal ASCII fallback
    tri_count = 0
    for line in data.decode("latin1", errors="ignore").splitlines():
        parts = line.strip().split()
        if len(parts) == 4 and parts[0].lower() == "vertex":
            verts.append(tuple(float(x) for x in parts[1:4]))
    tri_count = len(verts) // 3
    return verts, tri_count


def render_stl(stl: Path, out: Path, title: str):
    verts, tri_count = read_stl_vertices(stl)
    if not verts:
        raise RuntimeError(f"No vertices in {stl}")
    xs = [v[0] for v in verts]; ys = [v[1] for v in verts]; zs = [v[2] for v in verts]
    cx, cy, cz = (min(xs)+max(xs))/2, (min(ys)+max(ys))/2, (min(zs)+max(zs))/2
    scale = max(max(xs)-min(xs), max(ys)-min(ys), max(zs)-min(zs), 1)

    # Isometric-ish projection. Sample triangles for performance if huge.
    tris = [verts[i:i+3] for i in range(0, len(verts), 3)]
    step = max(1, len(tris)//14000)
    projected = []
    for tri in tris[::step]:
        pts = []
        depth = 0
        normal_hint = 0
        for x, y, z in tri:
            x = (x-cx)/scale; y = (y-cy)/scale; z = (z-cz)/scale
            # rotate around Z and X
            rz = -math.radians(32)
            x2 = x*math.cos(rz) - y*math.sin(rz)
            y2 = x*math.sin(rz) + y*math.cos(rz)
            rx = math.radians(58)
            y3 = y2*math.cos(rx) - z*math.sin(rx)
            z3 = y2*math.sin(rx) + z*math.cos(rx)
            px = 512 + x2*720
            py = 448 + y3*720
            pts.append((px, py))
            depth += z3
            normal_hint += z
        projected.append((depth/3, normal_hint/3, pts))
    projected.sort(key=lambda item: item[0])

    im = Image.new("RGBA", (1024, 768), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # background card/grid
    bg = Image.new("RGBA", im.size, (246, 247, 249, 255))
    bd = ImageDraw.Draw(bg)
    for x in range(0, 1024, 32):
        bd.line((x, 0, x, 768), fill=(226, 232, 240, 130), width=1)
    for y in range(0, 768, 32):
        bd.line((0, y, 1024, y), fill=(226, 232, 240, 130), width=1)
    im.alpha_composite(bg)
    # soft shadow
    shadow = Image.new("RGBA", im.size, (0,0,0,0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse((240, 560, 790, 706), fill=(15,23,42,45))
    shadow = shadow.filter(ImageFilter.GaussianBlur(28))
    im.alpha_composite(shadow)
    d = ImageDraw.Draw(im)

    for depth, normal_hint, pts in projected:
        shade = int(120 + max(-0.12, min(0.18, normal_hint)) * 420)
        fill = (max(40, shade-22), max(55, shade-8), min(210, shade+50), 222)
        outline = (255, 255, 255, 32)
        d.polygon(pts, fill=fill, outline=outline)

    # title + metrics overlay
    d.rounded_rectangle((34, 30, 420, 96), radius=18, fill=(255,255,255,230))
    d.text((56, 45), title, fill=(7,17,31,255), font=font(25, True))
    d.text((56, 72), f"{tri_count:,} triangles · generated STL", fill=(79,91,107,255), font=font(16))
    im.save(out)
    return {"triangles": tri_count, "preview": f"/samples/{out.name}"}


def main():
    manifest = []
    # Prefer local dev. If unavailable, caller can set PNGTOSTL_ASSET_API=https://pngtostl.net
    print(f"Using API: {API_BASE}")
    for sample in SAMPLES:
        print(f"Generating {sample.slug}...")
        source = make_source(sample)
        stl = call_api(sample, source)
        preview = OUT / f"{sample.slug}-preview.png"
        meta = render_stl(stl, preview, sample.title)
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
