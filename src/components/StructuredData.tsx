export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "LK Digital",
    url: "https://lkdigital.odo.br",
    description:
      "Agência de marketing digital especializada exclusivamente em odontologia. Captação de pacientes qualificados para dentistas e clínicas odontológicas.",
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
    sameAs: [],
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
        urlTemplate: "https://lkdigital.odo.br/insights?q={search_term_string}",
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
}: {
  name: string;
  description: string;
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
