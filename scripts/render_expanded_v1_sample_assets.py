#!/usr/bin/env python3
"""Generate expanded-v1 real-world sample assets for pngtostl.net.

This intentionally does not overwrite the premium-v4 baseline samples.
Each expanded sample uses a generated realistic source image, the real
/api/stl/convert endpoint, and the existing premium STL preview renderer.
"""
from __future__ import annotations

import json
import os
import subprocess
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

from render_premium_v4_sample_assets import (
    OUT,
    ROOT,
    API_BASE,
    Sample as PreviewSample,
    font,
    rounded_label,
    render_premium_preview,
    read_binary_stl,
)


@dataclass
class ExpandedSample:
    slug: str
    asset_slug: str
    title: str
    mode: str
    width_mm: int
    depth: float
    detail: int
    source_desc: str
    material: str
    min_thickness: float | None = None
    max_thickness: float | None = None
    invert: bool = False


SAMPLES = [
    ExpandedSample("rubber-stamp", "rubber-stamp-expanded-v1", "Rubber stamp relief", "logo", 80, 2.0, 112, "black stamp artwork PNG", "matte black PLA"),
    ExpandedSample("coin-relief", "coin-relief-expanded-v1", "Coin relief medallion", "relief", 70, 2.2, 128, "round medallion line art", "silver PLA"),
    ExpandedSample("sign-plate", "sign-plate-expanded-v1", "Workshop sign plate", "logo", 120, 1.8, 112, "bold text sign PNG", "white PLA"),
    ExpandedSample("pet-photo-relief", "pet-photo-relief-expanded-v1", "Pet photo relief", "relief", 95, 2.0, 128, "high-contrast pet portrait", "matte slate PLA"),
    ExpandedSample("portrait-lithophane", "portrait-lithophane-expanded-v1", "Portrait lithophane night light", "lithophane", 90, 3.0, 128, "portrait photo for lithophane", "translucent white PLA", 0.8, 3.0, True),
    ExpandedSample("terrain-tile", "terrain-tile-expanded-v1", "Terrain heightmap tile", "heightmap", 110, 5.5, 128, "game terrain heightmap", "matte green PLA"),
]


def save_rubber_stamp(path: Path):
    im = Image.new("RGBA", (512, 512), (255, 255, 255, 0))
    d = ImageDraw.Draw(im)
    d.ellipse((54, 54, 458, 458), outline=(10, 15, 28, 255), width=26)
    d.ellipse((104, 104, 408, 408), outline=(10, 15, 28, 255), width=8)
    d.text((150, 158), "APPROVED", fill=(10, 15, 28, 255), font=font(44, True))
    d.text((164, 230), "MAKER", fill=(10, 15, 28, 255), font=font(58, True))
    d.line((140, 320, 372, 320), fill=(10, 15, 28, 255), width=10)
    rounded_label(d, (28, 28), "stamp PNG")
    im.save(path)


def save_coin_relief(path: Path):
    im = Image.new("RGBA", (512, 512), (247, 250, 252, 255))
    d = ImageDraw.Draw(im)
    d.ellipse((50, 50, 462, 462), fill=(238, 242, 247, 255), outline=(15, 23, 42, 255), width=10)
    for r in range(82, 150, 16):
        d.ellipse((r, r, 512-r, 512-r), outline=(60, 72, 88, 170), width=3)
    # simple raised star/coin mark
    pts = []
    import math
    cx = cy = 256
    for i in range(10):
        ang = -math.pi/2 + i * math.pi/5
        rad = 120 if i % 2 == 0 else 52
        pts.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))
    d.polygon(pts, fill=(40, 50, 66, 255))
    d.text((190, 372), "2026", fill=(15, 23, 42, 255), font=font(42, True))
    rounded_label(d, (30, 30), "coin relief")
    im.save(path)


