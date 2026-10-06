-- LK Digital — complete database schema (Neon / Postgres 15+).
-- Idempotent: safe to run on every deploy with `npm run db:migrate`.
-- Every lead, from every tool and lead magnet, lives in tool_leads. The old per-funnel
-- tables (raiox_leads, unicornio_leads, raio_x_scorecard_leads) are no longer created:
-- migrateLegacyLeads() in db/sql-utils.mjs copies their rows into tool_leads, and
-- db/drop-legacy-lead-tables.sql removes them once the copy is checked.

-- ─── Every lead (free tools, lead magnets, legacy funnels) — one table ──────
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
    from tool_leads;
