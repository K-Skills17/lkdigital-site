// lib/backbone/models.ts
// Single source of truth for which AI provider and models LK Digital uses.
// Every AI call in this repo (tools, blog engine) picks a tier here instead of
// hard-coding a model string.
//
//   AI_PROVIDER        anthropic (default) | openai — which one to try first.
//                      The other is used automatically as a fallback when its
//                      API key is set.
//   AI_MODEL_FAST / AI_MODEL_SMART          override the Claude models
//   OPENAI_MODEL_FAST / OPENAI_MODEL_SMART  override the OpenAI models
//
// Kept dependency-free so scripts/ (run with tsx) can import it directly.

export type ModelTier = "fast" | "smart";
export type AiProvider = "anthropic" | "openai";

const DEFAULTS: Record<AiProvider, Record<ModelTier, string>> = {
  anthropic: {
    // Short, cheap generations: WhatsApp action plans, lead summaries.
    fast: "claude-haiku-4-5-20251001",
    // Long-form generation: blog posts, full reports.
    smart: "claude-sonnet-4-6",
  },
  openai: {
    fast: "gpt-5.4-mini",
    smart: "gpt-5.5",
  },
};

const OVERRIDE_VARS: Record<AiProvider, Record<ModelTier, string>> = {
  anthropic: { fast: "AI_MODEL_FAST", smart: "AI_MODEL_SMART" },
  openai: { fast: "OPENAI_MODEL_FAST", smart: "OPENAI_MODEL_SMART" },
};

const KEY_VARS: Record<AiProvider, string> = {
  anthropic: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY",
};

/**
 * USD per million tokens [input, output] — used only for the dashboard's cost
 * estimate. Models missing here show as "not estimated" rather than $0; add a
 * row when you switch to a model that isn't listed.
 */
export const MODEL_PRICING: Record<string, [number, number]> = {
  "claude-haiku-4-5-20251001": [1, 5],
  "claude-haiku-4-5": [1, 5],
  "claude-sonnet-4-20250514": [3, 15],
  "claude-sonnet-4-6": [3, 15],
  "claude-sonnet-5-5": [2, 10],
  "claude-opus-5-5": [4, 20],
};

export function modelFor(tier: ModelTier, provider: AiProvider = "anthropic"): string {
  const override = process.env[OVERRIDE_VARS[provider][tier]];
  return override?.trim() || DEFAULTS[provider][tier];
}

export function hasKey(provider: AiProvider): boolean {
  return !!process.env[KEY_VARS[provider]]?.trim();
}

/** Providers to try, in order: AI_PROVIDER first, then the other — only those with a key. */
export function providerOrder(): AiProvider[] {
  const primary: AiProvider = process.env.AI_PROVIDER?.trim().toLowerCase() === "openai" ? "openai" : "anthropic";
  const secondary: AiProvider = primary === "openai" ? "anthropic" : "openai";
  return [primary, secondary].filter(hasKey);
}
