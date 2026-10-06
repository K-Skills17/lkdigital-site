import ToolShell from "@/components/tools/ToolShell";
import { leadMagnetMetadata } from "@/components/tools/lead-magnet-metadata";
import App from "@/tools/calculadora-cac/App";
import { LEAD_MAGNET_CONFIG } from "@/tools/shared/lead-magnets";
import "@/tools/shared/lead-magnets.css";
import "@/tools/calculadora-cac/index.css";

// Calculadora de CAC (Eps 1, 2, 3): CAC real, cost per funnel step, ROI/ROAS, LTV, "onde está o dinheiro".
// Spreadsheet lead → /api/ferramentas/calculadora-cac/lead → tool_leads (+ AI analysis on WhatsApp).

export const metadata = leadMagnetMetadata({
  path: "/ferramentas/calculadora-cac",
  title: "Calculadora de CAC para clínicas odontológicas | LK Digital",
  description:
    "Calculadora gratuita: descubra o CAC real da sua clínica odontológica, o custo de cada etapa do funil, ROI, ROAS, LTV e onde está o dinheiro no seu funil.",
  ogTitle: "Calculadora de CAC para clínicas odontológicas",
  ogDescription: "Quanto custa, de verdade, cada paciente que fecha tratamento? E qual etapa do funil mais pesa no seu CAC?",
  ogImage: "og-calculadora-cac.png",
});

export default function Page() {
  return (
    <ToolShell slug="calculadora-cac">
      <App config={LEAD_MAGNET_CONFIG} />
    </ToolShell>
  );
}
