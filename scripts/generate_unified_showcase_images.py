from __future__ import annotations

from io import BytesIO
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps
from rembg import new_session, remove

BASE = Path("public/samples")
CANVAS = (1600, 1120)
BACKGROUND = (244, 247, 251)
MAX_FIT = (1300, 820)

FILES = {
    "showcase-cgtrader-charminar-hyderabad.webp": "showcase-unified-charminar-hyderabad.webp",
    "showcase-cgtrader-ironman-suit.webp": "showcase-unified-ironman-suit.webp",
    "showcase-cgtrader-porsche-911-turbo.webp": "showcase-unified-porsche-911-turbo.webp",
    "showcase-cgtrader-female-outfit.webp": "showcase-unified-female-outfit.webp",
    "showcase-cgtrader-deepink-funko-jellykid.webp": "showcase-unified-deepink-funko-jellykid.webp",
    "showcase-cgtrader-retro-wired-headphones.webp": "showcase-unified-retro-wired-headphones.webp",
}

# Fine-tuned per source because source crops and proportions differ substantially.
SCALE = {
    "showcase-cgtrader-charminar-hyderabad.webp": 0.96,
    "showcase-cgtrader-ironman-suit.webp": 1.12,
    "showcase-cgtrader-porsche-911-turbo.webp": 0.94,
    "showcase-cgtrader-female-outfit.webp": 1.15,
    "showcase-cgtrader-deepink-funko-jellykid.webp": 1.05,
    "showcase-cgtrader-retro-wired-headphones.webp": 1.16,
}

Y_OFFSET = {
    "showcase-cgtrader-charminar-hyderabad.webp": -4,
    "showcase-cgtrader-ironman-suit.webp": 0,
    "showcase-cgtrader-porsche-911-turbo.webp": 8,
    "showcase-cgtrader-female-outfit.webp": 0,
    "showcase-cgtrader-deepink-funko-jellykid.webp": -2,
    "showcase-cgtrader-retro-wired-headphones.webp": 0,
}


def trim_alpha(image: Image.Image) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        return image
    pad = 18
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(image.width, bbox[2] + pad)
    bottom = min(image.height, bbox[3] + pad)
    return image.crop((left, top, right, bottom))


def fit_subject(image: Image.Image, src_name: str) -> Image.Image:
    max_w, max_h = MAX_FIT
    scale = min(max_w / image.width, max_h / image.height) * SCALE.get(src_name, 1.0)
    size = (max(1, int(image.width * scale)), max(1, int(image.height * scale)))
    return image.resize(size, Image.Resampling.LANCZOS)


def add_shadow(canvas: Image.Image, subject: Image.Image, xy: tuple[int, int]) -> None:
    alpha = subject.getchannel("A")
    shadow = Image.new("RGBA", subject.size, (15, 23, 42, 0))
    shadow.putalpha(alpha.point(lambda v: int(v * 0.16)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    canvas.alpha_composite(shadow, (xy[0] + 0, xy[1] + 18))


def process(src_name: str, dest_name: str, session) -> None:
    src = BASE / src_name
    original = Image.open(src).convert("RGBA")
    png_bytes = BytesIO()
    original.save(png_bytes, format="PNG")
    cutout = remove(
        png_bytes.getvalue(),
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=12,
        alpha_matting_erode_size=8,
        post_process_mask=True,
    )
    subject = Image.open(BytesIO(cutout)).convert("RGBA")
    subject = trim_alpha(subject)
    subject = fit_subject(subject, src_name)

    canvas = Image.new("RGBA", CANVAS, BACKGROUND + (255,))
    x = (CANVAS[0] - subject.width) // 2
    y = (CANVAS[1] - subject.height) // 2 + Y_OFFSET.get(src_name, 0)
    add_shadow(canvas, subject, (x, y))
    canvas.alpha_composite(subject, (x, y))

    out = ImageEnhance.Sharpness(canvas.convert("RGB")).enhance(1.18)
    dest = BASE / dest_name
    out.save(dest, "WEBP", quality=98, method=6)
    print(dest.name, out.size, dest.stat().st_size)


def main() -> None:
    session = new_session("u2net")
    for src_name, dest_name in FILES.items():
        process(src_name, dest_name, session)


if __name__ == "__main__":
    main()
