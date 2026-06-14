from __future__ import annotations

import math
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

BASE = Path("public/samples")
OUT_DIR = BASE
FRAME_DIR = Path("tmp/showcase_turntable_frames")
CANVAS = (768, 768)
BACKGROUND = (244, 247, 251)
FPS = 30
DURATION = 10
FRAMES = FPS * DURATION

FILES = {
    "showcase-unified-charminar-hyderabad.webp": "showcase-turntable-charminar-hyderabad.mp4",
    "showcase-unified-ironman-suit.webp": "showcase-turntable-ironman-suit.mp4",
    "showcase-unified-porsche-911-turbo.webp": "showcase-turntable-porsche-911-turbo.mp4",
    "showcase-unified-female-outfit.webp": "showcase-turntable-female-outfit.mp4",
    "showcase-unified-deepink-funko-jellykid.webp": "showcase-turntable-deepink-funko-jellykid.mp4",
    "showcase-unified-retro-wired-headphones.webp": "showcase-turntable-retro-wired-headphones.mp4",
}


def estimate_subject_mask(image: Image.Image) -> Image.Image:
    rgb = image.convert("RGB")
    arr = np.asarray(rgb).astype(np.float32)
    bg = np.array(BACKGROUND, dtype=np.float32)
    dist = np.sqrt(((arr - bg) ** 2).sum(axis=2))
    mask = (dist > 18).astype(np.uint8) * 255
    alpha = Image.fromarray(mask, "L").filter(ImageFilter.GaussianBlur(1.2))
    bbox = alpha.point(lambda v: 255 if v > 20 else 0).getbbox()
    if not bbox:
        return Image.new("L", image.size, 255)
    return alpha


def crop_subject(source: Image.Image) -> Image.Image:
    mask = estimate_subject_mask(source)
    bbox = mask.point(lambda v: 255 if v > 18 else 0).getbbox()
    if not bbox:
        return source.convert("RGBA")
    pad = 24
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(source.width, bbox[2] + pad)
    bottom = min(source.height, bbox[3] + pad)
    rgba = source.convert("RGBA")
    rgba.putalpha(mask)
    return rgba.crop((left, top, right, bottom))


def fit_subject(subject: Image.Image) -> Image.Image:
    max_w, max_h = 590, 500
    scale = min(max_w / subject.width, max_h / subject.height)
    size = (max(1, int(subject.width * scale)), max(1, int(subject.height * scale)))
    return subject.resize(size, Image.Resampling.LANCZOS)


def upright_turntable_pose(subject: Image.Image, phase: float) -> tuple[Image.Image, int]:
    width, height = subject.size
    yaw = math.sin(phase)
    squash = 1.0 - abs(yaw) * 0.14
    posed_width = max(1, int(width * squash))
    posed = subject.resize((posed_width, height), Image.Resampling.LANCZOS)
    horizontal_offset = int(yaw * width * 0.045)
    return posed, horizontal_offset


def render_frame(subject: Image.Image, frame: int) -> Image.Image:
    phase = 2 * math.pi * frame / FRAMES
    canvas = Image.new("RGBA", CANVAS, BACKGROUND + (255,))
    posed, horizontal_offset = upright_turntable_pose(subject, phase)
    brightness = 1.0 + math.sin(phase - math.pi / 5) * 0.035
    contrast = 1.0 + math.cos(phase) * 0.018
    posed_rgb = ImageEnhance.Brightness(posed.convert("RGBA")).enhance(brightness)
    posed_rgb = ImageEnhance.Contrast(posed_rgb).enhance(contrast)

    alpha = posed_rgb.getchannel("A")
    shadow = Image.new("RGBA", posed_rgb.size, (15, 23, 42, 0))
    shadow.putalpha(alpha.point(lambda v: int(v * 0.16)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(16))

    x = (CANVAS[0] - posed_rgb.width) // 2 + horizontal_offset
    y = (CANVAS[1] - posed_rgb.height) // 2 - 8
    canvas.alpha_composite(shadow, (x, y + 20))
    canvas.alpha_composite(posed_rgb, (x, y))
    return canvas.convert("RGB")


def make_video(src_name: str, out_name: str) -> None:
    frame_path = FRAME_DIR / Path(out_name).stem
    frame_path.mkdir(parents=True, exist_ok=True)
    source = Image.open(BASE / src_name).convert("RGB")
    subject = fit_subject(crop_subject(source))
    for i in range(FRAMES):
        frame = render_frame(subject, i)
        frame.save(frame_path / f"frame_{i:04d}.jpg", quality=92, subsampling=0)
    out = OUT_DIR / out_name
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-framerate",
            str(FPS),
            "-i",
            str(frame_path / "frame_%04d.jpg"),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            "-preset",
            "medium",
            "-crf",
            "22",
            str(out),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    print(out.name, out.stat().st_size)


def main() -> None:
    for src, out in FILES.items():
        make_video(src, out)


if __name__ == "__main__":
    main()
