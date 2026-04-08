"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getEquivalentPath } from "@/lib/i18n/utils";
import type { Locale } from "@/lib/i18n/config";

const languages: { code: Locale; label: string; flag: string; short: string }[] = [
  { code: "pt", label: "Portugues", flag: "\u{1F1E7}\u{1F1F7}", short: "PT" },
  { code: "en", label: "English", flag: "\u{1F1EC}\u{1F1E7}", short: "EN" },
  { code: "fr", label: "Francais", flag: "\u{1F1EB}\u{1F1F7}", short: "FR" },
];

function getCurrentLocale(pathname: string): Locale {
  if (pathname.startsWith("/en/") || pathname === "/en") return "en";
  if (pathname.startsWith("/fr/") || pathname === "/fr") return "fr";
  return "pt";
}

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const current = getCurrentLocale(pathname);
  const currentLang = languages.find((l) => l.code === current) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-white/70 hover:text-white border border-white/10 hover:border-white/20 rounded-md transition-all duration-200"
        aria-label="Change language"
        aria-expanded={open}
      >
        <span>{currentLang.flag}</span>
        <span>{currentLang.short}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-40 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl shadow-black/30 overflow-hidden z-50">
          {languages.map((lang) => {
            const href = getEquivalentPath(pathname, lang.code);
            const isActive = lang.code === current;
            return (
              <a
                key={lang.code}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors duration-150 ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
                {isActive && (
                  <svg
                    className="w-3.5 h-3.5 ml-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
