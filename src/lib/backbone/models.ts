// lib/backbone/models.ts
// Single source of truth for which Claude models LK Digital uses.
// Every AI call in this repo (tools, blog engine, raio-x) picks a tier here
// instead of hard-coding a model string. Override per environment with
// AI_MODEL_FAST / AI_MODEL_SMART without touching code.
//
// Kept dependency-free so scripts/ (run with tsx) can import it directly.

export type ModelTier = "fast" | "smart";

const DEFAULTS: Record<ModelTier, string> = {
  // Short, cheap generations: WhatsApp action plans, lead summaries.
  fast: "claude-haiku-4-5-20251001",
  // Long-form generation: blog posts, full reports.
  smart: "claude-sonnet-4-6",
};

/** USD per million tokens [input, output] — used only for the dashboard's cost estimate. */
export const MODEL_PRICING: Record<string, [number, number]> = {
  "claude-haiku-4-5-20251001": [1, 5],
  "claude-haiku-4-5": [1, 5],
  "claude-sonnet-4-20250514": [3, 15],
  "claude-sonnet-4-6": [3, 15],
  "claude-sonnet-5-5": [2, 10],
  "claude-opus-5-5": [4, 20],
};

export function modelFor(tier: ModelTier): string {
  const override =
    tier === "fast" ? process.env.AI_MODEL_FAST : process.env.AI_MODEL_SMART;
  return override?.trim() || DEFAULTS[tier];
}
