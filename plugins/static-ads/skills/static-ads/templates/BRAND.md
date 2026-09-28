# <Product> ad kit

The look, rules, assets and code for every <Product> static ad. Each campaign brief points here and only adds its concepts.
Sources: <landing URL>, <design system path>, <rules files>, product owner notes. When this file and the repo's rules files disagree, the repo wins.

## The brief (from the interview)
- Channels: <Meta / LinkedIn / X / Google Display>. Formats: <ids from formats.json>.
- Goal: <sign-ups / launch awareness / retargeting / event>. Audience: <in their words>.
- Must show: <features, by their product names>.
- Ingredients: <visual: UI crop / hero component / type only / pattern> · <proof: metric / quote / logos / none> · <CTA wording or none> · <variants: what they test>.
- Theme: <dark | light>. Languages: <..>.

## Hard rules
<!-- Every rule with its source. Capture what the product says; do not copy another product's rules. -->
- Casing: (source)
- Type: <type styles, where mono is allowed> (source)
- Corners: <radius token> (source)
- Surfaces: background `<token>`; other surfaces only where the product has them (source)
- Borders and shadows: (source)
- Copy: <dashes, reading level, banned words, headline length> (source)
- Claims: see "Claims".

## Frame
- Background token per theme: <..>. Painted by AdFrame on every format.
- Margins beyond the safe zone: <product spacing token, or default>.
- Headline style: font, weight, size per aspect class (square/portrait/story/landscape/tall/wide/small).

## Color
| Token | Value | Use |
|---|---|---|
| background | | |
| foreground | | |
| muted foreground | | |
| surface | | only where the product shows one |
| border | | only where the product uses one |
| accent | | CTA? |
| status tones | | from the product |

## Type
- Fonts and local files in `ads/public/fonts/`:
- Minimum sizes: from formats.json `minTextPx`, or stricter here.

## Logo
- Files: (SVG path or component), light and dark versions.
- Clear space and minimum size: (source or default: clear space = height of the mark; min 24 px tall on display banners).
- Never: (stretching, recoloring, effects).

## Signature elements
| Element | Look | Source | In ads |
|---|---|---|---|
| CTA button | | | at rest, product's own component |
| Badges or status markers | | | |
| Brand and partner icons | | | inline with names |
| Texture or pattern (if any) | | | calm, never behind small text |

## Components
| Need | Component (path) | In ads: import / static twin / redraw, and why |
|---|---|---|
| | | |

## Demo data
- Names, numbers and content from the landing page or seed data: (source). Never real customer data without approval.

## Claims
- What the product does (ads may show):
- What it never does (ads must not show):
- Approved lines and numbers, with source:
- Pricing wording and qualifiers:
- Words to avoid:

## Workspace
- Folder, Vite config (aliases, CSS), dev server port, fonts, scripts (render, export, verify, sheet).
