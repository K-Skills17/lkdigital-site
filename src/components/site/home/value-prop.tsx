import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ValueProp() {
  return (
    <section className="section-premium">
      {/* 60/40 Split Layout */}
      <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
        {/* Left: Copy (60%) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Section eyebrow */}
          <p className="text-sm font-medium text-accent uppercase tracking-widest">
            Nossa Proposta
          </p>

          {/* Section title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
            Sua Especialidade é a Odontologia.{" "}
            <span className="text-accent">A Nossa é o Seu Resultado.</span>
          </h2>

          {/* Decorative divider */}
          <div className="w-16 h-px bg-accent" aria-hidden="true" />

          {/* Body copy */}
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Você não deveria ter que escolher entre ser um excelente cirurgião
              e um gestor de marketing. A LK Digital assume{" "}
              <span className="text-foreground font-medium">
                todo o trabalho pesado
              </span>{" "}
              — da estratégia técnica ao monitoramento de dados — para que seus
              objetivos de expansão sejam alcançados de forma previsível e veloz.
            </p>

            <p>
              Reduzimos seu esforço operacional ao mínimo, entregando uma{" "}
              <span className="text-foreground font-medium">
                estrutura pronta
              </span>{" "}
              que atrai o público certo, no momento certo.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 pt-4">
            <div>
              <div className="text-3xl md:text-4xl font-heading text-accent">
                0%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Seu tempo em marketing
              </p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-heading text-accent">
                100%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Foco na clínica
              </p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-heading text-accent">
                ∞
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Potencial de escala
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <Button
              asChild
              size="lg"
              className="bg-accent text-white hover:bg-accent-dark px-8 py-6 text-base"
            >
              <Link href="/solucoes">Descobrir Como Funciona</Link>
            </Button>
          </div>
        </div>

        {/* Right: Image Placeholder (40%) */}
        <div className="lg:col-span-2">
          <div className="relative">
            <div className="aspect-[3/4] bg-muted rounded-sm overflow-hidden">
              {/* Placeholder for image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 p-6">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                    <svg
                      className="w-7 h-7 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dentista focado no atendimento enquanto gráficos de
                    crescimento aparecem ao fundo
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative accent */}
            <div
              className="absolute -top-4 -left-4 w-20 h-20 border-l-2 border-t-2 border-accent/30"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
