# Concepts and copy

A static ad is one frame that has to work in under two seconds, mostly without the caption. Write the concepts before any layout.

## One concept = one idea

Each concept answers: who is it for, what changes for them, why believe it. Pick one angle per concept:
- **The outcome:** the result the feature produces, shown as the real finished UI.
- **The pain:** the before, in the user's words, with the product as the answer.
- **The proof:** a number or quote, big, with the product small.
- **The comparison:** old way vs the product, only if the claims rules allow it.
- **The launch:** what's new, named by its product name, with the date or "now in".

## Copy rules (defaults; BRAND.md wins)

- Headline: 7 words or fewer, the product's casing and voice. Say the benefit, not the feature list.
- Support line: optional, 12 words or fewer. Cut it if the visual already says it.
- CTA: 2 to 3 words, the product's own button wording when it has one.
- No text that restates the picture. No stacked adjectives. No claims without a source in BRAND.md.
- Numbers keep their source and qualifiers. Prices keep "from", "per seat", "billed yearly".
- Write copy once in `ads/src/ads.json`; components read it. Never hard-code copy inside a layout.

## Variants

Change one thing per variant so a test means something: the headline, or the visual, or the proof. Name variants by what they change (`h-speed`, `h-cost`, `v-chart`), not `a`/`b`.

## `ads.json` shape

```json
{
  "campaign": "spring-launch",
  "theme": "dark",
  "ads": [
    {
      "id": "outcome-report",
      "component": "OutcomeReport",
      "formats": ["feed-square", "feed-portrait", "story", "linkedin-landscape", "mrec", "leaderboard"],
      "variants": [
        { "id": "h-speed", "headline": "Your weekly report, written for you", "support": "", "cta": "Start free" },
        { "id": "h-time",  "headline": "Get your Mondays back", "support": "", "cta": "Start free" }
      ]
    }
  ]
}
```

## Checkpoint

Before building every format, render the 3 strongest concepts in one format (usually `feed-portrait`) as rough style frames. Show them with their copy and the angle. Wait for OK, then build the rest.
