# Formats, aspect classes and safe zones

All sizes, safe zones and weight limits live in `ads/src/kit/formats.json`. The TypeScript kit and the Python scripts both read it, so change them in one place.

**These are defaults.** Platforms change their specs and their UI overlays. Before a launch, check each platform's current ad specs and edit `formats.json`. Tell the user which values you checked and which are still defaults.

## From channels to formats

| Channel | Formats |
|---|---|
| Meta (Facebook, Instagram) | `feed-portrait` (4:5, best feed coverage), `feed-square`, `story` (9:16, also Reels) |
| LinkedIn | `feed-square`, `linkedin-landscape` |
| X | `feed-square`, `x-landscape` |
| Google Display | `mrec` (300x250), `half-page`, `leaderboard`, `mobile-banner`; `skyscraper` and `billboard` on request |

## Aspect classes

Never scale one design across formats. Each concept has one layout per class, sharing copy, visual and tokens:

- **square / portrait:** stacked. Headline top, visual middle, logo and CTA bottom. Portrait gives the visual more room.
- **story:** stacked, content pulled into the middle. The top ~14% and bottom ~35% are covered by the profile bar, caption and buttons.
- **landscape:** two columns. Words left, visual right (or the product's reading direction).
- **tall (half-page, skyscraper):** stacked, visual cropped close; skyscraper often drops the support line.
- **wide (leaderboard, billboard, mobile-banner):** one row: logo, headline, CTA. The visual shrinks to one component or disappears. On `mobile-banner` only logo, a short headline and CTA fit.
- **small (mrec):** logo, headline, one cropped component, CTA. No support line unless it fits at `minTextPx`.

## Safe zones

`safe` is the margin kept free of text, logo and CTA. The visual may bleed into it; words may not. In `--debug` renders `AdFrame` draws the safe zone in magenta, and `verify.py` fails any text box outside it.

## Weight

Display formats are usually capped at 150 KB. Flat UI in JPG at quality 80 to 88 fits easily at these sizes. Textures, photos and dithers do not: check the weight after the first render, not at delivery.
