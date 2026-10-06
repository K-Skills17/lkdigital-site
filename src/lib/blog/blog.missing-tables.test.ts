// Production incident: the release with the blog admin was deployed to a
// database migrated before it (no blog tables). The public blog must stay up,
// and the admin must offer to create the tables.
import { readFileSync } from "fs";
import path from "path";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, expect, it } from "vitest";
import { query, setQueryFnForTests } from "../db";
import { getPublishedPost, isMissingTable, listAllPosts, listPublishedPosts } from "./store";
import { splitStatements } from "../../../db/sql-utils.mjs";
import { POST as setup } from "@/app/api/painel/setup/route";

beforeAll(async () => {
  const pg = new PGlite();
  for (const stmt of splitStatements(readFileSync(path.join(__dirname, "../../../db/schema.sql"), "utf8"))) await pg.exec(stmt);
  // Back to the state before this release: leads tables only.
  await pg.exec("drop table blog_post_revisions; drop table blog_posts; drop table app_meta;");
  await pg.exec("insert into tool_leads (tool, name) values ('calculadora-agenda', 'Ana')");
  setQueryFnForTests(async (text, params = []) => (await pg.query(text, params)).rows as Record<string, unknown>[]);
});

it("keeps the public blog up from the bundled posts while the tables are missing", async () => {
  expect(await listPublishedPosts()).toHaveLength(75);
  expect((await getPublishedPost("regras-cfo-publicidade"))?.title).toBeTruthy();
});

it("tells the admin the tables are missing (so it can show the setup screen)", async () => {
  const err = await listAllPosts().catch((e) => e);
  expect(isMissingTable(err)).toBe(true);
});

it("the setup button creates the tables, imports the posts and keeps existing data", async () => {
  const res = await setup();
  const body = await res.json();
  expect(res.status).toBe(200);
  expect(body).toMatchObject({ ok: true, posts: 75 });
  expect((await listAllPosts()).length).toBe(75);
  expect((await query("select name from tool_leads"))[0].name).toBe("Ana");
  // Running it again is harmless.
  expect((await (await setup()).json()).posts).toBe(75);
});
