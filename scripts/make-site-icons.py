"""Create the root icons browsers and iOS ask for by default (Python + Pillow).

- public/favicon.ico: the protected symbol at 16, 32 and 48 px, transparent, for /favicon.ico requests.
- public/apple-touch-icon.png: 180 x 180 px, opaque navy #000C19 (iOS paints transparency black), with the symbol
  centered at 76% of the side.

The symbol is only scaled proportionally from the approved original: never redrawn, recolored or clipped.
"""
from hashlib import sha256
from io import BytesIO
from pathlib import Path
import json

from PIL import Image

public = Path(__file__).resolve().parents[1] / "public"
source = public / "assets" / "tetelestai-symbol.png"
if sha256(source.read_bytes()).hexdigest() != "2d9c7c3c12403aa55de0b8092cb78c7898615d084e0fd7bfedcb922dd7c063fd":
    raise ValueError("Approved source asset changed: tetelestai-symbol.png")

symbol = Image.open(source).convert("RGBA")
if symbol.width != symbol.height:
    raise ValueError("The symbol must be square")

outputs = []

data = BytesIO()
symbol.resize((48, 48), Image.Resampling.LANCZOS).save(data, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
outputs.append(("favicon.ico", data.getvalue()))

side, mark = 180, 136
touch = Image.new("RGBA", (side, side), (0, 12, 25, 255))
scaled = symbol.resize((mark, mark), Image.Resampling.LANCZOS)
touch.alpha_composite(scaled, ((side - mark) // 2, (side - mark) // 2))
data = BytesIO()
touch.convert("RGB").save(data, format="PNG", optimize=True)
outputs.append(("apple-touch-icon.png", data.getvalue()))

for name, content in outputs:
    (public / name).write_bytes(content)
    if (public / name).read_bytes() != content:
        raise IOError(f"Icon readback mismatch: {name}")
print(json.dumps([{"icon": name, "bytes": len(content)} for name, content in outputs]))
