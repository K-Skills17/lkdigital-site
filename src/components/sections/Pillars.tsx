import { Container, SectionLabel, SpecGrid } from "@/components/ui/primitives";

export default function Pillars() {
  const pillars = [
    {
      numeral: "I",
      title: "Visibilidade de Precisão",
      subtitle: "Apareça onde seus pacientes procuram",
      description:
        "Google, Google Maps, Instagram, ChatGPT — seu consultório aparece como a primeira opção quando alguém na sua região busca por um dentista. Não é achismo: é posicionamento estratégico baseado em dados.",
      benefits: [
        "Primeira página do Google para buscas da sua especialidade",
        "Perfil otimizado no Google Maps com avaliações reais",
        "Presença em respostas de IA (ChatGPT, Gemini, Perplexity)",
      ],
    },
    {
      numeral: "II",
      title: "Gestão Zero Para Você",
      subtitle: "Nós cuidamos de tudo, literalmente",
      description:
        "Da criação de conteúdo ao gerenciamento de campanhas, da resposta a leads ao relatório mensal. Você não precisa abrir um painel, editar um post ou responder uma mensagem de marketing. Nunca.",
      benefits: [
        "Conteúdo criado e publicado pela nossa equipe",
        "Campanhas gerenciadas e otimizadas diariamente",
        "Relatórios claros sem jargão — resultados que você entende",
      ],
    },
    {
      numeral: "III",
      title: "Atenção Exclusiva",
      subtitle: "Você não é mais um cliente numa lista",
      description:
        "Aceitamos apenas um consultório por especialidade por região. Isso significa que nunca trabalhamos com seu concorrente direto. Toda a nossa inteligência, dados e estratégia são exclusivos para você.",
      benefits: [
        "Exclusividade territorial — seu concorrente não tem acesso",
        "Estratégia personalizada para sua especialidade",
        "Reuniões mensais com o estrategista dedicado à sua conta",
      ],
    },
  ];

  return (
    <section className="border-t border-border bg-white py-section">
      <Container>
        <SpecGrid label={<SectionLabel>Os Três Pilares</SectionLabel>}>
          <h2 className="font-display text-display-lg text-foreground text-balance">O Sistema que Enche Sua Agenda</h2>
        </SpecGrid>

        <div className="mt-16 border-t border-foreground/80">
          {pillars.map((pillar) => (
            <article
              key={pillar.numeral}
              className="pillar-card grid gap-6 border-b border-foreground/15 py-10 md:py-14 lg:grid-cols-12 lg:gap-8"
            >
              <span
                className="font-display text-5xl font-light leading-none text-accent md:text-6xl lg:col-span-3"
                aria-hidden="true"
              >
                {pillar.numeral}
              </span>

              <div className="lg:col-span-4">
                <h3 className="font-display text-3xl font-medium text-foreground">{pillar.title}</h3>
                <p className="mt-2 text-sm font-medium text-accent-ink">{pillar.subtitle}</p>
              </div>

              <div className="lg:col-span-5">
                <p className="text-base leading-relaxed text-muted-foreground">{pillar.description}</p>
                <ul className="mt-6 border-t border-foreground/10">
                  {pillar.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-4 border-b border-foreground/10 py-3 text-sm text-foreground">
                      <span aria-hidden="true" className="mt-[0.6rem] h-px w-4 shrink-0 bg-accent-ink" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
