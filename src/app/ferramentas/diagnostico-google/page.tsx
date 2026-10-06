import type { Metadata } from "next";
import { toolFontVars } from "@/tools/shared/fonts";
import App from "@/tools/diagnostico-google/App";
import "@/tools/diagnostico-google/index.css";

// Ported from the standalone diagnostico-google app; leads go through the shared backbone
// (src/lib/backbone) via /api/ferramentas/diagnostico-google/lead.

export const metadata: Metadata = {
  title: { absolute: "Diagnóstico Google Meu Negócio | LK Digital" },
  description: "Avalie seu perfil no Google Meu Negócio e descubra como atrair mais pacientes. Diagnóstico gratuito para dentistas.",
  alternates: { canonical: "https://lkdigital.odo.br/ferramentas/diagnostico-google" },
  openGraph: {
    title: "Diagnóstico Google Meu Negócio | LK Digital",
    description: "Avalie seu perfil no Google Meu Negócio e descubra como atrair mais pacientes. Diagnóstico gratuito para dentistas.",
    url: "https://lkdigital.odo.br/ferramentas/diagnostico-google",
    type: "website",
    images: [{ url: "https://lkdigital.odo.br/og-default.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className={`${toolFontVars} tool-diagnostico-google`} style={{ minHeight: "100vh" }}>
      <App />
    </div>
  );
}
