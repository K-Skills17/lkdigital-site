// One-time copy of every lead table from Supabase into Neon.
// Safe to re-run: rows are matched on id and existing ones are skipped.
//
//   SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=… \
//   DATABASE_URL=postgres://… npm run db:copy-from-supabase
//
// Run `npm run db:migrate` first so the tables exist in Neon.
import { neon } from "@neondatabase/serverless";
import { buildInsert } from "../db/sql-utils.mjs";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DATABASE_URL) {
  console.error("Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and DATABASE_URL");
  process.exit(1);
}

// Order matters: ai_calls references tool_leads.
const TABLES = ["raiox_leads", "unicornio_leads", "raio_x_scorecard_leads", "tool_leads", "ai_calls"];
const PAGE = 500;
const sql = neon(DATABASE_URL);

async function fetchPage(table, offset) {
  const res = await fetch(
    `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}?select=*&order=created_at.asc,id.asc&limit=${PAGE}&offset=${offset}`,
    { headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` } }
  );
  if (res.status === 404) return null; // table never created in Supabase
  if (!res.ok) throw new Error(`${table}: Supabase ${res.status} ${await res.text()}`);
  return res.json();
}

for (const table of TABLES) {
  const typeRows = await sql.query(
    `select column_name, data_type from information_schema.columns where table_schema = 'public' and table_name = $1`,
    [table]
  );
  if (!typeRows.length) throw new Error(`${table} missing in Neon — run npm run db:migrate first`);
  const types = Object.fromEntries(typeRows.map((r) => [r.column_name, r.data_type]));

  let offset = 0;
  let copied = 0;
  for (;;) {
    const rows = await fetchPage(table, offset);
    if (rows === null) {
      console.log(`- ${table}: not in Supabase, skipped`);
      break;
    }
    if (!rows.length) break;
    const { text, params } = buildInsert(table, rows, types);
    const inserted = await sql.query(`${text} returning id`, params);
    copied += inserted.length;
    offset += rows.length;
    if (rows.length < PAGE) break;
  }
  const [{ n }] = await sql.query(`select count(*)::int as n from ${table}`);
  console.log(`✓ ${table}: ${copied} new rows copied (${n} total in Neon)`);
}
