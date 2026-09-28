# static-ads

A Claude Code skill that makes static product ads in code: social feed and stories, LinkedIn, X and Google Display banners. It uses your product's real components, design tokens, logo and voice, and exports every ad at the exact size and file weight each placement needs.

Adapted from [product-film](https://github.com/Rieranthony/product-film-skill) (MIT): same discovery, interview and brand-kit approach, without sound, motion or Remotion.

## Install

In Claude Code, from this repo pushed to GitHub:

```
/plugin marketplace add <you>/static-ads-skill
/plugin install static-ads@static-ads-skill
```

Or copy the skill folder by hand:

```bash
mkdir -p ~/.claude/skills
cp -R plugins/static-ads/skills/static-ads ~/.claude/skills/
```

## Use

In your product's repo, ask Claude Code:

> Make a set of static ads for our new reporting feature, for Meta and LinkedIn, two headline variants each.

1. **Discovery.** Design rules, tokens, components, logo, demo data and claims.
2. **Interview.** Channels, goal, audience, features; then visual, proof, CTA and variants.
3. **Brand kit and concepts.** `ads/BRAND.md`, a campaign brief and `ads/src/ads.json`. Three style frames first.
4. **Build.** A small Vite + React app, one component per concept, one layout per aspect class.
5. **Review.** Debug renders with safe zones and measured text, contact sheets per concept.
6. **Export and verify.** Exact sizes, PNG or JPG under weight limits, safe zones, minimum font sizes, overlaps.

## What's inside

```
plugins/static-ads/skills/static-ads/
├── SKILL.md            workflow, quality floor, traps
├── reference/          discovery, interview, concepts, formats, build, review, export
├── templates/
│   ├── BRAND.md        fill-in design kit
│   ├── ad-brief.md     fill-in campaign brief
│   └── kit/            formats.json, layout.ts, AdFrame.tsx, AdText.tsx
└── scripts/
    ├── render.ts       Playwright: every ad × variant × format to PNG + manifest
    ├── export.py       delivery files under weight limits
    ├── verify.py       size, weight, safe zones, font sizes, overlaps
    └── sheet.py        contact sheets per concept
```

## Requirements

- Claude Code (the skill runs your local toolchain).
- Node.js and Bun; Playwright with Chromium (`bunx playwright install chromium`).
- uv for Python (the scripts pull Pillow on demand).

The sizes, safe zones and weight limits in `formats.json` are defaults. Platforms change their specs: check them before a launch.

## License

MIT.
