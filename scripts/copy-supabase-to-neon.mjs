// One-time copy of every lead table from Supabase into Neon. The old per-funnel tables
// (raiox_leads, unicornio_leads, raio_x_scorecard_leads) land in tool_leads, like every lead.
// Safe to re-run: rows are matched on id and existing ones are skipped.
//
//   SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=… \
//   DATABASE_URL=postgres://… npm run db:copy-from-supabase
//
// Run `npm run db:migrate` first so the tables exist in Neon.
import { neon } from "@neondatabase/serverless";
import { buildInsert, insertLegacyRows, LEGACY_LEAD_TABLES } from "../db/sql-utils.mjs";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DATABASE_URL) {
  console.error("Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and DATABASE_URL");
  process.exit(1);
}

// Order matters: ai_calls references tool_leads.
const TABLES = [...Object.keys(LEGACY_LEAD_TABLES), "tool_leads", "ai_calls"];
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
  const legacy = table in LEGACY_LEAD_TABLES;
  const target = legacy ? "tool_leads" : table;
  const typeRows = await sql.query(
    `select column_name, data_type from information_schema.columns where table_schema = 'public' and table_name = $1`,
    [target]
  );
  if (!typeRows.length) throw new Error(`${target} missing in Neon — run npm run db:migrate first`);
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
    if (legacy) {
      copied += await insertLegacyRows((text, params) => sql.query(text, params), table, rows);
    } else {
      const { text, params } = buildInsert(table, rows, types);
      copied += (await sql.query(`${text} returning id`, params)).length;
    }
    offset += rows.length;
    if (rows.length < PAGE) break;
  }
  const [{ n }] = legacy
    ? await sql.query(`select count(*)::int as n from tool_leads where tool = $1`, [LEGACY_LEAD_TABLES[table]])
    : await sql.query(`select count(*)::int as n from ${table}`);
  console.log(`✓ ${table} → ${target}: ${copied} new rows copied (${n} total in Neon)`);
}
