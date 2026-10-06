// lib/blog/ai-draft.ts
// "Gerar rascunho com IA" in /painel/blog. Produces a DRAFT only — a human
// edits it, works through the quality checklist and confirms review before it
// can be published. Prompt rules carried over from the retired blog engine.

import { complete } from "@/lib/backbone/llm";
import { logAiCall } from "@/lib/backbone/store";
import { BANNED_PHRASES, BANNED_SOURCES, DENTIST_PROBLEMS_CONTEXT, FRAMEWORK_CONTEXTS, PERSUASION_PRINCIPLES } from "./editorial";
import { slugify } from "./quality";
import { ValidationError } from "./store";
import type { FaqItem } from "./types";

export interface DraftRequest {
  topic: string;
  keyword: string;
  category: string;
  /** Optional outline / angle / notes from the editor. */
  notes?: string;
  /** Key of FRAMEWORK_CONTEXTS to apply, if any. */
  framework?: string;
  /** Recently published slugs the draft may link to. */
  linkableSlugs?: string[];
}

export interface DraftResult {
  title: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  content: string;
  tags: string[];
  keywords: string[];
  tldr: string;
  faqItems: FaqItem[];
  model: string;
}

const YEAR = new Date().getFullYear();

export function buildSystemPrompt(): string {
  return `You are the senior content strategist at LK Digital, a dental marketing agency in Brazil specialized EXCLUSIVELY in odontologia. You write in Portuguese (pt-BR). A human editor will review and edit your draft before it is published.

VOICE & TONE:
- Authoritative: you know this market deeply
- Empathetic: you understand dentists' struggles and fears
- Practical: every section must have actionable takeaways
- Direct: lead with the answer, not the buildup
- Professional but warm: not academic, not casual

═══ CRITICAL CONTENT RULES ═══

1. NEVER FABRICATE STATISTICS OR SOURCES.
   - Do NOT invent percentages, studies, or organizations.
   - NEVER use these fake sources: ${BANNED_SOURCES.join("; ")}.
   - If you don't have a real stat, use reasoning, practical experience or qualitative arguments.
   - When you do cite a number, name the real source next to it, so the editor can verify it.

2. REAL SOURCES ONLY — sparingly (max 3-5 per article): Google, BrightLocal, CFO/CRO (cite resolution numbers), IBGE/Datasus, or framed as observation ("Na nossa experiência com consultórios...").

3. NEVER USE "340%" for anything.

4. NO FICTIONAL TESTIMONIALS with names and cities. Use anonymized examples ("Um implantodontista em capital do Sudeste...") or hypotheticals ("Imagine um consultório que...").

5. KEYWORD: primary keyword in the title and first paragraph, MAX 2-3 times in the whole article.

6. NO AI PATTERNS. Never use: ${BANNED_PHRASES.join(", ")}.

7. CFO COMPLIANCE: never suggest before/after photos without noting CFO restrictions; never promise clinical results.

8. VARY THE STRUCTURE: mix narrative, step-by-step, checklists/frameworks and practical templates (scripts, messages). Avoid "bold claim + percentage + bullet list" in every section.

SEO + AEO: each section starts with a direct answer an AI could quote; tables only where they genuinely help.

HTML: semantic tags only — <h2>, <h3>, <p>, <ul>, <ol>, <li>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <blockquote>, <strong>, <em>, <a href>. NO <h1>, no inline styles, no classes. Paragraphs of 2-3 sentences. 4-7 <h2> headings.

CURRENT YEAR: ${YEAR}

${PERSUASION_PRINCIPLES}

OUTPUT: Return ONLY valid JSON (no markdown fences) with exactly this structure:
{
  "title": "string",
  "seoTitle": "string (40-48 chars, keyword first)",
  "seoDescription": "string (140-160 chars, keyword + value + CTA)",
  "excerpt": "string (2-3 sentences, compelling, no invented statistics)",
  "content": "string (full HTML, 1800-3000 words)",
  "tags": ["string", ...],
  "keywords": ["primary keyword", "secondary 1", "secondary 2"],
  "tldr": "string (2-3 key takeaways in one paragraph)",
  "faqItems": [{"question": "string", "answer": "string"}, ...5 items]
}`;
}

export function buildUserPrompt(req: DraftRequest): string {
  let prompt = `Write a blog article draft:

TOPIC: ${req.topic}
PRIMARY KEYWORD: ${req.keyword}
CATEGORY: ${req.category}`;
  if (req.notes?.trim()) prompt += `\n\nEDITOR'S NOTES / OUTLINE (follow these):\n${req.notes.trim()}`;
  prompt += `\n\nPROBLEM CONTEXT (write with empathy and precision):\n${DENTIST_PROBLEMS_CONTEXT}`;
  const fw = req.framework && FRAMEWORK_CONTEXTS[req.framework];
  if (fw) prompt += `\n\nFRAMEWORK CONTEXT (apply it to dentistry):\n${fw}`;
  if (req.linkableSlugs?.length) {
    prompt += `\n\nINTERNAL LINKS — link 2-3 of these naturally in the text (href="/blog/<slug>"):\n${req.linkableSlugs
      .slice(0, 15)
      .map((s) => `- /blog/${s}`)
      .join("\n")}`;
  }
  prompt += `\n\nAll text in Portuguese (pt-BR). Return ONLY the JSON object.`;
  return prompt;
}

/** Pull the JSON object out of a model reply (tolerates fences or stray text). */
export function parseDraftJson(raw: string): Record<string, unknown> {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("A IA não retornou JSON.");
  return JSON.parse(cleaned.slice(start, end + 1));
}

const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function generateDraft(req: DraftRequest): Promise<DraftResult> {
  const { text, attempts } = await complete({
    tier: "smart",
    system: buildSystemPrompt(),
    prompt: buildUserPrompt(req),
    maxTokens: 12000,
  });

  for (const a of attempts) {
    await logAiCall({
      source: "blog-draft",
      lead_id: null,
      model: a.model,
      input_tokens: a.inputTokens,
      output_tokens: a.outputTokens,
      latency_ms: a.latencyMs,
      ok: a.ok,
      error: a.error,
    });
  }
  // ValidationError = shown to the admin as-is (they need to know what to fix).
  if (attempts.length === 0) throw new ValidationError("Configure ANTHROPIC_API_KEY ou OPENAI_API_KEY para gerar rascunhos.");
  if (text === null) throw new ValidationError(`A IA falhou: ${attempts.map((a) => a.error).join(" | ")}. Tente de novo em instantes.`);

  let j: Record<string, unknown>;
  try {
    j = parseDraftJson(text);
  } catch {
    throw new ValidationError("A IA devolveu um rascunho em formato inválido. Tente gerar de novo.");
  }
  const title = str(j.title) || req.topic;
  const faqItems = (Array.isArray(j.faqItems) ? j.faqItems : [])
    .map((f) => ({ question: str((f as FaqItem)?.question), answer: str((f as FaqItem)?.answer) }))
    .filter((f) => f.question && f.answer);
  const keywords = strings(j.keywords);

  return {
    title,
    slug: slugify(title),
    seoTitle: str(j.seoTitle),
    seoDescription: str(j.seoDescription),
    excerpt: str(j.excerpt),
    content: str(j.content),
    tags: strings(j.tags),
    keywords: keywords.length ? keywords : [req.keyword],
    tldr: str(j.tldr),
    faqItems,
    model: attempts.find((a) => a.ok)?.model ?? "",
  };
}
