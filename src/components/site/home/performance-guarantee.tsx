export function PerformanceGuarantee() {
  return (
    <section className="section-premium">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: Visual/Icon */}
        <div className="flex justify-center lg:justify-end order-2 lg:order-1">
          <div className="relative">
            {/* Quality Seal */}
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-accent/20 flex items-center justify-center">
              <div className="w-56 h-56 md:w-72 md:h-72 rounded-full border border-accent/30 flex items-center justify-center">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-foreground flex flex-col items-center justify-center text-center p-8">
                  {/* Seal icon */}
                  <svg
                    className="w-12 h-12 text-accent mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  <span className="text-background font-heading text-xl md:text-2xl font-semibold">
                    Compromisso
                  </span>
                  <span className="text-background/70 text-sm mt-1">
                    com Resultados
                  </span>
                </div>
              </div>
            </div>

            {/* Upward trend graph decoration */}
            <div className="absolute -bottom-4 -left-4 w-32 h-20 opacity-60">
              <svg
                viewBox="0 0 100 50"
                className="w-full h-full text-accent"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M0 45 Q 25 40, 40 30 T 70 15 T 100 5"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="5" r="3" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Copy */}
        <div className="space-y-8 order-1 lg:order-2">
          {/* Section eyebrow */}
          <p className="text-sm font-medium text-accent uppercase tracking-widest">
            Nossa Responsabilidade
          </p>

          {/* Section title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
            Compromisso Real com a Sua Rentabilidade.
          </h2>

          {/* Decorative divider */}
          <div className="w-16 h-px bg-accent" aria-hidden="true" />

          {/* Body copy */}
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Não acreditamos em vaidade digital ou métricas vazias. Trabalhamos
              com{" "}
              <span className="text-foreground font-medium">
                garantias de entrega de valor
              </span>{" "}
              baseadas em resultados tangíveis.
            </p>

            <p>
              Nossa responsabilidade é assegurar que cada euro ou real investido
              retorne em{" "}
              <span className="text-foreground font-medium">
                pacientes de alto ticket
              </span>{" "}
              e{" "}
              <span className="text-foreground font-medium">
                autoridade de mercado inquestionável
              </span>
              .
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg
                className="w-5 h-5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Resultados mensuráveis</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg
                className="w-5 h-5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>ROI comprovado</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg
                className="w-5 h-5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Transparência total</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
