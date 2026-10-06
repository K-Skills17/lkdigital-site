// lib/backbone/types.ts
import type { ChatbotAuditData } from "./whatsapp";

/** Contact + headline fields every tool lead has, whatever the tool. */
export interface LeadCore {
  name: string;
  /** Raw phone as typed; the pipeline normalizes it. Empty when the tool doesn't require one. */
  phone: string;
  email: string | null;
  clinic: string | null;
  city: string | null;
  /** Tool's main number (0–100 score, R$ loss…), for sorting in the dashboard. */
  score: number | null;
  /** One-line summary shown in the dashboard and Telegram alert. */
  headline: string;
  reportUrl: string | null;
}

export type ParseResult<T> = { ok: true; lead: LeadCore; data: T } | { ok: false; error: string };

/**
 * Each tool plugs into the shared pipeline by describing only what is unique
 * to it: how to read its payload, what to ask Claude, and how the WhatsApp
 * message reads. Storage, AI, CAPI, delivery and alerts are shared.
 */
export interface ToolAdapter<T> {
  id: string;
  label: string;
  /** Whether a WhatsApp number is mandatory for this tool's lead form. */
  requiresPhone: boolean;
  parse(body: unknown): ParseResult<T>;
  /** Prompt for the personalised action plan; return null to skip AI. */
  prompt(lead: LeadCore, data: T): string | null;
  maxTokens?: number;
  message(lead: LeadCore, data: T, plan: string | null): string;
  auditData(lead: LeadCore, data: T): ChatbotAuditData;
}

// --- tiny parsing helpers shared by adapters ---

export type Obj = Record<string, unknown>;

export function obj(v: unknown): Obj {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {};
}

export function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "";
}

export function optStr(v: unknown): string | null {
  const s = str(v);
  return s ? s : null;
}

export function num(v: unknown): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

export function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

export function strArr(v: unknown): string[] {
  return arr(v).map(str).filter(Boolean);
}

export function brl(value: number | null | undefined, digits = 0): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value ?? 0);
}

/** Shared tail every prompt uses so all tools write in the same voice and format. */
export const WHATSAPP_PLAN_RULES = `INSTRUCOES:
- Escreva em portugues brasileiro, tom profissional mas amigavel
- Maximo 3-4 acoes prioritarias, cada uma com 1-2 frases curtas
- Seja especifico para o contexto de clinica odontologica e use os numeros acima
- NAO use markdown. Use formatacao WhatsApp: *negrito* para destaques
- Mantenha CURTO — maximo 500 caracteres no total do plano
- Retorne APENAS o plano de acao, sem introducao ou conclusao`;
