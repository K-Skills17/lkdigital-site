# Raio-X da Clínica Unicórnio™ — Setup & Reference

**Route:** `/unicornio`  
**Primary KPI:** `raiox_completed` event (last question answered — fires before lead gate)

---

## Quick Setup Checklist

1. **WhatsApp number** — open `src/components/unicornio/ScoreQuiz.tsx`, line 1 of the CONFIG block:
   ```ts
   const WHATSAPP_NUMBER = "5511999999999"; // replace with Komando's real number
   ```

2. **Database** — run the migration in Supabase SQL Editor:
   ```
   supabase/migrations/20260628_unicornio_leads.sql
   ```
   This creates `unicornio_leads` with RLS enabled (no public policies — all writes go through the service role in the API route).

3. **Env vars** — same as the existing raio-x setup (`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`).  
   No new variables needed.

---

## Where Leads Land

| Field | Where stored |
|---|---|
| Form data (nome, clínica, cidade…) | `unicornio_leads` table in Supabase |
| 7-lever scores | `scores` jsonb column |
| 14 raw answers | `respostas` int[] column |
| 2 weakest levers | `alavancas_fracas` text[] column |
| Archetype name | `arquetipo` text column |
| Total score | `total` int column |

If the API call fails (network error, Supabase down), the payload is queued in the user's `localStorage` under the key `raiox_unicornio_pending_lead` and retried automatically on their next visit to `/unicornio`.

---

## Changing Questions or Scoring

All question data lives in `src/components/unicornio/ScoreQuiz.tsx` in the `QUESTIONS` constant (one object per question, in lever order — 2 per lever).

Each question option has a `value: 0 | 1 | 2 | 3`. Per-lever score = sum of its 2 questions (0–6). Total = sum of all 7 levers (0–42).

**To change a question:** edit its `text` or `options` in the `QUESTIONS` array. Keep `lever` index correct (0 = Posicionamento … 6 = Sistemas) and ensure `value` stays in 0–3 range.

**To change archetype bands:** edit the `ARCHETYPES` array (each entry has `min`, `max`, `name`, `interpretation`).

**To change lever prescriptions:** edit the `PRESCRIPTIONS` object (key = `LEVER_KEYS[i]`).

---

## Analytics Events

All events fire to **both** GA4 (via `window.dataLayer` + `window.gtag`) and **Meta Pixel** (via `window.fbq`) when the respective globals are present on the page. The root layout already loads GA4 (`G-FXE36BBPPQ`) and Meta Pixel (`812107305229720`) 5 s after load.

| Event name | Trigger | Meta Pixel mapping |
|---|---|---|
| `raiox_start` | "Começar" button tapped | — |
| `raiox_question_answered` | Any option tapped (param: `question_index`) | — |
| `raiox_completed` | Last question (Q14) answered — **primary KPI** | `RaioXCompleted` (custom) |
| `raiox_lead_submitted` | Form submitted successfully | `Lead` (standard) |
| `raiox_cta_whatsapp_click` | WhatsApp CTA button clicked | — |

---

## OG Image

The layout references `https://lkdigital.odo.br/og-unicornio.jpg` (1200×630).  
Create this image in `public/og-unicornio.jpg` — gold-on-dark with the title text for social sharing.

---

## Note on /raio-x

The existing `/raio-x` route is a separate product (manual free audit with 50 spots).  
This scorecard lives at `/unicornio`. If you later want to merge the two URLs, update `src/app/unicornio/layout.tsx` `alternates.canonical` and add a redirect in `next.config.mjs`.
