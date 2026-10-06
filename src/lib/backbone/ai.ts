// lib/backbone/ai.ts
// The site's AI entry point. Generation goes through llm.ts (Claude or OpenAI,
// see models.ts); every attempt is logged to `ai_calls` so the /painel
// dashboard can show usage per tool, provider and model.

import { complete } from "./llm";
import type { ModelTier } from "./models";
import { logAiCall } from "./store";

export interface GenerateOptions {
  /** Which tool / feature is calling — recorded in ai_calls.source. */
  source: string;
  tier: ModelTier;
  prompt: string;
  system?: string;
  maxTokens?: number;
  /** Lead this generation belongs to, if any. */
  leadId?: string | null;
}

/** Returns the generated text, or null if no AI key is set or every provider failed. */
export async function generateText(opts: GenerateOptions): Promise<string | null> {
  const { text, attempts } = await complete(opts);

  if (attempts.length === 0) {
    console.warn(`[backbone/ai] no ANTHROPIC_API_KEY or OPENAI_API_KEY set — skipping ${opts.source}`);
    return null;
  }

  for (const a of attempts) {
    if (!a.ok) console.error(`[backbone/ai] ${opts.source} via ${a.provider}/${a.model} failed:`, a.error);
    await logAiCall({
      source: opts.source,
      lead_id: opts.leadId ?? null,
      model: a.model,
      input_tokens: a.inputTokens,
      output_tokens: a.outputTokens,
      latency_ms: a.latencyMs,
      ok: a.ok,
      error: a.error,
    });
  }

  return text;
}
