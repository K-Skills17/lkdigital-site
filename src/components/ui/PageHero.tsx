"use client";

interface PageHeroProps {
  variant: "editorial" | "split" | "typographic" | "minimal" | "dramatic";
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  pageNumber?: string;
}

export default function PageHero({
  variant,
  eyebrow,
  title,
  titleAccent,
  subtitle,
  pageNumber,
}: PageHeroProps) {
  // ─── EDITORIAL ───
  if (variant === "editorial") {
    return (
      <section className="relative pt-24 pb-12 md:pt-40 md:pb-24 overflow-hidden border-b border-border">
        <div className="max-w-content mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-end">
            <div>
              {eyebrow && (
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <span className="w-8 h-px bg-accent" />
                  <p className="text-[11px] sm:text-xs font-medium text-accent uppercase tracking-[0.25em]">
                    {eyebrow}
                  </p>
                </div>
              )}
              <h1 className="font-display text-[clamp(1.75rem,6vw,5.5rem)] leading-[1.05] tracking-tight text-foreground">
                {title}
                {titleAccent && (
                  <>
                    <br />
                    <span className="text-accent font-light italic">
                      {titleAccent}
                    </span>
                  </>
                )}
              </h1>
              {subtitle && (
                <p className="mt-4 md:mt-6 text-base text-muted-foreground max-w-xl leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            {pageNumber && (
              <div className="hidden md:flex flex-col items-end gap-2 pb-2">
                <span className="font-display text-[8rem] leading-none text-border/50 font-light select-none">
                  {pageNumber}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ─── SPLIT ───
  if (variant === "split") {
    return (
      <section className="relative overflow-hidden border-b border-border">
        <div className="relative min-h-[50vh] md:min-h-[60vh] bg-gradient-to-br from-[#0f0f0f] via-[#1a1510] to-[#2a2318] flex items-end">
          <div className="grain-overlay" />
          <div className="relative z-10 max-w-content mx-auto px-4 sm:px-6 lg:px-16 pt-28 pb-12 md:pt-44 md:pb-20 w-full">
            <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 md:gap-10 items-end">
              <div>
                {eyebrow && (
                  <div className="flex items-center gap-3 mb-4 md:mb-5">
                    <span className="w-6 h-px bg-accent" />
                    <p className="text-[11px] sm:text-xs font-medium text-accent uppercase tracking-[0.25em]">
                      {eyebrow}
                    </p>
                  </div>
                )}
                <h1 className="font-display text-[clamp(1.75rem,5vw,4rem)] leading-[1.1] text-white">
                  {title}
                  {titleAccent && (
                    <>
                      <br />
                      <span className="text-accent">{titleAccent}</span>
                    </>
                  )}
                </h1>
              </div>
              {subtitle && (
                <div className="border-t border-white/10 pt-4 md:pt-5">
                  <p className="text-sm md:text-base text-white/45 leading-relaxed">
                    {subtitle}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 md:mt-10 h-px bg-gradient-to-r from-accent/50 via-accent/15 to-transparent" />
          </div>
        </div>
      </section>
    );
  }

  // ─── TYPOGRAPHIC ───
  if (variant === "typographic") {
    const words = title.split(" ");
    return (
      <section className="relative pt-24 pb-10 md:pt-40 md:pb-16 overflow-hidden border-b border-border">
        <div className="max-w-content mx-auto px-4 sm:px-6">
          {eyebrow && (
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <span className="w-8 h-px bg-accent" />
              <p className="text-[11px] sm:text-xs font-medium text-accent uppercase tracking-[0.25em]">
                {eyebrow}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-end">
            {/* Left — stacked words */}
            <h1 className="font-display leading-[0.9] tracking-tight">
              {words.map((word, i) => (
                <span
                  key={i}
                  className={`block text-[clamp(2rem,8vw,7rem)] ${
                    titleAccent && word === titleAccent
                      ? "text-accent font-light italic"
                      : i % 2 === 0
                      ? "text-foreground font-medium"
                      : "text-muted-foreground font-light"
                  }`}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Right — animated CTA stack (desktop) */}
            <div className="hidden md:flex flex-col gap-4 pb-3 min-w-[220px]">
              <a
                href="/contato"
                className="group relative overflow-hidden px-6 py-4 bg-accent text-white font-medium rounded-md transition-all duration-300 hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-[2px]"
              >
                <span className="relative z-10 flex items-center justify-between gap-3">
                  Diagnóstico Gratuito
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-accent-dark translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </a>
              <a
                href="/casos"
                className="group relative overflow-hidden px-6 py-4 border border-border bg-card text-foreground font-medium rounded-md transition-all duration-300 hover:border-accent/40 hover:-translate-y-[2px]"
              >
                <span className="relative z-10 flex items-center justify-between gap-3">
                  Ver Resultados
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-accent/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </a>
              <a
                href="/segmentos"
                className="group relative overflow-hidden px-6 py-4 border border-border bg-card text-foreground font-medium rounded-md transition-all duration-300 hover:border-accent/40 hover:-translate-y-[2px]"
              >
                <span className="relative z-10 flex items-center justify-between gap-3">
                  Especialidades
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-accent/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </a>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1 text-right">
                Comece por aqui
              </p>
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="flex md:hidden gap-3 mt-6">
            <a
              href="/contato"
              className="flex-1 px-5 py-3 bg-accent text-white text-sm font-medium rounded-md text-center"
            >
              Diagnóstico Gratuito
            </a>
            <a
              href="/casos"
              className="flex-1 px-5 py-3 border border-border text-foreground text-sm font-medium rounded-md text-center"
            >
              Ver Resultados
            </a>
          </div>

          {subtitle && (
            <div className="mt-6 md:mt-8 flex items-start gap-4 md:gap-6">
              <span className="w-8 md:w-12 h-px bg-accent mt-3 flex-shrink-0 hidden sm:block" />
              <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ─── MINIMAL ───
  if (variant === "minimal") {
    return (
      <section className="relative pt-24 pb-8 md:pt-40 md:pb-14 overflow-hidden">
        <div className="max-w-content mx-auto px-4 sm:px-6">
          {eyebrow && (
            <p className="text-[11px] sm:text-xs font-medium text-accent uppercase tracking-[0.25em] mb-4 md:mb-6">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-[clamp(1.75rem,5.5vw,4.5rem)] leading-[1.1] font-light text-foreground max-w-4xl">
            {title}
            {titleAccent && (
              <span className="text-accent"> {titleAccent}</span>
            )}
          </h1>
          <div className="mt-6 md:mt-8 h-px bg-border w-full" />
          {subtitle && (
            <div className="mt-4 md:mt-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <p className="text-sm md:text-base text-muted-foreground max-w-lg leading-relaxed">
                {subtitle}
              </p>
              {pageNumber && (
                <span className="font-display text-xs sm:text-sm text-muted-foreground tracking-[0.25em] uppercase flex-shrink-0">
                  {pageNumber}
                </span>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  // ─── DRAMATIC ───
  if (variant === "dramatic") {
    return (
      <section className="relative bg-[#0f0f0f] overflow-hidden">
        <div className="grain-overlay" />
        <div className="relative z-10 max-w-content mx-auto px-4 sm:px-6 pt-28 pb-14 md:pt-44 md:pb-28">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 md:gap-10 items-end">
            <div>
              {eyebrow && (
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <span className="w-6 h-px bg-accent" />
                  <p className="text-[11px] sm:text-xs font-medium text-accent uppercase tracking-[0.25em]">
                    {eyebrow}
                  </p>
                </div>
              )}
              <h1 className="font-display text-[clamp(1.75rem,6vw,5rem)] leading-[1.05] text-white tracking-tight">
                {title}
                {titleAccent && (
                  <>
                    {" "}
                    <span className="text-accent italic font-light">
                      {titleAccent}
                    </span>
                  </>
                )}
              </h1>
            </div>
            {subtitle && (
              <div className="border-t border-white/10 pt-4 md:pt-6">
                <p className="text-sm text-white/40 leading-relaxed">
                  {subtitle}
                </p>
              </div>
            )}
          </div>
          <div className="mt-8 md:mt-12 h-px bg-gradient-to-r from-accent/60 via-accent/20 to-transparent" />
        </div>
      </section>
    );
  }

  return null;
}
