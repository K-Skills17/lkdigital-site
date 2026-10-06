// Logic of the lead magnets: calculator math (spec acceptance values) and RAIO-X scoring.
// The same modules run in the browser and in the backbone adapters.
import { describe, expect, it } from "vitest";
import * as C from "./calculadora-cac/calc";
import * as RX from "./raio-x/raiox";
import demo from "./shared/demo-clinic.json";
import checklist from "./checklist-google/content.json";
import { itemCount } from "./checklist-google/render.mjs";
import scripts from "./scripts-whatsapp/content.json";
import { allScripts, markdown } from "./scripts-whatsapp/render.mjs";

const near = (a: number | null, b: number, t = 0.005) => typeof a === "number" && Math.abs(a - b) <= Math.max(t, b * 0.001);

describe("calculadora de CAC", () => {
  const m = demo.mes_base;
  const base = {
    invest: m.investimento_anuncios, fixos: m.custos_fixos_marketing, leads: m.leads, qual: m.qualificados,
    agend: m.agendados, comp: m.compareceram, fech: m.fechados,
    procs: demo.procedimentos.map((p) => ({ nome: p.nome, fech: p.fechamentos, ticket: p.ticket_medio, margem: 40 })),
  };
  const r = C.compute(base);

  it.each([
    ["CPL", "cpl", 10], ["custo por qualificado", "custoQual", 25], ["custo por agendamento", "custoAgend", 66.67],
    ["custo por comparecimento", "custoComp", 100], ["CAC só anúncios", "cacAds", 300], ["CAC real", "cacReal", 500],
    ["lead → fechamento", "convTotal", 0.0333], ["1 em cada X", "umEmCada", 30], ["receita", "receita", 46750],
    ["lucro bruto", "lucro", 18700], ["ROI", "roi", 2.74], ["ROAS", "roas", 15.58],
  ])("%s = %s", (_name, key, want) => {
    expect(near((r as unknown as Record<string, number | null>)[key as string], want as number)).toBe(true);
  });

  it("CAC by procedure is allocated by closes; Clínica geral loses R$ 1.800 after CAC", () => {
    expect(r.procs.every((p: { cac: number | null }) => near(p.cac, 500))).toBe(true);
    expect(near(r.procs[2].lucroAposCac, -1800)).toBe(true);
  });
  it("LTV 2.080 and LTV:CAC 4,16", () => {
    const l = C.compute({ ...base, volta: 50, retorno: 350, anos: 3 });
    expect(near(l.ltv, 2080) && near(l.ltvCac, 4.16)).toBe(true);
  });
  it("biggest lever and the +20% ads comparison", () => {
    expect(r.maiorAlavanca).toBe("fechamento");
    expect(near(r.maisAnuncios.cac, 466.67)).toBe(true);
  });
  it("secretary cost enters CAC real", () => {
    expect(near(C.compute({ ...base, salario: 3000, pctSec: 50 }).cacReal, 650)).toBe(true);
  });
  it("guards every division and warns on a non-monotonic funnel", () => {
    const z = C.compute({ procs: [] });
    expect([z.cpl, z.cacAds, z.cacReal, z.roi, z.roas, z.ltv, z.umEmCada].every((v) => v === null)).toBe(true);
    expect(C.compute({ ...base, comp: 50, fech: 60 }).avisos.length).toBeGreaterThan(0);
  });
});

describe("RAIO-X scoring", () => {
  const all = (v: number) => Array(12).fill(v);
  it("all 3s → 100 Sistema instalado; all 0s → 0 Vazamento crítico, Resposta weakest", () => {
    expect(RX.score(all(3))).toMatchObject({ total: 100, band: { label: "Sistema instalado" } });
    expect(RX.score(all(0))).toMatchObject({ total: 0, band: { label: "Vazamento crítico" }, weakest: "resposta" });
  });
  it("mixed case: 42 Sistema parcial, area % = points / 6, funnel tie-break", () => {
    const mix = RX.score([3, 3, 1, 0, 3, 1, 2, 0, 1, 0, 1, 0]);
    expect(mix).toMatchObject({ total: 42, weakest: "resposta", areas: { resposta: 17, visibilidade: 100 } });
    expect(RX.score([0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3]).weakest).toBe("visibilidade");
  });
  it("band edges and segments", () => {
    expect([40, 41, 70, 71].map((t) => RX.band(t).label)).toEqual(["Vazamento crítico", "Sistema parcial", "Sistema parcial", "Sistema instalado"]);
    expect(RX.segment({ especialidade: "Implantes/Prótese", particular: "Mais de 80%" }, 50)).toBe("oferta");
    expect(RX.segment({ especialidade: "Ortodontia", particular: "Mais de 80%" }, 50)).toBe("nutrir");
    expect(RX.segment({ especialidade: "Implantes/Prótese", particular: "30–50%" }, 50)).toBe("nutrir");
    expect(RX.segment({ especialidade: "Implantes/Prótese", particular: "50–80%" }, 71)).toBe("nutrir");
  });
  it("6 areas × 3 diagnoses + 2 actions, and each nutrir asset is a lead-magnet page", () => {
    expect(RX.AREAS).toHaveLength(6);
    expect(RX.AREAS.every((a) => a.diagnosticos.length === 3 && a.acoes.length === 2)).toBe(true);
    const pages = ["checklist-google", "scripts-whatsapp", "calculadora-cac", "dashboard-clinica"];
    expect(RX.AREAS.every((a) => pages.includes(a.asset))).toBe(true);
  });
});

describe("checklist content", () => {
  it("27 items in 9 sections, each with por quê and como", () => {
    expect(checklist.secoes).toHaveLength(9);
    expect(itemCount(checklist)).toBe(27);
    expect(checklist.secoes.flatMap((s) => s.itens).every((i) => i.por && i.como)).toBe(true);
  });
});

describe("scripts de WhatsApp", () => {
  const all = allScripts(scripts);
  it("short scripts: ≤ 3 lines (audio scripts excepted) and ≤ 1 emoji", () => {
    for (const sc of all) {
      if (!sc.audio) expect(sc.texto.split("\n").length, sc.texto).toBeLessThanOrEqual(3);
      expect((sc.texto.match(new RegExp("\\p{Extended_Pictographic}", "gu")) || []).length, sc.texto).toBeLessThanOrEqual(1);
    }
  });
  it("no prices, discounts or guarantees, in the scripts or the .md", () => {
    const text = all.map((s) => s.texto).join("\n") + markdown(scripts);
    expect(text).not.toMatch(/R\$|a partir de|desconto|garantia/i);
  });
});
