import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Admin area: operations dashboard + blog. Access is enforced in src/middleware.ts.
export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* The public site's floating WhatsApp/chat widgets would cover the editor. */}
      <style>{"#global-widgets{display:none}"}</style>
      <nav className="border-b border-border bg-card" aria-label="Painel">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 sm:px-6 h-12 text-sm">
          <span className="font-display text-lg text-foreground">LK Painel</span>
          <Link href="/painel" className="text-muted-foreground hover:text-foreground">Visão geral</Link>
          <Link href="/painel/blog" className="text-muted-foreground hover:text-foreground">Blog</Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
