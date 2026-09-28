import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { chromium } from "playwright";

/**
 * Render every ad × variant × format to an exact-size PNG, plus a manifest of every text box.
 * Needs the ads dev server running (e.g. `bun run dev` in ads/).
 *
 *   bun scripts/render.ts out/ads/v1 --url http://localhost:5178 \
 *     [--data ads/src/ads.json] [--formats ads/src/kit/formats.json] \
 *     [--only <ad>[:<variant>[:<format>]]] [--debug] [--scale 1]
 *
 * Output: <out>/raw/<ad>__<variant>__<format>.png and <out>/manifest.json.
 * With --debug, files go to <out>/debug/ and show safe zones and text boxes.
 */
const args = process.argv.slice(2);
const flag = (name: string, fallback?: string) => {
  const i = args.indexOf(name);
  if (i === -1) return fallback;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
};
const url = flag("--url", "http://localhost:5178")!;
const dataPath = flag("--data", "ads/src/ads.json")!;
const formatsPath = flag("--formats", "ads/src/kit/formats.json")!;
const only = flag("--only");
const scale = Number(flag("--scale", "1"));
const debug = args.includes("--debug");
const [outArg] = args.filter((a) => a !== "--debug");
if (!outArg) throw new Error("Usage: bun scripts/render.ts <out dir> --url <dev server> [--only ad:variant:format] [--debug]");

type Variant = { id: string };
type Ad = { id: string; formats: string[]; variants: Variant[] };
const data: { ads: Ad[] } = JSON.parse(readFileSync(dataPath, "utf8"));
const spec: { formats: Record<string, { w: number; h: number }> } = JSON.parse(readFileSync(formatsPath, "utf8"));

const [onlyAd, onlyVariant, onlyFormat] = (only ?? "").split(":");
const jobs = data.ads.flatMap((ad) =>
  ad.variants.flatMap((v) => ad.formats.map((f) => ({ ad: ad.id, variant: v.id, format: f }))),
).filter((j) => (!onlyAd || j.ad === onlyAd) && (!onlyVariant || j.variant === onlyVariant) && (!onlyFormat || j.format === onlyFormat));
if (jobs.length === 0) throw new Error("Nothing to render: check --only and ads.json.");

const out = resolve(outArg);
const dir = join(out, debug ? "debug" : "raw");
mkdirSync(dir, { recursive: true });

const browser = await chromium.launch();
const manifest: unknown[] = [];
try {
  for (const job of jobs) {
    const f = spec.formats[job.format];
    if (!f) throw new Error(`Unknown format "${job.format}" in ads.json.`);
    const context = await browser.newContext({
      viewport: { width: f.w, height: f.h },
      deviceScaleFactor: scale,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

    const q = new URLSearchParams({ ad: job.ad, variant: job.variant, format: job.format });
    if (debug) q.set("debug", "1");
    await page.goto(`${url}/?${q}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => (window as any).__AD_READY__ === true, null, { timeout: 20_000 });

    const file = join(dir, `${job.ad}__${job.variant}__${job.format}.png`);
    const ad = page.locator("#ad");
    await ad.screenshot({ path: file, animations: "disabled", omitBackground: false });

    const measured = await page.evaluate(() => {
      const frame = document.getElementById("ad")!;
      const fr = frame.getBoundingClientRect();
      const box = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - fr.left, y: r.top - fr.top, w: r.width, h: r.height };
      };
      return {
        background: getComputedStyle(frame).backgroundColor,
        size: { w: fr.width, h: fr.height },
        texts: [...document.querySelectorAll<HTMLElement>("[data-ad-text]")].map((el) => ({
          role: el.dataset.adText,
          text: el.innerText.trim(),
          fontPx: parseFloat(getComputedStyle(el).fontSize),
          ...box(el),
        })),
        keeps: [...document.querySelectorAll<HTMLElement>("[data-ad-keep]")].map((el) => ({
          name: el.dataset.adKeep,
          ...box(el),
        })),
      };
    });

    manifest.push({ file: file.slice(out.length + 1), ...job, scale, debug, errors, ...measured });
    console.log(`${errors.length ? "!" : "✓"} ${job.ad} ${job.variant} ${job.format}${errors.length ? `  ${errors[0]}` : ""}`);
    await context.close();
  }
} finally {
  await browser.close();
}

const manifestPath = join(out, debug ? "manifest.debug.json" : "manifest.json");
writeFileSync(manifestPath, JSON.stringify({ rendered: new Date().toISOString(), url, items: manifest }, null, 2));
console.log(`\n${manifest.length} ads → ${dir}\nmanifest → ${manifestPath}`);
