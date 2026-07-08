-- Migration: raio_x_scorecard_leads
-- Created: 2026-07-07

create table if not exists raio_x_scorecard_leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- Contact
  name          text not null,
  clinic_name   text not null,
  whatsapp      text,
  email         text,

  -- Scores
  vis_score     numeric(4,3) not null check (vis_score between 0 and 1),
  vis_gap       boolean not null,
  op_score      numeric(4,3) not null check (op_score between 0 and 1),
  op_gap        boolean not null,
  route         text not null check (route in ('lk', 'marcos', 'dual', 'optimize')),

  -- Raw answers (JSONB for flexibility)
  answers       jsonb not null default '{}',

  -- LGPD
  consent       boolean not null default true,
  consent_at    timestamptz not null default now(),

  -- Constraints
  constraint at_least_one_contact check (whatsapp is not null or email is not null)
);

-- Index for CRM queries
create index if not exists idx_raiox_leads_route      on raio_x_scorecard_leads (route);
create index if not exists idx_raiox_leads_created_at on raio_x_scorecard_leads (created_at desc);

-- RLS: only service role can read/write (API uses service role key)
alter table raio_x_scorecard_leads enable row level security;

-- No public policies â€” all access via service_role key in API routes
