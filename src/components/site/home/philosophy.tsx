import { AnimatedSection } from "@/components/shared/animated-section";

export function Philosophy() {
  return (
    <section className="section-premium bg-foreground text-background relative overflow-hidden grain-overlay">
      {/* Decorative large number behind */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 text-[20rem] font-heading text-background/[0.02] leading-none pointer-events-none select-none hidden lg:block"
        aria-hidden="true"
      >
        LK
      </div>

      {/* Gold vertical accent */}
      <div
        className="absolute left-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Quote mark decoration */}
        <AnimatedSection animation="scale-in">
          <div
            className="text-accent/30 text-[9rem] font-heading leading-[0.8] mb-6 select-none"
            aria-hidden="true"
          >
            &ldquo;
          </div>
        </AnimatedSection>

        {/* Philosophy text */}
        <AnimatedSection animation="fade-up" delay={1}>
          <blockquote className="text-xl md:text-2xl lg:text-3xl font-heading leading-[1.5] text-background/85">
            Acreditamos que o marketing odontológico deve ser tão indolor e
            preciso quanto uma cirurgia bem executada. Enquanto o mercado foca em
            tendências passageiras, a LK Digital foca em{" "}
            <span className="text-accent">fundamentos sólidos</span>,{" "}
            <span className="text-accent">dados verificáveis</span> e{" "}
            <span className="text-accent">crescimento sustentável</span>.
          </blockquote>
        </AnimatedSection>

        {/* Decorative line */}
        <AnimatedSection animation="scale-in" delay={2}>
          <div className="w-16 h-px bg-accent mx-auto mt-12" aria-hidden="true" />
        </AnimatedSection>

        {/* Attribution */}
        <AnimatedSection animation="fade-up" delay={3}>
          <p className="mt-8 text-xs uppercase tracking-[0.3em] text-background/40">
            Nossa Filosofia — LK Digital
          </p>
        </AnimatedSection>

        {/* Three pillars as bottom accent */}
        <AnimatedSection animation="fade-up" delay={4}>
          <div className="mt-16 grid grid-cols-3 gap-4 border-t border-background/10 pt-12 max-w-xl mx-auto">
            {[
              ["Precisão", "sobre volume"],
              ["Dados", "sobre intuição"],
              ["Sustentável", "sobre tendências"],
            ].map(([title, sub]) => (
              <div key={title} className="text-center">
                <p className="text-sm font-medium text-accent font-heading">{title}</p>
                <p className="text-[10px] uppercase tracking-widest text-background/30 mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
