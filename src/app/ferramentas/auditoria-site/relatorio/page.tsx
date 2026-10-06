import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Relatório da Auditoria | LK Digital" },
  robots: { index: false, follow: false },
};

export { default } from "@/tools/auditoria-site/Report";