def save_sign_plate(path: Path):
    im = Image.new("RGBA", (640, 420), (255, 255, 255, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((36, 58, 604, 362), radius=44, fill=(255, 255, 255, 250), outline=(8, 13, 24, 255), width=18)
    d.ellipse((72, 94, 128, 150), fill=(8, 13, 24, 255))
    d.ellipse((512, 94, 568, 150), fill=(8, 13, 24, 255))
    d.text((137, 126), "WORKSHOP", fill=(8, 13, 24, 255), font=font(58, True))
    d.text((186, 218), "TOOLS", fill=(8, 13, 24, 255), font=font(76, True))
    rounded_label(d, (28, 22), "sign PNG")
    im.save(path)


def save_pet_relief(path: Path):
    im = Image.new("L", (512, 512), 236)
    d = ImageDraw.Draw(im)
    # dog/cat-like high contrast portrait, synthetic and license-safe
    d.ellipse((112, 104, 400, 424), fill=194)
    d.polygon([(130, 120), (84, 34), (210, 94)], fill=92)
    d.polygon([(382, 120), (428, 34), (302, 94)], fill=92)
    d.ellipse((172, 208, 214, 250), fill=42)
    d.ellipse((298, 208, 340, 250), fill=42)
    d.ellipse((226, 262, 286, 316), fill=56)
    d.arc((184, 284, 256, 358), 10, 145, fill=68, width=6)
    d.arc((256, 284, 328, 358), 35, 170, fill=68, width=6)
    d.ellipse((154, 168, 236, 286), outline=120, width=9)
    d.ellipse((276, 168, 358, 286), outline=120, width=9)
    im = im.filter(ImageFilter.GaussianBlur(0.7)).convert("RGBA")
    d = ImageDraw.Draw(im)
    rounded_label(d, (28, 28), "pet portrait")
    im.save(path)


def save_portrait_lithophane(path: Path):
    im = Image.new("L", (512, 512), 222)
    d = ImageDraw.Draw(im)
    d.ellipse((154, 66, 358, 298), fill=206)
    d.pieslice((118, 38, 392, 318), 180, 360, fill=76)
    d.ellipse((194, 154, 222, 184), fill=50)
    d.ellipse((290, 154, 318, 184), fill=50)
    d.arc((214, 202, 306, 258), 15, 165, fill=78, width=5)
    d.polygon([(96, 492), (190, 310), (322, 310), (416, 492)], fill=112)
    for y in range(0, 512, 8):
        d.line((0, y, 512, y), fill=max(80, min(240, 212 - y // 20)), width=1)
    im = im.filter(ImageFilter.GaussianBlur(0.45)).convert("RGBA")
    d = ImageDraw.Draw(im)
    rounded_label(d, (28, 28), "portrait photo")
    im.save(path)


def save_terrain_tile(path: Path):
    import math
    im = Image.new("L", (512, 512), 24)
    for y in range(512):
        for x in range(512):
            v = 28
            for cx, cy, amp, sigma in [(108, 132, 190, 56), (240, 268, 230, 90), (392, 156, 140, 68), (358, 386, 180, 72)]:
                dx, dy = x - cx, y - cy
                v += amp * math.exp(-(dx*dx + dy*dy)/(2*sigma*sigma))
            v += 30 * math.sin((x+y)/32) + 20 * math.cos(x/21)
            im.putpixel((x, y), max(0, min(255, int(v))))
    d = ImageDraw.Draw(im)
    for y in range(80, 460, 42):
        d.line((0, y, 512, y + int(18 * math.sin(y/20))), fill=180, width=2)
    im = im.convert("RGBA")
    d = ImageDraw.Draw(im)
    rounded_label(d, (28, 28), "terrain heightmap")
    im.save(path)


SOURCE_MAKERS = {
    "rubber-stamp": save_rubber_stamp,
    "coin-relief": save_coin_relief,
    "sign-plate": save_sign_plate,
    "pet-photo-relief": save_pet_relief,
    "portrait-lithophane": save_portrait_lithophane,
    "terrain-tile": save_terrain_tile,
}


def make_source(sample: ExpandedSample) -> Path:
    path = OUT / f"{sample.asset_slug}-source.png"
    SOURCE_MAKERS[sample.slug](path)
    return path


def call_api(sample: ExpandedSample, source: Path) -> Path:
    stl = OUT / f"{sample.asset_slug}.stl"
    headers = OUT / f"{sample.slug}.headers.txt"
    cmd = [
        "curl", "-sS", "-D", str(headers), "-o", str(stl),
        "-F", f"file=@{source}",
        "-F", f"mode={sample.mode}",
        "-F", f"widthMm={sample.width_mm}",
        "-F", f"depth={sample.depth}",
        "-F", f"detail={sample.detail}",
    ]
    if sample.mode == "lithophane":
        cmd.extend(["-F", f"minThicknessMm={sample.min_thickness or 0.8}", "-F", f"maxThicknessMm={sample.max_thickness or 3.0}", "-F", f"invert={'true' if sample.invert else 'false'}"])
    cmd.append(f"{API_BASE.rstrip('/')}/api/stl/convert")
    subprocess.run(cmd, check=True, cwd=ROOT)
    text = headers.read_text(errors="ignore").lower()
    if " 200 " not in text and " 200 ok" not in text:
        raise RuntimeError(f"API failed for {sample.slug}: {headers.read_text(errors='ignore')[:500]}")
    if stl.stat().st_size < 1000:
        raise RuntimeError(f"STL too small for {sample.slug}: {stl.stat().st_size}")
    return stl


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest_path = OUT / "manifest.json"
    existing = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else []
    existing = [item for item in existing if not item.get("slug", "").endswith("-expanded-v1")]
    print(f"Using API: {API_BASE}")
    added = []
    for sample in SAMPLES:
        print(f"Generating expanded sample: {sample.slug}")
        source = make_source(sample)
        stl = call_api(sample, source)
        preview = OUT / f"{sample.asset_slug}-preview.png"
        preview_sample = PreviewSample(sample.slug, sample.asset_slug, sample.title, sample.mode, sample.width_mm, sample.depth, sample.detail, sample.source_desc, sample.material)
        meta = render_premium_preview(preview_sample, stl, preview)
        tris, tri_count = read_binary_stl(stl)
        assert tri_count == meta["triangles"]
        added.append({
            "slug": f"{sample.slug}-expanded-v1",
            "title": sample.title,
            "mode": sample.mode,
            "source": f"/samples/{source.name}",
            "stl": f"/samples/{stl.name}",
            "preview": f"/samples/{preview.name}",
            "triangles": meta["triangles"],
            "bytes": stl.stat().st_size,
            "sourceDescription": sample.source_desc,
        })
    combined = existing + added
    manifest_path.write_text(json.dumps(combined, indent=2), encoding="utf-8")
    print(json.dumps(added, indent=2))


if __name__ == "__main__":
    main()
