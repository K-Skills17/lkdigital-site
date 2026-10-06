import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Ferramentas Gratuitas | LK Digital" },
  description:
    "9 ferramentas gratuitas para dentistas: RAIO-X da clínica, checklist do Google, calculadora de CAC, dashboard, scripts de WhatsApp, auditoria de site e mais.",
  keywords: [
    "ferramentas para dentistas",
    "calculadora odontologia",
    "auditoria site dentista",
    "simulador convênio odontológico",
    "precificação odontologia",
    "raio-x clínica odontológica",
    "CAC clínica odontológica",
    "scripts whatsapp recepção dentista",
  ],
  openGraph: {
    title: "Ferramentas Gratuitas Para Dentistas — LK Digital",
    description:
      "Faça o RAIO-X da clínica, calcule o CAC real, organize o Google e o WhatsApp. 9 ferramentas criadas exclusivamente para dentistas.",
    url: "https://lkdigital.odo.br/ferramentas",
    type: "website",
    images: [{ url: "https://lkdigital.odo.br/og-default.jpg", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://lkdigital.odo.br/ferramentas",
  },
};

const tools = [
  {
    name: "RAIO-X da Clínica",
    href: "/raio-x",
    category: "Diagnóstico",
    description:
      "12 perguntas sobre o caminho entre o primeiro contato e a cadeira: visibilidade, resposta, qualificação, comparecimento, retenção e números.",
    benefit:
      "Descubra em 3 minutos em que etapa sua clínica perde mais pacientes — com um plano de ação por área.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    name: "Checklist do Perfil do Google",
    href: "/ferramentas/checklist-google",
    category: "Google",
    description:
      "27 itens para o Perfil da Empresa no Google, com pontuação ao vivo, kit de avaliações e modelos de pedido e resposta.",
    benefit:
      "Saiba exatamente o que falta no seu Perfil para aparecer para quem procura dentista no bairro.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    name: "Calculadora de CAC",
    href: "/ferramentas/calculadora-cac",
    category: "Financeiro",
    description:
      "Calcula o CAC real (não só o dos anúncios), o custo de cada etapa do funil, ROI, ROAS e LTV com os números do seu mês.",
    benefit:
      "Veja quanto custa, de verdade, cada paciente que fecha tratamento — e qual etapa do funil mais pesa.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
  {
    name: "Dashboard da Clínica",
    href: "/ferramentas/dashboard-clinica",
    category: "Gestão",
    description:
      "Planilha semanal (Excel e Google Sheets) com investimento, leads, agendamentos e receita por canal, CAC e ROAS automáticos.",
    benefit:
      "10 minutos toda segunda para saber qual canal traz receita, não só cliques.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    name: "Scripts de WhatsApp",
    href: "/ferramentas/scripts-whatsapp",
    category: "Atendimento",
    description:
      "Livreto para a recepção: primeira resposta, qualificação, “quanto custa?”, objeções, lembretes, faltas e follow-up.",
    benefit:
      "Mensagens prontas para levar o paciente do primeiro “oi” até a avaliação.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
  },
  {
    name: "Auditoria de Site",
    href: "/ferramentas/auditoria-site",
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
    name: "Simulador de Convênios",
    href: "/ferramentas/simulador-convenios",
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
    href: "/ferramentas/calculadora-precificacao",
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
    name: "Calculadora de Agenda",
    href: "/ferramentas/calculadora-agenda",
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
  "Diagnóstico": "bg-accent/10 text-accent border-accent/20",
  Atendimento: "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

function CollectionPageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Ferramentas Gratuitas Para Dentistas",
    description:
      "9 ferramentas gratuitas para dentistas: RAIO-X da clínica, checklist do Perfil do Google, calculadora de CAC, dashboard da clínica, scripts de WhatsApp, auditoria de site, simulador de convênios, calculadora de precificação e calculadora de agenda.",
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
        url: `https://lkdigital.odo.br${tool.href}`,
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
          subtitle="9 ferramentas criadas exclusivamente para dentistas. Sem custo — resultados práticos para tomar decisões melhores hoje."
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
                  key={tool.href}
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
                  <Link
                    href={tool.href}
                    className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-md transition-all duration-200 hover:shadow-lg hover:shadow-accent/20"
                  >
                    Usar Ferramenta Gratis
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
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

        {/* Cross-links to Blog */}
        <section className="py-16 md:py-20">
          <div className="max-w-content mx-auto px-4 sm:px-6">
            <h2 className="font-display text-display-sm text-foreground mb-6">
              Aprenda a Usar Seus Dados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/blog" className="group p-6 bg-card rounded-xl border border-border/60 hover:border-accent/30 transition-all">
                <h3 className="font-display text-lg font-medium text-foreground group-hover:text-accent transition-colors mb-2">Blog</h3>
                <p className="text-sm text-muted-foreground">Artigos práticos que complementam as ferramentas com estratégias aplicáveis.</p>
              </Link>
              <Link href="/solucoes" className="group p-6 bg-card rounded-xl border border-border/60 hover:border-accent/30 transition-all">
                <h3 className="font-display text-lg font-medium text-foreground group-hover:text-accent transition-colors mb-2">Soluções</h3>
                <p className="text-sm text-muted-foreground">Conheça os serviços profissionais que transformam diagnósticos em resultados.</p>
              </Link>
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
