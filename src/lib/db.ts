// lib/db.ts
// Single Postgres entry point for the whole site (Neon). Every table — tool
// leads, AI calls, RAIO-X, scorecard, Unicórnio, rate limits — lives in the
// database at DATABASE_URL. Schema: db/schema.sql (`npm run db:migrate`).
//
// Uses Neon's HTTP driver: one round-trip per query, no connection pool to
// manage, which fits Vercel's short-lived functions.

import { neon } from "@neondatabase/serverless";

export type Row = Record<string, unknown>;
export type QueryFn = (text: string, params?: unknown[]) => Promise<Row[]>;

let _query: QueryFn | null = null;

export function isDbConfigured(): boolean {
  return !!(_query || process.env.DATABASE_URL);
}

function executor(): QueryFn {
  if (_query) return _query;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Missing DATABASE_URL env var");
  const sql = neon(url);
  _query = (text, params = []) => sql.query(text, params) as Promise<Row[]>;
  return _query;
}

/** Run a parameterized query (`$1, $2…`) and return the rows. */
export async function query<T = Row>(text: string, params: unknown[] = []): Promise<T[]> {
  return (await executor()(text, params)) as T[];
}

/** Tests: route queries to another Postgres (e.g. PGlite). Pass null to reset. */
export function setQueryFnForTests(fn: QueryFn | null): void {
  _query = fn;
}
