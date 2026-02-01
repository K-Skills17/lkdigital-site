export function ValueProp() {
  return (
    <section className="section-premium bg-muted">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section eyebrow */}
        <p className="text-sm font-medium text-accent uppercase tracking-widest mb-6">
          Nossa Proposta
        </p>

        {/* Section title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
          Sua Especialidade é a Odontologia.{" "}
          <span className="block mt-2">A Nossa é o Seu Resultado.</span>
        </h2>

        {/* Decorative divider */}
        <div className="w-16 h-px bg-accent mx-auto my-10" aria-hidden="true" />

        {/* Body copy - styled as an editorial block */}
        <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
          <p>
            Você não deveria ter que escolher entre ser um excelente cirurgião e
            um gestor de marketing. A LK Digital assume{" "}
            <span className="text-foreground font-medium">
              todo o trabalho pesado
            </span>{" "}
            — da estratégia técnica ao monitoramento de dados — para que seus
            objetivos de expansão sejam alcançados de forma previsível e veloz.
          </p>

          <p>
            Reduzimos seu esforço operacional ao mínimo, entregando uma{" "}
            <span className="text-foreground font-medium">estrutura pronta</span>{" "}
            que atrai o público certo, no momento certo.
          </p>
        </div>

        {/* Visual representation of value */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-heading text-accent mb-2">
              0%
            </div>
            <p className="text-sm text-muted-foreground">
              Seu tempo em gestão de marketing
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-heading text-accent mb-2">
              100%
            </div>
            <p className="text-sm text-muted-foreground">
              Foco na excelência clínica
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-heading text-accent mb-2">
              ∞
            </div>
            <p className="text-sm text-muted-foreground">
              Potencial de crescimento
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
