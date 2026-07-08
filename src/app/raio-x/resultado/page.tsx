"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { raioXConfig } from "@/lib/raio-x/config";
import { resolveDualRoute } from "@/lib/raio-x/score";
import { SS_RESULT_KEY } from "@/components/raio-x/ScorecardFunnel";
import type { Route } from "@/lib/raio-x/score";

interface DomainScore { pct: number; gap: boolean; }
interface StoredResult {
  id: string;
  route: Route;
  domainScores: { visibilidade: DomainScore; operacao: DomainScore };
}

function DomainBar({ label, pct, gap }: { label: string; pct: number; gap: boolean }) {
  const color = gap ? "#C4963A" : "#4ade80";
  const statusText = gap ? "Oportunidade identificada" : "Em nÃ­vel saudÃ¡vel";
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1 text-sm">
        <span className="text-[#EDE8DF] font-medium">{label}</span>
        <span style={{ color }} className="font-semibold">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-[#2a2a2a] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className="mt-1 text-xs" style={{ color }}>{statusText}</p>
    </div>
  );
}

function LkCta({ label = "Falar com a LK Digital" }: { label?: string }) {
  const { lkBookingUrl } = raioXConfig.routing;
  function handleClick() {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "raio_x_cta_click", { cta: "lk" });
    }
  }
  return (
    <a href={lkBookingUrl} target="_blank" rel="noopener noreferrer" onClick={handleClick}
      className="inline-block w-full text-center py-4 px-6 rounded-lg font-semibold text-[#111111] transition-opacity hover:opacity-90"
      style={{ backgroundColor: "#C4963A" }}>
      {label}
    </a>
  );
}

function MarcosCta({ label = "Falar com a Biodonte" }: { label?: string }) {
  const { marcosBookingUrl, marcosWaNumber } = raioXConfig.routing;
  const href = marcosBookingUrl ?? `https://wa.me/${marcosWaNumber}`;
  function handleClick() {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "raio_x_cta_click", { cta: "marcos" });
    }
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={handleClick}
      className="inline-block w-full text-center py-4 px-6 rounded-lg font-semibold text-[#EDE8DF] border border-[#C4963A] transition-opacity hover:opacity-90">
      {label}
    </a>
  );
}

// --- CFO-271 compliant copy blocks ---
const COPY: Record<string, { headline: string; body: string }> = {
  lk: {
    headline: "Seu maior potencial está na visibilidade",
    body: "A análise aponta oportunidades de melhoria em Visibilidade & Aquisição. Nossa equipe pode apresentar um plano de ações para fortalecer a presença digital da sua clínica.",
  },
  marcos: {
    headline: "Seu maior potencial está na conversão",
    body: "A análise aponta oportunidades de melhoria em Conversão & Operação. A equipe da Biodonte pode apresentar um plano de ações para elevar a eficiência operacional da sua clínica.",
  },
  both: {
    headline: "Oportunidades identificadas em duas áreas",
    body: "A análise identificou oportunidades tanto em Visibilidade & Aquisição quanto em Conversão & Operação. Abaixo, você encontra um contato especializado para cada frente.",
  },
  optimize: {
    headline: "Sua clínica está bem posicionada",
    body: "A análise não identificou lacunas críticas nos dois domínios avaliados. Se quiser explorar um diagnóstico mais aprofundado, nossa equipe está à disposição.",
  },
};

// --- Page ---
export default function ResultadoPage() {
  const router = useRouter();
  const [result, setResult] = useState<StoredResult | null>(null);
  const [display, setDisplay] = useState<"lk" | "marcos" | "both" | "optimize" | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(SS_RESULT_KEY);
    if (!raw) {
      router.replace("/raio-x");
      return;
    }
    try {
      const parsed: StoredResult = JSON.parse(raw);
      setResult(parsed);

      const route = parsed.route;
      let disp: "lk" | "marcos" | "both" | "optimize";
      if (route === "dual") {
        const resolved = resolveDualRoute(
          { score: parsed.domainScores.visibilidade.pct, pct: parsed.domainScores.visibilidade.pct, gap: parsed.domainScores.visibilidade.gap, label: "" },
          { score: parsed.domainScores.operacao.pct, pct: parsed.domainScores.operacao.pct, gap: parsed.domainScores.operacao.gap, label: "" },
          raioXConfig.routing.dualRouteStrategy
        );
        disp = resolved;
      } else if (route === "optimize") {
        disp = "optimize";
      } else {
        disp = route as "lk" | "marcos";
      }
      setDisplay(disp);

      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "raio_x_results_view", {
          route,
          display: disp,
          vis_pct: parsed.domainScores.visibilidade.pct,
          op_pct: parsed.domainScores.operacao.pct,
        });
      }
    } catch {
      router.replace("/raio-x");
    }
  }, [router]);

  if (!result || !display) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C4963A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const copy = COPY[display];
  const { visibilidade, operacao } = result.domainScores;

  return (
    <main className="min-h-screen bg-[#111111] text-[#EDE8DF] py-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#C4963A] text-sm font-medium uppercase tracking-widest mb-3">
            Método Clínica Unicórnio&#x2122;
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight mb-4">
            {copy.headline}
          </h1>
          <p className="text-[#6E6A63] leading-relaxed">{copy.body}</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-6 mb-8 border border-[#2a2a2a]">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6E6A63] mb-4">
            Seu diagnóstico
          </h2>
          <DomainBar
            label="Visibilidade & Aquisição"
            pct={visibilidade.pct}
            gap={visibilidade.gap}
          />
          <DomainBar
            label="Conversão & Operação"
            pct={operacao.pct}
            gap={operacao.gap}
          />
        </div>

        <div className="space-y-4">
          {(display === "lk" || display === "optimize") && (
            <LkCta label={display === "optimize" ? "Conversar com a LK Digital" : "Quero melhorar minha visibilidade"} />
          )}
          {display === "marcos" && (
            <MarcosCta label="Quero melhorar minha conversão" />
          )}
          {display === "both" && (
            <>
              <LkCta label="Quero melhorar minha visibilidade" />
              <MarcosCta label="Quero melhorar minha conversão" />
            </>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-[#6E6A63]">
          Este diagnóstico Ã© baseado nas suas respostas e nÃ£o constitui garantia de resultados.{" "}
          <Link href="/raio-x/privacidade" className="underline hover:text-[#C4963A]">
            PolÃ­tica de Privacidade
          </Link>
        </p>
      </div>
    </main>
  );
}
