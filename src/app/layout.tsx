import type { Metadata } from "next";
import "./globals.css";

/**
 * SEO Metadata optimized for GEO (Generative Engine Optimization)
 * Focused on Portuguese market for dental clinic marketing
 */
export const metadata: Metadata = {
  // Base URL for resolving relative URLs in metadata
  metadataBase: new URL("https://lkdigital.com.br"),

  // Core metadata
  title: {
    default: "LK Digital | Marketing Digital para Dentistas e Clínicas Odontológicas",
    template: "%s | LK Digital",
  },
  description:
    "A LK Digital é especialista em marketing digital para dentistas e clínicas odontológicas. Desenvolvemos sistemas previsíveis de aquisição de pacientes, estratégias de conversão e posicionamento premium para profissionais da odontologia que buscam crescimento sustentável.",

  // Keywords for search engines and AI crawlers
  keywords: [
    "marketing digital para dentistas",
    "marketing odontológico",
    "captação de pacientes odontologia",
    "marketing para clínicas odontológicas",
    "agência de marketing dental",
    "estratégia digital para dentistas",
    "geração de leads odontologia",
    "posicionamento para dentistas",
    "consultoria marketing odontológico",
    "gestão de redes sociais dentistas",
    "SEO para clínicas odontológicas",
    "tráfego pago odontologia",
    "LK Digital",
  ],

  // Author and creator information
  authors: [{ name: "LK Digital", url: "https://lkdigital.com.br" }],
  creator: "LK Digital",
  publisher: "LK Digital",

  // Robots configuration for search engines and AI crawlers
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph for social sharing and AI context
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://lkdigital.com.br",
    siteName: "LK Digital",
    title: "LK Digital | Marketing Digital Premium para Dentistas",
    description:
      "Sistemas previsíveis de aquisição de pacientes e estratégias de conversão para clínicas odontológicas que buscam crescimento sustentável e posicionamento premium no mercado.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LK Digital - Marketing Digital para Dentistas",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "LK Digital | Marketing Digital para Dentistas",
    description:
      "Sistemas previsíveis de aquisição de pacientes e conversão para clínicas odontológicas. Posicionamento premium para dentistas.",
    images: ["/og-image.jpg"],
    creator: "@lkdigital",
  },

  // Verification for search consoles
  verification: {
    google: "google-site-verification-code",
  },

  // Category for better AI understanding
  category: "Marketing Digital",

  // Alternate languages (for future expansion)
  alternates: {
    canonical: "https://lkdigital.com.br",
    languages: {
      "pt-BR": "https://lkdigital.com.br",
    },
  },

  // Additional metadata for GEO optimization
  other: {
    "geo.region": "BR",
    "geo.placename": "Brasil",
    "content-language": "pt-BR",
    "audience": "dentistas, clínicas odontológicas, profissionais de odontologia",
    "topic": "marketing digital, odontologia, captação de pacientes",
    "coverage": "Brasil",
    "distribution": "global",
    "rating": "general",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Fonts - Cormorant Garamond (Headings) & Inter (Body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
