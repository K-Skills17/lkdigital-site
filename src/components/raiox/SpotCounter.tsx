"use client";

import { useEffect, useState } from "react";

export default function SpotCounter({ variant = "hero" }: { variant?: "hero" | "sticky" }) {
  const [remaining, setRemaining] = useState(50);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/raiox/vagas")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.remaining === "number") {
          setRemaining(d.remaining);
          setLoaded(true);
        }
      })
      .catch(() => {});
  }, []);

  if (variant === "sticky") {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-sm border-t border-[#C4963A]/20 px-4 py-3 md:hidden">
        <div className="flex items-center justify-between max-w-2xl mx-auto gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[#C4963A] font-display text-xl font-bold leading-none">
              {remaining}
            </span>
            <span className="text-[#EDE8DF]/60 text-xs font-body">de 50 vagas</span>
          </div>
          <a
            href="#form"
            className="flex-shrink-0 bg-[#C4963A] text-[#111111] font-semibold px-4 py-2.5 text-sm rounded font-body whitespace-nowrap"
          >
            Solicitar Raio-X
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center gap-1 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-60"}`}>
      <div className="flex items-baseline gap-2">
        <span className="text-[#C4963A] font-display text-4xl md:text-5xl font-bold leading-none">
          {remaining}
        </span>
        <span className="text-[#EDE8DF]/70 text-sm font-body">de 50 vagas restantes</span>
      </div>
      <span className="text-[#EDE8DF]/40 text-xs font-body">Turma Jun–Jul/2026</span>
    </div>
  );
}
