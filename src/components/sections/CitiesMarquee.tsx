// src/components/sections/CitiesMarquee.tsx
//
// Homepage section: index of all 15 cities LK Digital serves.
// `tier` is kept as SEO planning data (1 = easiest to rank); it is not displayed.

import Link from "next/link";
import { Container, SectionLabel } from "@/components/ui/primitives";

type CityTier = 1 | 2 | 3;

type CityEntry = {
  slug: string;
  name: string;
  state: string;
  tier: CityTier;
};

const CITIES: CityEntry[] = [
  // Tier 1 — easiest to rank, most prominent cards
  { slug: "vitoria", name: "Vitória", state: "ES", tier: 1 },
  { slug: "florianopolis", name: "Florianópolis", state: "SC", tier: 1 },
  { slug: "belem", name: "Belém", state: "PA", tier: 1 },
  { slug: "manaus", name: "Manaus", state: "AM", tier: 1 },
  { slug: "goiania", name: "Goiânia", state: "GO", tier: 1 },
  // Tier 2 — mid-competition metros
  { slug: "campinas", name: "Campinas", state: "SP", tier: 2 },
  { slug: "recife", name: "Recife", state: "PE", tier: 2 },
  { slug: "porto-alegre", name: "Porto Alegre", state: "RS", tier: 2 },
  { slug: "salvador", name: "Salvador", state: "BA", tier: 2 },
  { slug: "curitiba", name: "Curitiba", state: "PR", tier: 2 },
  // Tier 3 — largest markets, hardest to rank, compact cards
  { slug: "fortaleza", name: "Fortaleza", state: "CE", tier: 3 },
  { slug: "brasilia", name: "Brasília", state: "DF", tier: 3 },
  { slug: "belo-horizonte", name: "Belo Horizonte", state: "MG", tier: 3 },
  { slug: "rio-de-janeiro", name: "Rio de Janeiro", state: "RJ", tier: 3 },
  { slug: "sao-paulo", name: "São Paulo", state: "SP", tier: 3 },
];

function CityLink({ city }: { city: CityEntry }) {
  return (
    <Link
      href={`/cidades/${city.slug}`}
      className="group flex min-h-16 items-baseline justify-between gap-4 border-b border-white/15 py-5"
    >
      <span className="font-display text-2xl text-white transition-colors group-hover:text-accent md:text-3xl">
        {city.name}
      </span>
      <span className="flex items-baseline gap-3 text-[11px] uppercase tracking-[0.2em] text-white/60">
        <span className="text-accent">{city.state}</span>
        <span className="hidden transition-colors group-hover:text-accent sm:inline">ver cidade →</span>
      </span>
    </Link>
  );
}

/**
 * Static index of the cities served. Was a continuously scrolling marquee
 * (moving links, each rendered twice); now every city is one readable link.
 * Component name kept so the homepage import stays the same.
 */
export default function CitiesMarquee() {
  return (
    <section className="bg-hero-bg py-section" aria-labelledby="cities-marquee-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <SectionLabel tone="dark" as="span">Atendemos · 15 capitais</SectionLabel>
            <h2
              id="cities-marquee-heading"
              className="mt-6 font-display text-4xl font-normal leading-[1.05] tracking-tight text-white md:text-6xl"
            >
              Onde estamos hoje.
            </h2>
            <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-white/70">
              Sistema dental-only operando em quinze capitais brasileiras — dos
              grandes centros aos polos regionais.
            </p>
            <Link
              href="/cidades"
              className="mt-10 inline-flex min-h-11 items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-accent transition-colors hover:text-accent-light"
            >
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              <span>Ver todas as cidades</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <ul className="border-t border-white/15 sm:grid sm:grid-cols-2 sm:gap-x-10 lg:col-span-8">
            {CITIES.map((city) => (
              <li key={city.slug}>
                <CityLink city={city} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
