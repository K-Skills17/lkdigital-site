import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Diagnóstico Gratuito",
      description:
        "Analisamos sua presença digital atual, sua região, concorrentes e oportunidades. Você recebe um relatório claro — sem compromisso — mostrando exatamente onde estão os pacientes que você está perdendo.",
    },
    {
      number: "02",
      title: "Implementação Sob Medida",
      description:
        "Montamos e ativamos toda a estratégia: Google, Maps, redes sociais, conteúdo, campanhas pagas. Tudo personalizado para a sua especialidade e cidade. Você não precisa fazer nada.",
    },
    {
      number: "03",
      title: "Agenda Cheia + Crescimento",
      description:
        "Em semanas, os primeiros pacientes qualificados começam a aparecer. Otimizamos continuamente para aumentar o volume e a qualidade — enquanto você foca nos tratamentos.",
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-narrow mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-3">
            Como funciona
          </p>
          <h2 className="font-display text-display-md text-foreground text-balance">
            Do Diagnóstico à Agenda Cheia em 3 Passos
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`how-step relative flex flex-col md:flex-row items-center gap-8 opacity-0 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Number circle */}
                <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                  <span className="font-display text-lg font-semibold text-accent">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div
                  className={`flex-1 p-6 md:p-8 rounded-xl bg-card border border-border/60 ${
                    i % 2 === 1 ? "md:text-right" : ""
                  }`}
                >
                  <h3 className="font-display text-xl font-medium text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-14">
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25"
          >
            Começar Meu Diagnóstico Gratuito
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
