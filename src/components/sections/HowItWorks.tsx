import { ButtonLink, Container, SectionLabel, arrow } from "@/components/home/primitives";

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
    <section className="py-section">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionLabel>Como funciona</SectionLabel>
            <h2 className="mt-6 font-display text-display-lg text-foreground text-balance">
              Do Diagnóstico à Agenda Cheia em 3 Passos
            </h2>
          </div>
          <ButtonLink href="/contato" className="self-start lg:self-auto">
            Começar Meu Diagnóstico Gratuito
            {arrow}
          </ButtonLink>
        </div>

        <ol className="mt-16 grid gap-0 md:grid-cols-3 md:gap-10">
          {steps.map((step) => (
            <li key={step.number} className="how-step border-t-2 border-accent pt-6 pb-10 md:pb-0">
              <span className="font-display text-5xl font-light leading-none text-foreground lining-nums" aria-hidden="true">
                {step.number}
              </span>
              <h3 className="mt-6 font-display text-2xl font-medium text-foreground">{step.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
