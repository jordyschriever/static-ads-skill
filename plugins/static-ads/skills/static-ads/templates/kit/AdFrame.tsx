import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { format as getFormat, safeBox } from "./layout";

declare global {
  interface Window {
    __AD_READY__?: boolean;
  }
}

/** Kill every CSS animation and transition: an ad is one settled frame. */
const FREEZE = `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
html,body{margin:0;padding:0;background:transparent}`;

/**
 * The ad canvas: exact pixel size, the product's theme and background token, frozen motion,
 * and a ready flag (window.__AD_READY__) once fonts and images are decoded.
 * `theme` is applied the way the product does it; adjust `applyTheme` to match BRAND.md.
 */
export function AdFrame({
  format,
  theme = "light",
  background = "var(--background)",
  debug = false,
  children,
}: {
  format: string;
  theme?: "light" | "dark";
  background?: string;
  debug?: boolean;
  children: ReactNode;
}) {
  const f = getFormat(format);
  const safe = safeBox(format);
  const [boxes, setBoxes] = useState<{ x: number; y: number; w: number; h: number; label: string }[]>([]);

  useLayoutEffect(() => applyTheme(theme), [theme]);

  useEffect(() => {
    let alive = true;
    window.__AD_READY__ = false;
    (async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((img) => img.decode().catch(() => undefined)));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (!alive) return;
      if (debug) {
        const frame = document.getElementById("ad")!.getBoundingClientRect();
        setBoxes(
          [...document.querySelectorAll<HTMLElement>("[data-ad-text],[data-ad-keep]")].map((el) => {
            const r = el.getBoundingClientRect();
            const size = getComputedStyle(el).fontSize;
            const label = el.dataset.adText ? `${el.dataset.adText} ${size}` : `${el.dataset.adKeep}`;
            return { x: r.left - frame.left, y: r.top - frame.top, w: r.width, h: r.height, label };
          }),
        );
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      }
      if (alive) window.__AD_READY__ = true;
    })();
    return () => {
      alive = false;
    };
  }, [format, debug]);

  return (
    <>
      <style>{FREEZE}</style>
      <div
        id="ad"
        data-format={format}
        style={{ position: "relative", width: f.w, height: f.h, overflow: "hidden", background }}
      >
        {children}
        {debug && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div
              style={{
                position: "absolute",
                left: safe.left,
                top: safe.top,
                width: safe.width,
                height: safe.height,
                outline: "2px dashed #ff00ff",
              }}
            />
            {boxes.map((b, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: b.x,
                  top: b.y,
                  width: b.w,
                  height: b.h,
                  outline: "1px solid #00e5ff",
                  font: "11px/1 monospace",
                  color: "#00e5ff",
                }}
              >
                <span style={{ position: "absolute", top: -12, left: 0, whiteSpace: "nowrap" }}>{b.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}
