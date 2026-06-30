#!/usr/bin/env python3
"""Generate the app icon: gold Chi Rho (U+2627) on a lapis ground.
4x supersampling -> 512px -> base64 -> icon.b64 (injected at build time)."""
import base64, io
from PIL import Image, ImageDraw, ImageFont

S = 512
SS = 4
W = S * SS

LAPIS      = (24, 40, 92)      # #18285C deep lapis ground
LAPIS_DEEP = (16, 28, 68)
GOLD       = (200, 160, 70)    # #C8A046 illuminated gold
GOLD_SOFT  = (172, 134, 52)

img = Image.new("RGB", (W, W), LAPIS)
d = ImageDraw.Draw(img)

# subtle vertical depth so the ground isn't flat
for y in range(W):
    t = y / W
    r = int(LAPIS[0]*(1-t) + LAPIS_DEEP[0]*t)
    g = int(LAPIS[1]*(1-t) + LAPIS_DEEP[1]*t)
    b = int(LAPIS[2]*(1-t) + LAPIS_DEEP[2]*t)
    d.line([(0, y), (W, y)], fill=(r, g, b))

# thin gold inset frame (rubrication border), inside the maskable safe zone
m = int(W * 0.12)
d.rounded_rectangle([m, m, W-m, W-m], radius=int(W*0.05),
                    outline=GOLD_SOFT, width=max(2, int(W*0.006)))

# Chi Rho glyph, gold, centered
font = ImageFont.truetype("/usr/share/fonts/truetype/freefont/FreeSerifBold.ttf",
                          int(W*0.52))
glyph = "\u2627"
bbox = d.textbbox((0, 0), glyph, font=font)
gw, gh = bbox[2]-bbox[0], bbox[3]-bbox[1]
cx = (W - gw)//2 - bbox[0]
cy = (W - gh)//2 - bbox[1]
d.text((cx, cy), glyph, font=font, fill=GOLD)

img = img.resize((S, S), Image.LANCZOS)
img.save("icon.png")

buf = io.BytesIO()
img.save(buf, format="PNG", optimize=True)
b64 = base64.b64encode(buf.getvalue()).decode()
open("icon.b64", "w").write(b64)
print(f"icon.png + icon.b64 written ({len(b64)} b64 chars)")
