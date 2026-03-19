"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Logo variant="compact" color="white" />
          </Link>

          {/* Desktop Nav */}
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

          {/* Desktop CTA */}
          <Link
            href="/contato"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg hover:shadow-accent/20"
          >
            Diagnóstico Gratuito
          </Link>

          {/* Mobile Hamburger */}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#0f0f0f] flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.1 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-display text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/contato"
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex px-8 py-3 bg-accent text-white rounded-md font-medium"
              >
                Diagnóstico Gratuito
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
