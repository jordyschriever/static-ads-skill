"""Check every delivery file against its format and the render manifest.

    uv run --with pillow python scripts/verify.py out/ads/v1 [--formats ads/src/kit/formats.json] [--max-headline-words 7]

Fails on: wrong pixel size, over the weight limit, alpha channel, page errors during render,
empty text, text or logo/CTA outside the safe zone, text below minTextPx, overlapping text.
Warns on: long headlines, small UI text, a corner pixel that does not match the background token.
Exit code 1 if anything fails.
"""

import argparse
import json
import re
import sys
from pathlib import Path

from PIL import Image

p = argparse.ArgumentParser()
p.add_argument("out")
p.add_argument("--formats", default="ads/src/kit/formats.json")
p.add_argument("--max-headline-words", type=int, default=7)
a = p.parse_args()

out = Path(a.out)
spec = json.loads(Path(a.formats).read_text())["formats"]
items = json.loads((out / "manifest.json").read_text())["items"]
TOL = 1.0  # px, for sub-pixel layout


def rgb(css: str):
    m = re.match(r"rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)", css or "")
    if not m or (m.group(4) is not None and float(m.group(4)) == 0):
        return None
    return tuple(round(float(m.group(i))) for i in (1, 2, 3))


def inside(b, f):
    s = f["safe"]
    return (
        b["x"] >= s["left"] - TOL
        and b["y"] >= s["top"] - TOL
        and b["x"] + b["w"] <= f["w"] - s["right"] + TOL
        and b["y"] + b["h"] <= f["h"] - s["bottom"] + TOL
    )


def overlap(p, q):
    return p["x"] < q["x"] + q["w"] - TOL and q["x"] < p["x"] + p["w"] - TOL and p["y"] < q["y"] + q["h"] - TOL and q["y"] < p["y"] + p["h"] - TOL


total_fail = 0
for item in items:
    f = spec[item["format"]]
    stem = f"{item['ad']}__{item['variant']}__{item['format']}"
    fails, warns = [], []

    files = list((out / "final").glob(stem + ".*"))
    if not files:
        fails.append("no file in final/ (run export.py)")
    else:
        path = files[0]
        img = Image.open(path)
        scale = item.get("scale", 1)
        want = (round(f["w"] * scale), round(f["h"] * scale))
        if img.size != want:
            fails.append(f"size {img.size[0]}x{img.size[1]}, want {want[0]}x{want[1]}")
        kb = path.stat().st_size / 1024
        if f["maxKB"] and kb > f["maxKB"]:
            fails.append(f"{kb:.0f} KB > {f['maxKB']} KB")
        if img.mode in ("RGBA", "LA", "P") and "A" in img.getbands():
            fails.append("has alpha channel")
        bg = rgb(item.get("background"))
        if bg:
            px = img.convert("RGB").getpixel((1, 1))
            if max(abs(x - y) for x, y in zip(px, bg)) > 6:
                warns.append(f"corner {'#%02x%02x%02x' % px} vs background {'#%02x%02x%02x' % bg} (fine if the visual bleeds)")

    for e in item.get("errors", []):
        fails.append(f"page error: {e[:120]}")

    texts = item.get("texts", [])
    for t in texts:
        label = f"{t['role']} \"{t['text'][:40]}\""
        if not t["text"]:
            fails.append(f"empty {t['role']}")
        if not inside(t, f):
            fails.append(f"{label} outside safe zone")
        if t["fontPx"] < f["minTextPx"]:
            (warns if t["role"] == "ui" else fails).append(f"{label} at {t['fontPx']:.0f}px < {f['minTextPx']}px")
        if t["role"] == "headline" and len(t["text"].split()) > a.max_headline_words:
            warns.append(f"headline has {len(t['text'].split())} words (> {a.max_headline_words})")
    for k in item.get("keeps", []):
        if not inside(k, f):
            fails.append(f"{k['name']} outside safe zone")
    for i, t in enumerate(texts):
        for u in texts[i + 1 :]:
            if overlap(t, u) and not (t["role"] == "ui" and u["role"] == "ui"):
                fails.append(f"{t['role']} overlaps {u['role']}")

    mark = "✗" if fails else ("!" if warns else "✓")
    print(f"{mark} {stem}")
    for m in fails:
        print(f"    fail  {m}")
    for m in warns:
        print(f"    warn  {m}")
    total_fail += bool(fails)

print(f"\n{len(items) - total_fail}/{len(items)} pass")
sys.exit(1 if total_fail else 0)
