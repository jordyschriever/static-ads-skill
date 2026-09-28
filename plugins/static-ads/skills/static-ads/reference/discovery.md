# Discovery: learn the product before drawing an ad

Ads are judged against the product's own look. Collect it first, write it down, treat it as law. Output: `ads/BRAND.md` (template: `templates/BRAND.md`).

## Where to look

Run 3 or 4 read-only sweeps in parallel (Explore subagents), one topic each. Ask each to return paths, values and quotes, not opinions.

1. **Rules and voice.**
   - Files: `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `CONTRIBUTING.md`, `docs/brand*`, `docs/design*`, style guides, marketing copy docs.
   - Extract, with the source of each rule: casing, dashes, reading level, banned words; radius, borders, shadows, mono usage; claims and legal limits, approved taglines, pricing wording.
2. **Tokens.**
   - Files: global CSS (`globals.css`, `@theme`, CSS variables), Tailwind config, theme files.
   - Extract: background, foreground, muted, card, border and accent in dark and light; radius; fonts and where they load from (local files are needed at render time).
3. **Components and signature elements.**
   - Buttons (the CTA look), badges, status markers, cards, avatars, charts, tables, empty states, the logo (SVG), partner and integration icons.
   - Landing-page signatures: patterns, dithers, outlines, ornaments, illustration style.
   - For each: path, props, and whether it has a clock or async state (motion libraries, `requestAnimationFrame`, `setInterval`, CSS keyframes, Lottie, async images). Those need static twins.
4. **Features and proof.**
   - For each feature an ad could show: the real screen or component, its copy, its best finished state.
   - The demo data the landing page already uses, fake-data preview routes, seed data.
   - Proof the product may use: metrics, customer logos, quotes, ratings, awards, with their source and any approval rule.
5. **Old ad or social work, if any:** what performed, what was dropped, templates the team already uses, image licenses.

## Tour the live site

Open the landing page in a browser at desktop and at phone width. Note right after each pair of screenshots: colors on screen, type sizes, how the hero is built, how CTAs look, how partner logos and proof are shown, the tone of headlines. Screenshots do not persist, so write findings down right away.

## Feed the interview

Stop once you can name the real options: features, screens and components worth showing, the logo, partner logos, proof you found, any brand pattern. Then run the interview before finishing the brand kit.

## Write BRAND.md

Fill `templates/BRAND.md`. Every rule cites its source. Keep a Components table (import / static twin / redraw, and why) and a Claims section. Where the product says nothing, use this skill's defaults and mark them as defaults so the owner can overrule them.
