import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import App from "@/tools/raio-x/App";
import { LEAD_MAGNET_CONFIG, SITE_URL } from "@/tools/shared/lead-magnets";
import "@/tools/shared/lead-magnets.css";
import "@/tools/raio-x/index.css";

// RAIO-X da clínica (series "O Sistema Operacional da Clínica Odontológica", Eps 0, 4, 6, 7, 10, 11, 14).
// Leads go through the backbone: /api/ferramentas/raio-x/lead → tool_leads.

const title = "RAIO-X da clínica odontológica: onde você está perdendo pacientes | LK Digital";
const description =
  "12 perguntas, 3 minutos: descubra em que etapa entre o primeiro contato e a cadeira a sua clínica odontológica está perdendo pacientes, com um plano de ação por área.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE_URL}/raio-x` },
  openGraph: {
    title: "RAIO-X da clínica odontológica",
    description: "Onde sua clínica está perdendo pacientes? 12 perguntas, 3 minutos.",
    url: `${SITE_URL}/raio-x`,
    type: "website",
    locale: "pt_BR",
    images: [{ url: `${SITE_URL}/ferramentas/arquivos/og-raio-x.png`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function Page() {
  return (
    <ToolShell slug="raio-x">
      <App config={LEAD_MAGNET_CONFIG} />
    </ToolShell>
  );
}
