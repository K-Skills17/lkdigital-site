import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { headers } from "next/headers";
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
    languages: {
      "pt-BR": "/",
      "pt-PT": "/",
      en: "/en",
      fr: "/fr",
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "LK Digital",
    title: "LK Digital — Marketing Digital de Precisão para Dentistas",
    description:
      "Captação de pacientes qualificados para consultórios e clínicas odontológicas.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  // headers() may return a Promise in newer Next.js versions
  const resolvedHeaders = headersList instanceof Promise ? await headersList : headersList;
  const locale = resolvedHeaders.get("x-locale") || "pt";
  const langMap: Record<string, string> = { pt: "pt-BR", en: "en", fr: "fr" };
  const htmlLang = langMap[locale] || "pt-BR";

  return (
    <html lang={htmlLang} className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "wcd0mr2thc");
            `,
          }}
        />
      </head>
      <body className="font-body antialiased">
        <a href="#main-content" className="skip-to-content">
          Pular para o conteúdo
        </a>
        {children}
        <ChatWidget />
        <WhatsAppButton />
      </body>
    </html>
  );
}
