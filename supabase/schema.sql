-- Anto x Luca leads table (run in Supabase SQL editor)

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  preferred_product text not null,
  consent_marketing boolean not null default false,
  source text,
  campaign text,
  medium text,
  content text,
  term text,
  landing_variant text,
  created_at timestamptz not null default now()
);

create unique index if not exists leads_email_unique on public.leads (lower(email));

alter table public.leads enable row level security;

-- No public policies: access only via service role from Next.js API
