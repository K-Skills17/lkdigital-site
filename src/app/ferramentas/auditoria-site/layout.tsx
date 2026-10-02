import type { Metadata } from "next";
import "@/tools/auditoria-site/tool.css";
import { toolFontVars } from "@/tools/shared/fonts";

// Ported from the standalone Fb-lead-audit-tool app. Scanning runs on
// /api/ferramentas/scan-site; leads go through the shared backbone.

export const metadata: Metadata = {
  title: { absolute: "Auditoria Gratuita de Site | LK Digital" },
  description: "Receba uma auditoria instantânea e gratuita do seu site: SEO, captação de leads, mobile, visibilidade em IA e velocidade.",
  alternates: { canonical: "https://lkdigital.odo.br/ferramentas/auditoria-site" },
  openGraph: {
    title: "Auditoria Gratuita de Site | LK Digital",
    description: "Receba uma auditoria instantânea e gratuita do seu site: SEO, captação de leads, mobile, visibilidade em IA e velocidade.",
    url: "https://lkdigital.odo.br/ferramentas/auditoria-site",
    type: "website",
    images: [{ url: "https://lkdigital.odo.br/og-default.jpg", width: 1200, height: 630 }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${toolFontVars} tool-auditoria-site`} style={{ minHeight: "100vh" }}>
      {children}
    </div>
  );
}
