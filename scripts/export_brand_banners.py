#!/usr/bin/env python3
"""Create deterministic Peacock Atelier social and card exports."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
BRAND_DIR = ROOT / "public" / "brand"
MASTER = BRAND_DIR / "tower-bridge-peacock-master.png"
BOLD_FONT = Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf")
REGULAR_FONT = Path("/System/Library/Fonts/Supplemental/Arial.ttf")

INK = "#0b1c3d"
PAPER = "#f1e8d3"
GOLD = "#c89a3b"
TEAL = "#087f7a"
ELECTRIC_RED = "#d12a55"


EXPORTS = [
    {
        "filename": "jacksonthedev-linkedin-banner.png",
        "platform": "LinkedIn personal banner",
        "size": (1584, 396),
        "plaque": (330, 74, 1170, 242),
        "wordmark_size": 88,
        "subtitle_size": 25,
    },
    {
        "filename": "jacksonthedev-x-banner.png",
        "platform": "X / Twitter header",
        "size": (1500, 500),
        "plaque": (260, 116, 1100, 270),
        "wordmark_size": 91,
        "subtitle_size": 25,
    },
    {
        "filename": "jacksonthedev-business-card-front.png",
        "platform": "Business card front concept (3.5 × 2 ratio)",
        "size": (1050, 600),
        "plaque": (92, 154, 866, 292),
        "wordmark_size": 76,
        "subtitle_size": 22,
    },
]


def fit_font(text: str, font_path: Path, requested: int, max_width: int) -> ImageFont.FreeTypeFont:
    size = requested
    while size > 12:
        font = ImageFont.truetype(str(font_path), size=size)
        bbox = font.getbbox(text)
        if bbox[2] - bbox[0] <= max_width:
            return font
        size -= 1
    return ImageFont.truetype(str(font_path), size=12)


def tracked_width(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, tracking: int) -> int:
    widths = [draw.textlength(char, font=font) for char in text]
    return round(sum(widths) + tracking * max(0, len(text) - 1))


def draw_tracked_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    center_x: int,
    y: int,
    font: ImageFont.FreeTypeFont,
    fill: str,
    tracking: int,
) -> None:
    x = center_x - tracked_width(draw, text, font, tracking) / 2
    for char in text:
        draw.text((round(x), y), char, font=font, fill=fill)
        x += draw.textlength(char, font=font) + tracking


def paper_texture(size: tuple[int, int]) -> Image.Image:
    texture = Image.new("RGBA", size, (0, 0, 0, 0))
    pixels = texture.load()
    for y in range(size[1]):
        for x in range(size[0]):
            value = ((x * 17 + y * 29 + (x * y) % 13) % 19) - 9
            pixels[x, y] = (70, 48, 24, max(0, value + 7))
    return texture.filter(ImageFilter.GaussianBlur(radius=0.35))


def make_export(spec: dict[str, object], master: Image.Image) -> dict[str, object]:
    width, height = spec["size"]
    canvas = ImageOps.fit(master, (width, height), method=Image.Resampling.LANCZOS, centering=(0.52, 0.52))
    canvas = canvas.convert("RGBA")

    shade = Image.new("RGBA", canvas.size, (4, 17, 32, 20))
    canvas = Image.alpha_composite(canvas, shade)

    x, y, plaque_width, plaque_height = spec["plaque"]
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rectangle(
        (x + 12, y + 14, x + plaque_width + 12, y + plaque_height + 14),
        fill=(0, 0, 0, 105),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=12))
    canvas = Image.alpha_composite(canvas, shadow)

    plaque = Image.new("RGBA", (plaque_width, plaque_height), PAPER)
    plaque = Image.alpha_composite(plaque, paper_texture(plaque.size))
    plaque_draw = ImageDraw.Draw(plaque)
    plaque_draw.rectangle((0, 0, plaque_width - 1, plaque_height - 1), outline=GOLD, width=2)

    wordmark = "JACKSONTHEDEV"
    subtitle = "PRACTICAL AI · HUMAN SYSTEMS"
    wordmark_font = fit_font(
        wordmark,
        BOLD_FONT,
        int(spec["wordmark_size"]),
        plaque_width - 90,
    )
    subtitle_font = fit_font(
        subtitle,
        REGULAR_FONT,
        int(spec["subtitle_size"]),
        plaque_width - 110,
    )

    wordmark_bbox = plaque_draw.textbbox((0, 0), wordmark, font=wordmark_font)
    wordmark_y = round(plaque_height * 0.18 - wordmark_bbox[1])
    plaque_draw.text(
        (plaque_width / 2, wordmark_y),
        wordmark,
        font=wordmark_font,
        fill=INK,
        anchor="ma",
    )

    divider_y = round(plaque_height * 0.59)
    plaque_draw.line((58, divider_y, plaque_width - 58, divider_y), fill=GOLD, width=2)
    plaque_draw.ellipse(
        (plaque_width / 2 - 4, divider_y - 4, plaque_width / 2 + 4, divider_y + 4),
        fill=GOLD,
    )

    subtitle_y = round(plaque_height * 0.70)
    draw_tracked_text(
        plaque_draw,
        subtitle,
        plaque_width // 2,
        subtitle_y,
        subtitle_font,
        TEAL,
        tracking=max(2, round(plaque_width / 430)),
    )

    plaque_draw.ellipse((22, 20, 32, 30), fill=ELECTRIC_RED)
    canvas.alpha_composite(plaque, (x, y))

    output_path = BRAND_DIR / str(spec["filename"])
    canvas.convert("RGB").save(output_path, "PNG", optimize=True)
    return {
        "file": output_path.name,
        "platform": spec["platform"],
        "width": width,
        "height": height,
        "safe_zone": "Exact lockup is centered clear of the lower-left profile-photo overlap.",
    }


def main() -> None:
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    master = Image.open(MASTER).convert("RGB")
    outputs = [make_export(spec, master) for spec in EXPORTS]
    manifest = {
        "system": "JacksonTheDev / Peacock Atelier",
        "source_master": MASTER.name,
        "lockup_copy": ["JACKSONTHEDEV", "PRACTICAL AI · HUMAN SYSTEMS"],
        "accent": ELECTRIC_RED,
        "outputs": outputs,
        "provenance": {
            "background": "Built-in image generation using the approved Peacock Atelier card and a Sacramento Tower Bridge reference.",
            "typography_and_exports": "Deterministic Pillow composition from this script.",
        },
    }
    (BRAND_DIR / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
