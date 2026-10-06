// lib/backbone/ai.ts
// One Claude client for the whole site. Every call is logged to `ai_calls`
// so the /painel dashboard can show usage per tool and per model.

import Anthropic from "@anthropic-ai/sdk";
import { modelFor, type ModelTier } from "./models";
import { logAiCall } from "./store";

let _client: Anthropic | null = null;

function client(): Anthropic | null {
  if (_client) return _client;
  if (!process.env.ANTHROPIC_API_KEY) return null;
  _client = new Anthropic();
  return _client;
}

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

/** Returns the generated text, or null if AI is unconfigured or the call fails. */
export async function generateText(opts: GenerateOptions): Promise<string | null> {
  const anthropic = client();
  if (!anthropic) {
    console.warn(`[backbone/ai] ANTHROPIC_API_KEY not set — skipping ${opts.source}`);
    return null;
  }

  const model = modelFor(opts.tier);
  const started = Date.now();

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: opts.maxTokens ?? 1024,
      ...(opts.system ? { system: opts.system } : {}),
      messages: [{ role: "user", content: opts.prompt }],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    await logAiCall({
      source: opts.source,
      lead_id: opts.leadId ?? null,
      model,
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
      latency_ms: Date.now() - started,
      ok: true,
      error: null,
    });

    return text || null;
  } catch (err) {
    console.error(`[backbone/ai] ${opts.source} failed:`, err);
    await logAiCall({
      source: opts.source,
      lead_id: opts.leadId ?? null,
      model,
      input_tokens: 0,
      output_tokens: 0,
      latency_ms: Date.now() - started,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}
