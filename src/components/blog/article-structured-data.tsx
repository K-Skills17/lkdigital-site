import { PostFrontmatter } from "@/lib/mdx";

interface ArticleStructuredDataProps {
  frontmatter: PostFrontmatter;
  slug: string;
  url?: string;
}

export function ArticleStructuredData({
  frontmatter,
  slug,
  url = "https://lkdigital.com.br",
}: ArticleStructuredDataProps) {
  const articleUrl = `${url}/jornal/${slug}`;
  const imageUrl = frontmatter.image
    ? `${url}${frontmatter.image}`
    : `${url}/og-image.jpg`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    image: imageUrl,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: {
      "@type": "Person",
      name: frontmatter.author,
      jobTitle: frontmatter.authorRole || "Especialista em Marketing Odontológico",
      url: `${url}/sobre`,
    },
    publisher: {
      "@type": "Organization",
      name: "LK Digital",
      logo: {
        "@type": "ImageObject",
        url: `${url}/logo.png`,
      },
      url: url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    url: articleUrl,
    articleSection: frontmatter.category,
    keywords: frontmatter.tags?.join(", "),
    inLanguage: "pt-BR",
    isAccessibleForFree: true,
    // GEO optimization: Add breadcrumb for AI context
    isPartOf: {
      "@type": "Blog",
      name: "LK Digital Jornal",
      description:
        "Insights estratégicos sobre marketing digital para clínicas odontológicas",
      url: `${url}/jornal`,
    },
  };

  // Add BreadcrumbList for better SEO/GEO
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Jornal",
        item: `${url}/jornal`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: frontmatter.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
    </>
  );
}
