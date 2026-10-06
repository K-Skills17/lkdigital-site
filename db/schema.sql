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

-- ─── Blog (written and published by admins in /painel/blog) ─────────────────
create table if not exists blog_posts (
  id               uuid        primary key default gen_random_uuid(),
  slug             text        not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title            text        not null,
  seo_title        text        not null default '',
  seo_description  text        not null default '',
  excerpt          text        not null default '',
  content          text        not null default '',   -- sanitized HTML
  tldr             text        not null default '',
  category         text        not null default '',
  tags             text[]      not null default '{}',
  keywords         text[]      not null default '{}',
  faq_items        jsonb       not null default '[]',
  author_slug      text        not null default 'stephen-domingos-komando',
  cta_heading      text        not null default '',
  cta_description  text        not null default '',
  cta_button       text        not null default '',
  related_slugs    text[]      not null default '{}',
  noindex          boolean     not null default false,
  reading_time     int         not null default 1,
  -- draft → published (published_at in the future = scheduled) → archived
  status           text        not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  created_by       text,
  updated_by       text,
  -- Human-in-the-loop: AI drafts must be marked reviewed before publishing.
  ai_generated     boolean     not null default false,
  ai_model         text,
  reviewed_by      text,
  reviewed_at      timestamptz,
  constraint published_has_date check (status <> 'published' or published_at is not null)
);
create index if not exists blog_posts_live_idx on blog_posts (status, published_at desc);

-- Snapshot of a post before every save, so any edit can be undone.
create table if not exists blog_post_revisions (
  id        uuid        primary key default gen_random_uuid(),
  post_id   uuid        not null references blog_posts (id) on delete cascade,
  saved_at  timestamptz not null default now(),
  saved_by  text,
  snapshot  jsonb       not null
);
create index if not exists blog_post_revisions_post_idx on blog_post_revisions (post_id, saved_at desc);

-- Small key/value table for one-time jobs (e.g. "blog seeded").
create table if not exists app_meta (
  key   text primary key,
  value text not null,
  at    timestamptz not null default now()
);

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
