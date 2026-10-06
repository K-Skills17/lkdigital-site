# LK Backbone

Every free tool and every lead magnet runs inside this site, on one shared backend, and every lead
lands in one table (`tool_leads`).

| Tool | Route | Came from |
|---|---|---|
| RAIO-X da Clínica | `/raio-x` | `K-Skills17/lk-lead-magnets` (replaced the scorecard, Unicórnio and RAIO-X 2026 funnels) |
| Checklist do Perfil do Google | `/ferramentas/checklist-google` | `K-Skills17/lk-lead-magnets` (replaced Diagnóstico Google) |
| Calculadora de CAC | `/ferramentas/calculadora-cac` | `K-Skills17/lk-lead-magnets` |
| Dashboard da Clínica | `/ferramentas/dashboard-clinica` | `K-Skills17/lk-lead-magnets` |
| Scripts de WhatsApp | `/ferramentas/scripts-whatsapp` | `K-Skills17/lk-lead-magnets` |
| Auditoria de Site | `/ferramentas/auditoria-site` | `K-Skills17/Fb-lead-audit-tool` |
| Simulador de Convênios | `/ferramentas/simulador-convenios` | `K-Skills17/simulador-convenio` |
| Calculadora de Precificação | `/ferramentas/calculadora-precificacao` | `K-Skills17/Calculadora-precificac-o` |
| Calculadora de Agenda | `/ferramentas/calculadora-agenda` | `K-Skills17/calculadora-agenda` |

Retired and redirected (old links keep working): `/unicornio`, `/raio-x/resultado`, `/raio-x/privacidade`,
`/ferramentas/diagnostico-google` → `/ferramentas/checklist-google`, `/ferramentas/diagnostico-clinica` → `/raio-x`.

The first five are the lead magnets of the YouTube series "O Sistema Operacional da Clínica
Odontológica". How they were moved in, and why, is in [`docs/lead-magnets-integration.md`](docs/lead-magnets-integration.md).

The WhatsApp chatbot (`K-Skills17/lk-chatbot`) stays a separate service on Railway.
It's a long-running Fastify + Postgres + Redis/BullMQ worker that can't run on
Vercel functions. The backbone talks to it over `/webhook/audit-lead`, so every
lead lands in the bot with the same context.

## The routine

Every tool lead goes through `runLeadPipeline` (`src/lib/backbone/pipeline.ts`):

```
browser: submitLead(tool, payload)          src/tools/shared/backbone-client.js
  └─ POST /api/ferramentas/<tool>/lead      src/app/api/ferramentas/[tool]/lead/route.ts
       1. adapter.parse()        validate + normalize (per tool)
       2. store                  tool_leads row (Neon)
       3. AI plan  ‖  Meta CAPI  same model registry · Lead event deduped with the pixel
       4. WhatsApp               LK Chatbot → Evolution API fallback
       5. update row + Telegram  delivery status, AI plan; team alert
```

Only the **adapter** is tool-specific (`src/lib/backbone/tools/<tool>.ts`): how to
read the payload, the Claude prompt, and how the WhatsApp message reads.
Storage, AI, CAPI, delivery, alerts and logging are shared.

### Adding a new tool

1. Put the frontend in `src/tools/<slug>/`. Its CSS is automatically scoped to
   `.tool-<slug>` by `postcss-tool-scope.cjs`, so it can't leak into the site.
2. Add `src/app/ferramentas/<slug>/page.tsx` that wraps it in `<ToolShell slug="<slug>">`
   (`src/components/tools/ToolShell.tsx`: the site Navbar and Footer, the tool fonts and the
   `.tool-<slug>` scope). Every tool looks like the rest of the site, so the tool itself has no
   logo, header or footer.
3. Submit leads with `submitLead('<slug>', payload)`. A lead magnet uses the shared form instead
   (`mountLeadForm` in `src/tools/shared/lead-form.js`: name, clinic, city, WhatsApp, e-mail,
   specialty, unchecked LGPD consent) and its page uses `leadMagnetMetadata()`.
4. Write `src/lib/backbone/tools/<slug>.ts` and register it in `tools/index.ts`.
5. Add a fixture to `src/lib/backbone/backbone.test.ts` (the test fails until you do).

