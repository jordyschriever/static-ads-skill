import type { ElementType, ReactNode } from "react";

export type TextRole = "headline" | "support" | "cta" | "proof" | "legal" | "ui";

/**
 * Every word on an ad goes through AdText, so the render manifest can measure it:
 * its box (must sit inside the safe zone) and its computed font size (must be >= minTextPx).
 */
export function AdText({
  role,
  as: Tag = "p",
  className,
  children,
}: {
  role: TextRole;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag data-ad-text={role} className={className}>
      {children}
    </Tag>
  );
}

/** Logo, CTA button, badges: anything that must stay inside the safe zone but is not plain text. */
export function AdKeep({ name, className, children }: { name: string; className?: string; children: ReactNode }) {
  return (
    <div data-ad-keep={name} className={className}>
      {children}
    </div>
  );
}
