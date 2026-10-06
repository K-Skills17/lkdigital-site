# Go-live checklist

Do these in order. Steps 1–2 are in Neon, step 3 is in Vercel, steps 4–6 are after deploying.

## 1. Create the tables in Neon

The SQL is in [`db/schema.sql`](db/schema.sql). Either:

- **Neon console:** open your project → **SQL Editor** → paste the whole file → **Run**, or
- **Terminal:** `DATABASE_URL="<your Neon connection string>" npm run db:migrate`

It creates every table (`tool_leads`, `ai_calls`, `rate_limits`, `blog_posts`,
`blog_post_revisions`, `app_meta`) and the `all_leads` view used by `/painel`. It's safe to run more
than once.

Every lead lives in `tool_leads`. If your database still has the old `raiox_leads`,
`unicornio_leads` or `raio_x_scorecard_leads` tables, `npm run db:migrate` (or **Atualizar banco de dados** at the top of
`/painel`) copies their rows into `tool_leads` and leaves the old tables alone. (The SQL Editor route
doesn't run this copy: use one of those two.) When `/painel` shows the old leads, you can drop the
old tables with [`db/drop-legacy-lead-tables.sql`](db/drop-legacy-lead-tables.sql); it lists the
counts to compare first.

The 75 existing blog posts are imported into `blog_posts` automatically: by `npm run db:migrate`,
or, if you used the SQL Editor, on the first visit to the blog. Either way it happens once; posts
you delete later don't come back.

## 2. Copy your existing leads from Supabase (once)

```bash
SUPABASE_URL="https://xxxx.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="<service role key>" \
DATABASE_URL="<your Neon connection string>" \
npm run db:copy-from-supabase
```

It prints how many rows it copied per table; the RAIO-X, scorecard and Unicórnio leads go straight
into `tool_leads`. Re-running it skips rows already copied.

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
| `PAINEL_USERS` | One login per admin for `/painel` (dashboard + blog), as `name:password` pairs separated by commas, e.g. `stephen:uma-senha-forte,ana:outra-senha-forte`. The name is recorded on every edit and publish. (Alternative: a single shared login with `PAINEL_PASSWORD`, username `lk` or `PAINEL_USER`.) |

### Add these (optional)

| Variable | What it does |
|---|---|
| `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE` | WhatsApp fallback when the chatbot is down. Copy from an old tool project (`EVOLUTION_INSTANCE` is called `EVOLUTION_API_INSTANCE` there). |
| `GOOGLE_PAGESPEED_API_KEY` | Speed check in the site audit tool; works without it but Google rate-limits it. Copy from the old `fb-lead-audit-tool` project. |
| `AI_PROVIDER` | `anthropic` (default) or `openai` — which AI is tried first when both keys are set. |
| `AI_MODEL_FAST`, `AI_MODEL_SMART`, `OPENAI_MODEL_FAST`, `OPENAI_MODEL_SMART` | Switch Claude / OpenAI models without a code change. Leave unset to use the defaults (see `BACKBONE.md`). |

### Already set — keep

`TELEGRAM_BOT_TOKEN`, `NOTIFY_KOMANDO_CHAT_ID`, `NEXT_PUBLIC_DEMO_TENANT_ID`, `INDEXNOW_KEY`,
`INDEXNOW_SECRET`.

### Remove after step 2 is done

`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — the site no longer reads them.

### Remove — no longer used

`NOTIFY_MARCOS_CHAT_ID`, `NEXT_PUBLIC_MARCOS_BOOKING_URL`, `NEXT_PUBLIC_MARCOS_WA_NUMBER`,
`NEXT_PUBLIC_LK_BOOKING_URL` (the old RAIO-X scorecard), `NEXT_PUBLIC_GTM_ID` (GTM `GTM-P9RPPHD9` is
set in the root layout for the whole site), and anything from the `lk-lead-magnets` setup
(`WEBHOOK_URL`, the Google Apps Script): lead magnets now post to the site like every tool.

### GitHub

The daily blog engine (GitHub Actions) has been removed, so GitHub no longer needs any AI keys.
You can delete the `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` secrets under the repo's
**Settings → Secrets and variables → Actions**.

## 4. Deploy and test

1. Merge the branch / redeploy so the new env vars are picked up.
2. Open `/painel` with one of your `PAINEL_USERS` logins — your old leads should be there.
3. Open `/painel/blog` — the 75 existing posts should be listed as published. Create a test
   article, save it, open **Pré-visualizar**, then delete it.
4. Go through each tool at `/ferramentas` once (the RAIO-X at `/raio-x` included) with your own
   WhatsApp number and confirm the message arrives and the lead shows up in `/painel`. The lead
   magnets' downloads are under `/ferramentas/arquivos/`.

## 5. Redirect the old tool apps

In each old Vercel project, add a `vercel.json` like this (change the path per tool) and redeploy,
so old links, ads and QR codes land on the site:

```json
{ "redirects": [{ "source": "/(.*)", "destination": "https://lkdigital.odo.br/ferramentas/calculadora-agenda", "permanent": true }] }
```

| Old app | New path |
|---|---|
| fb-lead-audit-tool.vercel.app | `/ferramentas/auditoria-site` |
| diagnostico-google.vercel.app | `/ferramentas/checklist-google` |
| simulador-convenio.vercel.app | `/ferramentas/simulador-convenios` |
| calculadora-precificacao-phi.vercel.app | `/ferramentas/calculadora-precificacao` |
| lk-diagnostico-clinica.vercel.app | `/raio-x` |
| calculadora-agenda-ten.vercel.app | `/ferramentas/calculadora-agenda` |

## 6. Google Tag Manager

The site audit tool used its own container (`GTM-WKQ6FX8D`); the site uses `GTM-P9RPPHD9`.
Recreate any triggers you relied on there. All tools also push a `tool_lead` event. The lead
magnets push `asset_view`, `lead_submitted`, `download`, `cta_whatsapp_click`, `cta_raiox_click`
and the RAIO-X steps (`raiox_start`, `raiox_question`, `raiox_complete`, `raiox_gate_submit`,
`raiox_cta_click`).

## 7. Lead magnets: what to fill in

- **YouTube links:** when an episode is published, paste its URL in `YOUTUBE_EPISODE_URLS`
  (`src/tools/shared/lead-magnets.ts`). Until then the RAIO-X shows the episode name without a link.
- **Downloads** (PDFs, spreadsheets, OG images, Ep 10 demo pages) are built offline: see
  [`lead-magnets/README.md`](lead-magnets/README.md). Rebuild and commit them after changing the
  checklist, the scripts, the demo data or the design.
- **The old `K-Skills17/lk-lead-magnets` repo** is fully moved in; archive it on GitHub.
