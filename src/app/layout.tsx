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
        <WhatsAppButton />

        {/* Analytics — delayed 5s after load to avoid competing with TBT window */}
        <Script
          id="deferred-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(function(){
                // Google Analytics
                var gs=document.createElement('script');
                gs.src='https://www.googletagmanager.com/gtag/js?id=G-FXE36BBPPQ';
                gs.async=true;
                document.head.appendChild(gs);
                window.dataLayer=window.dataLayer||[];
                function gtag(){dataLayer.push(arguments);}
                gtag('js',new Date());
                gtag('config','G-FXE36BBPPQ');

                // Microsoft Clarity
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window,document,"clarity","script","wcd0mr2thc");

                // Meta Pixel
                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
                n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
                s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
                }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init','812107305229720');
                fbq('track','PageView');
              }, 5000);
            `,
          }}
        />
      </body>
    </html>
  );
}
