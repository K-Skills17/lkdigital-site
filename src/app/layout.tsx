import type { Metadata } from "next";
import "./globals.css";

/**
 * SEO Metadata optimized for GEO (Generative Engine Optimization) and AEO
 * Focused on the health industry — clinics, hospitals, and healthcare professionals
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://lkdigital.com.br"),

  title: {
    default: "LK Digital | Marketing Digital para Clínicas e Profissionais de Saúde",
    template: "%s | LK Digital",
  },
  description:
    "A LK Digital é especialista em marketing digital para clínicas, hospitais e profissionais de saúde. Desenvolvemos sistemas previsíveis de aquisição de pacientes, estratégias de posicionamento premium e infraestrutura digital escalável para quem busca crescimento sustentável no setor da saúde.",

  keywords: [
    "marketing digital para clínicas de saúde",
    "marketing para médicos",
    "captação de pacientes",
    "marketing digital para dentistas",
    "marketing para clínicas médicas",
    "agência de marketing saúde",
    "SEO para clínicas",
    "GEO para saúde",
    "marketing para dermatologistas",
    "marketing para psicólogos",
    "marketing para fisioterapeutas",
    "marketing para nutricionistas",
    "marketing para ortopedistas",
    "marketing para cardiologistas",
    "posicionamento digital para profissionais de saúde",
    "consultoria marketing saúde",
    "branding para clínicas",
    "geração de leads saúde",
    "LK Digital",
  ],

  authors: [{ name: "LK Digital", url: "https://lkdigital.com.br" }],
  creator: "LK Digital",
  publisher: "LK Digital",

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

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://lkdigital.com.br",
    siteName: "LK Digital",
    title: "LK Digital | Marketing Digital Premium para Saúde",
    description:
      "Sistemas previsíveis de aquisição de pacientes e estratégias de posicionamento para clínicas e profissionais de saúde que buscam crescimento sustentável.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LK Digital - Marketing Digital para Clínicas e Profissionais de Saúde",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "LK Digital | Marketing Digital para Saúde",
    description:
      "Sistemas previsíveis de aquisição de pacientes para clínicas e profissionais de saúde. Posicionamento premium, SEO e GEO aplicados ao setor.",
    images: ["/og-image.jpg"],
    creator: "@lkdigital",
  },

  verification: {
    google: "google-site-verification-code",
  },

  category: "Marketing Digital",

  alternates: {
    canonical: "https://lkdigital.com.br",
    languages: {
      "pt-BR": "https://lkdigital.com.br",
    },
  },

  other: {
    "geo.region": "BR",
    "geo.placename": "Brasil",
    "content-language": "pt-BR",
    "audience": "médicos, dentistas, clínicas de saúde, hospitais, profissionais de saúde",
    "topic": "marketing digital, saúde, captação de pacientes, SEO, GEO",
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
