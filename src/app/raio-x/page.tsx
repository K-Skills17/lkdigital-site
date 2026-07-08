import type { Metadata } from "next";
import ScorecardFunnel from "@/components/raio-x/ScorecardFunnel";

export const metadata: Metadata = {
  title: "RAIO-X da Clínica | Diagnóstico gratuito em 3 minutos — LK Digital × Biodonte",
  description:
    "Responda 12 perguntas e descubra os pontos de melhoria da sua clínica odontológica em Visibilidade & Aquisição e Conversão & Operação. Gratuito, sem compromisso.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "RAIO-X da Clínica | Diagnóstico gratuito em 3 minutos",
    description:
      "Scorecard gratuito para clínicas odontológicas: 12 perguntas, 2 domínios, resultado imediato.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RaioXPage() {
  return <ScorecardFunnel />;
}