## AI models

One registry: `src/lib/backbone/models.ts`. Every AI call (tools, and the blog's "Rascunho com IA"
draft assistant) goes through `src/lib/backbone/llm.ts`, which supports **Claude and OpenAI**.

| Tier | Claude default | OpenAI default | Used by |
|---|---|---|---|
| `fast` | `claude-haiku-4-5-20251001` | `gpt-5.4-mini` | the WhatsApp action plans (tools, RAIO-X, CAC calculator; the download-only lead magnets skip AI) |
| `smart` | `claude-sonnet-4-6` | `gpt-5.5` | blog draft assistant (`/painel/blog/gerar`) |

- **Which provider:** `AI_PROVIDER=anthropic` (default) or `openai` picks which one is tried
  first. If the other provider's key is also set, it's used automatically when the first one
  errors or returns nothing. With only one key set, only that provider is used.
- **Which model:** `AI_MODEL_FAST` / `AI_MODEL_SMART` override the Claude models;
  `OPENAI_MODEL_FAST` / `OPENAI_MODEL_SMART` override the OpenAI ones. Env vars only, no code
  change needed.

Every attempt, including failed ones and fallbacks, is logged to `ai_calls` with model, tokens,
latency and errors. The `/painel` cost estimate covers models listed in `MODEL_PRICING`; others
show "—" until you add their prices there.

## Database: Neon

Everything — every lead, AI calls, rate limits and the blog — lives in one Neon Postgres database at
`DATABASE_URL`, queried through `src/lib/db.ts` with Neon's HTTP driver (no connection pool to
manage on Vercel). The full schema is `db/schema.sql`.

**One lead table.** Every lead, from every tool and lead magnet, is a row in `tool_leads` (`tool` =
the source). The old per-funnel tables (`raiox_leads`, `unicornio_leads`, `raio_x_scorecard_leads`)
are no longer created or written: `npm run db:migrate` (and the **Atualizar banco de dados** button at the top of `/painel`) copies any
rows still in them into `tool_leads` — same id and date, the whole original row in `payload`, under
the sources `raio-x-2026`, `unicornio` and `raio-x-scorecard` — and never deletes anything. Once
the counts match, drop the old tables by hand with [`db/drop-legacy-lead-tables.sql`](db/drop-legacy-lead-tables.sql).

## Rate limiting

`src/lib/ratelimit.ts` keeps fixed-window counters in the `rate_limits` table, so the limits hold
across every serverless instance. Keys are hashed; no raw IPs or phone numbers are stored. If the
database is unreachable it fails open, so an outage never blocks a real lead.

| What | Limit | Over the limit |
|---|---|---|
| Lead form (tools and lead magnets), per IP | 5 per 10 min, 20 per day | 429 (results still show; nothing is sent) |
| WhatsApp report + AI plan, per destination number | 4 per day | lead is stored, no message or AI call |
| Site scanner, per IP | 10 per 10 min | 429 with a message on screen |
| Meta event proxy, per IP | 60 per 10 min | 429 |

Tune the numbers in `LIMITS` in `src/lib/ratelimit.ts`.

## Dashboard: `/painel`

One view across **every** lead source: the five lead magnets, the four tools, and the rows kept from
the retired funnels (listed only while they have leads in the window). It shows leads by source and
by day, recent leads, leads whose WhatsApp report failed (contact them by hand), and AI usage and
cost by model.

It reads the `all_leads` view and the `ai_calls` table in Neon. It's protected by HTTP Basic auth
(`PAINEL_USERS`, one login per admin, or `PAINEL_USER` / `PAINEL_PASSWORD`) and stays closed until
a login is configured.

## Blog: `/painel/blog`

Blog posts live in Neon (`blog_posts`) and are written by people in `/painel/blog`. The old daily
blog engine (GitHub Actions + `scripts/blog-engine`) has been removed; nothing publishes on its own.

- **Write manually:** "+ Novo artigo" opens the editor (visual editor, or HTML for posts with
  custom blocks; those open in HTML automatically so nothing is stripped).
