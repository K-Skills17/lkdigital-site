// lib/raio-x/score.ts
// Pure, unit-testable scoring and routing functions.
// No side effects — safe to import in both API routes and tests.

import type { DomainKey, DualRouteStrategy, RaioXConfig } from "./config";

/** Resolved route after applying dualRouteStrategy */
export type Route = "lk" | "marcos" | "dual" | "optimize";

export interface DomainResult {
  /** Raw score 0.0–1.0 */
  score: number;
  /** Rounded percentage 0–100 */
  pct: number;
  /** true when score < domain.gapThreshold */
  gap: boolean;
  label: string;
}

export interface ScoringResult {
  visibilidade: DomainResult;
  operacao: DomainResult;
  /** Logical route before display strategy is applied */
  route: Route;
}

/**
 * domainScore(domain) = Σ(answer × weight) / Σ(maxValue × weight)
 * Returns a DomainResult for the given domain.
 */
export function computeDomainScore(
  domainKey: DomainKey,
  answers: Record<string, number>,
  config: RaioXConfig
): DomainResult {
  const domain = config.domains[domainKey];
  const domainQs = config.questions.filter((q) => q.domain === domainKey);
  const maxValue = config.scale[config.scale.length - 1].value; // 3

  const numerator = domainQs.reduce((sum, q) => sum + (answers[q.id] ?? 0) * q.weight, 0);
  const denominator = domainQs.reduce((sum, q) => sum + maxValue * q.weight, 0);

  const score = denominator > 0 ? numerator / denominator : 0;

  return {
    score,
    pct: Math.round(score * 100),
    gap: score < domain.gapThreshold,
    label: domain.label,
  };
}

/**
 * Routing matrix:
 *   vis gap  + op healthy → "lk"
 *   vis healthy + op gap  → "marcos"
 *   vis healthy + op healthy → "optimize" (→ LK with optimize copy)
 *   vis gap  + op gap     → "dual" (display resolved by dualRouteStrategy on results page)
 */
export function computeRoute(vis: DomainResult, op: DomainResult): Route {
  if (vis.gap && !op.gap) return "lk";
  if (!vis.gap && op.gap) return "marcos";
  if (!vis.gap && !op.gap) return "optimize";
  return "dual";
}

/**
 * Resolves "dual" into a concrete CTA target based on dualRouteStrategy.
 * Used on the results page to pick which CTA(s) to show.
 */
export function resolveDualRoute(
  vis: DomainResult,
  op: DomainResult,
  strategy: DualRouteStrategy
): "lk" | "marcos" | "both" {
  if (strategy === "show-both") return "both";
  if (strategy === "severity-weighted") {
    return vis.score <= op.score ? "lk" : "marcos";
  }
  // lk-primary (default)
  return "lk";
}

/** Convenience: compute both domain scores and route in one call. */
export function computeScores(
  answers: Record<string, number>,
  config: RaioXConfig
): ScoringResult {
  const visibilidade = computeDomainScore("visibilidade", answers, config);
  const operacao = computeDomainScore("operacao", answers, config);
  return { visibilidade, operacao, route: computeRoute(visibilidade, operacao) };
}
