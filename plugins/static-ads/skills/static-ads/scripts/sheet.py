"""Contact sheets for review: one sheet per ad, rows = variants, columns = formats.

    uv run --with pillow python scripts/sheet.py out/ads/v1 [--from final|raw|debug] [--cell 360]

Writes <out>/sheets/<ad>.png. Each cell fits the ad in a square box at true aspect, labelled.
Also prints the real size of each small format, so you judge banners at 100% separately.
"""

import argparse
import json
from collections import OrderedDict
from pathlib import Path

from PIL import Image, ImageDraw

p = argparse.ArgumentParser()
p.add_argument("out")
p.add_argument("--from", dest="src", default="final", choices=["final", "raw", "debug"])
p.add_argument("--cell", type=int, default=360)
a = p.parse_args()

out = Path(a.out)
manifest = "manifest.debug.json" if a.src == "debug" else "manifest.json"
items = json.loads((out / manifest).read_text())["items"]
src = out / a.src
sheets = out / "sheets"
sheets.mkdir(exist_ok=True)

by_ad: "OrderedDict[str, list]" = OrderedDict()
for it in items:
    by_ad.setdefault(it["ad"], []).append(it)

PAD, LABEL, BG, FG = 16, 22, (40, 40, 40), (220, 220, 220)
for ad, its in by_ad.items():
    variants = list(OrderedDict.fromkeys(i["variant"] for i in its))
    formats = list(OrderedDict.fromkeys(i["format"] for i in its))
    W = PAD + len(formats) * (a.cell + PAD)
    H = PAD + len(variants) * (a.cell + LABEL + PAD)
    sheet = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(sheet)
    for r, v in enumerate(variants):
        for c, fm in enumerate(formats):
            x, y = PAD + c * (a.cell + PAD), PAD + r * (a.cell + LABEL + PAD)
            files = list(src.glob(f"{ad}__{v}__{fm}.*"))
            if files:
                im = Image.open(files[0]).convert("RGB")
                im.thumbnail((a.cell, a.cell), Image.LANCZOS)
                sheet.paste(im, (x + (a.cell - im.width) // 2, y + (a.cell - im.height) // 2))
            draw.text((x, y + a.cell + 4), f"{v} · {fm}", fill=FG)
    path = sheets / f"{ad}{'-debug' if a.src == 'debug' else ''}.png"
    sheet.save(path)
    print(f"✓ {path}  ({len(variants)} variants × {len(formats)} formats)")
