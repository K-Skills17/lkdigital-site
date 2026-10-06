# Go-live checklist

Do these in order. Steps 1–2 are in Neon, step 3 is in Vercel, steps 4–6 are after deploying.

## 1. Create the tables in Neon

The SQL is in [`db/schema.sql`](db/schema.sql). Either:

- **Neon console:** open your project → **SQL Editor** → paste the whole file → **Run**, or
- **Terminal:** `DATABASE_URL="<your Neon connection string>" npm run db:migrate`

It creates every table (`tool_leads`, `ai_calls`, `raiox_leads`, `unicornio_leads`,
`raio_x_scorecard_leads`, `rate_limits`) and the `all_leads` view used by `/painel`.
It's safe to run more than once.

## 2. Copy your existing leads from Supabase (once)

```bash
SUPABASE_URL="https://xxxx.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="<service role key>" \
DATABASE_URL="<your Neon connection string>" \
npm run db:copy-from-supabase
```

It prints how many rows it copied per table. Re-running it skips rows already copied.

## 3. Environment variables in Vercel

Vercel → project **lkdigital-site** → **Settings → Environment Variables**.
Set each for **Production** and **Preview**.

### Add these (required)

| Variable | Where to get the value |
|---|---|
| `DATABASE_URL` | Neon console → your project → **Connect** → choose the **pooled** connection string (host contains `-pooler`) |
| `ANTHROPIC_API_KEY` and/or `OPENAI_API_KEY` | At least one is needed for the AI action plans and the blog. Claude: console.anthropic.com → API Keys (the old tool projects in Vercel already have one). OpenAI: platform.openai.com → API keys. With both set, the second one is an automatic backup. |
| `LK_CHATBOT_URL` | `https://lk-chatbot-production.up.railway.app` |
| `LK_CHATBOT_API_KEY` | Copy from any old tool project in Vercel (e.g. `calculadora-agenda`), or from the lk-chatbot service on Railway |
| `LK_CHATBOT_TENANT_ID` | Same place as above |
| `FB_PIXEL_ID` | `812107305229720` |
| `FB_ACCESS_TOKEN` | Copy from an old tool project (named `FB_ACCESS_TOKEN` or `CAPI_ACCESS_TOKEN` there), or Meta Events Manager → your pixel → Settings → Conversions API → Generate access token |
| `PAINEL_PASSWORD` | Make one up — it's the password for `/painel` (username is `lk`) |

### Add these (optional)

| Variable | What it does |
|---|---|
| `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE` | WhatsApp fallback when the chatbot is down. Also needed for the RAIO-X confirmation message, which is currently not set in Vercel. Copy from an old tool project (`EVOLUTION_INSTANCE` is called `EVOLUTION_API_INSTANCE` there). |
| `GOOGLE_PAGESPEED_API_KEY` | Speed check in the site audit tool; works without it but Google rate-limits it. Copy from the old `fb-lead-audit-tool` project. |
| `PAINEL_USER` | Change the `/painel` username (default `lk`). |
| `NOTIFY_MARCOS_CHAT_ID` | Telegram alerts to Marcos for RAIO-X scorecard leads. |
| `AI_PROVIDER` | `anthropic` (default) or `openai` — which AI is tried first when both keys are set. |
| `AI_MODEL_FAST`, `AI_MODEL_SMART`, `OPENAI_MODEL_FAST`, `OPENAI_MODEL_SMART` | Switch Claude / OpenAI models without a code change. Leave unset to use the defaults (see `BACKBONE.md`). |

### Already set — keep

`TELEGRAM_BOT_TOKEN`, `NOTIFY_KOMANDO_CHAT_ID`, `NEXT_PUBLIC_LK_BOOKING_URL`,
`NEXT_PUBLIC_DEMO_TENANT_ID`, `INDEXNOW_KEY`, `INDEXNOW_SECRET`.

### Remove after step 2 is done

`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — the site no longer reads them.

### GitHub (daily blog engine)

The daily blog runs in GitHub Actions, not Vercel. In the GitHub repo → **Settings → Secrets and
variables → Actions**: keep the `ANTHROPIC_API_KEY` secret, add an `OPENAI_API_KEY` secret if you
use OpenAI, and optionally a **variable** (not secret) `AI_PROVIDER` = `openai` to make it go first.

## 4. Deploy and test

1. Merge the branch / redeploy so the new env vars are picked up.
2. Open `/painel` (user `lk` + your password) — your old leads should be there.
3. Go through each tool at `/ferramentas` once with your own WhatsApp number and confirm the
   report arrives and the lead shows up in `/painel`.

## 5. Redirect the old tool apps

In each old Vercel project, add a `vercel.json` like this (change the path per tool) and redeploy,
so old links, ads and QR codes land on the site:

```json
{ "redirects": [{ "source": "/(.*)", "destination": "https://lkdigital.odo.br/ferramentas/calculadora-agenda", "permanent": true }] }
```

| Old app | New path |
|---|---|
| fb-lead-audit-tool.vercel.app | `/ferramentas/auditoria-site` |
| diagnostico-google.vercel.app | `/ferramentas/diagnostico-google` |
| simulador-convenio.vercel.app | `/ferramentas/simulador-convenios` |
| calculadora-precificacao-phi.vercel.app | `/ferramentas/calculadora-precificacao` |
| lk-diagnostico-clinica.vercel.app | `/ferramentas/diagnostico-clinica` |
| calculadora-agenda-ten.vercel.app | `/ferramentas/calculadora-agenda` |

## 6. Google Tag Manager

The site audit tool used its own container (`GTM-WKQ6FX8D`); the site uses `GTM-P9RPPHD9`.
Recreate any triggers you relied on there. All tools also push a `tool_lead` event.
