import type { Metadata } from "next";
import { toolFontVars } from "@/tools/shared/fonts";
import App from "@/tools/calculadora-agenda/App";
import "@/tools/calculadora-agenda/index.css";

// Ported from the standalone calculadora-agenda app; leads go through the shared backbone
// (src/lib/backbone) via /api/ferramentas/calculadora-agenda/lead.

export const metadata: Metadata = {
  title: { absolute: "Calculadora de Agenda Ideal | LK Digital" },
  description: "Descubra a agenda ideal para sua clínica odontológica. Otimize procedimentos e ganhe mais trabalhando menos.",
  alternates: { canonical: "https://lkdigital.odo.br/ferramentas/calculadora-agenda" },
  openGraph: {
    title: "Calculadora de Agenda Ideal | LK Digital",
    description: "Descubra a agenda ideal para sua clínica odontológica. Otimize procedimentos e ganhe mais trabalhando menos.",
    url: "https://lkdigital.odo.br/ferramentas/calculadora-agenda",
    type: "website",
    images: [{ url: "https://lkdigital.odo.br/og-default.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className={`${toolFontVars} tool-calculadora-agenda`} style={{ minHeight: "100vh" }}>
      <App />
    </div>
  );
}
