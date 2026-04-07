import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  BreadcrumbSchema,
  FAQSchema,
  ArticleSchema,
} from "@/components/StructuredData";
import { blogPosts, getBlogPost, getAllSlugs } from "@/data/blog-posts";
import type { BlogPost } from "@/data/blog-posts";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/blog";
import type { BlogArticle } from "@/lib/blog";

// ─── Static Params (merge initial + engine-generated) ───
export function generateStaticParams() {
  const initialSlugs = getAllSlugs();
  const engineSlugs = getAllBlogSlugs();
  const allSlugs = Array.from(new Set([...initialSlugs, ...engineSlugs]));
  return allSlugs.map((slug) => ({ slug }));
}

// ─── Dynamic Metadata ───
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const enginePost = !post ? getBlogPostBySlug(slug) : null;

  if (!post && !enginePost) return { title: "Artigo não encontrado" };

  const title = post?.title ?? enginePost!.seoTitle ?? enginePost!.title;
  const description =
    post?.description ??
    enginePost!.seoDescription ??
    enginePost!.excerpt;
  const datePublished = post?.datePublished ?? enginePost!.datePublished;
  const dateModified = post?.dateModified ?? enginePost!.dateModified;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      locale: "pt_BR",
      siteName: "LK Digital",
      publishedTime: datePublished,
      modifiedTime: dateModified,
      authors: ["LK Digital"],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

