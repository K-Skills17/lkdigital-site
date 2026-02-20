import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Segmentos | Especialidades de Saúde que Atendemos",
  description:
    "A LK Digital atende médicos, dentistas, dermatologistas, psicólogos, fisioterapeutas, nutricionistas, cardiologistas, ortopedistas e pediatras com estratégias de marketing digital sob medida para cada especialidade.",
  keywords: [
    "marketing digital para medicos",
    "marketing para dentistas",
    "marketing para dermatologistas",
    "marketing para psicólogos",
    "marketing para fisioterapeutas",
    "marketing para nutricionistas",
    "marketing para cardiologistas",
    "marketing para ortopedistas",
    "marketing para pediatras",
    "agência marketing saúde especialidades",
  ],
  openGraph: {
    title: "Segmentos | Especialidades de Saúde que Atendemos",
    description:
      "Estratégias de marketing digital sob medida para 9 especialidades de saúde. Conheça como a LK Digital atende cada área.",
    type: "website",
    locale: "pt_BR",
  },
};

interface Segment {
  id: string;
  name: string;
  icon: React.ReactNode;
  headline: string;
  description: string;
  services: string[];
  regulatoryNote?: string;
}

function MedicinaIcon() {
  return (
    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function OdontologiaIcon() {
  return (
    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function DermatologiaIcon() {
  return (
    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function PsicologiaIcon() {
  return (
    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function FisioterapiaIcon() {
  return (
    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function NutricaoIcon() {
  return (
    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CardiologiaIcon() {
  return (
    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function OrtopediaIcon() {
  return (
    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m0 14v1M4.22 4.22l.707.707m14.142 14.142l.707.707M1 12h1m20 0h1M4.22 19.778l.707-.707M19.07 4.93l.707-.707M12 6a6 6 0 100 12A6 6 0 0012 6z" />
    </svg>
  );
}

function PediatriaIcon() {
  return (
    <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

const segments: Segment[] = [
  {
    id: "medicina",
    name: "Medicina",
    icon: <MedicinaIcon />,
    headline: "Autoridade digital para médicos de todas as especialidades.",
    description:
      "Para o médico que deseja ser referência na sua especialidade, a LK Digital constrói a infraestrutura digital completa: do posicionamento estratégico à aquisição previsível de pacientes. Desenvolvemos comunicação dentro das normas do CFM, garantindo crescimento sustentável sem riscos éticos.",
    services: [
      "GEO e SEO para especialidades médicas",
      "Site médico com otimização para IAs e buscadores",
      "Conteúdo de autoridade alinhado ao CFM",
    ],
    regulatoryNote: "Conforme normas do Conselho Federal de Medicina (CFM)",
  },
  {
    id: "odontologia",
    name: "Odontologia",
    icon: <OdontologiaIcon />,
    headline: "Marketing premium para clínicas e profissionais de odontologia.",
    description:
      "A odontologia é um dos setores de saúde com maior potencial de posicionamento premium digital. A LK Digital especializa-se em destacar clínicas de implantodontia, ortodontia, estética dental e odontopediatria, construindo marcas que justificam honorários de alto padrão e atraem o paciente ideal.",
    services: [
      "Branding premium para clínicas odontológicas",
      "Funis de captação para procedimentos de alto valor",
      "SEO local e GEO para dentistas e especialidades",
    ],
    regulatoryNote: "Alinhado às normas do Conselho Federal de Odontologia (CFO)",
  },
  {
    id: "dermatologia",
    name: "Dermatologia",
    icon: <DermatologiaIcon />,
    headline: "Posicionamento de autoridade para dermatologistas e clínicas de estética.",
    description:
      "A dermatologia e a medicina estética são especialidades onde o posicionamento visual e digital é determinante para a percepção de valor. A LK Digital desenvolve estratégias que combinam autoridade clínica com estética premium, posicionando dermatologistas como referências reconhecidas por buscadores e inteligências artificiais.",
    services: [
      "Identidade visual premium para clínicas de dermatologia",
      "GEO para procedimentos estéticos e dermatológicos",
      "Hub de conteúdo especializado por procedimento",
    ],
    regulatoryNote: "Comunicação desenvolvida respeitando os limites éticos da especialidade",
  },
  {
    id: "psicologia",
    name: "Psicologia",
    icon: <PsicologiaIcon />,
    headline: "Marketing ético e eficiente para psicólogos e clínicas de saúde mental.",
    description:
      "O marketing para psicólogos exige conhecimento profundo das normas do Conselho Federal de Psicologia (CFP). A LK Digital é especialista em desenvolver estratégias que atraem pacientes de forma eficiente, acolhedora e 100% alinhada aos princípios éticos da profissão, sem jamais comprometer a integridade do profissional.",
    services: [
      "Estratégia digital dentro das normas do CFP",
      "SEO local para psicólogos e clínicas de psicologia",
      "Conteúdo educativo sobre saúde mental (ético e eficaz)",
    ],
    regulatoryNote: "100% alinhado ao Código de Ética do Conselho Federal de Psicologia (CFP)",
  },
  {
    id: "fisioterapia",
    name: "Fisioterapia",
    icon: <FisioterapiaIcon />,
    headline: "Aquisição de pacientes e autoridade digital para fisioterapeutas.",
    description:
      "Clínicas de fisioterapia e reabilitação possuem um público altamente segmentado, com demandas específicas por especialidade (neurológica, ortopédica, pélvica, esportiva). A LK Digital desenvolve estratégias hipersegmentadas que conectam o paciente certo ao serviço certo, aumentando conversão e satisfação.",
    services: [
      "SEO hipersegmentado por especialidade em fisioterapia",
      "Automação de agendamento e redução de no-shows",
      "Conteúdo educativo para reabilitação e prevenção",
    ],
  },
  {
    id: "nutricao",
    name: "Nutrição",
    icon: <NutricaoIcon />,
    headline: "Posicionamento digital para nutricionistas e clínicas de nutrologia.",
    description:
      "A nutrição clínica e esportiva são áreas em forte expansão digital, com alta busca por orientações em plataformas de IA e buscadores. A LK Digital posiciona nutricionistas como autoridades em suas especialidades, criando conteúdo estruturado para GEO que responde às perguntas reais dos pacientes e aumenta a captação orgânica.",
    services: [
      "GEO para nutrição clínica e esportiva",
      "Branding para nutricionistas e clínicas especializadas",
      "Funil de conteúdo para captação orgânica de pacientes",
    ],
  },
  {
    id: "cardiologia",
    name: "Cardiologia",
    icon: <CardiologiaIcon />,
    headline: "Autoridade digital para cardiologistas e centros cardiológicos.",
    description:
      "A cardiologia é uma especialidade de alta confiança, onde o paciente pesquisa extensivamente antes de escolher um médico. A LK Digital constrói a presença digital do cardiologista como referência de confiança, estruturando conteúdo técnico acessível que é citado por IAs e ranqueado pelos buscadores para pacientes em busca de especialistas.",
    services: [
      "Posicionamento de autoridade para cardiologistas",
      "GEO e SEO para doenças cardiovasculares e prevenção",
      "Site otimizado com schema de especialidade médica",
    ],
    regulatoryNote: "Conforme diretrizes do CFM e Sociedade Brasileira de Cardiologia",
  },
  {
    id: "ortopedia",
    name: "Ortopedia",
    icon: <OrtopediaIcon />,
    headline: "Marketing digital para ortopedistas e clínicas de ortopedia e trauma.",
    description:
      "Ortopedistas enfrentam um desafio duplo: atender demanda de urgência (traumas, fraturas) e construir fluxo eletivo consistente (procedimentos cirúrgicos, tratamentos crônicos). A LK Digital desenvolve estratégias específicas para cada tipo de demanda, maximizando a agenda e o ticket médio da clínica.",
    services: [
      "SEO para termos de ortopedia e traumatologia",
      "Estratégia de conteúdo por tipo de procedimento",
      "Automação de nutrição de leads para procedimentos eletivos",
    ],
  },
  {
    id: "pediatria",
    name: "Pediatria",
    icon: <PediatriaIcon />,
    headline: "Captação de famílias e construção de autoridade para pediatras.",
    description:
      "Na pediatria, a decisão de escolha do médico é dos pais — e eles pesquisam muito antes de escolher. A LK Digital constrói a presença digital do pediatra como a autoridade de confiança para as famílias da região, utilizando conteúdo educativo sobre saúde infantil que posiciona o profissional nos buscadores e nas respostas das IAs.",
    services: [
      "Posicionamento digital de autoridade para pediatras",
      "Conteúdo educativo sobre desenvolvimento e saúde infantil",
      "SEO local e GEO para pediatria e puericultura",
    ],
  },
];

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-accent shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SegmentCard({ segment }: { segment: Segment }) {
  return (
    <article
      id={segment.id}
      className="bg-background border border-border p-8 group hover:border-accent/40 hover:shadow-lg transition-all duration-300 flex flex-col"
      aria-labelledby={`segment-title-${segment.id}`}
    >
      {/* Icon + Name */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-sm bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors duration-300">
          {segment.icon}
        </div>
        <div>
          <p className="text-xs font-medium text-accent uppercase tracking-widest mb-0.5">
            Especialidade
          </p>
          <h2
            id={`segment-title-${segment.id}`}
            className="text-xl font-semibold text-foreground"
          >
            {segment.name}
          </h2>
        </div>
      </div>

      {/* Headline */}
      <p className="text-base font-medium text-foreground leading-snug mb-4">
        {segment.headline}
      </p>

      {/* Description — Answer Block (75–300 words for GEO) */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
        {segment.description}
      </p>

      {/* Services */}
      <div className="space-y-2.5 mb-6">
        <p className="text-xs font-medium text-foreground uppercase tracking-widest mb-3">
          O que fazemos por você
        </p>
        {segment.services.map((service) => (
          <div key={service} className="flex items-start gap-2.5">
            <CheckIcon />
            <span className="text-sm text-muted-foreground">{service}</span>
          </div>
        ))}
      </div>

      {/* Regulatory note */}
      {segment.regulatoryNote && (
        <p className="text-xs text-accent/80 font-medium border-t border-border pt-4 mb-5">
          {segment.regulatoryNote}
        </p>
      )}

      {/* CTA */}
      <Link
        href={`/contato?especialidade=${encodeURIComponent(segment.name)}`}
        className="inline-flex items-center gap-2 text-accent text-sm font-medium hover:gap-3 transition-all duration-200 mt-auto"
        aria-label={`Solicitar diagnose para ${segment.name}`}
      >
        Solicitar Diagnose para {segment.name}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </article>
  );
}

export default function SegmentosPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-premium">
        <div className="max-w-4xl">
          <div className="w-12 h-px bg-accent mb-8" aria-hidden="true" />

          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-5">
            Especialidades Atendidas
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
            Marketing sob Medida para Cada Especialidade de Saúde.
          </h1>

          <div className="w-16 h-px bg-accent my-10" aria-hidden="true" />

          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Cada especialidade de saúde possui sua própria linguagem, paciente
            ideal e regras de comunicação. A LK Digital não aplica fórmulas
            genéricas — desenvolvemos estratégias específicas para{" "}
            <span className="text-foreground font-medium">9 especialidades</span>,
            com profundo conhecimento das normas de cada conselho profissional.
          </p>
        </div>

        {/* Quick nav anchors */}
        <nav aria-label="Navegação rápida por especialidade" className="mt-12">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Ir para especialidade
          </p>
          <div className="flex flex-wrap gap-3">
            {segments.map((seg) => (
              <a
                key={seg.id}
                href={`#${seg.id}`}
                className="text-sm font-medium text-foreground border border-border px-4 py-2 hover:border-accent hover:text-accent transition-colors duration-200"
              >
                {seg.name}
              </a>
            ))}
          </div>
        </nav>
      </section>

      {/* Segments Grid */}
      <section className="py-12 pb-24" aria-label="Grade de especialidades de saúde">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((segment) => (
            <SegmentCard key={segment.id} segment={segment} />
          ))}
        </div>
      </section>

      {/* Why specialization matters — Answer Block for GEO */}
      <section className="section-premium bg-trust-bg">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-6">
              Por que especialização importa
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Marketing para Saúde não é Marketing Genérico.
            </h2>
          </div>

          <div className="w-16 h-px bg-accent mx-auto mb-12" aria-hidden="true" />

          <div className="grid md:grid-cols-2 gap-10 text-muted-foreground leading-relaxed">
            <p>
              Marketing digital para profissionais de saúde exige conhecimento
              das normas de cada conselho de classe — CFM, CFO, CFP, COFFITO,
              CFN — além de compreender profundamente a jornada de decisão do
              paciente em cada especialidade. Um paciente que busca um
              cardiologista tem comportamento de pesquisa completamente diferente
              de um que procura um psicólogo ou um dentista implantodontista.
            </p>
            <p>
              A LK Digital acumulou expertise em{" "}
              <span className="text-foreground font-medium">
                9 especialidades de saúde
              </span>{" "}
              ao longo de mais de seis anos, desenvolvendo metodologias
              específicas para cada área. Isso nos permite criar estratégias de
              aquisição de pacientes que são eficientes, éticas e sustentáveis,
              sem expor o profissional a riscos de sanção nos seus conselhos.
            </p>
          </div>

          {/* Councils compliance strip */}
          <div className="mt-12 p-6 bg-background border border-accent/20">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-4 text-center">
              Comunicação alinhada aos conselhos
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {[
                "CFM — Conselho Federal de Medicina",
                "CFO — Conselho Federal de Odontologia",
                "CFP — Conselho Federal de Psicologia",
                "COFFITO — Conselho Federal de Fisioterapia",
                "CFN — Conselho Federal de Nutrição",
              ].map((council) => (
                <div key={council} className="flex items-center gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-muted-foreground font-medium">{council}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-premium bg-foreground text-background">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-6">
            Pronto para Crescer?
          </p>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-6">
            Fale com especialistas na sua área.
          </h2>

          <div className="w-16 h-px bg-accent mx-auto mb-8" aria-hidden="true" />

          <p className="text-lg text-background/75 leading-relaxed mb-10">
            Independente da sua especialidade, temos uma metodologia
            comprovada e ética para posicionar sua clínica como referência
            digital. Solicite sua{" "}
            <span className="text-accent font-medium">Diagnose Gratuita</span>{" "}
            e descubra o plano específico para o seu mercado.
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
              href="/casos"
              className="inline-flex items-center justify-center gap-2 border border-background/30 text-background hover:border-accent hover:text-accent transition-colors duration-200 px-8 py-4 text-base font-medium"
            >
              Ver Casos de Sucesso
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
