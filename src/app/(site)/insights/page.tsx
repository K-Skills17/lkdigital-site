import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Insights | LK Digital — Marketing Estratégico para Saúde",
  description:
    "Artigos especializados em GEO, SEO local e marketing digital para clínicas médicas, odontológicas e profissionais de saúde no Brasil. Conteúdo técnico e atualizado para 2026.",
  keywords: [
    "marketing digital para clínicas",
    "SEO para médicos",
    "GEO para saúde",
    "captação de pacientes",
    "marketing médico",
  ],
  alternates: {
    canonical: "https://lkdigital.com.br/insights",
  },
  openGraph: {
    title: "Insights | LK Digital — Marketing Estratégico para Saúde",
    description:
      "Artigos especializados em GEO, SEO local e marketing digital para clínicas médicas e profissionais de saúde.",
    url: "https://lkdigital.com.br/insights",
    siteName: "LK Digital",
    locale: "pt_BR",
    type: "website",
  },
};

const categoryColors: Record<string, string> = {
  "GEO & SEO": "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  "Marketing de Saúde": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "SEO Local": "bg-sky-50 text-sky-700 ring-sky-600/20",
};

function getCategoryClasses(category: string): string {
  return (
    categoryColors[category] ?? "bg-slate-50 text-slate-700 ring-slate-600/20"
  );
}

export default async function InsightsPage() {
  const sortedPosts = await getAllPosts(); // already sorted newest-first

  return (
    <main className="bg-white">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 py-20 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 40%, #4f46e5 0%, transparent 60%), radial-gradient(circle at 20% 80%, #0ea5e9 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Conhecimento Especializado
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Insights LK Digital
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Estratégias avançadas de marketing digital, GEO e SEO local
              desenvolvidas especificamente para clínicas e profissionais de
              saúde no Brasil. Conteúdo técnico, ético e orientado a resultados.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["GEO & SEO", "Marketing de Saúde", "SEO Local"].map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur-sm"
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
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-8">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">
              {sortedPosts.length}
            </span>{" "}
            artigos publicados
          </p>
          <p className="text-sm text-slate-500">
            Última atualização:{" "}
            <span className="font-medium text-slate-700">
              {formatDate(sortedPosts[0]?.date ?? "")}
            </span>
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post: BlogPost) => (
            <article
              key={post.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Card accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-sky-400" />

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
                <h2 className="mb-3 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-700">
                  <Link
                    href={`/insights/${post.slug}`}
                    className="after:absolute after:inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    {post.title}
                  </Link>
                </h2>

                {/* Description */}
                <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-600">
                  {post.description}
                </p>

                {/* Meta footer */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 text-slate-400"
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

                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 text-slate-400"
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
              <div className="border-t border-slate-100 px-6 py-4">
                <Link
                  href={`/insights/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
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

        {/* ── Newsletter CTA ── */}
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 px-8 py-14 text-center shadow-xl">
          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            Receba novos artigos em primeira mão
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-300">
            Análises sobre GEO, SEO e marketing de saúde diretamente na sua
            caixa de entrada. Conteúdo técnico, sem spam.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contato"
              className="rounded-full bg-indigo-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Falar com um especialista
            </Link>
            <Link
              href="/solucoes"
              className="text-sm font-semibold leading-6 text-slate-300 transition-colors hover:text-white"
            >
              Ver nossas soluções <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
