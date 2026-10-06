// Small helpers shared by the db scripts (plain ESM so they run with `node`).

/** Split a schema file into statements. db/schema.sql has no functions or
 *  quoted semicolons, so splitting on `;` at end of line is safe. */
export function splitStatements(sql) {
  return sql
    .split(/;\s*$/m)
    .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
    .filter(Boolean);
}

/**
 * Build one idempotent multi-row INSERT for rows copied from another database.
 * `types` maps column → Postgres data_type (from information_schema) so jsonb
 * values are serialized while text[]/int[] arrays are passed as arrays.
 */
export function buildInsert(table, rows, types) {
  const cols = Object.keys(rows[0]).filter((c) => c in types);
  const params = [];
  const tuples = rows.map((row) => {
    const ph = cols.map((c) => {
      let v = row[c];
      if (types[c] === "jsonb" && v !== null && v !== undefined) v = JSON.stringify(v);
      params.push(v ?? null);
      return `$${params.length}${types[c] === "jsonb" ? "::jsonb" : ""}`;
    });
    return `(${ph.join(", ")})`;
  });
  const quoted = cols.map((c) => `"${c}"`).join(", ");
  return {
    text: `insert into ${table} (${quoted}) values ${tuples.join(", ")} on conflict (id) do nothing`,
    params,
  };
}
