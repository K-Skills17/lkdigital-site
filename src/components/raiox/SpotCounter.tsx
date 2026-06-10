"use client";

import { useEffect, useState } from "react";

export default function SpotCounter() {
  const [remaining, setRemaining] = useState(50);

  useEffect(() => {
    fetch("/api/raiox/vagas")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.remaining === "number") setRemaining(d.remaining);
      })
      .catch(() => {});
  }, []);

  return (
    <span className="text-sm text-[#EDE8DF]/70">
      Turma Jun–Jul/2026 · <strong className="text-[#C4963A]">{remaining}</strong> de 50 vagas
      restantes
    </span>
  );
}
