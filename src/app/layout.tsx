import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "optional",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "optional",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <a href="#main-content" className="skip-to-content">
          Pular para o conteúdo
        </a>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
