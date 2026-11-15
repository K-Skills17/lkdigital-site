import Link from "next/link";
import { Container, SectionLabel, arrow, buttonClass } from "@/components/ui/primitives";

interface PageHeroProps {
  variant: "editorial" | "split" | "typographic" | "minimal" | "dramatic";
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  pageNumber?: string;
}

/**
 * Opening of every inner page. Light variants use the derived text gold
 * (accent-ink); dark variants use the brand gold. Server component.
 */
export default function PageHero({ variant, eyebrow, title, titleAccent, subtitle, pageNumber }: PageHeroProps) {
  // ─── EDITORIAL ───
  if (variant === "editorial") {
    return (
      <section className="border-b border-border pb-12 pt-28 md:pb-20 md:pt-40">
        <Container className="grid grid-cols-1 items-end gap-6 md:grid-cols-[1fr_auto] md:gap-8">
          <div>
            {eyebrow && (
              <div className="mb-6">
                <SectionLabel>{eyebrow}</SectionLabel>
              </div>
            )}
            <h1 className="font-display text-[clamp(2.25rem,1.4rem+4vw,5.25rem)] leading-[1.04] tracking-tight text-foreground">
              {title}
              {titleAccent && (
                <>
                  <br />
                  <span className="font-light italic text-accent-ink">{titleAccent}</span>
                </>
              )}
            </h1>
            {subtitle && <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{subtitle}</p>}
          </div>
          {pageNumber && (
            <span aria-hidden="true" className="hidden select-none pb-2 font-display text-[8rem] font-light leading-none text-foreground/10 lining-nums md:block">
              {pageNumber}
            </span>
          )}
        </Container>
      </section>
    );
  }

  // ─── SPLIT ───
  if (variant === "split") {
    return (
      <section className="flex min-h-[50vh] items-end border-b border-border bg-hero-bg md:min-h-[60vh]">
        <Container className="pb-12 pt-32 md:pb-20 md:pt-44">
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[3fr_2fr] md:gap-10">
            <div>
              {eyebrow && (
                <div className="mb-6">
                  <SectionLabel tone="dark">{eyebrow}</SectionLabel>
                </div>
              )}
              <h1 className="font-display text-[clamp(2.25rem,1.4rem+3.6vw,4.5rem)] leading-[1.06] text-white">
                {title}
                {titleAccent && (
                  <>
                    <br />
                    <span className="italic text-accent">{titleAccent}</span>
                  </>
                )}
              </h1>
            </div>
            {subtitle && (
              <p className="border-t border-white/15 pt-5 text-base leading-relaxed text-white/70">{subtitle}</p>
            )}
          </div>
          <div className="mt-10 h-px bg-accent/50" aria-hidden="true" />
        </Container>
      </section>
    );
  }

  // ─── TYPOGRAPHIC ───
  if (variant === "typographic") {
    const words = title.split(" ");
    return (
      <section className="border-b border-border pb-12 pt-28 md:pb-16 md:pt-40">
        <Container>
          {eyebrow && (
            <div className="mb-8">
              <SectionLabel>{eyebrow}</SectionLabel>
            </div>
          )}
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[1fr_auto] md:gap-10">
            <h1 className="font-display leading-[0.92] tracking-tight">
              {words.map((word, i) => (
                <span
                  key={i}
                  className={`block text-[clamp(2.25rem,1rem+6vw,7rem)] ${
                    titleAccent && word === titleAccent
                      ? "font-light italic text-accent-ink"
                      : i % 2 === 0
                        ? "font-medium text-foreground"
                        : "font-light text-muted-foreground"
                  }`}
                >
                  {word}
                </span>
              ))}
            </h1>
            <div className="flex flex-col gap-3 sm:flex-row md:min-w-[240px] md:flex-col md:pb-3">
              <Link href="/contato" className={buttonClass("primary", "light", "justify-between")}>
                Diagnóstico Gratuito
                {arrow}
              </Link>
              <Link href="/segmentos" className={buttonClass("secondary", "light", "hidden justify-between md:inline-flex")}>
                Especialidades
                {arrow}
              </Link>
              <p className="mt-1 hidden text-right text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:block">Comece por aqui</p>
            </div>
          </div>
          {subtitle && (
            <div className="mt-8 flex items-start gap-6">
              <span aria-hidden="true" className="mt-3 hidden h-px w-12 flex-shrink-0 bg-accent-ink sm:block" />
              <p className="max-w-md text-base leading-relaxed text-muted-foreground">{subtitle}</p>
            </div>
          )}
        </Container>
      </section>
    );
  }

  // ─── MINIMAL ───
  if (variant === "minimal") {
    return (
      <section className="pb-10 pt-28 md:pb-14 md:pt-40">
        <Container>
          {eyebrow && (
            <div className="mb-6">
              <SectionLabel>{eyebrow}</SectionLabel>
            </div>
          )}
          <h1 className="max-w-4xl font-display text-[clamp(2.25rem,1.4rem+3.8vw,4.5rem)] font-light leading-[1.08] text-foreground">
            {title}
            {titleAccent && <span className="text-accent-ink"> {titleAccent}</span>}
          </h1>
          <div className="mt-8 h-px w-full bg-foreground/80" aria-hidden="true" />
          {subtitle && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground">{subtitle}</p>
              {pageNumber && (
                <span className="flex-shrink-0 font-display text-sm uppercase tracking-[0.25em] text-muted-foreground lining-nums">
                  {pageNumber}
                </span>
              )}
            </div>
          )}
        </Container>
      </section>
    );
  }

  // ─── DRAMATIC ───
  if (variant === "dramatic") {
    return (
      <section className="bg-hero-bg">
        <Container className="pb-14 pt-32 md:pb-24 md:pt-44">
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[2fr_1fr] md:gap-10">
            <div>
              {eyebrow && (
                <div className="mb-6">
                  <SectionLabel tone="dark">{eyebrow}</SectionLabel>
                </div>
              )}
              <h1 className="font-display text-[clamp(2.25rem,1.4rem+4vw,5rem)] leading-[1.05] tracking-tight text-white">
                {title}
                {titleAccent && (
                  <>
                    {" "}
                    <span className="font-light italic text-accent">{titleAccent}</span>
                  </>
                )}
              </h1>
            </div>
            {subtitle && <p className="border-t border-white/15 pt-5 text-base leading-relaxed text-white/70">{subtitle}</p>}
          </div>
          <div className="mt-10 h-px bg-accent/60 md:mt-12" aria-hidden="true" />
        </Container>
      </section>
    );
  }

  return null;
}
