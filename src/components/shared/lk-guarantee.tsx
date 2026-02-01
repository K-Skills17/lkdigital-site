import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LKGuaranteeProps {
  showCTA?: boolean;
}

export function LKGuarantee({ showCTA = true }: LKGuaranteeProps) {
  return (
    <section className="section-premium bg-trust-bg">
      <div className="max-w-4xl mx-auto text-center">
        {/* Shield Icon - Responsive sizing */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 md:mb-8">
          <svg
            className="w-8 h-8 md:w-10 md:h-10 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        {/* Section eyebrow */}
        <p className="text-xs sm:text-sm font-medium text-accent uppercase tracking-widest mb-4 md:mb-6">
          O Padrão LK
        </p>

        {/* Section title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
          Nossa Promessa de Valor.
        </h2>

        {/* Decorative divider */}
        <div className="w-12 md:w-16 h-px bg-accent mx-auto my-6 md:my-10" aria-hidden="true" />

        {/* Body copy */}
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          Se não estivermos aproximando você dos seus objetivos de faturamento e
          escala, nós nos responsabilizamos. Nosso modelo de parceria é
          desenhado para que só tenhamos sucesso quando a sua clínica prosperar.{" "}
          <span className="text-foreground font-medium">
            É o investimento mais seguro que você fará este ano.
          </span>
        </p>

        {/* Trust badges - Stack on mobile, row on tablet+ */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mt-8 md:mt-12">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
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
            </div>
            <span className="text-sm text-foreground">
              Resultados Garantidos
            </span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <span className="text-sm text-foreground">
              Parceria de Confiança
            </span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <span className="text-sm text-foreground">ROI Comprovado</span>
          </div>
        </div>

        {/* CTA - Full width on mobile */}
        {showCTA && (
          <div className="mt-8 md:mt-12">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-accent text-white hover:bg-accent-dark px-6 sm:px-8 py-5 sm:py-6 text-base"
            >
              <Link href="/contato">Garantir Meu Crescimento</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
