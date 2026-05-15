// src/components/sections/CitiesMarquee.tsx
//
// Homepage section: horizontal marquee of all 15 cities LK Digital serves.
// Tier 1 (easiest to rank) cards are largest; Tier 3 (hardest) are most compact.
// Order in the array is left-to-right flow order before the marquee animates.

import Link from "next/link";

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

const TIER_STYLES: Record<CityTier, { card: string; name: string }> = {
  1: { card: "min-w-[280px] py-10 px-8", name: "text-3xl" },
  2: { card: "min-w-[220px] py-8 px-7", name: "text-2xl" },
  3: { card: "min-w-[180px] py-7 px-6", name: "text-xl" },
};

function CityCard({ city }: { city: CityEntry }) {
  const t = TIER_STYLES[city.tier];
  return (
    <Link
      href={`/cidades/${city.slug}`}
      className={`group flex-shrink-0 ${t.card} border border-[#2a241c] hover:border-[#c5a368] bg-[#161310] hover:bg-[#1c1814] rounded-sm transition-all duration-300 flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c5a368]/80">
          {city.state}
        </span>
        {city.tier === 1 && (
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#c5a368]"
            aria-hidden="true"
          />
        )}
      </div>
      <div
        className={`font-serif font-normal text-white group-hover:text-[#c5a368] transition-colors leading-tight ${t.name}`}
      >
        {city.name}
      </div>
      <div className="mt-4 text-[11px] font-light text-[#d8d2c4]/60 flex items-center gap-2 group-hover:text-[#c5a368] transition-colors">
        <span>ver cidade</span>
        <span
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </Link>
  );
}

export default function CitiesMarquee() {
  // Duplicate the array so the loop seam is invisible
  const doubled = [...CITIES, ...CITIES];

  return (
    <section
      className="bg-[#0f0f0f] py-24 md:py-32 overflow-hidden border-t border-[#2a241c]/40"
      aria-labelledby="cities-marquee-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-12 bg-[#c5a368]" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#c5a368] font-medium">
            Atendemos · 15 capitais
          </span>
        </div>
        <h2
          id="cities-marquee-heading"
          className="font-serif font-normal text-4xl md:text-6xl text-white leading-[1.05] tracking-tight max-w-3xl"
        >
          Onde estamos hoje.
        </h2>
        <p className="mt-6 text-[#d8d2c4]/75 max-w-2xl text-lg font-light leading-relaxed">
          Sistema dental-only operando em quinze capitais brasileiras — dos
          grandes centros aos polos regionais.
        </p>
      </div>

      <div className="relative cities-marquee">
        <div
          className="cities-marquee-track flex gap-4 items-stretch animate-marquee-scroll"
          style={{ width: "max-content" }}
        >
          {doubled.map((city, i) => (
            <CityCard key={`${city.slug}-${i}`} city={city} />
          ))}
        </div>

        {/* Edge fades */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-[#0f0f0f] to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-[#0f0f0f] to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-12 text-center">
        <Link
          href="/cidades"
          className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#c5a368] hover:text-[#d4b87a] transition-colors"
        >
          <span className="h-px w-8 bg-[#c5a368]" aria-hidden="true" />
          <span>Ver todas as cidades</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
