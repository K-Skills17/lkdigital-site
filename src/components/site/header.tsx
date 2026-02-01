"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TopNotice } from "./top-notice";
import { Button } from "@/components/ui/button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Sobre", href: "/sobre", description: "Nossa história e metodologia" },
    { label: "Soluções", href: "/solucoes", description: "GEO, Branding e Automação" },
    { label: "Insights", href: "/insights", description: "Artigos e estudos de caso" },
    { label: "Contato", href: "/contato", description: "Inicie sua transformação" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <TopNotice />
      <nav className="container mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-semibold text-foreground"
          >
            LK Digital
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button
                aria-label="Open menu"
                className="p-2 hover:bg-muted rounded-md transition-colors"
              >
                <Menu className="h-6 w-6 text-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-[350px] bg-foreground border-l-0 p-0 [&>button]:hidden"
            >
              {/* Premium Mobile Menu */}
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-background/10">
                  <span className="text-xl font-heading text-background">
                    LK Digital
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                  >
                    <X className="h-5 w-5 text-background" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-8 px-6">
                  <ul className="space-y-2">
                    {navItems.map((item, index) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="group flex flex-col py-4 border-b border-background/10 hover:border-accent/50 transition-colors"
                        >
                          <span className="text-lg font-medium text-background group-hover:text-accent transition-colors">
                            {item.label}
                          </span>
                          <span className="text-sm text-background/50 mt-1">
                            {item.description}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Footer with CTA */}
                <div className="p-6 border-t border-background/10">
                  {/* Decorative element */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-px bg-accent" aria-hidden="true" />
                    <span className="text-xs uppercase tracking-widest text-accent">
                      Próximo Passo
                    </span>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-accent text-foreground hover:bg-accent-light py-6 text-base font-medium"
                  >
                    <Link
                      href="/contato"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Garantir Meu Crescimento
                    </Link>
                  </Button>

                  {/* Trust indicator */}
                  <p className="text-center text-xs text-background/40 mt-4">
                    Consultoria estratégica gratuita
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
