---
name: static-ads
description: Make static product ads in code (social feed, stories, LinkedIn, X, display banners, app-store style panels), built on the product's own design system, components, logo and voice, then exported at exact sizes under each platform's file limits. Use whenever someone asks for ads, ad creatives, social images, banners, display ads, a campaign set, ad variants for A/B tests or "static creatives" for their app, SaaS or codebase, even if they don't say "static". No sound, no animation. For videos use a product-film skill instead.
---

# Static ads

An ad that looks like the product made it: its colors, type, components, logo and voice, frozen into one frame and sized for every placement. Built as a small React app inside (or beside) the product's codebase, so it reuses real components, then captured with Playwright into exact-size PNG or JPG files.

## Non-negotiables

- **Their design wins.** Every rule comes from the product: tokens, components, rules files, landing page, copy. Never carry another product's taste in, including any default in this skill that their design contradicts.
- **Ask, don't assume.** What the ads say, where they run and which ingredients they use is the user's call. Interview before writing concepts ([reference/interview.md](reference/interview.md)). Offer options named after their real features and components, never generic ones.
- **One message per ad.** A static ad gets under two seconds of attention in a feed. One idea, one headline, one call to action. Variants test one change at a time.
- **Nothing moves.** No animation, no transitions, no timers, no loading states caught mid-way. Every component shows a finished, settled state. A component that runs its own clock gets a static twin.
- **Measure, never guess.** Text boxes, font sizes and safe zones come from the DOM (the render manifest). Sizes, file weight and colors come from the exported files.
- **Honest claims.** Show only what the product really does. Real UI, real data shapes. Find its claims rules and approved lines before writing a word. Prices keep their qualifiers ("from", "per seat", "billed yearly").
- **Ask first** before committing, pushing or uploading anything. Keep every render round (`out/ads/v1`, `v2`, ...).

## Workflow

1. **Quick discovery.** Rules files, tokens, components, logo, landing page, main features, claims. See [reference/discovery.md](reference/discovery.md).
2. **Interview.** Two rounds of AskUserQuestion: the brief (channels, formats, goal, audience, features), then the ingredients (visual, words, proof, CTA, variants). See [reference/interview.md](reference/interview.md).
3. **Brand kit → `ads/BRAND.md`.** Finish discovery on what they chose and fill [templates/BRAND.md](templates/BRAND.md).
4. **Concepts and copy → `ads/<campaign>-brief.md` and `ads/src/ads.json`.** Read [reference/concepts.md](reference/concepts.md), fill [templates/ad-brief.md](templates/ad-brief.md). Checkpoint: show 3 concepts as rough style frames in one format before building the rest. Wait for OK.
5. **Build.** Read [reference/build.md](reference/build.md) and [reference/formats.md](reference/formats.md).
   - Copy [templates/kit/](templates/kit/) into `ads/src/kit/`.
   - One component per concept in `ads/src/ads/`, with a layout per aspect class, not one design scaled.
6. **Review loop.** See [reference/review.md](reference/review.md): render with `--debug`, contact sheet per concept, fix, show the user.
7. **Export, verify, deliver.** See [reference/export.md](reference/export.md): `scripts/render.ts`, `scripts/export.py`, `scripts/verify.py`, `scripts/sheet.py`, then hand over the files and the sheet.

## Quality floor (always, whatever the ingredients)

- **Only the product's own surfaces, colors, borders and shades.** Never invent gradients, glows, card tints or outlines it does not use.
- **Readable at the size people see it.** Judge at 100% on a phone for social, at real pixel size for banners. Fewer words beat smaller words. Headline 7 words or fewer as a default; the product's rules win.
- **Clear hierarchy.** One thing is biggest. The eye goes: visual or headline, then proof, then CTA and logo.
- **Text never covered** by UI, screenshots, stickers or texture, and always inside the placement's safe zone.
- **The logo is always there and always legible,** at the product's own clear-space rule.
- **Settled UI.** Buttons at rest, lists filled, no spinners, no skeletons, no cursors unless the concept is about the click.
- **Same brand across formats.** A 9:16 and a 300x250 of one concept read as the same ad.
- **No effects the product's language does not use:** fake 3D mockups, drop shadows, stock photos, emoji, stickers, "NEW!" bursts.

## Traps that cost real time

- Fonts load late. Wait for `document.fonts.ready` and every image's `decode()` before capture (`kit/AdFrame.tsx` does this and sets `window.__AD_READY__`).
- CSS animations and transitions still run in headless Chrome. `AdFrame` kills them globally; components on a JS clock (motion libraries, `setInterval`, Lottie) need a static twin.
- Async image components (Radix or base-ui avatars) can render their fallback in a capture. Twin them with a plain `<img>` that is decoded before ready.
- Screenshots at `deviceScaleFactor` 2 are twice the size. Platforms want exact pixels: render at 1 unless the format says otherwise.
- JPG has no alpha: a transparent background turns black. `AdFrame` always paints the background token.
- Display networks cap file weight (often 150 KB). Flat UI compresses well as PNG-8 or JPG; photos and textures do not. Check the weight early, not at the end.
- `color-mix()`, `oklch()` and wide-gamut tokens can shift in export. Screenshots are sRGB: decode the pixels and compare to the tokens (verify.py does).
- In a monorepo: never let the ads workspace re-resolve the app's Tailwind; alias the app's path imports in the Vite config; pin shared dependency versions.
- Stop only the processes you started; other sessions may be using the dev server.
