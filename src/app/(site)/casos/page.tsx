import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Casos de Sucesso | Resultados Reais para Clínicas de Saúde",
  description:
    "Veja como a LK Digital transformou a presença digital e a aquisição de pacientes de clínicas de cardiologia, odontologia, dermatologia e psicologia com estratégias de GEO, SEO e branding premium.",
  keywords: [
    "casos de sucesso marketing saúde",
    "resultados marketing digital clinicas",
    "LK Digital cases",
    "marketing para clinica de dermatologia",
    "marketing para clinica odontologica",
    "resultados SEO para medicos",
    "captação de pacientes resultados",
  ],
  openGraph: {
    title: "Casos de Sucesso | Resultados Reais para Clínicas de Saúde",
    description:
      "Resultados mensuráveis de clínicas que transformaram sua aquisição de pacientes com a LK Digital.",
    type: "website",
    locale: "pt_BR",
  },
};

interface Metric {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface CaseStudy {
  id: string;
  specialty: string;
  clinicType: string;
  location: string;
  tag: string;
  challenge: string;
  solution: string;
  metrics: Metric[];
  quote: string;
}

function TrendUpIcon() {
  return (
    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

const caseStudies: CaseStudy[] = [
  {
    id: "cardiologia",
    specialty: "Cardiologia",
    clinicType: "Clínica Cardiológica Privada",
    location: "São Paulo, SP",
    tag: "GEO + SEO + Branding",
    challenge:
      "Cardiologista de alta reputação clínica, porém invisível digitalmente. Apesar de 15 anos de experiência, o médico não aparecia nas buscas do Google nem era mencionado por plataformas de IA quando pacientes pesquisavam por cardiologistas na região. A agenda dependia exclusivamente de indicações, gerando imprevisibilidade.",
    solution:
      "Desenvolvemos uma estratégia completa de autoridade digital: rebranding premium, site técnico otimizado para GEO com conteúdo estruturado em Answer Blocks, schema markup de especialidade médica e campanha de conteúdo educativo sobre saúde cardiovascular. Em paralelo, instalamos automação de nutrição de leads via WhatsApp.",
    metrics: [
      { value: "312%", label: "Aumento no tráfego orgânico", icon: <TrendUpIcon /> },
      { value: "18×", label: "Mais agendamentos online em 4 meses", icon: <CalendarIcon /> },
      { value: "Top 3", label: "Posição no Google para 12 termos-chave", icon: <SearchIcon /> },
    ],
    quote:
      "Pela primeira vez, pacientes chegam até mim por pesquisa própria, não apenas por indicação. A LK Digital transformou minha autoridade clínica em autoridade digital.",
  },
  {
    id: "odontologia",
    specialty: "Odontologia",
    clinicType: "Clínica Odontológica Multi-profissional",
    location: "Belo Horizonte, MG",
    tag: "Branding + Aquisição + Automação",
    challenge:
      "Clínica com 3 especialistas em implantodontia, ortodontia e estética dental disputando atenção em mercado saturado. O posicionamento era genérico, a comunicação era inconsistente entre as redes sociais e o site, e o custo por lead vinha crescendo 40% ao semestre. A clínica precisava se diferenciar e reduzir dependência de mídia paga.",
    solution:
      "Criamos uma identidade de marca premium e unificada, posicionando a clínica como referência em sorrisos de alto padrão. Desenvolvemos funil de conteúdo orgânico especializado, sistema de captação por GEO e automação de relacionamento pós-consulta para estímulo a indicações qualificadas.",
    metrics: [
      { value: "67%", label: "Redução no custo por lead qualificado", icon: <TrendUpIcon /> },
      { value: "4.8★", label: "Avaliação média no Google (era 3.9)", icon: <StarIcon /> },
      { value: "220%", label: "Aumento em procedimentos de alto valor", icon: <CalendarIcon /> },
    ],
    quote:
      "Nossa clínica finalmente tem uma identidade que reflete a qualidade do nosso trabalho. Os pacientes chegam sabendo exatamente o que queremos oferecer — e pagam por isso.",
  },
  {
    id: "dermatologia",
    specialty: "Dermatologia",
    clinicType: "Clínica Dermatológica e Estética",
    location: "Curitiba, PR",
    tag: "SEO + GEO + Conteúdo de Autoridade",
    challenge:
      "Dermatologista especializada em procedimentos estéticos de alto ticket enfrentava concorrência agressiva de clínicas com grandes orçamentos de mídia paga. Precisava construir autoridade orgânica sustentável sem depender de investimento publicitário crescente. As IAs não a mencionavam quando pacientes buscavam orientação sobre procedimentos.",
    solution:
      "Estruturamos um hub de conteúdo de autoridade com artigos clínicos em formato Answer Block otimizados para GEO, respondendo perguntas reais de pacientes sobre procedimentos dermatológicos. Implementamos schema de especialidade médica, criamos o arquivo llms.txt e desenvolvemos série de conteúdo educativo que posicionou a médica como referência nacional na especialidade.",
    metrics: [
      { value: "580%", label: "Crescimento em tráfego orgânico em 6 meses", icon: <TrendUpIcon /> },
      { value: "1ª", label: "Mencionada por IAs para 5 procedimentos-chave", icon: <SearchIcon /> },
      { value: "92%", label: "Da agenda preenchida por canais orgânicos", icon: <UsersIcon /> },
    ],
    quote:
      "Hoje sou citada pelo ChatGPT e pelo Perplexity quando pacientes perguntam sobre procedimentos dermatológicos em Curitiba. Isso é a prova de que a estratégia de GEO funciona de verdade.",
  },
  {
    id: "psicologia",
    specialty: "Psicologia",
    clinicType: "Psicólogo Clínico em Consultório Particular",
    location: "Rio de Janeiro, RJ",
    tag: "Branding + SEO Local + Automação",
    challenge:
      "Psicólogo recém-formado, com pós-graduação em TCC e EMDR, tentando construir uma base de pacientes particular em mercado competitivo e com restrições éticas de comunicação. As limitações do CFP na publicidade tornavam o marketing tradicional de difícil navegação, e a agenda estava apenas 30% ocupada.",
    solution:
      "Desenvolvemos estratégia completa dentro das normas do Conselho Federal de Psicologia: identidade visual acolhedora e profissional, SEO local hipersegmentado, conteúdo educativo sobre saúde mental dentro dos limites éticos, e automação de agendamento online para reduzir fricção no primeiro contato.",
    metrics: [
      { value: "100%", label: "Agenda ocupada em 75 dias", icon: <CalendarIcon /> },
      { value: "4×", label: "Aumento no volume de contatos mensais", icon: <UsersIcon /> },
      { value: "Zero", label: "Infrações às normas éticas do CFP", icon: <StarIcon /> },
    ],
    quote:
      "Duvidei que fosse possível fazer marketing respeitando todas as normas do CFP e ainda assim atrair pacientes. A LK Digital me provou o contrário — minha agenda lotou em 75 dias.",
  },
];

function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article
      className="bg-background border border-border overflow-hidden group"
      id={study.id}
      aria-labelledby={`case-title-${study.id}`}
    >
      {/* Card header */}
      <div className="bg-foreground p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-2">
              {study.specialty}
            </p>
            <h2
              id={`case-title-${study.id}`}
              className="text-xl md:text-2xl font-semibold text-background leading-tight"
            >
              {study.clinicType}
            </h2>
            <p className="text-background/60 text-sm mt-1">{study.location}</p>
          </div>
          <span className="shrink-0 text-xs font-medium text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 whitespace-nowrap">
            {study.tag}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-8 space-y-8">

        {/* Challenge + Solution */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">
              O Desafio
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {study.challenge}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-3">
              A Solução LK
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {study.solution}
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-border" aria-hidden="true" />

        {/* Metrics */}
        <div>
          <p className="text-xs font-medium text-accent uppercase tracking-widest mb-5">
            Resultados Mensuráveis
          </p>
          <div className="grid grid-cols-3 gap-4">
            {study.metrics.map((metric, i) => (
              <div key={i} className="bg-muted p-4 text-center">
                <div className="flex justify-center mb-2">{metric.icon}</div>
                <div className="text-2xl md:text-3xl font-heading text-foreground font-semibold mb-1">
                  {metric.value}
                </div>
                <p className="text-xs text-muted-foreground leading-snug">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-border" aria-hidden="true" />

        {/* Quote */}
        <blockquote className="relative pl-6 border-l-2 border-accent">
          <svg
            className="w-6 h-6 text-accent/30 absolute -top-1 left-0"
            fill="currentColor"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M10 8c-3.866 0-7 3.134-7 7v9h9v-9H6c0-2.209 1.791-4 4-4V8zm18 0c-3.866 0-7 3.134-7 7v9h9v-9h-6c0-2.209 1.791-4 4-4V8z" />
          </svg>
          <p className="text-foreground font-medium italic leading-relaxed">
            &ldquo;{study.quote}&rdquo;
          </p>
          <footer className="mt-3">
            <cite className="text-xs text-muted-foreground not-italic font-medium">
              {study.specialty} — {study.location}
            </cite>
          </footer>
        </blockquote>
      </div>
    </article>
  );
}

export default function CasosPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-premium">
        <div className="max-w-4xl">
          <div className="w-12 h-px bg-accent mb-8" aria-hidden="true" />

          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-5">
            Casos de Sucesso
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
            Resultados Reais. Clínicas Reais.
          </h1>

          <div className="w-16 h-px bg-accent my-10" aria-hidden="true" />

          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Preservamos a privacidade dos nossos clientes, mas os números falam
            por si. Conheça como médicos, dentistas, dermatologistas e psicólogos
            transformaram sua presença digital e aquisição de pacientes com a
            metodologia LK Digital.
          </p>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14">
            {[
              { value: "150+", label: "Clínicas atendidas" },
              { value: "9+", label: "Especialidades" },
              { value: "95%", label: "Taxa de renovação" },
              { value: "4×", label: "ROI médio no 1º ano" },
            ].map((stat) => (
              <div key={stat.label} className="border-l-2 border-accent pl-4">
                <div className="text-3xl md:text-4xl font-heading text-foreground font-semibold">
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-12 pb-24">
        <div className="space-y-12">
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            <strong className="text-foreground">Nota de transparência:</strong> Os casos
            apresentados são reais, porém os nomes das clínicas e profissionais foram
            omitidos para preservação de privacidade, conforme acordado em nossos contratos
            de parceria. Os resultados podem variar de acordo com o mercado, especialidade,
            investimento e período de parceria.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-premium bg-foreground text-background">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-6">
            O Próximo Caso de Sucesso
          </p>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-6">
            Pode ser a sua clínica.
          </h2>

          <div className="w-16 h-px bg-accent mx-auto mb-8" aria-hidden="true" />

          <p className="text-lg text-background/75 leading-relaxed mb-10">
            Agende sua{" "}
            <span className="text-accent font-medium">Diagnose Gratuita</span>{" "}
            e descubra as oportunidades de crescimento específicas para sua
            especialidade e mercado — sem compromisso.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contato"
              className="inline-flex items-center justify-center gap-2 bg-accent text-white hover:bg-accent-dark transition-colors duration-200 px-8 py-4 text-base font-medium"
            >
              Solicitar Diagnose Gratuita
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/segmentos"
              className="inline-flex items-center justify-center gap-2 border border-background/30 text-background hover:border-accent hover:text-accent transition-colors duration-200 px-8 py-4 text-base font-medium"
            >
              Ver sua Especialidade
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
