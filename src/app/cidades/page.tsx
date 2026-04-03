import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { cities } from "@/data/cities";

export const metadata: Metadata = {
  title: "Marketing Digital para Dentistas por Cidade — LK Digital",
  description:
    "Captação de pacientes qualificados para dentistas nas principais cidades do Brasil. São Paulo, Rio de Janeiro, Curitiba, Salvador, Belo Horizonte e mais. Exclusividade territorial.",
};

const competitionBadge = {
  alta: "bg-red-500/10 text-red-400",
  média: "bg-yellow-500/10 text-yellow-400",
  baixa: "bg-green-500/10 text-green-400",
};

export default function Cidades() {
  const regions = Array.from(new Set(cities.map((c) => c.region)));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Início", href: "/" },
          { name: "Cidades", href: "/cidades" },
        ]}
      />
      <Navbar />
      <main>
        <PageHero
          variant="editorial"
          eyebrow="Cidades"
          title="Marketing para Dentistas na"
          titleAccent="Sua Cidade."
          subtitle="Atuamos nas principais metrópoles do Brasil com exclusividade territorial. Encontre sua cidade e verifique se a sua especialidade ainda está disponível na sua região."
          pageNumber="15"
        />

        {regions.map((region) => (
          <section key={region} className="py-16 first:pt-20 last:pb-28">
            <div className="max-w-content mx-auto px-4 sm:px-6">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-6 h-px bg-accent" />
                <h2 className="text-xs font-medium text-accent uppercase tracking-[0.25em]">
                  {region}
                </h2>
                <span className="w-6 h-px bg-accent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cities
                  .filter((c) => c.region === region)
                  .map((city) => (
                    <Link
                      key={city.slug}
                      href={`/cidades/${city.slug}`}
                      className="group p-6 bg-card rounded-xl border border-border/60 hover:border-accent/30 transition-all duration-300 flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-display text-xl font-medium text-foreground group-hover:text-accent transition-colors">
                          {city.name}
                        </h3>
                        <span className="text-sm text-muted-foreground">{city.stateAbbr}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-medium rounded ${competitionBadge[city.competitionLevel]}`}
                        >
                          Competição {city.competitionLevel}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {city.population} hab.
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3 mb-4">
                        {city.highlights[0]}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-[10px]">{city.estimatedDentists} dentistas</span>
                        <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:gap-2 transition-all">
                          Ver detalhes
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="py-20 md:py-28 bg-muted text-center">
          <div className="max-w-narrow mx-auto px-4 sm:px-6">
            <h2 className="font-display text-display-md text-foreground mb-4 text-balance">
              Sua Cidade Não Está na Lista?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Atendemos consultórios em todo o Brasil. Entre em contato e verificamos
              a disponibilidade na sua região.
            </p>
            <Link
              href="/contato"
              className="inline-flex px-8 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25"
            >
              Consultar Minha Cidade
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
