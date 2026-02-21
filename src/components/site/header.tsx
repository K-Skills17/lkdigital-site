"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TopNotice } from "./top-notice";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Sobre", href: "/sobre" },
    { label: "Soluções", href: "/solucoes" },
    { label: "Segmentos", href: "/segmentos" },
    { label: "Casos", href: "/casos" },
    { label: "Insights", href: "/insights" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur shadow-sm shadow-accent/5 border-b border-border/40"
          : "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      }`}
    >
      <TopNotice />
      <nav className="container mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="relative group flex items-center gap-2"
          >
            <span className="text-xl font-semibold text-foreground tracking-tight">
              LK{" "}
              <span className="text-accent">Digital</span>
            </span>
            {/* Subtle underline animation */}
            <span
              className="absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-300 w-0 group-hover:w-full"
              aria-hidden="true"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group"
              >
                {item.label}
                <span
                  className="absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-300 w-0 group-hover:w-full"
                  aria-hidden="true"
                />
              </Link>
            ))}

            {/* Desktop CTA */}
            <Link
              href="/contato"
              className="text-xs uppercase tracking-widest font-medium border border-accent/50 text-accent hover:bg-accent hover:text-white px-5 py-2 transition-all duration-300"
            >
              Diagnose Gratuita
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button
                aria-label="Abrir menu"
                className="p-2 hover:bg-accent/5 rounded-sm transition-colors"
              >
                <Menu className="h-5 w-5 text-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  LK <span className="text-accent">Digital</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-foreground hover:text-accent transition-colors py-3 border-b border-border/40"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/contato"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-6 text-center text-xs uppercase tracking-widest font-medium bg-accent text-white hover:bg-accent-dark px-5 py-3 transition-colors"
                >
                  Diagnose Gratuita
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
