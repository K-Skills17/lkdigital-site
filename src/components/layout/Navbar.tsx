"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { href: "/sobre", label: "Sobre" },
  { href: "/solucoes", label: "Soluções" },
  { href: "/segmentos", label: "Segmentos" },
  { href: "/casos", label: "Casos" },
  { href: "/insights", label: "Insights" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolledRef = useRef(false);

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
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/10"
            : "bg-[#0f0f0f]/80 backdrop-blur-md"
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

          <Link
            href="/contato"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg hover:shadow-accent/20"
          >
            Diagnóstico Gratuito
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-1.5"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
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
        </nav>
      </header>

      {/* Mobile Menu — CSS animations only, no Framer Motion */}
      <div
        className={`fixed inset-0 z-40 bg-[#0f0f0f] flex flex-col items-center justify-center gap-8 transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {navLinks.map((link, i) => (
          <div
            key={link.href}
            className={`transition-all duration-300 ${
              mobileOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: mobileOpen ? `${i * 50 + 100}ms` : "0ms" }}
          >
            <Link
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-display text-white/80 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </div>
        ))}
        <div
          className={`transition-all duration-300 ${
            mobileOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: mobileOpen ? "400ms" : "0ms" }}
        >
          <Link
            href="/contato"
            onClick={() => setMobileOpen(false)}
            className="mt-4 inline-flex px-8 py-3 bg-accent text-white rounded-md font-medium"
          >
            Diagnóstico Gratuito
          </Link>
        </div>
      </div>
    </>
  );
}
