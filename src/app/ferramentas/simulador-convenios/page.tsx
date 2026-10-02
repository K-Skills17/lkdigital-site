import type { Metadata } from "next";
import { toolFontVars } from "@/tools/shared/fonts";
import App from "@/tools/simulador-convenios/App";
import "@/tools/simulador-convenios/index.css";

// Ported from the standalone simulador-convenios app; leads go through the shared backbone
// (src/lib/backbone) via /api/ferramentas/simulador-convenios/lead.

export const metadata: Metadata = {
  title: { absolute: "Simulador de Convênios | LK Digital" },
  description: "Simule a rentabilidade de cada convênio odontológico. Descubra quais planos valem a pena e quais estão dando prejuízo. Ferramenta gratuita para dentistas.",
  alternates: { canonical: "https://lkdigital.odo.br/ferramentas/simulador-convenios" },
  openGraph: {
    title: "Simulador de Convênios | LK Digital",
    description: "Simule a rentabilidade de cada convênio odontológico. Descubra quais planos valem a pena e quais estão dando prejuízo. Ferramenta gratuita para dentistas.",
    url: "https://lkdigital.odo.br/ferramentas/simulador-convenios",
    type: "website",
    images: [{ url: "https://lkdigital.odo.br/og-default.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className={`${toolFontVars} tool-simulador-convenios`} style={{ minHeight: "100vh" }}>
      <App />
    </div>
  );
}
