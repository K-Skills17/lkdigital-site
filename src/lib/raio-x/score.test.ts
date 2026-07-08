// lib/raio-x/score.test.ts
// Unit tests for RAIO-X scoring + routing pure functions.
//
// To run: npx vitest src/lib/raio-x/score.test.ts
// Setup:  npm install -D vitest
//         Add "test": "vitest" to package.json scripts

import { describe, it, expect } from "vitest";
import { computeDomainScore, computeRoute, resolveDualRoute, computeScores } from "./score";
import { raioXConfig } from "./config";
import type { DomainResult } from "./score";

// ── Helpers ─────────────────────────────────────────────────────────────────

function allAnswers(val: number): Record<string, number> {
  return Object.fromEntries(raioXConfig.questions.map((q) => [q.id, val]));
}

function domainAnswers(
  domain: "visibilidade" | "operacao",
  val: number
): Record<string, number> {
  return Object.fromEntries(
    raioXConfig.questions.filter((q) => q.domain === domain).map((q) => [q.id, val])
  );
}

const gap = (score = 0.4): DomainResult => ({ score, pct: Math.round(score * 100), gap: true, label: "test" });
const healthy = (score = 0.8): DomainResult => ({ score, pct: Math.round(score * 100), gap: false, label: "test" });

// ── computeDomainScore ───────────────────────────────────────────────────────

describe("computeDomainScore", () => {
  it("returns 0 when all answers are 0", () => {
    const r = computeDomainScore("visibilidade", allAnswers(0), raioXConfig);
    expect(r.score).toBe(0);
    expect(r.pct).toBe(0);
    expect(r.gap).toBe(true);
  });

  it("returns 1.0 when all answers are max (3)", () => {
    const r = computeDomainScore("visibilidade", allAnswers(3), raioXConfig);
    expect(r.score).toBe(1);
    expect(r.pct).toBe(100);
    expect(r.gap).toBe(false);
  });

  it("correctly detects gap below threshold (0.6)", () => {
    // 6 questions × max 3 = 18 max. Sum=10 → 10/18 ≈ 0.556 → gap
    const answers = { V1: 2, V2: 2, V3: 2, V4: 2, V5: 1, V6: 1, O1: 0, O2: 0, O3: 0, O4: 0, O5: 0, O6: 0 };
    const r = computeDomainScore("visibilidade", answers, raioXConfig);
    expect(r.gap).toBe(true);
    expect(r.score).toBeCloseTo(10 / 18, 5);
  });

  it("correctly detects no gap at or above threshold", () => {
    // Sum=11 → 11/18 ≈ 0.611 → no gap
    const answers = { V1: 2, V2: 2, V3: 2, V4: 2, V5: 2, V6: 1, O1: 0, O2: 0, O3: 0, O4: 0, O5: 0, O6: 0 };
    const r = computeDomainScore("visibilidade", answers, raioXConfig);
    expect(r.gap).toBe(false);
    expect(r.score).toBeCloseTo(11 / 18, 5);
  });

  it("only counts questions for the specified domain", () => {
    const answers = { ...domainAnswers("visibilidade", 0), ...domainAnswers("operacao", 3) };
    const vis = computeDomainScore("visibilidade", answers, raioXConfig);
    const op = computeDomainScore("operacao", answers, raioXConfig);
    expect(vis.score).toBe(0);
    expect(op.score).toBe(1);
  });
});

// ── computeRoute — 4 matrix cells ───────────────────────────────────────────

describe("computeRoute — routing matrix", () => {
  it("vis gap + op healthy → lk", () => {
    expect(computeRoute(gap(), healthy())).toBe("lk");
  });

  it("vis healthy + op gap → marcos", () => {
    expect(computeRoute(healthy(), gap())).toBe("marcos");
  });

  it("vis healthy + op healthy → optimize", () => {
    expect(computeRoute(healthy(), healthy())).toBe("optimize");
  });

  it("vis gap + op gap → dual", () => {
    expect(computeRoute(gap(), gap())).toBe("dual");
  });
});

// ── resolveDualRoute — 3 dualRouteStrategy modes ────────────────────────────

describe("resolveDualRoute — dualRouteStrategy modes", () => {
  it("lk-primary → lk", () => {
    expect(resolveDualRoute(gap(0.3), gap(0.4), "lk-primary")).toBe("lk");
  });

  it("show-both → both", () => {
    expect(resolveDualRoute(gap(0.3), gap(0.4), "show-both")).toBe("both");
  });

  it("severity-weighted → lk when vis score is lower", () => {
    expect(resolveDualRoute(gap(0.2), gap(0.4), "severity-weighted")).toBe("lk");
  });

  it("severity-weighted → marcos when op score is lower", () => {
    expect(resolveDualRoute(gap(0.4), gap(0.2), "severity-weighted")).toBe("marcos");
  });

  it("severity-weighted → lk on tie (vis ≤ op)", () => {
    expect(resolveDualRoute(gap(0.3), gap(0.3), "severity-weighted")).toBe("lk");
  });
});

// ── computeScores — end-to-end ───────────────────────────────────────────────

describe("computeScores — end-to-end", () => {
  it("all-zero → both gap → dual route", () => {
    const r = computeScores(allAnswers(0), raioXConfig);
    expect(r.visibilidade.gap).toBe(true);
    expect(r.operacao.gap).toBe(true);
    expect(r.route).toBe("dual");
  });

  it("all-max → no gap → optimize route", () => {
    const r = computeScores(allAnswers(3), raioXConfig);
    expect(r.visibilidade.gap).toBe(false);
    expect(r.operacao.gap).toBe(false);
    expect(r.route).toBe("optimize");
  });

  it("vis low + op high → lk route", () => {
    const answers = { ...domainAnswers("visibilidade", 0), ...domainAnswers("operacao", 3) };
    expect(computeScores(answers, raioXConfig).route).toBe("lk");
  });

  it("vis high + op low → marcos route", () => {
    const answers = { ...domainAnswers("visibilidade", 3), ...domainAnswers("operacao", 0) };
    expect(computeScores(answers, raioXConfig).route).toBe("marcos");
  });
});
