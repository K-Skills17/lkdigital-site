// lib/db-setup.ts
// Apply db/schema.sql from inside the app — used by the "Atualizar banco de dados" button in
// /painel (and the blog setup screen), so a release that adds tables doesn't require opening
// Neon. Idempotent (`if not exists` / `create or replace`); also copies rows left in the old
// per-funnel lead tables into tool_leads, never deleting anything.

import { readFileSync } from "fs";
import path from "path";
import { query } from "@/lib/db";
// Plain ESM helper shared with scripts/db-migrate.mjs.
import { migrateLegacyLeads, splitStatements } from "../../db/sql-utils.mjs";

export type LegacyCopyReport = Record<string, { rows: number; inserted: number }>;

export async function applySchema(): Promise<{ statements: number; legacy: LegacyCopyReport }> {
  const sql = readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8");
  const statements: string[] = splitStatements(sql);
  // One at a time, in order: later statements (the view) depend on earlier ones.
  for (const stmt of statements) await query(stmt);
  // Rows left in the old per-funnel lead tables move into tool_leads (idempotent).
  const legacy = (await migrateLegacyLeads((text: string, params: unknown[]) => query(text, params))) as LegacyCopyReport;
  return { statements: statements.length, legacy };
}
