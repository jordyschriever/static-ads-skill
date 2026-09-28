"""Export raw renders to delivery files: the right type, sRGB, no metadata, under each format's weight limit.

    uv run --with pillow python scripts/export.py out/ads/v1 [--formats ads/src/kit/formats.json]

Reads <out>/manifest.json and <out>/raw/*.png, writes <out>/final/<ad>__<variant>__<format>.<png|jpg>.
PNGs over the limit fall back to JPG. JPGs step quality down from 92 to 60; below that it fails
and tells you to simplify the ad (fewer textures, flatter visual) instead of crushing it.
"""

import argparse
import io
import json
import sys
from pathlib import Path

from PIL import Image

p = argparse.ArgumentParser()
p.add_argument("out")
p.add_argument("--formats", default="ads/src/kit/formats.json")
a = p.parse_args()

out = Path(a.out)
spec = json.loads(Path(a.formats).read_text())["formats"]
items = json.loads((out / "manifest.json").read_text())["items"]
final = out / "final"
final.mkdir(parents=True, exist_ok=True)

failed = 0
for item in items:
    f = spec[item["format"]]
    src = out / item["file"]
    img = Image.open(src).convert("RGB")  # flat, no alpha; AdFrame paints the background
    limit = (f["maxKB"] or 10**9) * 1024
    stem = f"{item['ad']}__{item['variant']}__{item['format']}"

    data, ext, note = None, None, ""
    if f["type"] == "png":
        buf = io.BytesIO()
        img.save(buf, "PNG", optimize=True)
        if buf.tell() <= limit:
            data, ext = buf.getvalue(), "png"
        else:
            note = "png over limit, fell back to jpg"
    if data is None:
        for q in range(92, 59, -4):
            buf = io.BytesIO()
            img.save(buf, "JPEG", quality=q, optimize=True, progressive=True, subsampling=0 if q >= 88 else 2)
            if buf.tell() <= limit:
                data, ext = buf.getvalue(), "jpg"
                note = (note + f", q{q}").lstrip(", ")
                break
    if data is None:
        failed += 1
        print(f"✗ {stem}: over {f['maxKB']} KB even at quality 60. Simplify the visual.")
        continue

    for old in final.glob(stem + ".*"):
        old.unlink()
    (final / f"{stem}.{ext}").write_bytes(data)
    print(f"✓ {stem}.{ext}  {len(data) / 1024:.0f} KB {note}".rstrip())

sys.exit(1 if failed else 0)
