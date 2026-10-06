import ToolShell from "@/components/tools/ToolShell";
import { leadMagnetMetadata } from "@/components/tools/lead-magnet-metadata";
import App from "@/tools/checklist-google/App";
import { LEAD_MAGNET_CONFIG } from "@/tools/shared/lead-magnets";
import "@/tools/shared/lead-magnets.css";
import "@/tools/checklist-google/index.css";

// Checklist do Perfil da Empresa no Google + kit de avaliações (Ep 9). Replaces the old
// diagnostico-google quiz. PDF lead → /api/ferramentas/checklist-google/lead → tool_leads.

export const metadata = leadMagnetMetadata({
  path: "/ferramentas/checklist-google",
  title: "Checklist do Perfil da Empresa no Google para clínicas odontológicas | LK Digital",
  description:
    "Checklist gratuito com 27 itens para o Perfil da Empresa no Google da sua clínica odontológica, mais kit de avaliações com modelos de pedido e resposta.",
  ogTitle: "Checklist do Perfil da Empresa no Google para clínicas odontológicas",
  ogDescription: "27 itens + kit de avaliações com modelos prontos. Gratuito.",
  ogImage: "og-checklist-google.png",
});

export default function Page() {
  return (
    <ToolShell slug="checklist-google">
      <App config={LEAD_MAGNET_CONFIG} />
    </ToolShell>
  );
}
