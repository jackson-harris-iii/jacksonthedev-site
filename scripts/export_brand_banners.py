#!/usr/bin/env python3
"""Create deterministic Human Current social and card exports."""

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
        "plaque": (360, 54, 1080, 190),
        "wordmark_size": 82,
        "subtitle_size": 24,
        "centering": (0.5, 0.7),
        "safe_zone": "Lockup is clear of LinkedIn's lower-left profile-photo overlap.",
    },
    {
        "filename": "jacksonthedev-x-banner.png",
        "platform": "X / Twitter header",
        "size": (1500, 500),
        "plaque": (300, 74, 1000, 205),
        "wordmark_size": 84,
        "subtitle_size": 24,
        "centering": (0.5, 0.68),
        "safe_zone": "Lockup remains centered within X header safe zones.",
    },
    {
        "filename": "jacksonthedev-business-card-front.png",
        "platform": "Business card front concept (3.5 × 2 ratio)",
        "size": (1050, 600),
        "plaque": (110, 170, 830, 185),
        "wordmark_size": 72,
        "subtitle_size": 22,
        "centering": (0.5, 0.62),
        "safe_zone": "Exact lockup stays inside a generous print-safe margin.",
    },
    {
        "filename": "og-peacock-atelier.png",
        "relative_path": "public/og-peacock-atelier.png",
        "platform": "Design Lab social preview",
        "size": (1600, 900),
        "plaque": (210, 236, 1180, 270),
        "wordmark_size": 108,
        "subtitle_size": 30,
        "centering": (0.5, 0.56),
        "safe_zone": "Exact lockup is centered for link previews and unfurls.",
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
    canvas = ImageOps.fit(
        master,
        (width, height),
        method=Image.Resampling.LANCZOS,
        centering=spec.get("centering", (0.5, 0.5)),
    )
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
    subtitle = "HUMAN IN THE LOOP"
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

    relative_path = spec.get("relative_path")
    output_path = ROOT / str(relative_path) if relative_path else BRAND_DIR / str(spec["filename"])
    canvas.convert("RGB").save(output_path, "PNG", optimize=True)
    return {
        "file": output_path.name,
        "platform": spec["platform"],
        "width": width,
        "height": height,
        "safe_zone": spec["safe_zone"],
    }


def main() -> None:
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    master = Image.open(MASTER).convert("RGB")
    outputs = [make_export(spec, master) for spec in EXPORTS]
    manifest = {
        "system": "JacksonTheDev / Human Current",
        "source_master": MASTER.name,
        "lockup_copy": ["JACKSONTHEDEV", "HUMAN IN THE LOOP"],
        "accent": ELECTRIC_RED,
        "booking_url": "https://stan.store/jacksonthedev",
        "outputs": outputs,
        "provenance": {
            "background": "Built-in image editing of the approved Sacramento Tower Bridge master, replacing the feather with the Human Current motif.",
            "typography_and_exports": "Deterministic Pillow composition from this script.",
        },
    }
    (BRAND_DIR / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
