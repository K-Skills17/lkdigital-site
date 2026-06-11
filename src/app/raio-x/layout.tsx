import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import Script from "next/script";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Raio-X Digital 2026 | Avaliação gratuita para clínicas odontológicas — LK Digital",
  description:
    "Avaliação gratuita e individual da presença digital da sua clínica — Google, site, Instagram, WhatsApp e busca por IA — com nota de 0 a 100 e os 3 pontos mais críticos para corrigir. Sem custo, sem compromisso, sem call de vendas obrigatória.",
  openGraph: {
    title: "Raio-X Digital 2026 | Avaliação gratuita para clínicas odontológicas — LK Digital",
    description:
      "Avaliação gratuita e individual da presença digital da sua clínica — Google, site, Instagram, WhatsApp e busca por IA — com nota de 0 a 100.",
    images: [{ url: "https://lkdigital.odo.br/og-raiox.jpg", width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RaioXLayout({ children }: { children: React.ReactNode }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      {/* Override display font to Playfair for this route */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .raiox-page { --font-display: ${playfair.style.fontFamily}; }
            #global-widgets { display: none !important; }
          `,
        }}
      />

      {gtmId && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}

      <div className={`raiox-page ${playfair.variable}`}>{children}</div>
    </>
  );
}
