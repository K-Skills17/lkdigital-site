# LK Backbone

All six free tools that used to live in separate repos and separate `*.vercel.app`
deployments now run inside this site, on one shared backend.

| Tool | Route | Came from |
|---|---|---|
| Auditoria de Site | `/ferramentas/auditoria-site` | `K-Skills17/Fb-lead-audit-tool` |
| Diagnóstico Google Meu Negócio | `/ferramentas/diagnostico-google` | `K-Skills17/diagnostico-google` |
| Simulador de Convênios | `/ferramentas/simulador-convenios` | `K-Skills17/simulador-convenio` |
| Calculadora de Precificação | `/ferramentas/calculadora-precificacao` | `K-Skills17/Calculadora-precificac-o` |
| Diagnóstico de Clínica | `/ferramentas/diagnostico-clinica` | `K-Skills17/LK-diagnostico-clinica` |
| Calculadora de Agenda | `/ferramentas/calculadora-agenda` | `K-Skills17/calculadora-agenda` |

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
2. Add `src/app/ferramentas/<slug>/page.tsx` that wraps it in
   `<div className={`${toolFontVars} tool-<slug>`}>`.
3. Submit leads with `submitLead('<slug>', payload)`.
4. Write `src/lib/backbone/tools/<slug>.ts` and register it in `tools/index.ts`.
5. Add a fixture to `src/lib/backbone/backbone.test.ts` (the test fails until you do).

## AI models

One registry: `src/lib/backbone/models.ts`.

| Tier | Default | Used by |
|---|---|---|
| `fast` | `claude-haiku-4-5-20251001` | every tool's WhatsApp action plan |
| `smart` | `claude-sonnet-4-6` | blog engine (`scripts/blog-engine`), `npm run blog:new` |

To change a model everywhere, set `AI_MODEL_FAST` / `AI_MODEL_SMART` in Vercel (no deploy of
code needed) or edit the defaults. Every tool call is logged to `ai_calls` with tokens,
latency and errors.

## Database: Neon

Everything — tool leads, AI calls, RAIO-X, scorecard, Unicórnio and rate limits — lives in one
Neon Postgres database at `DATABASE_URL`, queried through `src/lib/db.ts` with Neon's HTTP
driver (no connection pool to manage on Vercel). The full schema is `db/schema.sql`.

## Rate limiting

`src/lib/ratelimit.ts` keeps fixed-window counters in the `rate_limits` table, so the limits hold
across every serverless instance. Keys are hashed; no raw IPs or phone numbers are stored. If the
database is unreachable it fails open, so an outage never blocks a real lead.

| What | Limit | Over the limit |
|---|---|---|
| Tool lead form, per IP | 5 per 10 min, 20 per day | 429 (results still show; nothing is sent) |
| WhatsApp report + AI plan, per destination number | 4 per day | lead is stored, no message or AI call |
| Site scanner, per IP | 10 per 10 min | 429 with a message on screen |
| Meta event proxy, per IP | 60 per 10 min | 429 |
| RAIO-X / scorecard / Unicórnio forms, per IP | 5 per 10 min | 429 with a message on screen |

Tune the numbers in `LIMITS` in `src/lib/ratelimit.ts`.

## Dashboard: `/painel`

One view across **every** lead source: the six tools, RAIO-X, the RAIO-X scorecard
and Unicórnio. It shows leads by source and by day, recent leads, leads whose
WhatsApp report failed (contact them by hand), and AI usage and cost by model.

It reads the `all_leads` view and the `ai_calls` table in Neon. It's protected by HTTP Basic auth
(`PAINEL_USER` / `PAINEL_PASSWORD`) and stays closed until a password is set.

## Go-live checklist

1. **Create the schema in Neon.** Set `DATABASE_URL` (the pooled connection string from the
   Neon console) and run `npm run db:migrate`. It applies `db/schema.sql`, which creates every
   table, the rate-limit table and the `all_leads` view. It's idempotent, so re-running it is safe.
2. **Copy the existing leads out of Supabase** (once):
   `SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… DATABASE_URL=… npm run db:copy-from-supabase`.
   It copies RAIO-X, scorecard and Unicórnio leads (plus tool leads and AI calls if they exist)
   and skips rows already copied, so it can be re-run. Afterwards, remove `SUPABASE_*` from Vercel.
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
- **Diagnóstico Google** had no backend before. It now gets the same routine as the other
  tools: AI plan, CAPI, and a WhatsApp report when a number is given (WhatsApp stays optional
  on that form).
- **One WhatsApp CTA number:** (11) 94685-1028, set in `src/tools/shared/config.js` and used
  site-wide. Agenda, Precificação, Google and the audit report used to point at an old number.
- **Fixed on the way in:**
  - The clinic diagnostic sent its data as `diagnosticData`, which the chatbot
    ignores. It now sends `auditData`, so the bot has the lead's context.
  - The audit report's WhatsApp button linked to `wa.me/11959041799`, which has no
    country code, so it didn't open a valid chat.
  - The simulator sent a report link without the results in it.
  - The site scanner now refuses private and internal addresses, because it fetches
    visitor-supplied URLs from a server that holds the site's secrets.
- `middleware.ts` moved to `src/middleware.ts`. Next.js ignores a root middleware when the app
  lives in `src/`, so the old file never ran (it was a no-op).
