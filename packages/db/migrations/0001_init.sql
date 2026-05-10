-- Antiport: schema inicial
-- Aplicar sobre Supabase Postgres. Asume que existe el schema auth (Supabase Auth).

create extension if not exists "pgcrypto";

-- ==========================================================================
-- users: espejo del auth.users de Supabase
-- ==========================================================================
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ==========================================================================
-- user_profile
-- ==========================================================================
create table if not exists public.user_profile (
  user_id uuid primary key references public.users (id) on delete cascade,
  display_name text,
  language text not null default 'es',
  tone text not null default 'cercano',
  aliado_name text not null default 'Aliado',
  aliado_gender text not null default 'neutro',
  spiritual_layer boolean not null default false,
  spiritual_tradition text,
  anonymous boolean not null default false
);

-- ==========================================================================
-- blocklist_domains: lista global curada
-- ==========================================================================
create table if not exists public.blocklist_domains (
  id serial primary key,
  domain text not null unique,
  category text,
  severity smallint,
  added_at timestamptz not null default now()
);

-- ==========================================================================
-- user_blocklist_overrides
-- ==========================================================================
create table if not exists public.user_blocklist_overrides (
  user_id uuid not null references public.users (id) on delete cascade,
  domain text not null,
  kind text not null check (kind in ('whitelist','custom_block')),
  primary key (user_id, domain)
);

-- ==========================================================================
-- intervention_log: NUNCA contiene la URL
-- ==========================================================================
create table if not exists public.intervention_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  occurred_at timestamptz not null default now(),
  category text,
  mood text,
  outcome text check (outcome in ('resisted','breathed','contacted','relapsed','dismissed')),
  duration_seconds int
);

create index if not exists intervention_log_user_idx on public.intervention_log (user_id, occurred_at desc);

-- ==========================================================================
-- daily_checkins
-- ==========================================================================
create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  day date not null,
  mood text,
  energy smallint,
  slept_well boolean,
  notes text,
  unique (user_id, day)
);

-- ==========================================================================
-- streaks
-- ==========================================================================
create table if not exists public.streaks (
  user_id uuid primary key references public.users (id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_clean_day date
);

-- ==========================================================================
-- anchors
-- ==========================================================================
create table if not exists public.anchors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  kind text not null check (kind in ('photo','audio','text')),
  label text,
  content_url text,
  content_text text,
  created_at timestamptz not null default now()
);

-- ==========================================================================
-- scriptures
-- ==========================================================================
create table if not exists public.scriptures (
  id serial primary key,
  reference text not null,
  body text not null,
  tradition text not null check (tradition in ('shared','catholic','evangelical')),
  themes text[]
);

-- ==========================================================================
-- triggers_observed
-- ==========================================================================
create table if not exists public.triggers_observed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  hour smallint,
  day_of_week smallint,
  emotion text,
  count int not null default 1,
  last_seen timestamptz
);

create index if not exists triggers_observed_user_idx on public.triggers_observed (user_id);
