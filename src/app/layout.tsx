import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import Script from "next/script";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import WhatsAppButton from "@/components/WhatsAppButton";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | LK Digital",
    default: "LK Digital — Marketing Digital de Precisão para Dentistas",
  },
  description:
    "Captação de pacientes qualificados para consultórios e clínicas odontológicas. Agenda cheia, faturamento previsível, zero gestão para você.",
  metadataBase: new URL("https://lkdigital.odo.br"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "LK Digital",
    title: "LK Digital — Marketing Digital de Precisão para Dentistas",
    description:
      "Captação de pacientes qualificados para consultórios e clínicas odontológicas.",
    images: [{ url: "https://lkdigital.odo.br/og-default.jpg", width: 1200, height: 630 }],
  },
  other: {
    "facebook-domain-verification": "vl2tn4mo9rttbeblfoujf3m4ah1irk",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P9RPPHD9"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <a href="#main-content" className="skip-to-content">
          Pular para o conteúdo
        </a>
        {children}
        <div id="global-widgets">
          <ChatWidget />
          <WhatsAppButton />
        </div>

        {/* Google Tag Manager — afterInteractive keeps it non-blocking */}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P9RPPHD9');`,
          }}
        />
      </body>
    </html>
  );
}
