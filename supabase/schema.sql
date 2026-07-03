-- Container One Depot — lead capture + reservations schema
-- Run this in the Supabase SQL editor once the Supabase integration is connected.
-- The app writes to these tables via the service role key (see src/lib/leads.ts).

-- Quote requests captured from the /quote form and product pages.
create table if not exists public.quote_leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  email         text not null,
  phone         text,
  zip           text,
  message       text,
  product_slug  text,
  product_title text,
  category      text,
  quantity      integer not null default 1,
  source        text not null default 'quote_form'
);

-- Reservation requests created from the cart checkout flow.
create table if not exists public.reservations (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  email         text not null,
  phone         text,
  zip           text,
  units         jsonb not null,
  total_deposit numeric not null default 0,
  status        text not null default 'pending',
  -- Populated later when Stripe deposit collection is wired up.
  stripe_session_id      text,
  stripe_payment_status  text
);

create index if not exists quote_leads_created_at_idx on public.quote_leads (created_at desc);
create index if not exists reservations_created_at_idx on public.reservations (created_at desc);

-- Row Level Security: lock the tables down. Writes happen server-side with the
-- service role key (which bypasses RLS), so no public insert policy is needed.
-- Add authenticated admin read policies when you build an internal dashboard.
alter table public.quote_leads enable row level security;
alter table public.reservations enable row level security;
