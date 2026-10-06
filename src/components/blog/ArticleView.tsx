// components/blog/ArticleView.tsx
// The article body used by the public post page and the admin preview, so
// editors see exactly what visitors will see.

import Link from "next/link";
import { authorHref, DEFAULT_CTA } from "@/lib/blog/catalog";
import type { PublicPost } from "@/lib/blog/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** First and last initials, e.g. "Stephen Domingos Komando" → "SK". */
function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export default function ArticleView({
  post,
  relatedPosts = [],
}: {
  post: PublicPost;
  relatedPosts?: PublicPost[];
}) {
  return (
    <main className="pt-20 md:pt-24">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-narrow mx-auto px-4 sm:px-6 py-12 md:py-20">
          <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
            <ol className="flex items-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground truncate max-w-[200px]">
                {post.title}
              </li>
            </ol>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <span className="px-2.5 py-1 text-[10px] font-medium text-accent bg-accent/10 rounded uppercase tracking-wider">
                {post.category}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {post.readingTime} min de leitura
            </span>
          </div>

          <h1
            className="font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.1] tracking-tight text-foreground max-w-4xl"
            data-speakable
          >
            {post.title}
          </h1>

          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
              <span className="text-sm font-medium text-accent">{initials(post.author.name)}</span>
            </div>
            <div>
              <Link href={authorHref(post.author.slug)} className="text-sm font-medium text-foreground hover:text-accent transition-colors">
                {post.author.name}
              </Link>
              <p className="text-xs text-muted-foreground">
                {post.author.title} &middot; {formatDate(post.publishedAt ?? post.updatedAt)}
                {post.publishedAt && post.updatedAt.slice(0, 10) !== post.publishedAt.slice(0, 10) && (
                  <>
                    {" "}&middot; Atualizado em {formatDate(post.updatedAt)}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-narrow mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12 lg:gap-16">
          <article className="max-w-prose">
            {/* AEO: TLDR / Quick Answer box */}
            {post.tldr && (
              <div
                className="answer-box mb-10 p-5 rounded-lg bg-accent/5 border border-accent/20"
                data-speakable
              >
                <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">
                  Resumo
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {post.tldr}
                </p>
              </div>
            )}

            {/* Excerpt */}
            <p
              className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-accent/40 pl-5"
              data-speakable
            >
              {post.excerpt}
            </p>

            {/* HTML Content */}
            <div
              className="prose-content [&_h2]:font-display [&_h2]:text-display-sm [&_h2]:text-foreground [&_h2]:mb-4 [&_h2]:mt-10 [&_h3]:font-display [&_h3]:text-lg [&_h3]:text-foreground [&_h3]:mb-3 [&_h3]:mt-6 [&_p]:text-[15px] [&_p]:text-muted-foreground [&_p]:leading-[1.8] [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:text-[15px] [&_ul_li]:text-muted-foreground [&_ul_li]:mb-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol_li]:text-[15px] [&_ol_li]:text-muted-foreground [&_ol_li]:mb-1.5 [&_table]:w-full [&_table]:mb-6 [&_table]:text-sm [&_th]:text-left [&_th]:p-3 [&_th]:bg-muted [&_th]:text-foreground [&_th]:font-medium [&_td]:p-3 [&_td]:border-t [&_td]:border-border/60 [&_td]:text-muted-foreground [&_blockquote]:border-l-2 [&_blockquote]:border-accent/40 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_strong]:text-foreground [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* FAQ */}
            {post.faqItems.length > 0 && (
              <section className="mt-16 pt-10 border-t border-border">
                <h2 className="font-display text-display-sm text-foreground mb-8">
                  Perguntas Frequentes
                </h2>
                <div className="space-y-6">
                  {post.faqItems.map((faq, i) => (
                    <details
                      key={i}
                      className="group bg-card rounded-lg border border-border/60 overflow-hidden"
                    >
                      <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-sm font-medium text-foreground hover:text-accent transition-colors list-none [&::-webkit-details-marker]:hidden">
                        {faq.question}
                        <svg
                          className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0 ml-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </summary>
                      <div className="px-5 pb-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <section className="mt-16 p-8 rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
              <h2 className="font-display text-display-sm text-foreground mb-3">
                {post.ctaHeading || DEFAULT_CTA.heading}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-lg">
                {post.ctaDescription || DEFAULT_CTA.description}
              </p>
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg hover:shadow-accent/20"
              >
                {post.ctaButton || DEFAULT_CTA.button}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </section>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="p-4 rounded-lg bg-card border border-border/60">
                <p className="text-xs font-medium text-foreground mb-2">
                  {post.ctaHeading &&
                  post.ctaHeading.length <= 50
                    ? post.ctaHeading
                    : "Diagnóstico Gratuito"}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                  {post.ctaDescription
                    ? post.ctaDescription.substring(0, 120) +
                      (post.ctaDescription.length > 120 ? "..." : "")
                    : "Descubra o que está impedindo seu consultório de aparecer no Google."}
                </p>
                <Link
                  href="/contato"
                  className="block w-full text-center px-3 py-2 bg-accent hover:bg-accent-dark text-white text-xs font-medium rounded transition-colors"
                >
                  {post.ctaButton || "Quero o Diagnóstico"}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Posts — internal linking for SEO */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border">
          <div className="max-w-narrow mx-auto px-4 sm:px-6 py-12 md:py-16">
            <h2 className="font-display text-display-sm text-foreground mb-8">
              Artigos Relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => {
                const relReadTime = `${related.readingTime} min`;
                return (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group block p-5 rounded-xl border border-border/60 bg-card hover:border-accent/40 transition-colors"
                  >
                    <span className="inline-block px-2 py-0.5 text-[10px] font-medium text-accent bg-accent/10 rounded uppercase tracking-wider mb-3">
                      {related.category}
                    </span>
                    <h3 className="font-display text-base text-foreground group-hover:text-accent transition-colors leading-snug mb-2 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                      {related.excerpt}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {relReadTime} de leitura
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
