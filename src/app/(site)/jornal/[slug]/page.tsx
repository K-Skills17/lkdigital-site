import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getPostBySlug,
  getPostSlugs,
  formatDate,
  calculateReadingTime,
} from "@/lib/mdx";
import { Callout, GuaranteedResult, ArticleStructuredData } from "@/components/blog";
import { Button } from "@/components/ui/button";

// Custom MDX components available in blog posts
const mdxComponents = {
  Callout,
  GuaranteedResult,
  // Custom heading components with anchor links
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-2xl md:text-3xl font-semibold text-foreground mt-10 mb-4"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="text-xl md:text-2xl font-semibold text-foreground mt-8 mb-3"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="text-muted-foreground leading-relaxed mb-6"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside space-y-2 mb-6 text-muted-foreground" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      className="text-accent hover:text-accent-dark underline underline-offset-4 transition-colors"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-accent pl-6 my-6 italic text-foreground/80"
      {...props}
    >
      {children}
    </blockquote>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
      {...props}
    >
      {children}
    </code>
  ),
  hr: () => <hr className="my-8 border-t border-border" />,
};

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata from frontmatter
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Artigo não encontrado",
    };
  }

  const { frontmatter } = post;

  return {
    title: `${frontmatter.title} | LK Digital Jornal`,
    description: frontmatter.description,
    authors: [{ name: frontmatter.author }],
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      type: "article",
      publishedTime: frontmatter.date,
      authors: [frontmatter.author],
      images: frontmatter.image ? [frontmatter.image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: frontmatter.image ? [frontmatter.image] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;
  const readingTime =
    frontmatter.readingTime || calculateReadingTime(content);

  return (
    <>
      {/* Structured Data for SEO/GEO */}
      <ArticleStructuredData frontmatter={frontmatter} slug={slug} />

      {/* Article Header */}
      <header className="section-premium pb-0">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/jornal" className="hover:text-accent transition-colors">
              Jornal
            </Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">
              {frontmatter.title}
            </span>
          </nav>

          {/* Category */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-medium text-accent uppercase tracking-widest">
              {frontmatter.category}
            </span>
            {frontmatter.featured && (
              <span className="text-xs font-medium text-white bg-accent px-2 py-0.5 rounded-full">
                Destaque
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground leading-tight">
            {frontmatter.title}
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
            {frontmatter.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-8 pb-8 border-b border-border">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-semibold text-sm">
                  {frontmatter.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {frontmatter.author}
                </p>
                {frontmatter.authorRole && (
                  <p className="text-xs text-muted-foreground">
                    {frontmatter.authorRole}
                  </p>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDate(frontmatter.date)}</span>
            </div>

            {/* Reading time */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{readingTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {frontmatter.image && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="aspect-[16/9] bg-muted rounded-sm overflow-hidden">
            <img
              src={frontmatter.image}
              alt={frontmatter.imageAlt || frontmatter.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="section-premium pt-8">
        <div className="max-w-3xl mx-auto prose-custom">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </article>

      {/* Tags */}
      {frontmatter.tags && frontmatter.tags.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 pb-8 md:pb-12">
          <div className="flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium text-muted-foreground bg-muted rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Article Footer CTA */}
      <section className="section-premium bg-foreground">
        <div className="max-w-3xl mx-auto text-center">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-accent" aria-hidden="true" />
            <span className="text-xs uppercase tracking-widest text-accent">
              Próximo Passo
            </span>
            <div className="w-8 h-px bg-accent" aria-hidden="true" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-background">
            Pronto para Transformar sua Clínica?
          </h2>
          <p className="mt-4 md:mt-6 text-background/70 leading-relaxed max-w-xl mx-auto">
            Agende uma consultoria estratégica gratuita e descubra como a
            metodologia GEO pode acelerar o crescimento da sua clínica.
          </p>

          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-accent text-foreground hover:bg-accent-light px-8 py-6 text-base font-medium"
            >
              <Link href="/contato">Garantir Meu Crescimento</Link>
            </Button>
          </div>

          <p className="text-xs text-background/40 mt-4">
            Consultoria gratuita • Sem compromisso
          </p>
        </div>
      </section>

      {/* Back to Jornal */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/jornal"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar para o Jornal
        </Link>
      </div>
    </>
  );
}
