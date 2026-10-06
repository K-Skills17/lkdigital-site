// lib/db-setup.ts
// Apply db/schema.sql from inside the app — used by the "Criar tabelas" button
// in /painel/blog, so creating new tables after a release doesn't require
// opening Neon. The schema is idempotent (`if not exists` / `create or replace`).

import { readFileSync } from "fs";
import path from "path";
import { query } from "@/lib/db";
// Plain ESM helper shared with scripts/db-migrate.mjs.
import { splitStatements } from "../../db/sql-utils.mjs";

export async function applySchema(): Promise<number> {
  const sql = readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8");
  const statements: string[] = splitStatements(sql);
  // One at a time, in order: later statements (the view) depend on earlier ones.
  for (const stmt of statements) await query(stmt);
  return statements.length;
}
