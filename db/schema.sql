-- LK Digital — complete database schema (Neon / Postgres 15+).
-- Idempotent: safe to run on every deploy with `npm run db:migrate`.
-- Replaces the old supabase/migrations/*.sql (same tables and columns, so data
-- copied from Supabase with scripts/copy-supabase-to-neon.mjs fits as-is).

-- ─── RAIO-X Digital (manual audit, 50-spot cohorts) ─────────────────────────
create table if not exists raiox_leads (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz default now(),
  cohort           text not null default 'jun-jul-2026',
  status           text not null default 'new',
  name             text not null,
  clinic_name      text not null,
  city             text not null,
  whatsapp         text not null,
  instagram        text,
  site_url         text,
  role             text not null,
  chairs           text not null,
  procedures       text[] not null,
  marketing_owner  text not null,
  lead_score       int,
  lead_tier        text,
  trojan_signal    text,
  trojan_predicted text,
  nota_final       int,
  utm              jsonb,
  notes            text
);
create index if not exists raiox_leads_cohort_status_idx on raiox_leads (cohort, status);

-- ─── Raio-X da Clínica Unicórnio (scorecard quiz) ───────────────────────────
create table if not exists unicornio_leads (
  id               uuid        primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  nome             text        not null,
  clinica          text        not null,
  especialidade    text        not null,
  cidade           text        not null,
  whatsapp         text        not null,
  email            text,
  total            int         not null check (total between 0 and 42),
  arquetipo        text        not null,
  scores           jsonb       not null,
  alavancas_fracas text[]      not null,
  respostas        int[]       not null,
  consent          boolean     not null default true,
  source           text        not null default 'raio-x'
);
create index if not exists unicornio_leads_created_at_idx on unicornio_leads (created_at desc);
create index if not exists unicornio_leads_arquetipo_idx  on unicornio_leads (arquetipo);

-- ─── RAIO-X Scorecard funnel ────────────────────────────────────────────────
create table if not exists raio_x_scorecard_leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  clinic_name text not null,
  whatsapp    text,
  email       text,
  vis_score   numeric(4,3) not null check (vis_score between 0 and 1),
  vis_gap     boolean not null,
  op_score    numeric(4,3) not null check (op_score between 0 and 1),
  op_gap      boolean not null,
  route       text not null check (route in ('lk', 'marcos', 'dual', 'optimize')),
  answers     jsonb not null default '{}',
  consent     boolean not null default true,
  consent_at  timestamptz not null default now(),
  constraint at_least_one_contact check (whatsapp is not null or email is not null)
);
create index if not exists idx_raiox_leads_route      on raio_x_scorecard_leads (route);
create index if not exists idx_raiox_leads_created_at on raio_x_scorecard_leads (created_at desc);

-- ─── Free tools (/ferramentas/*) — one table for all of them ────────────────
create table if not exists tool_leads (
  id               uuid        primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  tool             text        not null,
  name             text        not null,
  phone            text        not null default '',
  email            text,
  clinic_name      text,
  city             text,
  score            numeric,
  headline         text,
  payload          jsonb       not null default '{}',
  utm              jsonb,
  report_url       text,
  ai_plan          text,
  whatsapp_sent    boolean     not null default false,
  whatsapp_channel text,
  whatsapp_error   text,
  capi_sent        boolean     not null default false,
  status           text        not null default 'new'
);
create index if not exists tool_leads_created_at_idx on tool_leads (created_at desc);
create index if not exists tool_leads_tool_idx       on tool_leads (tool, created_at desc);
create index if not exists tool_leads_phone_idx      on tool_leads (phone);

-- ─── AI usage log (every Claude call, every backend) ────────────────────────
create table if not exists ai_calls (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  source        text        not null,
  lead_id       uuid        references tool_leads (id) on delete set null,
  model         text        not null,
  input_tokens  int         not null default 0,
  output_tokens int         not null default 0,
  latency_ms    int         not null default 0,
  ok            boolean     not null,
  error         text
);
create index if not exists ai_calls_created_at_idx on ai_calls (created_at desc);

-- ─── Rate limiting (fixed windows, shared by every serverless instance) ────
create table if not exists rate_limits (
  key          text        not null,
  window_start timestamptz not null,
  count        int         not null default 0,
  primary key (key, window_start)
);
create index if not exists rate_limits_window_idx on rate_limits (window_start);

-- ─── Every lead on the site, whatever the funnel, in one shape (/painel) ───
create or replace view all_leads as
  select id, created_at, tool as source, name, phone as whatsapp, email, clinic_name, city,
         score, headline, whatsapp_sent, status
    from tool_leads
  union all
  select id, created_at, 'raio-x', name, whatsapp, null, clinic_name, city,
         lead_score, coalesce(lead_tier, '') || ' · ' || role, null, status
    from raiox_leads
  union all
  select id, created_at, 'unicornio', nome, whatsapp, email, clinica, cidade,
         total, arquetipo, null, 'new'
    from unicornio_leads
  union all
  select id, created_at, 'raio-x-scorecard', name, whatsapp, email, clinic_name, null,
         round(((vis_score + op_score) / 2) * 100), 'rota: ' || route, null, 'new'
    from raio_x_scorecard_leads;
