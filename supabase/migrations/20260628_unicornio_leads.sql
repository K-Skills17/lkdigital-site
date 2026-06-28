-- Raio-X da Clínica Unicórnio™ — scorecard leads
create table unicornio_leads (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null    default now(),
  nome         text        not null,
  clinica      text        not null,
  especialidade text       not null,
  cidade       text        not null,
  whatsapp     text        not null,
  email        text,
  total        int         not null check (total between 0 and 42),
  arquetipo    text        not null,
  scores       jsonb       not null,   -- { posicionamento, oferta, modelo, marca, aquisicao, experiencia, sistemas }
  alavancas_fracas text[]  not null,   -- 2-element array of lever keys
  respostas    int[]       not null,   -- 14 answers (0-3 each)
  consent      boolean     not null default true,
  source       text        not null default 'raio-x'
);

create index unicornio_leads_created_at_idx on unicornio_leads (created_at desc);
create index unicornio_leads_arquetipo_idx  on unicornio_leads (arquetipo);

-- RLS: enable with no public policies — all access via service role key in route handlers
alter table unicornio_leads enable row level security;
