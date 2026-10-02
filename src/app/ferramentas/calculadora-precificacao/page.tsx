import type { Metadata } from "next";
import { toolFontVars } from "@/tools/shared/fonts";
import App from "@/tools/calculadora-precificacao/App";
import "@/tools/calculadora-precificacao/index.css";

// Ported from the standalone calculadora-precificacao app; leads go through the shared backbone
// (src/lib/backbone) via /api/ferramentas/calculadora-precificacao/lead.

export const metadata: Metadata = {
  title: { absolute: "Calculadora de Precificação | LK Digital" },
  description: "Calcule o preço ideal para cada procedimento odontológico. Ferramenta gratuita de precificação para dentistas.",
  alternates: { canonical: "https://lkdigital.odo.br/ferramentas/calculadora-precificacao" },
  openGraph: {
    title: "Calculadora de Precificação | LK Digital",
    description: "Calcule o preço ideal para cada procedimento odontológico. Ferramenta gratuita de precificação para dentistas.",
    url: "https://lkdigital.odo.br/ferramentas/calculadora-precificacao",
    type: "website",
    images: [{ url: "https://lkdigital.odo.br/og-default.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className={`${toolFontVars} tool-calculadora-precificacao`} style={{ minHeight: "100vh" }}>
      <App />
    </div>
  );
}
