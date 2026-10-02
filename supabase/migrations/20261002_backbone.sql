-- Backbone: one lead table for every free tool, one AI usage log, and a view
-- that unifies every lead source on the site for the /painel dashboard.

create table if not exists tool_leads (
  id               uuid        primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  tool             text        not null,          -- adapter id, e.g. 'calculadora-agenda'
  name             text        not null,
  phone            text        not null default '', -- normalized 55DDDNNNNNNNNN, '' if not given
  email            text,
  clinic_name      text,
  city             text,
  score            numeric,                         -- tool's headline number
  headline         text,                            -- one-line summary for the dashboard
  payload          jsonb       not null default '{}',
  utm              jsonb,
  report_url       text,
  ai_plan          text,
  whatsapp_sent    boolean     not null default false,
  whatsapp_channel text,                            -- 'chatbot' | 'evolution'
  whatsapp_error   text,
  capi_sent        boolean     not null default false,
  status           text        not null default 'new'
);

create index if not exists tool_leads_created_at_idx on tool_leads (created_at desc);
create index if not exists tool_leads_tool_idx       on tool_leads (tool, created_at desc);
create index if not exists tool_leads_phone_idx      on tool_leads (phone);

alter table tool_leads enable row level security;

create table if not exists ai_calls (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  source        text        not null,   -- tool id or feature ('blog-engine', …)
  lead_id       uuid        references tool_leads (id) on delete set null,
  model         text        not null,
  input_tokens  int         not null default 0,
  output_tokens int         not null default 0,
  latency_ms    int         not null default 0,
  ok            boolean     not null,
  error         text
);

create index if not exists ai_calls_created_at_idx on ai_calls (created_at desc);

alter table ai_calls enable row level security;

-- Every lead the site captures, whatever the funnel, in one shape.
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

-- Views run with the owner's rights by default; keep it service-role only like the tables.
alter view all_leads set (security_invoker = true);
revoke all on all_leads from anon, authenticated;
