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

  const filled = 50 - remaining;
  const pct = (filled / 50) * 100;

  if (variant === "sticky") {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-sm border-t border-[#C4963A]/20 px-4 py-3 md:hidden">
        <div className="flex items-center justify-between max-w-2xl mx-auto gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-[#C4963A] font-display text-xl font-bold leading-none">
                {remaining}
              </span>
              <span className="text-[#EDE8DF]/60 text-xs font-body">vagas restantes</span>
            </div>
            <div className="w-full h-1 bg-[#111111] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C4963A] rounded-full transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
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
    <div className={`inline-flex flex-col items-center gap-2 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-60"}`}>
      <div className="flex items-baseline gap-2">
        <span className="text-[#C4963A] font-display text-4xl md:text-5xl font-bold leading-none">
          {remaining}
        </span>
        <span className="text-[#EDE8DF]/70 text-sm font-body">de 50 vagas restantes</span>
      </div>
      <div className="w-48 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#C4963A] rounded-full transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[#EDE8DF]/40 text-xs font-body">Turma Jun–Jul/2026</span>
    </div>
  );
}
