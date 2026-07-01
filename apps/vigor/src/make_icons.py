#!/usr/bin/env python3
"""
Regenerate VIGOR's app icon — a brass "hour gauge" dial on a deep-pine rounded
tile (the same mark used on the launch screen and the in-app gauge).

Draws at 4x supersampling, then downsamples to 512/192/180 and writes the
base64 PNGs into icons_b64.py.  Run this only when you want to change the icon;
the committed icons_b64.py already holds the current icon.

    python3 make_icons.py        # requires Pillow:  pip install pillow

The output is a *matching design*, not necessarily byte-identical to the icon
that shipped, so review the preview it writes (icon_preview.png) after running.
"""
import base64, io, math, pathlib
from PIL import Image, ImageDraw

HERE = pathlib.Path(__file__).parent

# palette (matches the app tokens)
PINE_A   = (53, 99, 85)     # tile gradient top
PINE_B   = (31, 61, 51)     # tile gradient bottom
BRASS    = (224, 189, 114)  # gauge arc
BRASS_HL = (243, 230, 207)  # needle
TRACK    = (231, 211, 166)  # faint track


def polar(cx, cy, r, deg):
    a = math.radians(deg - 90)  # 0deg = top, clockwise
    return (cx + r * math.cos(a), cy + r * math.sin(a))


def draw_icon(px):
    S = px * 4  # supersample
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # rounded tile with a soft vertical gradient
    grad = Image.new("RGB", (1, S))
    for y in range(S):
        t = y / (S - 1)
        grad.putpixel((0, y), tuple(int(PINE_A[i] + (PINE_B[i] - PINE_A[i]) * t) for i in range(3)))
    grad = grad.resize((S, S))
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.22), fill=255)
    img.paste(grad, (0, 0), mask)

    cx = cy = S / 2
    r = S * 0.30
    lw = int(S * 0.055)

    # faint full track
    d.arc([cx - r, cy - r, cx + r, cy + r], 0, 360, fill=TRACK + (70,), width=lw)

    # brass gauge arc: 260deg opening at the bottom (start 230 -> +260)
    start, sweep = 230, 260
    # PIL arc angles: 0deg = 3 o'clock, clockwise. Convert from our "0=top" scheme.
    a0 = start - 90
    a1 = start + sweep - 90
    d.arc([cx - r, cy - r, cx + r, cy + r], a0, a1, fill=BRASS + (255,), width=lw)

    # needle (swept to ~34deg from top) + hub
    tip = polar(cx, cy, r * 0.82, 34)
    d.line([cx, cy, tip[0], tip[1]], fill=BRASS_HL + (255,), width=int(S * 0.032))
    hub = S * 0.028
    d.ellipse([cx - hub, cy - hub, cx + hub, cy + hub], fill=BRASS + (255,))

    return img.resize((px, px), Image.LANCZOS)


def b64(img):
    buf = io.BytesIO()
    img.save(buf, "PNG")
    return base64.b64encode(buf.getvalue()).decode()


def main():
    sizes = {"512": 512, "192": 192, "180": 180}
    icons = {k: b64(draw_icon(px)) for k, px in sizes.items()}

    with open(HERE / "icons_b64.py", "w") as f:
        f.write("# Auto-generated base64 PNG icons for VIGOR (apple-touch 180, PWA 192 & 512).\n")
        f.write("# Regenerate with make_icons.py; committed here so build.py works without Pillow.\n")
        f.write("ICONS={\n")
        for k in ("180", "192", "512"):
            f.write(f'  "{k}":"{icons[k]}",\n')
        f.write("}\n")

    draw_icon(512).save(HERE / "icon_preview.png")
    print("wrote icons_b64.py and icon_preview.png")


if __name__ == "__main__":
    main()
