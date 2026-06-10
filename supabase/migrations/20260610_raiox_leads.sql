create table raiox_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  cohort text not null default 'jun-jul-2026',
  status text not null default 'new',
  name text not null,
  clinic_name text not null,
  city text not null,
  whatsapp text not null,
  instagram text,
  site_url text,
  role text not null,
  chairs text not null,
  procedures text[] not null,
  marketing_owner text not null,
  lead_score int,
  lead_tier text,
  trojan_signal text,
  trojan_predicted text,
  nota_final int,
  utm jsonb,
  notes text
);

create index on raiox_leads (cohort, status);

-- RLS: enable, no public policies (all access via service role in route handlers)
alter table raiox_leads enable row level security;
