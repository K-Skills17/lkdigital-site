import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ferramentas Gratuitas Para Dentistas — Audite, Calcule e Otimize Sua Clínica",
  description:
    "6 ferramentas gratuitas para dentistas: auditoria de site, diagnóstico Google Meu Negócio, simulador de convênios, calculadora de preços, diagnóstico de clínica e calculadora de agenda.",
  keywords: [
    "ferramentas para dentistas",
    "calculadora odontologia",
    "auditoria site dentista",
    "simulador convênio odontológico",
    "precificação odontologia",
    "diagnóstico clínica odontológica",
  ],
  openGraph: {
    title: "Ferramentas Gratuitas Para Dentistas — LK Digital",
    description:
      "Audite seu site, calcule preços, simule convênios e otimize sua agenda. 6 ferramentas criadas exclusivamente para dentistas.",
    url: "https://lkdigital.odo.br/ferramentas",
    type: "website",
  },
  alternates: {
    canonical: "https://lkdigital.odo.br/ferramentas",
  },
};

const tools = [
  {
    name: "Auditoria de Site",
    slug: "auditoria-site",
    url: "https://fb-lead-audit-tool.vercel.app",
    category: "Website",
    description:
      "Analisa seu site em SEO, captação de leads, mobile, visibilidade em IA e prontidão para conversão.",
    benefit:
      "Descubra por que seu site não gera pacientes — receba uma nota de 0 a 100 com correções específicas.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.466.73-3.558" />
      </svg>
    ),
  },
  {
    name: "Diagnóstico Google Meu Negócio",
    slug: "diagnostico-google",
    url: "https://diagnostico-google.vercel.app",
    category: "Google",
    description:
      "Avalia seu Perfil da Empresa no Google em fotos, avaliações, postagens e completude do perfil.",
    benefit:
      "Descubra se seu perfil no Google está ajudando ou prejudicando o fluxo de pacientes.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    name: "Simulador de Convênios",
    slug: "simulador-convenios",
    url: "https://simulador-convenio.vercel.app",
    category: "Financeiro",
    description:
      "Calcula se seus convênios odontológicos são realmente lucrativos ou estão dando prejuízo.",
    benefit:
      "Veja exatamente quanto cada convênio custa para você — e quantos pacientes particulares o substituiriam.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
  {
    name: "Calculadora de Precificação",
    slug: "calculadora-precificacao",
    url: "https://calculadora-precificacao-phi.vercel.app",
    category: "Financeiro",
    description:
      "Determina o preço correto dos seus procedimentos com base em custos, tempo e margem desejada.",
    benefit:
      "Pare de cobrar abaixo do custo — descubra seu valor-hora real e quais procedimentos estão dando prejuízo.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
      </svg>
    ),
  },
  {
    name: "Diagnóstico de Clínica",
    slug: "diagnostico-clinica",
    url: "https://lk-diagnostico-clinica.vercel.app",
    category: "Gestão",
    description:
      "Identifica perdas ocultas de receita: faltas, orçamentos rejeitados, evasão de pacientes e desperdício em marketing.",
    benefit:
      "Veja exatamente quanto dinheiro sua clínica está deixando na mesa todo mês.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    name: "Calculadora de Agenda",
    slug: "calculadora-agenda",
    url: "https://calculadora-agenda-ten.vercel.app",
    category: "Produtividade",
    description:
      "Otimiza sua agenda analisando mix de procedimentos, alocação de tempo e receita por cadeira-hora.",
    benefit:
      "Ganhe mais sem trabalhar mais — otimize sua agenda para máxima receita por hora.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
      </svg>
    ),
  },
];

