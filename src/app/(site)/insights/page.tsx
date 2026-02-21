import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Insights | LK Digital — Marketing Estratégico para Saúde",
  description:
    "Artigos especializados em GEO, SEO local, gestão de mídia paga e marketing digital para clínicas médicas e profissionais de saúde no Brasil. Conteúdo técnico sobre o sistema integrado de aquisição de pacientes.",
  keywords: [
    "marketing digital para clínicas",
    "SEO para médicos",
    "GEO para saúde",
    "Google Ads para clínicas",
    "captação de pacientes",
    "marketing médico",
  ],
  alternates: {
    canonical: "https://lkdigital.com.br/insights",
  },
  openGraph: {
    title: "Insights | LK Digital — Marketing Estratégico para Saúde",
    description:
      "Artigos especializados em GEO, SEO local, mídia paga e marketing de saúde integrado para clínicas e profissionais.",
    url: "https://lkdigital.com.br/insights",
    siteName: "LK Digital",
    locale: "pt_BR",
    type: "website",
  },
};

const categoryColors: Record<string, string> = {
  "GEO & SEO": "bg-amber-50 text-amber-800 ring-amber-600/20",
  "Marketing de Saúde": "bg-stone-100 text-stone-700 ring-stone-600/20",
  "SEO Local": "bg-[#F9F6F0] text-[#8B6914] ring-[#C5A368]/30",
  "Gestão de Mídia Paga": "bg-[#1A1A1A] text-[#C5A368] ring-[#C5A368]/30",
};

function getCategoryClasses(category: string): string {
  return (
    categoryColors[category] ?? "bg-stone-100 text-stone-700 ring-stone-600/20"
  );
}

export default async function InsightsPage() {
  const sortedPosts = await getAllPosts();

  return (
    <main className="bg-[#FAFAFA]">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1A1A1A] to-[#2C2C2C] py-20 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 40%, #C5A368 0%, transparent 60%), radial-gradient(circle at 20% 80%, #A8894F 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#C5A368]">
              Conhecimento Especializado
            </p>
            <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Insights LK Digital
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/75">
              Estratégias avançadas de marketing digital para clínicas e
              profissionais de saúde: GEO, SEO local, gestão de mídia paga e
              crescimento orgânico. Cada artigo é parte de um sistema integrado
              de aquisição de pacientes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                "GEO & SEO",
                "Marketing de Saúde",
                "SEO Local",
                "Gestão de Mídia Paga",
              ].map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-[#C5A368] ring-1 ring-[#C5A368]/30 backdrop-blur-sm"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Post Grid ── */}
      <section
        aria-labelledby="posts-heading"
        className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8"
      >
        <h2 id="posts-heading" className="sr-only">
          Artigos publicados
        </h2>

        {/* Stats bar */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E5E5] pb-8">
          <p className="text-sm text-[#6B6B6B]">
            <span className="font-semibold text-[#1A1A1A]">
              {sortedPosts.length}
            </span>{" "}
            artigos publicados
          </p>
          <p className="text-sm text-[#6B6B6B]">
            Última atualização:{" "}
            <span className="font-medium text-[#1A1A1A]">
              {formatDate(sortedPosts[0]?.date ?? "")}
            </span>
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post: BlogPost) => (
            <article
              key={post.slug}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Card accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-[#C5A368] to-[#D4B87A]" />

              <div className="flex flex-1 flex-col p-6">
                {/* Category badge */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getCategoryClasses(post.category)}`}
                  >
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="mb-3 text-lg font-bold leading-snug text-[#1A1A1A] transition-colors group-hover:text-[#C5A368]">
                  <Link
                    href={`/insights/${post.slug}`}
                    className="after:absolute after:inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A368]"
                  >
                    {post.title}
                  </Link>
                </h2>

                {/* Description */}
                <p className="mb-6 flex-1 text-sm leading-relaxed text-[#6B6B6B]">
                  {post.description}
                </p>

                {/* Meta footer */}
                <div className="flex items-center justify-between border-t border-[#E5E5E5] pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 text-[#C5A368]"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#6B6B6B]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 text-[#C5A368]"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {post.readTime} de leitura
                  </div>
                </div>
              </div>

              {/* Read more link */}
              <div className="border-t border-[#E5E5E5] px-6 py-4">
                <Link
                  href={`/insights/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C5A368] transition-colors hover:text-[#A8894F]"
                  aria-label={`Ler artigo completo: ${post.title}`}
                >
                  Ler artigo completo
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* ── System CTA ── */}
        <div className="mt-20 rounded-3xl bg-[#1A1A1A] px-8 py-14 text-center shadow-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C5A368]">
            O Sistema LK Digital
          </p>
          <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-bold text-white sm:text-3xl">
            Orgânico e Pago. Um Sistema. Um Resultado.
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/75">
            GEO, SEO, Google Ads e Meta Ads não são serviços isolados — são
            camadas de um ecossistema estruturado que a LK Digital implementa na
            sua clínica para atrair pacientes qualificados com previsibilidade e
            consistência.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contato"
              className="rounded-full bg-[#C5A368] px-8 py-3.5 text-sm font-semibold text-[#1A1A1A] shadow-lg transition-colors hover:bg-[#D4B87A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A368]"
            >
              Solicitar Diagnóstico Gratuito
            </Link>
            <Link
              href="/solucoes"
              className="text-sm font-semibold leading-6 text-white/60 transition-colors hover:text-white"
            >
              Conhecer o Sistema LK <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
