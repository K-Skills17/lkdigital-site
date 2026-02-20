import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost, getAllSlugs, formatDate } from "@/lib/blog";
import { ArticleSchema } from "@/components/shared/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Artigo não encontrado | LK Digital",
    };
  }

  return {
    title: `${post.title} | LK Digital Insights`,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: "LK Digital", url: "https://lkdigital.com.br" }],
    alternates: {
      canonical: `https://lkdigital.com.br/insights/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://lkdigital.com.br/insights/${post.slug}`,
      siteName: "LK Digital",
      locale: "pt_BR",
      type: "article",
      publishedTime: post.date,
      authors: ["LK Digital"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

// Converts the markdown-style content string into structured HTML segments
function parseContent(content: string): React.ReactNode[] {
  const sections = content.split(/\n\n+/);

  return sections.map((block, index) => {
    const trimmed = block.trim();

    // H2 heading
    if (trimmed.startsWith("## ")) {
      const text = trimmed.replace(/^## /, "");
      return (
        <h2
          key={index}
          className="mb-4 mt-12 text-2xl font-bold tracking-tight text-slate-900 first:mt-0"
        >
          {text}
        </h2>
      );
    }

    // H3 heading
    if (trimmed.startsWith("### ")) {
      const text = trimmed.replace(/^### /, "");
      return (
        <h3 key={index} className="mb-3 mt-8 text-xl font-semibold text-slate-800">
          {text}
        </h3>
      );
    }

    // Horizontal rule
    if (trimmed === "---") {
      return <hr key={index} className="my-10 border-slate-200" />;
    }

    // Bold heading paragraph (e.g. "**Pilar 1 — ...**")
    if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.slice(2, -2).includes("\n")) {
      const text = trimmed.slice(2, -2);
      return (
        <p key={index} className="mb-2 mt-6 font-bold text-slate-900">
          {text}
        </p>
      );
    }

    // Unordered list
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").filter((line) => line.startsWith("- "));
      return (
        <ul
          key={index}
          className="mb-6 ml-6 list-disc space-y-2 text-slate-700 marker:text-indigo-400"
        >
          {items.map((item, i) => {
            const raw = item.replace(/^- /, "");
            return (
              <li key={i} className="leading-relaxed">
                {renderInline(raw)}
              </li>
            );
          })}
        </ul>
      );
    }

    // Regular paragraph — render inline bold/code
    return (
      <p key={index} className="mb-6 leading-8 text-slate-700">
        {renderInline(trimmed)}
      </p>
    );
  });
}

// Renders inline bold (**text**) and code (`text`) within a string
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-indigo-700"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.description}
        datePublished={post.date}
        slug={post.slug}
      />

      <main>
        {/* ── Article Header ── */}
        <header className="bg-gradient-to-b from-slate-900 to-slate-800 pb-16 pt-12">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav aria-label="Navegação estrutural" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-white"
                  >
                    Início
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-600">
                  /
                </li>
                <li>
                  <Link
                    href="/insights"
                    className="transition-colors hover:text-white"
                  >
                    Insights
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-600">
                  /
                </li>
                <li
                  className="max-w-xs truncate text-slate-300"
                  aria-current="page"
                >
                  {post.title}
                </li>
              </ol>
            </nav>

            {/* Category badge */}
            <div className="mb-5">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getCategoryClasses(post.category)}`}
              >
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {/* Description */}
            <p className="mt-5 text-lg leading-relaxed text-slate-300">
              {post.description}
            </p>

            {/* Meta row */}
            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-slate-700 pt-6">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
                  LK
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">LK Digital</p>
                  <p className="text-xs text-slate-400">Equipe Editorial</p>
                </div>
              </div>

              <div className="h-4 w-px bg-slate-600" aria-hidden="true" />

              {/* Date */}
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
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

              <div className="h-4 w-px bg-slate-600" aria-hidden="true" />

              {/* Read time */}
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
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
        </header>

        {/* ── Article Body ── */}
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-16">
            {/* Main content */}
            <article
              className="prose-headings:scroll-mt-20 min-w-0"
              aria-label={`Artigo: ${post.title}`}
            >
              {parseContent(post.content)}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-12 border-t border-slate-200 pt-8">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Tópicos abordados
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                {/* About LK Digital card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                    LK
                  </div>
                  <h3 className="mb-2 text-sm font-bold text-slate-900">
                    LK Digital
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Agência especializada em marketing digital, GEO e SEO para
                    clínicas e profissionais de saúde no Brasil.
                  </p>
                  <Link
                    href="/sobre"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Conhecer a equipe
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-3 w-3"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.25a.75.75 0 010 1.06l-4.5 4.25a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>

                {/* Related posts */}
                {relatedPosts.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                      Leitura relacionada
                    </h3>
                    <div className="space-y-4">
                      {relatedPosts.map((related) => (
                        <div
                          key={related.slug}
                          className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                        >
                          <span
                            className={`mb-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${getCategoryClasses(related.category)}`}
                          >
                            {related.category}
                          </span>
                          <Link
                            href={`/insights/${related.slug}`}
                            className="mt-1.5 block text-sm font-semibold leading-snug text-slate-800 transition-colors hover:text-indigo-700"
                          >
                            {related.title}
                          </Link>
                          <p className="mt-1 text-xs text-slate-500">
                            {related.readTime} de leitura
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <section
          aria-labelledby="cta-heading"
          className="border-t border-slate-100 bg-gradient-to-br from-slate-900 to-indigo-950"
        >
          <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Próximo Passo
            </p>
            <h2
              id="cta-heading"
              className="text-2xl font-bold text-white sm:text-3xl"
            >
              Pronto para aplicar estas estratégias na sua clínica?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
              A LK Digital desenvolve estratégias personalizadas de GEO, SEO
              local e marketing de saúde para clínicas e consultórios que desejam
              crescer com previsibilidade e dentro das normas do CFM.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contato"
                className="rounded-full bg-indigo-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Solicitar análise gratuita
              </Link>
              <Link
                href="/insights"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                    clipRule="evenodd"
                  />
                </svg>
                Ver todos os artigos
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
