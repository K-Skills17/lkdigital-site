// Shared building blocks for the homepage refine (docs/redesign/HOMEPAGE.md).
// One button implementation, one section label, one page container.
import Link from "next/link";
import type { ReactNode } from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export type ButtonVariant = "primary" | "secondary";
export type Tone = "light" | "dark";

/**
 * Gold fill with near-black label (7.3:1). The previous white-on-gold label
 * was 2.4:1. Square edges; no lift, glow or scale on hover.
 */
export function buttonClass(variant: ButtonVariant = "primary", tone: Tone = "light", extra?: string) {
  const base =
    "inline-flex min-h-12 items-center justify-center gap-3 px-7 text-center sm:whitespace-nowrap text-sm font-medium tracking-[0.04em] transition-colors duration-200";
  const variants: Record<ButtonVariant, Record<Tone, string>> = {
    primary: {
      light: "bg-accent text-[#1a1a1a] hover:bg-accent-dark",
      dark: "bg-accent text-[#0f0f0f] hover:bg-accent-light",
    },
    secondary: {
      light: "border border-foreground/70 text-foreground hover:bg-foreground hover:text-background",
      dark: "border border-accent/60 text-accent hover:border-accent hover:bg-accent hover:text-[#0f0f0f]",
    },
  };
  return cx(base, variants[variant][tone], extra);
}

export function ButtonLink({
  href,
  children,
  variant,
  tone,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  tone?: Tone;
  className?: string;
}) {
  return (
    <Link href={href} className={buttonClass(variant, tone, className)}>
      {children}
    </Link>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-page px-gutter", className)}>{children}</div>;
}

/** Hairline + small caps label. Gold on dark, derived ink gold on light. */
export function SectionLabel({ children, tone = "light", as: Tag = "p" }: { children: ReactNode; tone?: Tone; as?: "p" | "span" }) {
  return (
    <Tag
      className={cx(
        "flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em]",
        tone === "light" ? "text-accent-ink" : "text-accent",
      )}
    >
      <span aria-hidden="true" className={cx("h-px w-8", tone === "light" ? "bg-accent-ink" : "bg-accent")} />
      {children}
    </Tag>
  );
}

/** Spec-sheet row: label column (lg: 3 of 12) beside the content (lg: 9 of 12). */
export function SpecGrid({ label, children, className }: { label: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cx("grid gap-10 lg:grid-cols-12 lg:gap-8", className)}>
      <div className="lg:col-span-3 lg:pt-3">{label}</div>
      <div className="lg:col-span-9">{children}</div>
    </div>
  );
}

export const arrow = (
  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);
