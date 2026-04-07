export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "LK Digital",
    url: "https://lkdigital.odo.br",
    description:
      "Agência de marketing digital especializada exclusivamente em odontologia. Captação de pacientes qualificados para dentistas e clínicas odontológicas.",
    foundingDate: "2024",
    areaServed: [
      { "@type": "Country", name: "Brasil" },
      { "@type": "Country", name: "Portugal" },
    ],
    serviceType: [
      "SEO para Dentistas",
      "Google Ads para Odontologia",
      "Marketing Digital para Clínicas Odontológicas",
      "Gestão de Google Meu Negócio",
      "GEO - Generative Engine Optimization",
    ],
    knowsAbout: [
      "marketing para dentistas",
      "captação de pacientes odontológicos",
      "SEO local para consultórios",
      "publicidade odontológica CFO",
      "marketing digital para saúde bucal",
    ],
    sameAs: [
      "https://instagram.com/lkdigital.odo",
      "https://facebook.com/lkdigital.odo",
      "https://linkedin.com/company/lkdigital",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LK Digital",
    url: "https://lkdigital.odo.br",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://lkdigital.odo.br/blog?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://lkdigital.odo.br${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceSchema({
  name,
  description,
  dateModified,
}: {
  name: string;
  description: string;
  dateModified?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "ProfessionalService",
      name: "LK Digital",
      url: "https://lkdigital.odo.br",
    },
    areaServed: { "@type": "Country", name: "Brasil" },
    serviceType: "Marketing Digital para Odontologia",
    ...(dateModified && { dateModified }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  category,
  keywords,
  wordCount,
  authorName,
  speakable,
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  category?: string;
  keywords?: string[];
  wordCount?: number;
  authorName?: string;
  speakable?: boolean;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `https://lkdigital.odo.br/blog/${slug}`,
    datePublished,
    dateModified,
    inLanguage: "pt-BR",
    author: {
      "@type": "Person",
      name: authorName ?? "Equipe LK Digital",
      jobTitle: "Especialistas em Marketing Digital para Odontologia",
      url: "https://lkdigital.odo.br/sobre",
    },
    publisher: {
      "@type": "Organization",
      name: "LK Digital",
      url: "https://lkdigital.odo.br",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://lkdigital.odo.br/blog/${slug}`,
    },
    isAccessibleForFree: true,
    ...(category && { articleSection: category }),
    ...(keywords && keywords.length > 0 && { keywords: keywords.join(", ") }),
    ...(wordCount && { wordCount }),
    about: {
      "@type": "Thing",
      name: "Marketing Digital para Odontologia",
    },
  };

  // GEO: Speakable markup for AI/voice assistants
  if (speakable) {
    schema.speakable = {
      "@type": "SpeakableSpecification",
      cssSelector: [
        "[data-speakable]",
        "article h1",
        "article h2",
        ".answer-box",
      ],
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Blog Collection Schema (SEO: listing page) ───
export function BlogCollectionSchema({
  posts,
}: {
  posts: {
    title: string;
    slug: string;
    datePublished?: string;
  }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog — Marketing Digital Para Dentistas",
    description:
      "Artigos, guias e estratégias de marketing digital exclusivos para dentistas. SEO local, Google Ads, captação de pacientes e mais.",
    url: "https://lkdigital.odo.br/blog",
    inLanguage: "pt-BR",
    isPartOf: {
      "@type": "WebSite",
      name: "LK Digital",
      url: "https://lkdigital.odo.br",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://lkdigital.odo.br/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function CityServiceSchema({
  cityName,
  stateAbbr,
  description,
}: {
  cityName: string;
  stateAbbr: string;
  description: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Marketing Digital para Dentistas em ${cityName}`,
    description,
    provider: {
      "@type": "ProfessionalService",
      name: "LK Digital",
      url: "https://lkdigital.odo.br",
    },
    areaServed: {
      "@type": "City",
      name: cityName,
      containedInPlace: {
        "@type": "State",
        name: stateAbbr,
        containedInPlace: { "@type": "Country", name: "Brasil" },
      },
    },
    serviceType: "Marketing Digital para Odontologia",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
