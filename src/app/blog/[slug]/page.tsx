import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BreadcrumbSchema, FAQSchema, ArticleSchema } from "@/components/StructuredData";
import ArticleView from "@/components/blog/ArticleView";
import { getPublishedPost, getRelatedPosts, listPublishedPosts } from "@/lib/blog/store";

// Posts live in the database and are published from /painel/blog. Pages are
// cached and re-checked every 5 minutes; publishing refreshes them instantly,
// and a scheduled post appears within 5 minutes of its time.
export const revalidate = 300;

// Pre-render live posts at build time when the database is reachable;
// anything else (new posts, or no DB at build) renders on first request.
export async function generateStaticParams() {
  try {
    return (await listPublishedPosts()).map((p) => ({ slug: p.slug }));
  } catch (err) {
    console.warn("[blog] could not list posts at build time — rendering on demand:", err);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPublishedPost(params.slug);
  if (!post) return { title: "Artigo não encontrado" };

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;

  // Keep the final <title> under 60 chars for Google's results page.
  const withBrand = `${title} | LK Digital`;
  const finalTitle = withBrand.length <= 60 ? withBrand : title;

  return {
    title: { absolute: finalTitle },
    description,
    ...(post.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "article",
      title,
      description,
      locale: "pt_BR",
      siteName: "LK Digital",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [{ url: "https://lkdigital.odo.br/og-default.jpg", width: 1200, height: 630 }],
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPublishedPost(params.slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post, 3);

  return (
    <>
      <ArticleSchema
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        slug={post.slug}
        datePublished={post.publishedAt!}
        dateModified={post.updatedAt}
        category={post.category}
        keywords={post.keywords}
        authorName={post.author.name}
        speakable
      />
      {post.faqItems.length > 0 && <FAQSchema faqs={post.faqItems} />}
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <Navbar />
      <ArticleView post={post} relatedPosts={related} />
      <Footer />
    </>
  );
}