// ─── Helper: format date ───
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Page Component ───
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const enginePost = !post ? getBlogPostBySlug(slug) : null;

  if (!post && !enginePost) notFound();

  // If it's an engine-generated post, render it differently
  if (enginePost && !post) {
    return <EnginePostPage article={enginePost} />;
  }

  // Original initial-6-articles rendering (post is guaranteed non-null here)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const safePost = post!;

  // Calculate word count for SEO schema
  const wordCount = safePost.content.reduce(
    (acc, s) =>
      acc +
      s.content.split(" ").length +
      (s.subsections?.reduce(
        (a, ss) => a + ss.content.split(" ").length,
        0
      ) ?? 0),
    0
  );

  const relatedPosts = safePost.relatedSlugs
    .map((s) => blogPosts.find((p) => p.slug === s))
    .filter(Boolean) as BlogPost[];

  return (
    <>
      {/* Structured Data — SEO + GEO (speakable) */}
      <ArticleSchema
        title={safePost.title}
        description={safePost.description}
        slug={safePost.slug}
        datePublished={safePost.datePublished}
        dateModified={safePost.dateModified}
        category={safePost.category}
        wordCount={wordCount}
        speakable
      />
      <FAQSchema faqs={safePost.faqs} />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: safePost.title, href: `/blog/${safePost.slug}` },
        ]}
      />

      <Navbar />

      <main className="pt-20 md:pt-24">
        {/* ─── Article Header ─── */}
        <header className="border-b border-border">
          <div className="max-w-narrow mx-auto px-4 sm:px-6 py-12 md:py-20">
            {/* Breadcrumb */}
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
                  {safePost.title}
                </li>
              </ol>
            </nav>

            {/* Category + Read Time */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 text-[10px] font-medium text-accent bg-accent/10 rounded uppercase tracking-wider">
                {safePost.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {safePost.readTime} de leitura
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.1] tracking-tight text-foreground max-w-4xl"
              data-speakable
            >
              {safePost.title}
            </h1>

            {/* Author Byline */}
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                <span className="text-sm font-medium text-accent">LK</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Equipe LK Digital
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(safePost.datePublished)}
                  {safePost.dateModified !== safePost.datePublished && (
                    <>
                      {" "}
                      &middot; Atualizado em{" "}
                      {formatDate(safePost.dateModified)}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ─── Article Body ─── */}
        <div className="max-w-narrow mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12 lg:gap-16">
            {/* Content */}
            <article className="max-w-prose">
              {/* AEO: Excerpt as citable lead */}
              <p
                className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-accent/40 pl-5"
                data-speakable
              >
                {safePost.excerpt}
              </p>

              {/* Sections */}
              {safePost.content.map((section, i) => (
                <section key={i} className="mb-10" id={`section-${i}`}>
                  <h2
                    className="font-display text-display-sm text-foreground mb-4"
                    data-speakable
                  >
                    {section.heading}
                  </h2>
                  <div className="prose-content">
                    {section.content.split("\n\n").map((para, j) => (
                      <p
                        key={j}
                        className="text-[15px] text-muted-foreground leading-[1.8] mb-4"
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* Subsections */}
                  {section.subsections?.map((sub, k) => (
                    <div key={k} className="mt-6 ml-0">
                      <h3 className="font-display text-lg text-foreground mb-3">
                        {sub.heading}
                      </h3>
                      <div className="prose-content">
                        {sub.content.split("\n\n").map((para, l) => (
                          <p
                            key={l}
                            className="text-[15px] text-muted-foreground leading-[1.8] mb-4"
                          >
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              ))}

              {/* ─── FAQ Section (AEO: prominent, accessible) ─── */}
              <section className="mt-16 pt-10 border-t border-border">
                <h2 className="font-display text-display-sm text-foreground mb-8">
                  Perguntas Frequentes
                </h2>
                <div className="space-y-6">
                  {safePost.faqs.map((faq, i) => (
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

              {/* ─── CTA ─── */}
              <section className="mt-16 p-8 rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
                <h2 className="font-display text-display-sm text-foreground mb-3">
                  {safePost.cta?.heading ??
                    "Quer Mais Pacientes Pelo Google?"}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-lg">
                  {safePost.cta?.description ??
                    "A LK Digital é especializada exclusivamente em marketing para dentistas. Fazemos diagnóstico gratuito da sua presença digital e mostramos exatamente onde estão as oportunidades."}
                </p>
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg hover:shadow-accent/20"
                >
                  {safePost.cta?.buttonText ??
                    "Agendar Diagnóstico Gratuito"}
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

            {/* ─── Sidebar: Table of Contents ─── */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-[10px] font-medium text-accent uppercase tracking-[0.25em] mb-4">
                  Neste artigo
                </p>
                <nav aria-label="Sumário do artigo">
                  <ol className="space-y-2 border-l border-border/60 pl-4">
                    {safePost.content.map((section, i) => (
                      <li key={i}>
                        <a
                          href={`#section-${i}`}
                          className="block text-xs text-muted-foreground hover:text-accent transition-colors leading-snug py-1"
                        >
                          {section.heading}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>

                {/* Sidebar CTA */}
                <div className="mt-8 p-4 rounded-lg bg-card border border-border/60">
                  <p className="text-xs font-medium text-foreground mb-2">
                    {safePost.cta?.heading
                      ? safePost.cta.heading.length > 50
                        ? "Diagnóstico Gratuito"
                        : safePost.cta.heading
                      : "Diagnóstico Gratuito"}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                    {safePost.cta?.description
                      ? safePost.cta.description.substring(0, 120) +
                        (safePost.cta.description.length > 120 ? "..." : "")
                      : "Descubra o que está impedindo seu consultório de aparecer no Google."}
                  </p>
                  <Link
                    href="/contato"
                    className="block w-full text-center px-3 py-2 bg-accent hover:bg-accent-dark text-white text-xs font-medium rounded transition-colors"
                  >
                    {safePost.cta?.buttonText ?? "Quero o Diagnóstico"}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ─── Related Articles ─── */}
        {relatedPosts.length > 0 && (
          <section className="py-16 md:py-20 bg-muted border-t border-border">
            <div className="max-w-content mx-auto px-4 sm:px-6">
              <h2 className="font-display text-display-md text-foreground mb-10">
                Artigos Relacionados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group bg-card rounded-xl border border-border/60 hover:border-accent/30 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[16/9] bg-gradient-to-br from-accent/5 to-accent/10 flex items-center justify-center">
                      <span className="text-xs text-accent/40 uppercase tracking-[0.25em] font-medium">
                        {related.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 text-[10px] font-medium text-accent bg-accent/10 rounded">
                          {related.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {related.readTime}
                        </span>
                      </div>
                      <h3 className="font-display text-base font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <div className="mt-3 pt-3 border-t border-border/60">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:gap-2 transition-all">
                          Ler artigo
                          <svg
                            className="w-3.5 h-3.5"
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
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// Engine-Generated Post Page (reads from content/blog/*.json)
// ═══════════════════════════════════════════════════════════════
function EnginePostPage({ article }: { article: BlogArticle }) {
  const readTime =
    typeof article.readingTime === "number"
      ? `${article.readingTime} min`
      : article.readingTime;

  return (
    <>
      {/* SEO + GEO: Enhanced Article schema with speakable */}
      <ArticleSchema
        title={article.seoTitle ?? article.title}
        description={article.seoDescription ?? article.excerpt}
        slug={article.slug}
        datePublished={article.datePublished}
        dateModified={article.dateModified}
        category={article.category}
        keywords={article.keywords}
        authorName={article.author.name}
        speakable
      />
      {article.faqItems.length > 0 && <FAQSchema faqs={article.faqItems} />}
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: article.title, href: `/blog/${article.slug}` },
        ]}
      />

      <Navbar />

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
                  {article.title}
                </li>
              </ol>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 text-[10px] font-medium text-accent bg-accent/10 rounded uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {readTime} de leitura
              </span>
            </div>

            <h1
              className="font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.1] tracking-tight text-foreground max-w-4xl"
              data-speakable
            >
              {article.title}
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                <span className="text-sm font-medium text-accent">LK</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {article.author.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(article.datePublished)}
                  {article.dateModified !== article.datePublished && (
                    <>
                      {" "}
                      &middot; Atualizado em{" "}
                      {formatDate(article.dateModified)}
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
              {article.tldr && (
                <div
                  className="answer-box mb-10 p-5 rounded-lg bg-accent/5 border border-accent/20"
                  data-speakable
                >
                  <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">
                    Resumo
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {article.tldr}
                  </p>
                </div>
              )}

              {/* Excerpt */}
              <p
                className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-accent/40 pl-5"
                data-speakable
              >
                {article.excerpt}
              </p>

              {/* HTML Content */}
              <div
                className="prose-content [&_h2]:font-display [&_h2]:text-display-sm [&_h2]:text-foreground [&_h2]:mb-4 [&_h2]:mt-10 [&_h3]:font-display [&_h3]:text-lg [&_h3]:text-foreground [&_h3]:mb-3 [&_h3]:mt-6 [&_p]:text-[15px] [&_p]:text-muted-foreground [&_p]:leading-[1.8] [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:text-[15px] [&_ul_li]:text-muted-foreground [&_ul_li]:mb-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol_li]:text-[15px] [&_ol_li]:text-muted-foreground [&_ol_li]:mb-1.5 [&_table]:w-full [&_table]:mb-6 [&_table]:text-sm [&_th]:text-left [&_th]:p-3 [&_th]:bg-muted [&_th]:text-foreground [&_th]:font-medium [&_td]:p-3 [&_td]:border-t [&_td]:border-border/60 [&_td]:text-muted-foreground [&_blockquote]:border-l-2 [&_blockquote]:border-accent/40 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_strong]:text-foreground [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* FAQ */}
              {article.faqItems.length > 0 && (
                <section className="mt-16 pt-10 border-t border-border">
                  <h2 className="font-display text-display-sm text-foreground mb-8">
                    Perguntas Frequentes
                  </h2>
                  <div className="space-y-6">
                    {article.faqItems.map((faq, i) => (
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
                  {article.ctaHeading ??
                    "Quer Mais Pacientes Pelo Google?"}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-lg">
                  {article.ctaDescription ??
                    "A LK Digital é especializada exclusivamente em marketing para dentistas. Fazemos diagnóstico gratuito da sua presença digital."}
                </p>
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg hover:shadow-accent/20"
                >
                  {article.ctaButton ?? "Agendar Diagnóstico Gratuito"}
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
                    {article.ctaHeading &&
                    article.ctaHeading.length <= 50
                      ? article.ctaHeading
                      : "Diagnóstico Gratuito"}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                    {article.ctaDescription
                      ? article.ctaDescription.substring(0, 120) +
                        (article.ctaDescription.length > 120 ? "..." : "")
                      : "Descubra o que está impedindo seu consultório de aparecer no Google."}
                  </p>
                  <Link
                    href="/contato"
                    className="block w-full text-center px-3 py-2 bg-accent hover:bg-accent-dark text-white text-xs font-medium rounded transition-colors"
                  >
                    {article.ctaButton ?? "Quero o Diagnóstico"}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
