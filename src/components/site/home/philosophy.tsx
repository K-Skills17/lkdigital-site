export function Philosophy() {
  return (
    <section className="section-premium bg-foreground text-background">
      <div className="max-w-4xl mx-auto text-center">
        {/* Quote mark decoration */}
        <div
          className="text-accent/40 text-8xl font-heading leading-none mb-8"
          aria-hidden="true"
        >
          &ldquo;
        </div>

        {/* Philosophy text */}
        <blockquote className="text-xl md:text-2xl lg:text-3xl font-heading leading-relaxed text-background/90">
          Acreditamos que o marketing odontológico deve ser tão indolor e
          preciso quanto uma cirurgia bem executada. Enquanto o mercado foca em
          tendências passageiras, a LK Digital foca em{" "}
          <span className="text-accent">fundamentos sólidos</span>,{" "}
          <span className="text-accent">dados verificáveis</span> e{" "}
          <span className="text-accent">crescimento sustentável</span>.
        </blockquote>

        {/* Decorative line */}
        <div className="w-16 h-px bg-accent mx-auto mt-12" aria-hidden="true" />

        {/* Attribution */}
        <p className="mt-8 text-sm uppercase tracking-widest text-background/60">
          Nossa Filosofia
        </p>
      </div>
    </section>
  );
}
