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
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      ),
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
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
      ),
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
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        {/* Section label with flanking lines */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-6 h-px bg-accent" />
            <p className="text-xs font-medium text-accent uppercase tracking-[0.25em]">
              Os Três Pilares
            </p>
            <span className="w-6 h-px bg-accent" />
          </div>
          <h2 className="font-display text-display-md text-foreground text-balance">
            O Sistema que Enche Sua Agenda
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className={`pillar-card group relative p-5 sm:p-8 lg:p-10 cursor-default border-b border-border/60 ${
                i < 2 ? "md:border-r" : ""
              } transition-colors duration-300 opacity-0`}
            >
              {/* Top accent line — expands on hover */}
              <div className="absolute top-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-500" />

              {/* Roman numeral */}
              <span className="pillar-numeral inline-block font-display text-3xl sm:text-5xl font-light text-accent/15 group-hover:text-accent/30 transition-colors duration-500 mb-4 sm:mb-8">
                {pillar.numeral}
              </span>

              {/* Icon */}
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-5">
                {pillar.icon}
              </div>

              {/* Content */}
              <h3 className="font-display text-2xl font-medium text-foreground mb-1">
                {pillar.title}
              </h3>
              <p className="text-sm text-accent font-medium mb-4">
                {pillar.subtitle}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {pillar.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-2.5">
                {pillar.benefits.map((benefit, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-card-foreground">
                    <svg
                      className="w-4 h-4 text-accent flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
