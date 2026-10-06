import ToolShell from "@/components/tools/ToolShell";
import { leadMagnetMetadata } from "@/components/tools/lead-magnet-metadata";
import App from "@/tools/scripts-whatsapp/App";
import { LEAD_MAGNET_CONFIG } from "@/tools/shared/lead-magnets";
import "@/tools/shared/lead-magnets.css";
import "@/tools/scripts-whatsapp/index.css";

// Scripts de WhatsApp para a recepção (Eps 2, 12, 13). Lead → /api/ferramentas/scripts-whatsapp/lead
// → tool_leads; the three files also go out on WhatsApp.

export const metadata = leadMagnetMetadata({
  path: "/ferramentas/scripts-whatsapp",
  title: "Scripts de WhatsApp para a recepção da clínica odontológica | LK Digital",
  description:
    "Livreto gratuito com scripts de WhatsApp para a recepção da clínica odontológica: primeira resposta, qualificação, “quanto custa?”, objeções, lembretes, faltas e follow-up.",
  ogTitle: "Scripts de WhatsApp para a recepção da clínica odontológica",
  ogDescription: "Do primeiro “oi” até a avaliação: mensagens prontas para copiar, colar e agendar.",
  ogImage: "og-scripts-whatsapp.png",
});

export default function Page() {
  return (
    <ToolShell slug="scripts-whatsapp">
      <App config={LEAD_MAGNET_CONFIG} />
    </ToolShell>
  );
}
