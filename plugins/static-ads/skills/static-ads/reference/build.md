# Build: a small React app that renders one ad per URL

## Workspace

Create `ads/` in the product's repo (or beside it):

```
ads/
├── BRAND.md
├── <campaign>-brief.md
├── index.html
├── vite.config.ts        aliases the app's path imports, reuses its Tailwind/CSS
├── src/
│   ├── main.tsx          reads ?ad=&variant=&format=&debug= and renders one ad
│   ├── ads.json          concepts, variants, copy, formats
│   ├── kit/              copied from templates/kit
│   └── ads/              one component per concept: OutcomeReport.tsx, ...
└── public/fonts/         local copies of the product's fonts
```

- Prefer Vite + React. If the product is Next.js with heavy server components, a hidden route inside the app (`/_ads`) can work instead; keep it out of production builds.
- Import the product's global CSS and tokens so components look identical. Do not re-resolve Tailwind in a monorepo: point at the app's config or its built CSS.
- Load fonts from local files. Remote fonts race the capture.

## main.tsx

```tsx
import { createRoot } from "react-dom/client";
import data from "./ads.json";
import * as Ads from "./ads";
import { AdFrame } from "./kit/AdFrame";
import "../../app/src/styles/globals.css"; // the product's own CSS

const q = new URLSearchParams(location.search);
const ad = data.ads.find((a) => a.id === q.get("ad"))!;
const variant = ad.variants.find((v) => v.id === q.get("variant")) ?? ad.variants[0];
const format = q.get("format") ?? ad.formats[0];
const Ad = (Ads as Record<string, React.ComponentType<any>>)[ad.component];

createRoot(document.getElementById("root")!).render(
  <AdFrame format={format} theme={data.theme} debug={q.has("debug")}>
    <Ad variant={variant} format={format} />
  </AdFrame>,
);
```

Also render an index page (no `ad` param) listing every ad × variant × format as links; it makes manual review fast.

## A concept component

```tsx
import { AdText } from "../kit/AdText";
import { aspect } from "../kit/layout";

export function OutcomeReport({ variant, format }) {
  const a = aspect(format);
  if (a === "wide") return (/* logo · headline · CTA in one row */);
  if (a === "landscape") return (/* words left, visual right */);
  return (
    <div className="flex h-full flex-col">
      <AdText role="headline" className="...">{variant.headline}</AdText>
      <div className="flex-1">{/* the real component, finished state, demo data */}</div>
      <footer>{/* logo + CTA button from the product */}</footer>
    </div>
  );
}
```

- Every piece of text goes through `<AdText role="headline|support|cta|proof|legal|ui">`. It tags the element for the render manifest. UI text inside product components gets `role="ui"` via a wrapper, or is left untagged when it is decorative and allowed to be small (say so in BRAND.md).
- Keep the logo and CTA in `<AdKeep>` so they are checked against the safe zone too.
- Use real components in their finished state with the landing page's demo data. Crop close: one card at 2x reads better than a whole dashboard at 0.5x.
- Components with a clock or async state get a static twin in `ads/src/twins/`, named after the original.

## Theme

`AdFrame` sets `data-theme` / `class="dark"` the way the product does (check BRAND.md) and paints the background token on the frame, so JPG exports never get a black or transparent edge.
