# Review loop: look at ads, fix, repeat

Renders are cheap here, attention is not. Review in this order.

## 1. Debug renders of one concept

```bash
bun scripts/render.ts out/ads/vN --url http://localhost:5178 --only outcome-report --debug
uv run --with pillow python scripts/sheet.py out/ads/vN --from debug
```

The magenta dashed box is the safe zone; cyan boxes are measured text (with font size) and kept elements. Look at the sheet, then at each small format at 100%.

## 2. Clean renders of everything, then the sheets

```bash
bun scripts/render.ts out/ads/vN --url http://localhost:5178
uv run --with pillow python scripts/export.py out/ads/vN
uv run --with pillow python scripts/verify.py out/ads/vN
uv run --with pillow python scripts/sheet.py out/ads/vN
```

## 3. The checklist, every round

- **Two-second test:** cover the caption, look for two seconds. Can you say what it is, for whom, and what to do? If not, cut words or crop closer.
- **Hierarchy:** one thing is biggest. Headline and visual don't compete.
- **Background:** the product's token. No invented shades, gradients or glows.
- **Text:** inside the safe zone, at or above `minTextPx`, never covered, never on a busy area without the product's own surface behind it.
- **Words:** fewer. Anything that restates the picture goes. Brand names have their logos.
- **UI:** real components, finished state, demo data from the landing page. No spinners, skeletons or half states.
- **Logo and CTA:** present, legible, the product's own button.
- **Across formats:** the same concept reads as the same ad in every size. Wide banners are not a squashed square.
- **Variants:** differ in exactly the thing they test.
- **Claims:** only what the product does, with sources. Prices with qualifiers.
- **Weight:** display files under their limit without visible artifacts.

## 4. Show the product owner

Send the sheets as soon as a round is coherent, plus the smallest banners at 100%. Fold every note into BRAND.md or the brief, so the next campaign starts from it.
