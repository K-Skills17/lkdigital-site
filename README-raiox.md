# Raio-X Digital 2026 — Setup

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only, never exposed to client) |
| `EVOLUTION_API_URL` | Evolution API base URL (self-hosted) |
| `EVOLUTION_API_KEY` | Evolution API key |
| `EVOLUTION_INSTANCE` | Evolution API instance name |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID (optional) |

## Database Setup

Run the migration in your Supabase SQL editor:

```bash
supabase/migrations/20260610_raiox_leads.sql
```

RLS is enabled with no public policies — all access goes through the service role key in API route handlers.

## How the Spot Counter Works

- `GET /api/raiox/vagas` returns `{ remaining: N }` where `N = 50 - count(leads where cohort='jun-jul-2026' AND status != 'waitlist')`
- Cached for 60 seconds via `revalidate`
- Hero and form fetch this client-side; fallback shows 50 while loading
- When remaining hits 0, the form switches to a waitlist-only variant

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/raiox/lead` | POST | Validate + insert lead, send WhatsApp confirmation |
| `/api/raiox/vagas` | GET | Return remaining spots (cached 60s) |
| `/api/raiox/generate` | POST | **STUB** — 501. Integration point for report pipeline |

## Report Pipeline Integration

The `/api/raiox/generate` route is a stub. To complete it:

1. Run `raiox-collect.mjs` to gather audit data into `blockF.json`
2. Combine with manual notes from the lead record
3. Call Claude API using `raiox-report-prompt.md` as the system prompt
4. Generate PDF from the response
5. Send PDF via Evolution API WhatsApp
6. Update lead status to `delivered`

## Tracking

- GTM loads only if `NEXT_PUBLIC_GTM_ID` is set
- `dataLayer` events: `raiox_view` (page load), `raiox_form_start` (first field focus), `raiox_submit_success`
- UTM params from URL are captured into the lead's `utm` jsonb column
