/**
 * JSON-LD Structured Data Components
 * Implements Organization, ProfessionalService, WebSite and FAQPage schemas
 * Optimized for GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization)
 */

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

interface HealthMarketingSchemaProps {
  name?: string;
  url?: string;
  description?: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  priceRange?: string;
  areaServed?: string[];
}

/**
 * Organization Schema - LK Digital marketing agency
 */
export function OrganizationSchema({
  name = "LK Digital",
  url = "https://lkdigital.com.br",
  logo = "https://lkdigital.com.br/logo.png",
  description = "Agência especialista em marketing digital para clínicas e profissionais de saúde. Sistemas previsíveis de aquisição de pacientes, branding premium e infraestrutura digital escalável.",
  sameAs = [],
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    foundingDate: "2019",
    founders: [
      {
        "@type": "Person",
        name: "LK Digital",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Portuguese"],
    },
    sameAs,
    areaServed: {
      "@type": "Country",
      name: "Brazil",
    },
    knowsAbout: [
      "Marketing Digital para Saúde",
      "SEO para Clínicas",
      "GEO - Generative Engine Optimization",
      "Captação de Pacientes",
      "Branding para Profissionais de Saúde",
      "Marketing para Médicos",
      "Marketing para Dentistas",
      "Marketing para Dermatologistas",
      "Marketing para Psicólogos",
      "Infraestrutura Digital para Clínicas",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * ProfessionalService Schema - Health marketing services context
 */
export function HealthMarketingSchema({
  name = "LK Digital - Marketing para Saúde",
  url = "https://lkdigital.com.br",
  description = "Especialistas em marketing digital para clínicas e profissionais de saúde de alto padrão. Desenvolvemos sistemas de aquisição de pacientes e posicionamento premium para médicos, dentistas, dermatologistas, psicólogos, fisioterapeutas e outras especialidades.",
  telephone,
  email,
  address,
  priceRange = "$$$",
  areaServed = ["Brasil", "Portugal"],
}: HealthMarketingSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${url}/#organization`,
    name,
    url,
    description,
    priceRange,
    areaServed: areaServed.map((area) => ({
      "@type": "Country",
      name: area,
    })),
    serviceType: [
      "Marketing Digital para Saúde",
      "SEO para Clínicas",
      "GEO - Generative Engine Optimization",
      "Branding Premium para Profissionais de Saúde",
      "Captação de Pacientes",
      "Infraestrutura Digital",
      "Consultoria de Crescimento",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços de Marketing para Saúde",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "GEO & SEO para Saúde",
            description:
              "Otimização para motores de busca tradicionais e inteligências artificiais, posicionando sua clínica como autoridade digital reconhecida quando pacientes buscam especialistas.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Branding Premium para Clínicas",
            description:
              "Desenvolvimento de identidade visual e posicionamento premium para clínicas e profissionais de saúde que desejam atrair pacientes de alto padrão.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Infraestrutura Digital Escalável",
            description:
              "Sistemas de automação, funis de conversão e dashboards de inteligência para clínicas que querem crescer com previsibilidade.",
          },
        },
      ],
    },
  };

  if (telephone) {
    schema.telephone = telephone;
  }

  if (email) {
    schema.email = email;
  }

  if (address) {
    schema.address = {
      "@type": "PostalAddress",
      ...address,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * WebSite Schema - For search box and site navigation
 */
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LK Digital",
    url: "https://lkdigital.com.br",
    description:
      "Marketing digital especializado para clínicas e profissionais de saúde. Sistemas previsíveis de aquisição de pacientes, SEO, GEO e branding premium.",
    inLanguage: "pt-BR",
    publisher: {
      "@type": "Organization",
      name: "LK Digital",
      url: "https://lkdigital.com.br",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQPage Schema - For Answer Engine Optimization (AEO)
 */
export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
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

/**
 * Article Schema - For blog posts (GEO + SEO)
 */
export function ArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  slug,
  authorName = "LK Digital",
}: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
  authorName?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    url: `https://lkdigital.com.br/insights/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "LK Digital",
      url: "https://lkdigital.com.br",
      logo: {
        "@type": "ImageObject",
        url: "https://lkdigital.com.br/logo.png",
      },
    },
    author: {
      "@type": "Organization",
      name: authorName,
      url: "https://lkdigital.com.br",
    },
    inLanguage: "pt-BR",
    about: {
      "@type": "Thing",
      name: "Marketing Digital para Saúde",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Combined schema component for the homepage
 */
export function HomepageStructuredData() {
  return (
    <>
      <OrganizationSchema />
      <HealthMarketingSchema />
      <WebSiteSchema />
    </>
  );
}

/** Keep MedicalBusinessSchema as alias for backwards compat */
export const MedicalBusinessSchema = HealthMarketingSchema;
