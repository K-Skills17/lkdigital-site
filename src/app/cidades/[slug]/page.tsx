import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BreadcrumbSchema, FAQSchema, CityServiceSchema } from "@/components/StructuredData";
import { cities, getCityBySlug } from "@/data/cities";
import { TrackedCTAButton, TrackedNearbyCityLink } from "@/components/TrackedCityButton";
import { Container, SectionLabel, SpecGrid, arrow, buttonClass } from "@/components/ui/primitives";

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
    description: `Marketing digital para dentistas em ${city.name}. Sites, Google Ads, Meta Ads, TikTok Ads e SEO para lotar sua agenda. Resultados em 90 dias.`,
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
        description={`Marketing digital especializado para dentistas em ${city.name}, ${city.stateAbbr}. Captação de pacientes qualificados com SEO local, Google Ads, Meta Ads, TikTok Ads e presença em IA.`}
      />
      <FAQSchema faqs={cityFaqs} />

      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-hero-bg pb-16 pt-28 md:pb-24 md:pt-40">
          <Container>
            <nav aria-label="Trilha" className="mb-10 flex items-center gap-2 text-xs text-white/60">
              <Link href="/" className="hover:text-accent">Início</Link>
              <span aria-hidden="true">/</span>
              <Link href="/cidades" className="hover:text-accent">Cidades</Link>
              <span aria-hidden="true">/</span>
              <span className="text-white/80">{city.name}</span>
            </nav>

            <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-[0.25em] text-accent">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              <span>Competição {city.competitionLevel}</span>
              <span aria-hidden="true" className="text-white/40">·</span>
              <span className="text-white/70">{city.region}</span>
            </p>

            <h1 className="mt-8 max-w-5xl font-display text-[clamp(2.25rem,1.3rem+4.2vw,5rem)] leading-[1.04] text-white text-balance">
              Marketing Digital para Dentistas em{" "}
              <span className="italic text-accent">{city.name}, {city.stateAbbr}</span>
            </h1>

            <div className="mt-12 grid gap-10 border-t border-white/15 pt-10 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-6">
                <p className="text-lg leading-relaxed text-white/70">
                  Captação de pacientes qualificados para consultórios odontológicos em {city.name}.
                  Exclusividade territorial — apenas 1 consultório por especialidade na sua região.
                </p>
                <TrackedCTAButton
                  href="/contato"
                  label={`Verificar Disponibilidade em ${city.name}`}
                  cityName={city.name}
                  className={buttonClass("primary", "dark", "mt-8 w-full sm:w-auto")}
                />
              </div>
              <dl className="grid grid-cols-3 lg:col-span-5 lg:col-start-8 lg:grid-cols-1 lg:gap-5">
                {[
                  { value: city.population, label: "Habitantes (região metropolitana)" },
                  { value: city.estimatedDentists, label: `Dentistas (${city.croCode})` },
                  { value: "1", label: "Vaga por especialidade" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`flex flex-col gap-1 lg:flex-row lg:items-baseline lg:gap-5 ${i > 0 ? "border-l border-white/15 pl-4 lg:border-l-0 lg:pl-0" : ""}`}
                  >
                    <dd className="font-display text-2xl text-white lining-nums md:text-3xl lg:w-32">{stat.value}</dd>
                    <dt className="text-xs text-white/60">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </section>

        {/* Market Insight */}
        <section className="py-section">
          <Container>
            <SpecGrid label={<SectionLabel>Mercado Odontológico</SectionLabel>}>
              <h2 className="font-display text-display-lg text-foreground">O Cenário em {city.name}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{city.marketInsight}</p>
              <ul className="mt-10 max-w-3xl border-t border-foreground/80">
                {city.highlights.map((highlight, i) => (
                  <li key={i} className="flex gap-5 border-b border-foreground/15 py-4 text-base text-foreground">
                    <span aria-hidden="true" className="mt-[0.7rem] h-px w-4 shrink-0 bg-accent-ink" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </SpecGrid>
          </Container>
        </section>

        {/* Local Context — UNIQUE per city */}
        <section className="border-t border-border bg-muted py-section">
          <Container>
            <SpecGrid label={<SectionLabel>Regiões</SectionLabel>}>
              <h2 className="font-display text-display-lg text-foreground">Bairros e Regiões de {city.name}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{city.localContext}</p>

              <p className="mt-10 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Regiões que atendemos em {city.name}:
              </p>
              <p className="mt-4 max-w-3xl font-display text-2xl leading-snug text-foreground">
                {city.neighborhoods.map((n, i) => (
                  <span key={n}>
                    {n}
                    {i < city.neighborhoods.length - 1 && <span aria-hidden="true" className="mx-3 text-accent-ink">/</span>}
                  </span>
                ))}
              </p>

              <dl className="mt-12 grid border-t border-foreground/80 sm:grid-cols-3">
                {[
                  { label: "Ticket Médio", value: city.avgTicket, display: true },
                  { label: "Conselho Regional", value: city.croCode, display: true },
                  { label: "Maturidade Digital", value: city.digitalMaturity, display: false },
                ].map((item, i) => (
                  <div key={item.label} className={`border-b border-foreground/15 py-5 sm:border-b-0 ${i > 0 ? "sm:border-l sm:pl-6" : ""} ${i < 2 ? "sm:pr-6" : ""}`}>
                    <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.label}</dt>
                    <dd className={item.display ? "mt-2 font-display text-2xl text-foreground lining-nums" : "mt-2 text-sm leading-snug text-foreground"}>
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </SpecGrid>
          </Container>
        </section>

        {/* Top Searches */}
        <section className="py-section">
          <Container>
            <SpecGrid label={<SectionLabel>Buscas</SectionLabel>}>
              <h2 className="font-display text-display-lg text-foreground">O Que Pacientes em {city.name} Buscam no Google</h2>
              <p className="mt-4 max-w-xl text-base text-muted-foreground">
                Estas são as buscas reais que captamos para consultórios odontológicos em {city.name}:
              </p>
              <ul className="mt-10 grid border-t border-foreground/80 sm:grid-cols-2 sm:gap-x-10">
                {city.topSearches.map((search) => (
                  <li key={search} className="border-b border-foreground/15 py-4 font-display text-xl italic text-foreground">
                    &ldquo;{search}&rdquo;
                  </li>
                ))}
              </ul>
            </SpecGrid>
          </Container>
        </section>

        {/* Top Specialties for this city */}
        <section className="border-t border-border bg-muted py-section">
          <Container>
            <div className="max-w-3xl">
              <SectionLabel>Mais buscadas em {city.name}</SectionLabel>
              <h2 className="mt-6 font-display text-display-lg text-foreground text-balance">Especialidades em Alta em {city.name}</h2>
              <p className="mt-4 text-base text-muted-foreground">
                Estas são as especialidades com maior volume de buscas na região de {city.name}. Aceitamos apenas 1 consultório por especialidade.
              </p>
            </div>

            <ol className="mt-14 border-t border-foreground/80">
              {city.topSpecialties.map((specName, i) => (
                <li key={specName} className="grid gap-4 border-b border-foreground/15 py-8 lg:grid-cols-12 lg:gap-8">
                  <p className="text-xs font-medium uppercase tracking-wider text-accent-ink lg:col-span-3 lg:pt-2">
                    #{i + 1} mais buscada
                  </p>
                  <h3 className="font-display text-3xl font-medium text-foreground lg:col-span-4">
                    {specName} em {city.name}
                  </h3>
                  <div className="lg:col-span-5">
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {specName === "Implantodontia" && `Pacientes em ${city.name} pesquisam por semanas antes de decidir sobre implantes. Posicionamos seu consultório como referência em implantes na região de ${city.neighborhoods[0]} e arredores.`}
                      {specName === "Ortodontia" && `Alinhadores invisíveis e aparelhos estéticos lideram as buscas em ${city.name}. Diferenciamos seu consultório pela expertise, atraindo pacientes que valorizam resultado acima de preço.`}
                      {specName === "Estética Dental" && `Lentes de contato dental, clareamento e facetas são os procedimentos mais buscados em ${city.name}. Atraímos pacientes de ${city.neighborhoods.slice(0, 2).join(" e ")} que investem em qualidade.`}
                      {specName === "Endodontia" && `Buscas de urgência por tratamento de canal em ${city.name} exigem presença digital imediata. Quando alguém busca às 22h, seu consultório precisa aparecer.`}
                      {specName === "Periodontia" && `Conteúdo educativo sobre saúde gengival transforma buscas informacionais em ${city.name} em consultas agendadas. Posicionamos você como autoridade regional.`}
                      {specName === "Odontopediatria" && `Pais em ${city.name} são extremamente criteriosos ao escolher dentista para os filhos. Construímos autoridade com conteúdo que responde às preocupações dos responsáveis.`}
                    </p>
                    <TrackedCTAButton
                      href="/contato"
                      label={`Verificar disponibilidade em ${city.name}`}
                      cityName={city.name}
                      className="mt-4 inline-flex min-h-11 items-center gap-1 border-b border-foreground/30 text-sm font-medium text-foreground hover:border-foreground"
                    />
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* How It Works — localized */}
        <section className="py-section">
          <Container>
            <div className="max-w-3xl">
              <SectionLabel>Como funciona em {city.name}</SectionLabel>
              <h2 className="mt-6 font-display text-display-lg text-foreground text-balance">Da Análise à Agenda Cheia em 3 Passos</h2>
            </div>
            <ol className="mt-14 grid md:grid-cols-3 md:gap-10">
              {[
                {
                  number: "01",
                  title: `Diagnóstico de ${city.name}`,
                  desc: `Analisamos o cenário odontológico de ${city.name}: concorrentes em ${city.neighborhoods.slice(0, 3).join(", ")} e região, volume de buscas por especialidade, e oportunidades que seus concorrentes não estão explorando.`,
                },
                {
                  number: "02",
                  title: "Implementação Sob Medida",
                  desc: `Ativamos a estratégia completa para ${city.name}: SEO local por bairro, Google Maps, campanhas de Google Ads, Meta Ads e TikTok Ads segmentadas para ${city.stateAbbr} e conteúdo focado em ${city.topSpecialties[0].toLowerCase()}. Você não precisa fazer nada.`,
                },
                {
                  number: "03",
                  title: "Pacientes + Otimização Contínua",
                  desc: `Em semanas, os primeiros pacientes de ${city.name} começam a aparecer. Otimizamos com dados do ${city.croCode} e métricas da região para aumentar volume e qualidade dos agendamentos.`,
                },
              ].map((step) => (
                <li key={step.number} className="border-t-2 border-accent pb-10 pt-6 md:pb-0">
                  <span aria-hidden="true" className="font-display text-5xl font-light leading-none text-foreground lining-nums">{step.number}</span>
                  <h3 className="mt-6 font-display text-2xl font-medium text-foreground">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{step.desc}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-border bg-muted py-section">
          <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <SectionLabel>Dúvidas frequentes</SectionLabel>
              <h2 className="mt-6 font-display text-display-md text-foreground text-balance">
                Perguntas Sobre Marketing para Dentistas em {city.name}
              </h2>
            </div>
            <div className="border-t border-foreground/80 lg:col-span-8">
              {cityFaqs.map((faq, i) => (
                <details key={i} className="group border-b border-foreground/15">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6">
                    <h3 className="font-display text-xl font-medium text-foreground md:text-2xl">{faq.question}</h3>
                    <svg
                      aria-hidden="true"
                      className="mt-1.5 h-5 w-5 flex-shrink-0 text-accent-ink transition-transform group-open:rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </summary>
                  <p className="max-w-2xl pb-6 text-base leading-relaxed text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        {/* Nearby city cross-link */}
        {nearbyCity && (
          <section className="border-t border-border py-12">
            <Container className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Também atendemos</p>
                <p className="mt-2 font-display text-3xl text-foreground">
                  Dentistas em {nearbyCity.name}, {nearbyCity.stateAbbr}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {nearbyCity.estimatedDentists} dentistas · Competição {nearbyCity.competitionLevel}
                </p>
              </div>
              <TrackedNearbyCityLink
                href={`/cidades/${nearbyCity.slug}`}
                label={`Ver ${nearbyCity.name}`}
                fromCity={city.name}
                toCity={nearbyCity.name}
                className={buttonClass("secondary", "light")}
              >
                Ver {nearbyCity.name}
                {arrow}
              </TrackedNearbyCityLink>
            </Container>
          </section>
        )}

        {/* CTA */}
        <section className="bg-hero-bg py-section">
          <Container className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <SectionLabel tone="dark">Vagas limitadas em {city.name}</SectionLabel>
              <h2 className="mt-6 font-display text-display-lg text-white text-balance">
                Pronto Para Encher Sua Agenda em {city.name}?
              </h2>
              <p className="mt-6 max-w-xl text-lg text-white/70">
                O diagnóstico é gratuito, sem compromisso, e mostra exatamente onde estão os pacientes
                em {city.name} que você não está alcançando.
              </p>
            </div>
            <div className="lg:col-span-5 lg:justify-self-end">
              <TrackedCTAButton
                href="/contato"
                label={`Agendar Diagnóstico Gratuito em ${city.name}`}
                cityName={city.name}
                className={buttonClass("primary", "dark", "w-full sm:w-auto")}
              />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
