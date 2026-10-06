import ToolShell from "@/components/tools/ToolShell";
import { leadMagnetMetadata } from "@/components/tools/lead-magnet-metadata";
import App from "@/tools/raio-x/App";
import { LEAD_MAGNET_CONFIG } from "@/tools/shared/lead-magnets";
import "@/tools/shared/lead-magnets.css";
import "@/tools/raio-x/index.css";

// RAIO-X da clínica (series "O Sistema Operacional da Clínica Odontológica", Eps 0, 4, 6, 7, 10, 11, 14).
// Leads go through the backbone: /api/ferramentas/raio-x/lead → tool_leads.

export const metadata = leadMagnetMetadata({
  path: "/raio-x",
  title: "RAIO-X da clínica odontológica: onde você está perdendo pacientes | LK Digital",
  description:
    "12 perguntas, 3 minutos: descubra em que etapa entre o primeiro contato e a cadeira a sua clínica odontológica está perdendo pacientes, com um plano de ação por área.",
  ogTitle: "RAIO-X da clínica odontológica",
  ogDescription: "Onde sua clínica está perdendo pacientes? 12 perguntas, 3 minutos.",
  ogImage: "og-raio-x.png",
});

export default function Page() {
  return (
    <ToolShell slug="raio-x">
      <App config={LEAD_MAGNET_CONFIG} />
    </ToolShell>
  );
}
