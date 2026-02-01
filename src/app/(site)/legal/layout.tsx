"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="container mx-auto max-w-[800px] px-4 pt-8 md:pt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar para Home
        </Link>
      </div>

      {/* Legal Content */}
      <article className="container mx-auto max-w-[800px] px-4 py-12 md:py-16 lg:py-20">
        <div className="legal-content">{children}</div>
      </article>

      {/* Bottom CTA */}
      <section className="container mx-auto max-w-[800px] px-4 pb-16 md:pb-20 lg:pb-24">
        <div className="border-t border-border pt-12 md:pt-16">
          <div className="bg-trust-bg p-8 md:p-10 text-center">
            <p className="text-xs sm:text-sm font-medium text-accent uppercase tracking-widest mb-4">
              Pronto para Começar?
            </p>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-foreground">
              Inicie Sua Transformação
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-md mx-auto">
              Agende uma consultoria estratégica e descubra como podemos acelerar
              o crescimento da sua clínica.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-accent text-white hover:bg-accent-dark px-8 py-5 text-base"
              >
                <Link href="/contato">Inquérito de Parceria</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Navigation */}
      <nav className="container mx-auto max-w-[800px] px-4 pb-12">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <Link
            href="/legal/privacidade"
            className="hover:text-accent transition-colors"
          >
            Privacidade
          </Link>
          <span className="text-border">|</span>
          <Link
            href="/legal/termos"
            className="hover:text-accent transition-colors"
          >
            Termos
          </Link>
          <span className="text-border">|</span>
          <Link
            href="/legal/cookies"
            className="hover:text-accent transition-colors"
          >
            Cookies
          </Link>
        </div>
      </nav>

      {/* Legal Typography Styles */}
      <style jsx global>{`
        .legal-content {
          font-family: var(--font-sans);
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--muted-foreground);
        }

        .legal-content h1 {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--accent);
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        @media (min-width: 768px) {
          .legal-content h1 {
            font-size: 3rem;
          }
        }

        .legal-content h2 {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--accent);
          margin-top: 3rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        @media (min-width: 768px) {
          .legal-content h2 {
            font-size: 2rem;
          }
        }

        .legal-content h3 {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--accent);
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .legal-content p {
          margin-bottom: 1.5rem;
        }

        .legal-content ul,
        .legal-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .legal-content li {
          margin-bottom: 0.75rem;
        }

        .legal-content strong {
          color: var(--foreground);
          font-weight: 600;
        }

        .legal-content a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: color 0.2s;
        }

        .legal-content a:hover {
          color: var(--accent-dark);
        }

        .legal-content .last-updated {
          display: inline-block;
          font-size: 0.875rem;
          color: var(--muted-foreground);
          background: var(--muted);
          padding: 0.5rem 1rem;
          margin-bottom: 2rem;
        }

        .legal-content .lead {
          font-size: 1.25rem;
          color: var(--foreground);
          margin-bottom: 2.5rem;
          line-height: 1.7;
        }

        .legal-content hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 3rem 0;
        }
      `}</style>
    </div>
  );
}
