import type { Metadata } from "next";
import { toolFontVars } from "@/tools/shared/fonts";
import App from "@/tools/diagnostico-clinica/App";
import "@/tools/diagnostico-clinica/index.css";

// Ported from the standalone diagnostico-clinica app; leads go through the shared backbone
// (src/lib/backbone) via /api/ferramentas/diagnostico-clinica/lead.

export const metadata: Metadata = {
  title: { absolute: "Diagnóstico Financeiro da Clínica | LK Digital" },
  description: "Descubra quanto dinheiro seu consultório odontológico está perdendo por mês. Ferramenta gratuita de diagnóstico financeiro pela LK Digital.",
  alternates: { canonical: "https://lkdigital.odo.br/ferramentas/diagnostico-clinica" },
  openGraph: {
    title: "Diagnóstico Financeiro da Clínica | LK Digital",
    description: "Descubra quanto dinheiro seu consultório odontológico está perdendo por mês. Ferramenta gratuita de diagnóstico financeiro pela LK Digital.",
    url: "https://lkdigital.odo.br/ferramentas/diagnostico-clinica",
    type: "website",
    images: [{ url: "https://lkdigital.odo.br/og-default.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className={`${toolFontVars} tool-diagnostico-clinica`} style={{ minHeight: "100vh" }}>
      <App />
    </div>
  );
}
