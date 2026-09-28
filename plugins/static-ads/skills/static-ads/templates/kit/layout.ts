import spec from "./formats.json";

export type FormatId = keyof typeof spec.formats;
export type Format = (typeof spec.formats)[FormatId];
export type Aspect = "square" | "portrait" | "story" | "landscape" | "tall" | "wide" | "small";

export function format(id: string): Format {
  const f = (spec.formats as Record<string, Format>)[id];
  if (!f) throw new Error(`Unknown format "${id}". Add it to kit/formats.json.`);
  return f;
}

/** The layout class a concept switches on. One layout per class, never one design scaled. */
export const aspect = (id: string): Aspect => format(id).class as Aspect;

/** Inner box (inside the safe zone) in CSS pixels. */
export function safeBox(id: string) {
  const f = format(id);
  return {
    left: f.safe.left,
    top: f.safe.top,
    width: f.w - f.safe.left - f.safe.right,
    height: f.h - f.safe.top - f.safe.bottom,
  };
}
