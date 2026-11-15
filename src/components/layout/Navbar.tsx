"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/primitives";
import Logo from "@/components/ui/Logo";


const defaultNavLinks = [
  { href: "/sobre", label: "Sobre" },
  { href: "/solucoes", label: "Soluções" },
  { href: "/segmentos", label: "Segmentos" },
  { href: "/cidades", label: "Cidades" },
  { href: "/blog", label: "Blog" },
  { href: "/ferramentas", label: "Ferramentas" },
  { href: "/faq", label: "FAQ" },
];

interface NavbarProps {
  links?: { href: string; label: string }[];
  ctaHref?: string;
  ctaLabel?: string;
}

export default function Navbar({
  links,
  ctaHref = "/contato",
  ctaLabel = "Diagnóstico Gratuito",
}: NavbarProps) {
  const navLinks = links || defaultNavLinks;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolledRef = useRef(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 60;
          if (isScrolled !== scrolledRef.current) {
            scrolledRef.current = isScrolled;
            setScrolled(isScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (!mobileOpen) return () => { document.body.style.overflow = ""; };
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b bg-hero-bg transition-colors duration-300 ${
          scrolled ? "border-white/15" : "border-transparent"
        }`}
      >
        <nav className="max-w-content mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center group">
            <Logo variant="compact" color="white" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href={ctaHref}
              className={buttonClass("primary", "dark", undefined, "compact")}
            >
              {ctaLabel}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative w-11 h-11 flex flex-col items-center justify-center gap-1.5"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
              aria-controls="menu-mobile"
            >
              <span
                className={`w-5 h-[1.5px] bg-white transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-[4.5px]" : ""
                }`}
              />
              <span
                className={`w-5 h-[1.5px] bg-white transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-[4.5px]" : ""
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu: ruled list on the brand black. Escape closes it; focus moves in on open. */}
      <div
        id="menu-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-0 z-40 flex flex-col bg-hero-bg px-6 pb-10 pt-24 transition-opacity duration-200 ${
          mobileOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        <ul className="border-t border-white/15">
          {navLinks.map((link, i) => (
            <li key={link.href} className="border-b border-white/15">
              <Link
                ref={i === 0 ? firstLinkRef : undefined}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-14 items-center justify-between font-display text-2xl text-white"
              >
                {link.label}
                <span aria-hidden="true" className="font-body text-sm text-accent">→</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={ctaHref} onClick={() => setMobileOpen(false)} className={buttonClass("primary", "dark", "mt-8 w-full")}>
          {ctaLabel}
        </Link>
      </div>
    </>
  );
}
