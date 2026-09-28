# Export, verify, deliver

## Commands

```bash
# 1. exact-size PNGs + manifest (dev server running)
bun scripts/render.ts out/ads/vN --url http://localhost:5178

# 2. delivery files: right type, sRGB, no metadata, under the weight limit
uv run --with pillow python scripts/export.py out/ads/vN

# 3. checks: size, weight, alpha, page errors, safe zones, font sizes, overlaps
uv run --with pillow python scripts/verify.py out/ads/vN

# 4. one contact sheet per concept for the owner
uv run --with pillow python scripts/sheet.py out/ads/vN
```

Playwright needs a browser once: `bunx playwright install chromium`.

## Rules

- Fix failures at the source (layout, copy, visual), not by loosening `formats.json`. Change a format's values only when the platform's current spec says so.
- Never overwrite a round. `v1`, `v2`, ... stay, so the owner can compare.
- File names are `<ad>__<variant>__<format>.<ext>`: they sort by concept and match the test plan.

## Deliver

Hand over:
- `out/ads/vN/final/`, all files
- `out/ads/vN/sheets/`, one sheet per concept
- a short list: concept, variant, what it tests, formats, file sizes, and which `formats.json` values were checked against current platform specs versus still defaults

Ask before committing, pushing or uploading to any ad platform.