const categoryColors: Record<string, string> = {
  Website: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Google: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Financeiro: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Gestão": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Produtividade: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

function CollectionPageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Ferramentas Gratuitas Para Dentistas",
    description:
      "6 ferramentas gratuitas para dentistas: auditoria de site, diagnóstico Google Meu Negócio, simulador de convênios, calculadora de preços, diagnóstico de clínica e calculadora de agenda.",
    url: "https://lkdigital.odo.br/ferramentas",
    inLanguage: "pt-BR",
    isPartOf: {
      "@type": "WebSite",
      name: "LK Digital",
      url: "https://lkdigital.odo.br",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: tool.name,
        url: tool.url,
        description: tool.description,
      })),
    },
    provider: {
      "@type": "Organization",
      name: "LK Digital",
      url: "https://lkdigital.odo.br",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function FerramentasPage() {
  return (
    <>
      <CollectionPageSchema />
      <Navbar />
      <main>
        <PageHero
          variant="split"
          eyebrow="Ferramentas Gratuitas"
          title="Diagnostique, Calcule e Otimize"
          titleAccent="Sua Clínica."
          subtitle="6 ferramentas criadas exclusivamente para dentistas. Sem cadastro, sem custo — só resultados práticos para tomar decisões melhores hoje."
        />

        {/* Tools Grid */}
        <section className="py-20 md:py-28">
          <div className="max-w-content mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-accent" />
              <p className="text-[11px] sm:text-xs font-medium text-accent uppercase tracking-[0.25em]">
                Todas as Ferramentas
              </p>
            </div>
            <h2 className="font-display text-display-sm text-foreground mb-4 max-w-2xl">
              Escolha a Ferramenta Certa Para o Seu Desafio
            </h2>
            <p className="text-muted-foreground mb-12 max-w-xl">
              Cada ferramenta resolve um problema específico da gestão odontológica.
              Use uma ou use todas — o diagnóstico é gratuito e instantâneo.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {tools.map((tool) => (
                <article
                  key={tool.slug}
                  className="group relative flex flex-col p-6 md:p-8 bg-card rounded-xl border border-border/60 hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5"
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] rounded-full border ${
                        categoryColors[tool.category] || "bg-accent/10 text-accent border-accent/20"
                      }`}
                    >
                      {tool.category}
                    </span>
                    <span className="text-muted-foreground/40 group-hover:text-accent transition-colors duration-300">
                      {tool.icon}
                    </span>
                  </div>

                  {/* Tool Name */}
                  <h3 className="font-display text-lg md:text-xl font-medium text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                    {tool.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                    {tool.description}
                  </p>

                  {/* Benefit Highlight */}
                  <div className="mb-6 p-3 rounded-lg bg-accent/5 border border-accent/10">
                    <p className="text-sm text-accent leading-relaxed flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {tool.benefit}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-md transition-all duration-200 hover:shadow-lg hover:shadow-accent/20"
                  >
                    Usar Ferramenta Gratis
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Why Free Section */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="max-w-content mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 items-start">
              <div>
                <h2 className="font-display text-display-sm text-foreground mb-4">
                  Por Que Gratuito?
                </h2>
                <span className="w-12 h-px bg-accent block" />
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Acreditamos que o dentista precisa de clareza antes de investir.
                  Cada ferramenta foi desenhada para revelar oportunidades que a
                  maioria dos consultórios não enxerga — de precificação errada a
                  pacientes perdidos no Google.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Use as ferramentas, descubra onde estão os gargalos, e se
                  precisar de ajuda para corrigir — a LK Digital está aqui.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-28 text-center">
          <div className="max-w-narrow mx-auto px-4 sm:px-6">
            <h2 className="font-display text-display-md text-foreground mb-4">
              Quer Um Diagnóstico Completo da Sua Clínica?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              As ferramentas mostram os números. Nossa equipe transforma esses
              números em pacientes na cadeira. Agende um diagnóstico estratégico
              gratuito.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contato"
                className="inline-flex px-8 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25"
              >
                Agendar Diagnóstico Gratuito
              </Link>
              <Link
                href="/casos"
                className="inline-flex px-8 py-4 border border-border text-foreground font-medium rounded-md transition-all duration-200 hover:border-accent/40 hover:-translate-y-[1px]"
              >
                Ver Casos de Sucesso
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
