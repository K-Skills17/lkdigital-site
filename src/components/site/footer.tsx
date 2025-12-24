import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <Link
              href="/privacidade"
              className="hover:text-[rgb(var(--brand-accent))] transition-colors"
            >
              Privacidade (LGPD)
            </Link>
            <Link
              href="/termos"
              className="hover:text-[rgb(var(--brand-accent))] transition-colors"
            >
              Termos
            </Link>
          </div>
          <div className="text-xs">PT · EN (em breve)</div>
        </div>
        {/* Spacer for mobile bottom CTA */}
        <div className="h-20 md:h-0" />
      </div>
    </footer>
  );
}