- **Semi-automatic:** "Rascunho com IA" asks the AI (Claude/OpenAI, same keys as above) for a first
  draft following the editorial rules carried over from the old engine. It only ever creates a
  **draft**, flagged as AI-generated, and it can't be published until a signed-in admin clicks
  "Revisei este conteúdo".
- **Quality checklist** (`src/lib/blog/quality.ts`), live in the editor. Errors block publishing:
  missing title/summary, too short, invented sources, the banned "340%" stat, `<h1>` in the body.
  Warnings are left to the editor's judgment: CFO phrases, AI-sounding phrases, keyword
  stuffing, SEO lengths, FAQ.
- **Publish now or schedule:** a scheduled post appears by itself at its time (within 5 minutes).
  Publishing refreshes the cached pages immediately and pings IndexNow.
- **Safety:** every save keeps the previous version (restore from "Histórico de versões"); a live
  post's URL can't be changed; live posts can't be deleted (unpublish or archive first); all HTML
  is sanitized on save; every edit records who made it.
- Posts appear on `/blog`, the home page, the author page and the live `/sitemap-blog.xml`
  (listed in robots.txt).


## Go-live checklist

Step-by-step version with every env var and where to find it: [`GO-LIVE.md`](GO-LIVE.md).

1. **Create the schema in Neon.** Set `DATABASE_URL` (the pooled connection string from the
   Neon console) and run `npm run db:migrate`. It applies `db/schema.sql`, which creates every
   table, the rate-limit table and the `all_leads` view. It's idempotent, so re-running it is safe.
2. **Copy the existing leads out of Supabase** (once):
   `SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… DATABASE_URL=… npm run db:copy-from-supabase`.
   It copies RAIO-X, scorecard and Unicórnio leads into `tool_leads` (plus tool leads and AI calls
   if they exist) and skips rows already copied, so it can be re-run. Afterwards, remove `SUPABASE_*` from Vercel.
3. **Set env vars in Vercel** (see `.env.example`): `DATABASE_URL`, `ANTHROPIC_API_KEY`, `LK_CHATBOT_URL`, `LK_CHATBOT_API_KEY`, `LK_CHATBOT_TENANT_ID`,
   `FB_PIXEL_ID`, `FB_ACCESS_TOKEN`, `PAINEL_PASSWORD`, and optionally
   `GOOGLE_PAGESPEED_API_KEY` and the `EVOLUTION_*` fallback. Copy the values from the old
   tool projects in Vercel. They used a mix of names (`PIXEL_ID`/`CAPI_ACCESS_TOKEN`,
   `EVOLUTION_API_INSTANCE`), and the backbone still accepts those as fallbacks.
4. **Deploy**, then submit one lead per tool with your own number and check `/painel`.
5. **Redirect the old apps** so existing links, ads and QR codes keep working. In each old
   Vercel project, add a `vercel.json` redirect, for example
   `{"redirects":[{"source":"/(.*)","destination":"https://lkdigital.odo.br/ferramentas/calculadora-agenda","permanent":true}]}`.
   Then archive the old repos.
6. **GTM**: the audit tool used its own container `GTM-WKQ6FX8D`. On the site, events go to
   `GTM-P9RPPHD9`. Recreate any triggers you relied on (`audit_submit`, `lead_capture`,
   `whatsapp_click`, …) there. All tools also push a common `tool_lead` event.

## Behaviour changes vs. the old repos

- **Google Sheets are gone.** Leads go to Neon (`tool_leads`) and show up in `/painel`.
  The old Apps Script sheets stop receiving new rows.
- **One WhatsApp CTA number:** (11) 94685-1028, set in `src/tools/shared/config.js` and used
  site-wide. Agenda, Precificação, Google and the audit report used to point at an old number.
- **Fixed on the way in:**
  - The audit report's WhatsApp button linked to `wa.me/11959041799`, which has no
    country code, so it didn't open a valid chat.
  - The simulator sent a report link without the results in it.
  - The site scanner now refuses private and internal addresses, because it fetches
    visitor-supplied URLs from a server that holds the site's secrets.
- `middleware.ts` moved to `src/middleware.ts`. Next.js ignores a root middleware when the app
  lives in `src/`, so the old file never ran (it was a no-op).
