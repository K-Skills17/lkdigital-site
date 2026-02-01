/**
 * JSON-LD Structured Data Components
 * Implements Organization and MedicalBusiness schema for GEO optimization
 */

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

interface MedicalBusinessSchemaProps {
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
 * Organization Schema - For the LK Digital marketing agency
 */
export function OrganizationSchema({
  name = "LK Digital",
  url = "https://lkdigital.com.br",
  logo = "https://lkdigital.com.br/logo.png",
  description = "Agência especialista em marketing digital para dentistas e clínicas odontológicas. Sistemas previsíveis de aquisição de pacientes e posicionamento premium.",
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
      "Marketing Digital para Dentistas",
      "SEO Odontológico",
      "GEO - Generative Engine Optimization",
      "Captação de Pacientes",
      "Branding para Clínicas Odontológicas",
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
 * MedicalBusiness Schema - For dental clinic clients context
 */
export function MedicalBusinessSchema({
  name = "LK Digital - Marketing Odontológico",
  url = "https://lkdigital.com.br",
  description = "Especialistas em marketing digital para clínicas odontológicas de alto padrão. Desenvolvemos sistemas de aquisição de pacientes e posicionamento premium para dentistas.",
  telephone,
  email,
  address,
  priceRange = "$$$",
  areaServed = ["Brasil", "Portugal"],
}: MedicalBusinessSchemaProps) {
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
      "Marketing Digital Odontológico",
      "SEO para Dentistas",
      "Branding Boutique",
      "Captação de Pacientes",
      "Consultoria Digital",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços de Marketing Odontológico",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "GEO & SEO Odontológico",
            description:
              "Otimização para motores de busca tradicionais e generativos, posicionando sua clínica como autoridade digital.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Branding Boutique para Dentistas",
            description:
              "Desenvolvimento de identidade visual e posicionamento premium para clínicas odontológicas de alto padrão.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Infraestrutura Digital Escalonável",
            description:
              "Sistemas e ferramentas digitais preparados para o crescimento da sua clínica.",
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
      "Marketing digital especializado para dentistas e clínicas odontológicas. Sistemas previsíveis de aquisição de pacientes.",
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
 * Combined schema component for the homepage
 */
export function HomepageStructuredData() {
  return (
    <>
      <OrganizationSchema />
      <MedicalBusinessSchema />
      <WebSiteSchema />
    </>
  );
}
