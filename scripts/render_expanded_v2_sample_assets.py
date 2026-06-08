#!/usr/bin/env python3
"""Generate expanded-v2 sample assets for pngtostl.net.

Adds practical, high-intent examples without overwriting earlier sample sets.
Each sample uses a generated source image, the real /api/stl/convert endpoint,
and the shared STL preview renderer.
"""
from __future__ import annotations

import json
import math
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
class ExpandedV2Sample:
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
    ExpandedV2Sample("cookie-cutter-outline", "cookie-cutter-expanded-v2", "Cookie cutter outline", "logo", 90, 2.6, 112, "bold outline cookie cutter PNG", "food-safe PETG"),
    ExpandedV2Sample("keychain-tag", "keychain-tag-expanded-v2", "Keychain name tag", "logo", 85, 2.2, 112, "simple name tag PNG", "matte blue PLA"),
    ExpandedV2Sample("topographic-coaster", "topographic-coaster-expanded-v2", "Topographic coaster heightmap", "heightmap", 100, 4.8, 128, "circular grayscale topo heightmap", "matte stone PLA"),
]


def save_cookie_cutter(path: Path):
    im = Image.new("RGBA", (560, 560), (255, 255, 255, 0))
    d = ImageDraw.Draw(im)
    dark = (9, 14, 26, 255)
    d.rounded_rectangle((96, 100, 464, 460), radius=92, outline=dark, width=28)
    d.rounded_rectangle((158, 162, 402, 398), radius=62, outline=dark, width=12)
    for x, y in [(178, 204), (344, 204), (222, 332), (318, 332)]:
        d.ellipse((x - 18, y - 18, x + 18, y + 18), fill=dark)
    d.arc((226, 244, 334, 354), 20, 160, fill=dark, width=10)
    rounded_label(d, (30, 28), "cookie cutter PNG")
    im.save(path)


def save_keychain_tag(path: Path):
    im = Image.new("RGBA", (640, 420), (255, 255, 255, 0))
    d = ImageDraw.Draw(im)
    dark = (8, 13, 24, 255)
    d.rounded_rectangle((42, 74, 598, 346), radius=54, fill=(255, 255, 255, 250), outline=dark, width=18)
    d.ellipse((76, 170, 136, 230), outline=dark, width=16)
    d.text((184, 135), "MILO", fill=dark, font=font(82, True))
    d.text((190, 244), "MAKER TAG", fill=dark, font=font(30, True))
    rounded_label(d, (30, 24), "keychain PNG")
    im.save(path)


def save_topographic_coaster(path: Path):
    im = Image.new("L", (560, 560), 20)
    cx = cy = 280
    for y in range(560):
        for x in range(560):
            dx, dy = x - cx, y - cy
            dist = math.sqrt(dx * dx + dy * dy)
            if dist > 235:
                value = 0
            else:
                value = 40
                value += 150 * math.exp(-((x - 214) ** 2 + (y - 238) ** 2) / (2 * 72 * 72))
                value += 120 * math.exp(-((x - 360) ** 2 + (y - 338) ** 2) / (2 * 92 * 92))
                value += 55 * math.sin((x + y) / 38) + 30 * math.cos((x - y) / 44)
                value *= max(0, min(1, (235 - dist) / 40 + 0.45))
            im.putpixel((x, y), max(0, min(255, int(value))))
    d = ImageDraw.Draw(im)
    for radius in range(70, 230, 28):
        d.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), outline=170, width=2)
    im = im.filter(ImageFilter.GaussianBlur(0.35)).convert("RGBA")
    d = ImageDraw.Draw(im)
    rounded_label(d, (30, 28), "topo heightmap")
    im.save(path)


SOURCE_MAKERS = {
    "cookie-cutter-outline": save_cookie_cutter,
    "keychain-tag": save_keychain_tag,
    "topographic-coaster": save_topographic_coaster,
}


def make_source(sample: ExpandedV2Sample) -> Path:
    path = OUT / f"{sample.asset_slug}-source.png"
    SOURCE_MAKERS[sample.slug](path)
    return path


def call_api(sample: ExpandedV2Sample, source: Path) -> Path:
    stl = OUT / f"{sample.asset_slug}.stl"
    headers = OUT / f"{sample.slug}.headers.txt"
    cmd = [
        "curl", "-sS", "-D", str(headers), "-o", str(stl),
        "-F", f"file=@{source}",
        "-F", f"mode={sample.mode}",
        "-F", f"widthMm={sample.width_mm}",
        "-F", f"depth={sample.depth}",
        "-F", f"detail={sample.detail}",
        "-F", "threshold=0.42",
        "-F", "smoothing=0.18",
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
    existing = [item for item in existing if not item.get("slug", "").endswith("-expanded-v2")]
    print(f"Using API: {API_BASE}")
    added = []
    for sample in SAMPLES:
        print(f"Generating expanded-v2 sample: {sample.slug}")
        source = make_source(sample)
        stl = call_api(sample, source)
        preview = OUT / f"{sample.asset_slug}-preview.png"
        preview_sample = PreviewSample(sample.slug, sample.asset_slug, sample.title, sample.mode, sample.width_mm, sample.depth, sample.detail, sample.source_desc, sample.material)
        meta = render_premium_preview(preview_sample, stl, preview)
        _, tri_count = read_binary_stl(stl)
        assert tri_count == meta["triangles"]
        added.append({
            "slug": f"{sample.slug}-expanded-v2",
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
