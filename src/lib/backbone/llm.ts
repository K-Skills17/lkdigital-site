// lib/backbone/llm.ts
// Provider-neutral text generation: Claude (Anthropic) or OpenAI, chosen by
// AI_PROVIDER, with the other provider as automatic fallback when its key is
// set. Used by the tools (via ai.ts, which adds logging) and by the blog
// engine in scripts/ — so it only uses relative imports.

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { modelFor, providerOrder, type AiProvider, type ModelTier } from "./models";

export interface CompleteOptions {
  tier: ModelTier;
  prompt: string;
  system?: string;
  maxTokens?: number;
}

export interface Attempt {
  provider: AiProvider;
  model: string;
  ok: boolean;
  text: string | null;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  error: string | null;
}

let _anthropic: Anthropic | null = null;
let _openai: OpenAI | null = null;

async function callAnthropic(model: string, opts: CompleteOptions) {
  _anthropic ??= new Anthropic();
  const res = await _anthropic.messages.create({
    model,
    max_tokens: opts.maxTokens ?? 1024,
    ...(opts.system ? { system: opts.system } : {}),
    messages: [{ role: "user", content: opts.prompt }],
  });
  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
  return { text, inputTokens: res.usage.input_tokens, outputTokens: res.usage.output_tokens };
}

async function callOpenAI(model: string, opts: CompleteOptions) {
  _openai ??= new OpenAI();
  const res = await _openai.responses.create({
    model,
    ...(opts.system ? { instructions: opts.system } : {}),
    input: opts.prompt,
    // GPT-5-family models spend part of this budget on hidden reasoning, so
    // leave headroom above the visible-text length the caller asked for.
    max_output_tokens: (opts.maxTokens ?? 1024) + 8000,
  });
  return {
    text: (res.output_text ?? "").trim(),
    inputTokens: res.usage?.input_tokens ?? 0,
    outputTokens: res.usage?.output_tokens ?? 0,
  };
}

const CALLERS: Record<AiProvider, typeof callAnthropic> = {
  anthropic: callAnthropic,
  openai: callOpenAI,
};

/**
 * Try each configured provider in order until one returns text. Returns every
 * attempt (for logging) plus the first successful text, or text=null when no
 * provider is configured or all of them failed.
 */
export async function complete(opts: CompleteOptions): Promise<{ text: string | null; attempts: Attempt[] }> {
  const attempts: Attempt[] = [];
  for (const provider of providerOrder()) {
    const model = modelFor(opts.tier, provider);
    const started = Date.now();
    try {
      const r = await CALLERS[provider](model, opts);
      const ok = !!r.text;
      attempts.push({
        provider, model, ok, text: r.text || null,
        inputTokens: r.inputTokens, outputTokens: r.outputTokens, latencyMs: Date.now() - started,
        error: ok ? null : "empty response",
      });
      if (ok) return { text: r.text, attempts };
    } catch (err) {
      attempts.push({
        provider, model, ok: false, text: null, inputTokens: 0, outputTokens: 0,
        latencyMs: Date.now() - started, error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  return { text: null, attempts };
}
