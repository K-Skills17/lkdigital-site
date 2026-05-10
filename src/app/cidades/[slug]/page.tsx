import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BreadcrumbSchema, FAQSchema, CityServiceSchema } from "@/components/StructuredData";
import { cities, getCityBySlug } from "@/data/cities";

export async function generateStaticParams() {
  return cities.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const city = getCityBySlug(params.slug);
  if (!city) return {};

  return {
    title: {
      absolute: `Marketing para Dentistas em ${city.name} ${city.stateAbbr}`,
    },
    description: `Marketing digital para dentistas em ${city.name}. Sites, Google Ads e SEO para lotar sua agenda. Resultados em 90 dias.`,
    alternates: {
      canonical: `/cidades/${city.slug}`,
    },
    openGraph: {
      title: `Marketing para Dentistas em ${city.name} | LK Digital`,
      description: `Sistema completo de captação de pacientes para dentistas em ${city.name}, ${city.stateAbbr}.`,
      images: [{ url: "https://lkdigital.odo.br/og-default.jpg", width: 1200, height: 630 }],
    },
  };
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const city = getCityBySlug(params.slug);
  if (!city) notFound();

  const nearbyCity = city.nearbyCity
    ? cities.find((c) => c.slug === city.nearbyCity)
    : null;

  const competitionColors = {
    alta: "bg-red-500/10 text-red-400 border-red-500/20",
    média: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    baixa: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  const cityFaqs = [
    {
      question: `Quanto custa marketing digital para dentistas em ${city.name}?`,
      answer: `O investimento varia conforme a especialidade, a concorrência na região de ${city.name} e os objetivos do consultório. Em ${city.name}, onde a competição é ${city.competitionLevel} e o ticket médio é de ${city.avgTicket} por procedimento, uma estratégia bem direcionada gera retorno desde as primeiras semanas. Oferecemos um diagnóstico gratuito que analisa sua situação específica e apresenta opções com ROI projetado.`,
    },
    {
      question: `Como aparecer no Google quando alguém busca "dentista em ${city.name}"?`,
      answer: `Para aparecer nas primeiras posições em ${city.name}, combinamos SEO local otimizado para bairros como ${city.neighborhoods.slice(0, 3).join(", ")}, Google Meu Negócio com fotos e avaliações reais, conteúdo relevante e campanhas de Google Ads segmentadas. Nosso sistema implementa tudo de forma integrada.`,
    },
    {
      question: `Quais bairros de ${city.name} vocês atendem?`,
      answer: `Atendemos consultórios em toda a região metropolitana de ${city.name}, incluindo ${city.neighborhoods.join(", ")}. Nossa estratégia de SEO local segmenta por bairros e micro-regiões específicas — posicionando seu consultório exatamente onde seus pacientes buscam.`,
    },
    {
      question: `Qual a diferença da LK Digital para outras agências em ${city.name}?`,
      answer: `Somos especializados exclusivamente em odontologia — não adaptamos estratégias genéricas. Conhecemos as especialidades mais buscadas em ${city.name} (${city.topSpecialties.join(", ")}), os bairros com maior demanda e a maturidade digital do mercado local. Além disso, oferecemos exclusividade territorial: aceitamos apenas um consultório por especialidade por região.`,
    },
    {
      question: `Em quanto tempo vejo resultados em ${city.name}?`,
      answer: `Com competição ${city.competitionLevel} em ${city.name}, a maioria dos nossos clientes começa a receber pacientes qualificados nas primeiras 2 a 4 semanas. Resultados consistentes se consolidam entre 60 e 90 dias. ${city.competitionLevel === "baixa" ? "Em mercados de baixa competição como " + city.name + ", o posicionamento é conquistado mais rapidamente." : ""}`,
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Início", href: "/" },
          { name: "Cidades", href: "/cidades" },
          { name: city.name, href: `/cidades/${city.slug}` },
        ]}
      />
      <CityServiceSchema
        cityName={city.name}
        stateAbbr={city.stateAbbr}
        description={`Marketing digital especializado para dentistas em ${city.name}, ${city.stateAbbr}. Captação de pacientes qualificados com SEO local, Google Ads e presença em IA.`}
      />
      <FAQSchema faqs={cityFaqs} />

      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-hero-bg pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a1510] to-[#0f0f0f]" />
          <div className="absolute inset-0 grain-overlay z-[1]" />
          <div className="relative z-10 max-w-narrow mx-auto px-4 sm:px-6 text-center">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-xs text-white/40 mb-6">
              <Link href="/" className="hover:text-accent transition-colors">Início</Link>
              <span>/</span>
              <Link href="/cidades" className="hover:text-accent transition-colors">Cidades</Link>
              <span>/</span>
              <span className="text-white/60">{city.name}</span>
            </nav>

            <div className="flex items-center justify-center gap-3 mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-medium uppercase tracking-wider ${competitionColors[city.competitionLevel]}`}
              >
                Competição {city.competitionLevel}
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 text-[10px] font-medium text-white/50 uppercase tracking-wider">
                {city.region}
              </span>
            </div>

            <h1 className="font-display text-[clamp(1.5rem,4vw,3.5rem)] leading-[1.1] text-white text-balance max-w-4xl mx-auto mb-4 md:mb-6">
              Marketing Digital para Dentistas em{" "}
              <span className="text-accent">{city.name}, {city.stateAbbr}</span>
            </h1>

            <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
              Captação de pacientes qualificados para consultórios odontológicos em {city.name}.
              Exclusividade territorial — apenas 1 consultório por especialidade na sua região.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link
                href="/contato"
                className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25 text-center"
              >
                Verificar Disponibilidade em {city.name}
              </Link>
            </div>

            {/* City Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="text-center">
                <p className="font-display text-xl sm:text-2xl font-semibold text-white">{city.population}</p>
                <p className="text-[10px] sm:text-xs text-white/40 mt-1">Habitantes (região metropolitana)</p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="font-display text-xl sm:text-2xl font-semibold text-white">{city.estimatedDentists}</p>
                <p className="text-[10px] sm:text-xs text-white/40 mt-1">Dentistas ({city.croCode})</p>
              </div>
              <div className="text-center">
                <p className="font-display text-xl sm:text-2xl font-semibold text-accent">1</p>
                <p className="text-[10px] sm:text-xs text-white/40 mt-1">Vaga por especialidade</p>
              </div>
            </div>
          </div>
        </section>

        {/* Market Insight */}
        <section className="py-20 md:py-28">
          <div className="max-w-prose mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-accent" />
              <p className="text-xs font-medium text-accent uppercase tracking-[0.25em]">
                Mercado Odontológico
              </p>
              <span className="w-6 h-px bg-accent" />
            </div>
            <h2 className="font-display text-display-sm text-foreground mb-6">
              O Cenário em {city.name}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base mb-10">
              {city.marketInsight}
            </p>

            {/* Highlights */}
            <div className="space-y-4">
              {city.highlights.map((highlight, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-muted rounded-lg border-l-2 border-accent/30">
                  <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <p className="text-sm text-card-foreground">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Local Context — UNIQUE per city */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="max-w-prose mx-auto px-4 sm:px-6">
            <h2 className="font-display text-display-sm text-foreground mb-6">
              Bairros e Regiões de {city.name}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base mb-8">
              {city.localContext}
            </p>

            {/* Neighborhood tags */}
            <div className="mb-8">
              <p className="text-xs text-muted-foreground uppercase tracking-[0.25em] mb-3">
                Regiões que atendemos em {city.name}:
              </p>
              <div className="flex flex-wrap gap-2">
                {city.neighborhoods.map((n) => (
                  <span
                    key={n}
                    className="px-3 py-1.5 text-sm bg-card rounded-lg border border-border/60 text-foreground"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* Market data cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-card rounded-lg border border-border/60">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Ticket Médio</p>
                <p className="font-display text-lg font-medium text-foreground">{city.avgTicket}</p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border/60">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Conselho Regional</p>
                <p className="font-display text-lg font-medium text-foreground">{city.croCode}</p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border/60">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Maturidade Digital</p>
                <p className="text-sm text-foreground leading-snug">{city.digitalMaturity}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Top Searches */}
        <section className="py-16">
          <div className="max-w-content mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-display text-display-sm text-foreground mb-3">
              O Que Pacientes em {city.name} Buscam no Google
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-xl mx-auto">
              Estas são as buscas reais que captamos para consultórios odontológicos em {city.name}:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {city.topSearches.map((search) => (
                <span
                  key={search}
                  className="px-4 py-2 bg-card rounded-full border border-border/60 text-sm text-foreground"
                >
                  &ldquo;{search}&rdquo;
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Top Specialties for this city */}
        <section className="py-20 md:py-28 bg-muted">
          <div className="max-w-content mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-3">
                Mais buscadas em {city.name}
              </p>
              <h2 className="font-display text-display-md text-foreground text-balance">
                Especialidades em Alta em {city.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto">
                Estas são as especialidades com maior volume de buscas na região de {city.name}. Aceitamos apenas 1 consultório por especialidade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {city.topSpecialties.map((specName, i) => (
                <div
                  key={specName}
                  className="group p-6 bg-card rounded-xl border border-border/60 hover:border-accent/30 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-medium text-accent/60 uppercase tracking-wider">
                      #{i + 1} mais buscada
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Verificar
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-medium text-foreground group-hover:text-accent transition-colors mb-3">
                    {specName} em {city.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                    {specName === "Implantodontia" && `Pacientes em ${city.name} pesquisam por semanas antes de decidir sobre implantes. Posicionamos seu consultório como referência em implantes na região de ${city.neighborhoods[0]} e arredores.`}
                    {specName === "Ortodontia" && `Alinhadores invisíveis e aparelhos estéticos lideram as buscas em ${city.name}. Diferenciamos seu consultório pela expertise, atraindo pacientes que valorizam resultado acima de preço.`}
                    {specName === "Estética Dental" && `Lentes de contato dental, clareamento e facetas são os procedimentos mais buscados em ${city.name}. Atraímos pacientes de ${city.neighborhoods.slice(0, 2).join(" e ")} que investem em qualidade.`}
                    {specName === "Endodontia" && `Buscas de urgência por tratamento de canal em ${city.name} exigem presença digital imediata. Quando alguém busca às 22h, seu consultório precisa aparecer.`}
                    {specName === "Periodontia" && `Conteúdo educativo sobre saúde gengival transforma buscas informacionais em ${city.name} em consultas agendadas. Posicionamos você como autoridade regional.`}
                    {specName === "Odontopediatria" && `Pais em ${city.name} são extremamente criteriosos ao escolher dentista para os filhos. Construímos autoridade com conteúdo que responde às preocupações dos responsáveis.`}
                  </p>
                  <Link
                    href="/contato"
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
                  >
                    Verificar disponibilidade em {city.name}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works — localized */}
        <section className="py-20 md:py-28">
          <div className="max-w-narrow mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-3">
                Como funciona em {city.name}
              </p>
              <h2 className="font-display text-display-md text-foreground text-balance">
                Da Análise à Agenda Cheia em 3 Passos
              </h2>
            </div>
            <div className="space-y-8">
              {[
                {
                  number: "01",
                  title: `Diagnóstico de ${city.name}`,
                  desc: `Analisamos o cenário odontológico de ${city.name}: concorrentes em ${city.neighborhoods.slice(0, 3).join(", ")} e região, volume de buscas por especialidade, e oportunidades que seus concorrentes não estão explorando.`,
                },
                {
                  number: "02",
                  title: "Implementação Sob Medida",
                  desc: `Ativamos a estratégia completa para ${city.name}: SEO local por bairro, Google Maps, campanhas de Google Ads segmentadas para ${city.stateAbbr} e conteúdo focado em ${city.topSpecialties[0].toLowerCase()}. Você não precisa fazer nada.`,
                },
                {
                  number: "03",
                  title: "Pacientes + Otimização Contínua",
                  desc: `Em semanas, os primeiros pacientes de ${city.name} começam a aparecer. Otimizamos com dados do ${city.croCode} e métricas da região para aumentar volume e qualidade dos agendamentos.`,
                },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-6 p-6 bg-card rounded-xl border border-border/60">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                    <span className="font-display text-sm font-semibold text-accent">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28 bg-muted">
          <div className="max-w-narrow mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-3">
                Dúvidas frequentes
              </p>
              <h2 className="font-display text-display-md text-foreground text-balance">
                Perguntas Sobre Marketing para Dentistas em {city.name}
              </h2>
            </div>
            <div className="space-y-4">
              {cityFaqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-card rounded-xl border border-border/60 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="font-display text-base font-medium text-foreground pr-4">{faq.question}</h3>
                    <svg
                      className="w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform group-open:rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Nearby city cross-link */}
        {nearbyCity && (
          <section className="py-12 border-t border-border">
            <div className="max-w-narrow mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between p-6 bg-card rounded-xl border border-border/60">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Também atendemos</p>
                  <p className="font-display text-lg font-medium text-foreground">
                    Dentistas em {nearbyCity.name}, {nearbyCity.stateAbbr}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {nearbyCity.estimatedDentists} dentistas · Competição {nearbyCity.competitionLevel}
                  </p>
                </div>
                <Link
                  href={`/cidades/${nearbyCity.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/10 hover:bg-accent/20 text-accent text-sm font-medium rounded-md transition-colors"
                >
                  Ver {nearbyCity.name}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 md:py-28 bg-muted text-center">
          <div className="max-w-narrow mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Vagas limitadas em {city.name}
            </div>
            <h2 className="font-display text-display-md text-foreground mb-4 text-balance">
              Pronto Para Encher Sua Agenda em {city.name}?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              O diagnóstico é gratuito, sem compromisso, e mostra exatamente onde estão os pacientes
              em {city.name} que você não está alcançando.
            </p>
            <Link
              href="/contato"
              className="inline-flex px-8 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25"
            >
              Agendar Diagnóstico Gratuito em {city.name}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
