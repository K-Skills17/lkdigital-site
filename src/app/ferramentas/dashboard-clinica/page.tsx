import ToolShell from "@/components/tools/ToolShell";
import { leadMagnetMetadata } from "@/components/tools/lead-magnet-metadata";
import App from "@/tools/dashboard-clinica/App";
import { LEAD_MAGNET_CONFIG } from "@/tools/shared/lead-magnets";
import "@/tools/shared/lead-magnets.css";
import "@/tools/dashboard-clinica/index.css";

// Dashboard da Clínica (Eps 5, 8, 14): weekly spreadsheet (Excel / Google Sheets), blank + example.
// Lead → /api/ferramentas/dashboard-clinica/lead → tool_leads; both files go out on WhatsApp too.

export const metadata = leadMagnetMetadata({
  path: "/ferramentas/dashboard-clinica",
  title: "Dashboard da clínica odontológica: planilha gratuita (Excel e Google Sheets) | LK Digital",
  description:
    "Planilha gratuita para clínicas odontológicas: investimento, leads qualificados, consultas agendadas e receita fechada por semana e por canal, com CAC e ROAS calculados sozinhos.",
  ogTitle: "Dashboard da clínica odontológica: planilha gratuita",
  ogDescription: "10 minutos toda segunda para saber quanto custa cada paciente e qual canal traz receita.",
  ogImage: "og-dashboard-clinica.png",
});

export default function Page() {
  return (
    <ToolShell slug="dashboard-clinica">
      <App config={LEAD_MAGNET_CONFIG} />
    </ToolShell>
  );
}
