// Provider selection and fallback between Claude and OpenAI (both SDKs mocked).
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const anthropicCreate = vi.fn();
const openaiCreate = vi.fn();

vi.mock("@anthropic-ai/sdk", () => ({
  default: class {
    messages = { create: anthropicCreate };
  },
}));
vi.mock("openai", () => ({
  default: class {
    responses = { create: openaiCreate };
  },
}));

const { complete } = await import("./llm");
const { modelFor, providerOrder } = await import("./models");

beforeEach(() => {
  anthropicCreate.mockReset().mockResolvedValue({
    content: [{ type: "text", text: "plano claude" }],
    usage: { input_tokens: 10, output_tokens: 5 },
  });
  openaiCreate.mockReset().mockResolvedValue({ output_text: "plano gpt", usage: { input_tokens: 12, output_tokens: 7 } });
  vi.stubEnv("ANTHROPIC_API_KEY", "");
  vi.stubEnv("OPENAI_API_KEY", "");
  vi.stubEnv("AI_PROVIDER", "");
});
afterEach(() => vi.unstubAllEnvs());

describe("provider order", () => {
  it("is empty without keys", async () => {
    expect(providerOrder()).toEqual([]);
    expect(await complete({ tier: "fast", prompt: "x" })).toEqual({ text: null, attempts: [] });
  });

  it("defaults to Claude first, OpenAI as fallback", () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "a");
    vi.stubEnv("OPENAI_API_KEY", "o");
    expect(providerOrder()).toEqual(["anthropic", "openai"]);
  });

  it("puts OpenAI first with AI_PROVIDER=openai", () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "a");
    vi.stubEnv("OPENAI_API_KEY", "o");
    vi.stubEnv("AI_PROVIDER", "OpenAI");
    expect(providerOrder()).toEqual(["openai", "anthropic"]);
  });

  it("uses OpenAI alone when it's the only key", async () => {
    vi.stubEnv("OPENAI_API_KEY", "o");
    const r = await complete({ tier: "fast", prompt: "oi", system: "sys", maxTokens: 500 });
    expect(r.text).toBe("plano gpt");
    expect(anthropicCreate).not.toHaveBeenCalled();
    const req = openaiCreate.mock.calls[0][0];
    expect(req).toMatchObject({ model: modelFor("fast", "openai"), instructions: "sys", input: "oi" });
    expect(req.max_output_tokens).toBeGreaterThan(500);
    expect(r.attempts[0]).toMatchObject({ provider: "openai", ok: true, inputTokens: 12, outputTokens: 7 });
  });
});

describe("fallback", () => {
  it("falls back to the other provider when the first one errors", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "a");
    vi.stubEnv("OPENAI_API_KEY", "o");
    anthropicCreate.mockRejectedValue(new Error("overloaded"));
    const r = await complete({ tier: "smart", prompt: "x" });
    expect(r.text).toBe("plano gpt");
    expect(r.attempts.map((a) => [a.provider, a.ok, a.error])).toEqual([
      ["anthropic", false, "overloaded"],
      ["openai", true, null],
    ]);
  });

  it("treats an empty answer as a failure and tries the next provider", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "a");
    vi.stubEnv("OPENAI_API_KEY", "o");
    vi.stubEnv("AI_PROVIDER", "openai");
    openaiCreate.mockResolvedValue({ output_text: "", usage: { input_tokens: 3, output_tokens: 900 } });
    const r = await complete({ tier: "fast", prompt: "x" });
    expect(r.text).toBe("plano claude");
    expect(r.attempts[0]).toMatchObject({ provider: "openai", ok: false, error: "empty response" });
  });

  it("returns null with every error when all providers fail", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "a");
    vi.stubEnv("OPENAI_API_KEY", "o");
    anthropicCreate.mockRejectedValue(new Error("a down"));
    openaiCreate.mockRejectedValue(new Error("o down"));
    const r = await complete({ tier: "fast", prompt: "x" });
    expect(r.text).toBeNull();
    expect(r.attempts.map((a) => a.error)).toEqual(["a down", "o down"]);
  });
});

describe("model overrides", () => {
  it("OpenAI tiers have their own defaults and env overrides", () => {
    expect(modelFor("fast", "openai")).toBe("gpt-5.4-mini");
    expect(modelFor("smart", "openai")).toBe("gpt-5.5");
    vi.stubEnv("OPENAI_MODEL_SMART", "gpt-5.5-pro");
    expect(modelFor("smart", "openai")).toBe("gpt-5.5-pro");
    // Claude overrides don't leak into OpenAI and vice versa.
    vi.stubEnv("AI_MODEL_SMART", "claude-opus-5-5");
    expect(modelFor("smart", "anthropic")).toBe("claude-opus-5-5");
    expect(modelFor("smart", "openai")).toBe("gpt-5.5-pro");
  });
});
