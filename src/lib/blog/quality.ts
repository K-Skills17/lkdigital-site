// lib/blog/quality.ts
// The pre-publish checklist editors see in /painel/blog. Rules come from the
// retired blog engine, which silently rewrote content; here they are shown to
// a human instead. Errors block publishing (only for things that are never
// acceptable); warnings need an editor's judgment.

import { BANNED_PHRASES, BANNED_SOURCES } from "./editorial";
import type { PostInput } from "./types";

export type CheckLevel = "error" | "warning";

export interface Check {
  level: CheckLevel;
  code: string;
  message: string;
}

export function textOf(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function wordCount(html: string): number {
  const t = textOf(html);
  return t ? t.split(" ").length : 0;
}

/** Minutes at 200 words/min, never below 1. */
export function readingTimeOf(html: string): number {
  return Math.max(1, Math.ceil(wordCount(html) / 200));
}

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function checkPost(p: PostInput): Check[] {
  const checks: Check[] = [];
  const err = (code: string, message: string) => checks.push({ level: "error", code, message });
  const warn = (code: string, message: string) => checks.push({ level: "warning", code, message });

  const text = textOf(p.content);
  const lower = text.toLowerCase();
  const words = wordCount(p.content);

  // ── Must-haves ──
  if (!p.title.trim()) err("title", "Falta o título.");
  if (!SLUG_RE.test(p.slug)) err("slug", "Slug inválido — use só letras minúsculas, números e hífens.");
  if (words < 300) err("content", `Conteúdo muito curto (${words} palavras).`);
  if (!p.excerpt.trim()) err("excerpt", "Falta o resumo (excerpt) — aparece na listagem e no topo do artigo.");
  if (/<h1[\s>]/i.test(p.content)) err("h1", "Remova o <h1> do corpo — o título do artigo já é o H1 da página.");

  // ── Integrity (from the engine's hard rules) ──
  for (const source of BANNED_SOURCES) {
    if (lower.includes(source.toLowerCase())) err("fake-source", `Fonte inventada: "${source}". Remova ou cite uma fonte real.`);
  }
  if (text.includes("340%")) err("340", 'O número "340%" é proibido (estatística inventada recorrente).');

  // ── CFO compliance ──
  if (/(antes e depois|antes\/depois|before\/after)/i.test(text) && !/(cfo|conselho federal)/i.test(text)) {
    warn("cfo-before-after", "Menciona antes/depois sem citar as restrições do CFO.");
  }
  const promises: Array<[RegExp, string]> = [
    [/garant(imos|e|ir) (o )?resultado/i, "promessa de resultado"],
    [/resultado garantido/i, "resultado garantido"],
    [/100% (de )?sucesso/i, "100% de sucesso"],
    [/cura garantida/i, "cura garantida"],
    [/sem (nenhum )?risco clínico/i, "sem risco clínico"],
  ];
  // A warning, not a blocker: articles that teach the CFO rules quote these
  // very phrases ("é proibido dizer 'resultado garantido'"). A human decides.
  for (const [re, label] of promises) {
    if (re.test(text)) {
      warn("cfo-promise", `Confira o CFO: o texto contém "${label}". Tudo bem se estiver explicando o que é proibido; não pode prometer resultado clínico.`);
    }
  }
  if (/a partir de R\$[^.]*procedimento/i.test(text) && !/verificar/i.test(text)) {
    warn("cfo-price", "Preço de procedimento clínico sem nota de verificação.");
  }

  // ── Writing quality ──
  const found = BANNED_PHRASES.filter((ph) => lower.includes(ph.toLowerCase()));
  if (found.length) warn("ai-phrases", `Frases com cara de IA: ${found.map((f) => `"${f}"`).join(", ")}.`);

  const h2 = (p.content.match(/<h2[\s>]/gi) || []).length;
  if (words >= 600 && h2 < 3) warn("h2-few", `Só ${h2} subtítulos H2 — 4 a 7 deixam o texto escaneável.`);
  if (h2 > 10) warn("h2-many", `${h2} subtítulos H2 — mais de 10 fragmenta demais.`);

  const stats = text.match(/\d+([.,]\d+)?%|R\$\s?[\d.,]+/g) || [];
  if (stats.length && !/(segundo|de acordo|pesquisa|estudo|dados|fonte|relatório|levantamento|ibge|cfo|cro|google|brightlocal)/i.test(text)) {
    warn("stats-source", `${stats.length} número(s) sem nenhuma fonte citada no texto.`);
  }

  const kw = p.keywords[0]?.trim().toLowerCase();
  if (kw) {
    const n = lower.split(kw).length - 1;
    if (n > 4) warn("keyword-stuffing", `Palavra-chave "${kw}" aparece ${n} vezes (máx. 4).`);
    if (n === 0) warn("keyword-missing", `Palavra-chave "${kw}" não aparece no texto.`);
  } else {
    warn("keyword", "Defina a palavra-chave principal (primeira em Palavras-chave).");
  }

  if (!p.category.trim()) warn("category", "Escolha uma categoria (aparece no artigo e agrupa os relacionados).");

  // ── SEO fields ──
  const seoTitle = p.seoTitle.trim() || p.title.trim();
  if (seoTitle.length > 48) warn("seo-title", `Título SEO com ${seoTitle.length} caracteres — acima de 48 o Google corta "| LK Digital".`);
  const d = p.seoDescription.trim().length;
  if (!d) warn("seo-description", "Falta a descrição SEO.");
  else if (d < 130 || d > 170) warn("seo-description", `Descrição SEO com ${d} caracteres (ideal 130–170).`);
  if (p.faqItems.filter((f) => f.question.trim() && f.answer.trim()).length < 3) {
    warn("faq", "Menos de 3 perguntas no FAQ — o FAQ ajuda a aparecer em respostas do Google e de IAs.");
  }

  return checks;
}

export const hasBlockingIssues = (checks: Check[]) => checks.some((c) => c.level === "error");
