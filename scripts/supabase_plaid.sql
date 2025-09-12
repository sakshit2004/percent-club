-- Enable UUID + crypto
create extension if not exists "pgcrypto";

-- PODS (virtual envelopes)
create table if not exists public.pods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_amount_cents integer,
  target_date date,
  visibility text not null default 'private',
  featured_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists pods_user_idx on public.pods(user_id);

-- Savings ledger
create table if not exists public.challenge_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pod_id uuid not null references public.pods(id) on delete cascade,
  source text not null,
  amount_cents integer not null check (amount_cents > 0),
  status text not null default 'posted',
  verification_source text,
  note text,
  created_at timestamptz not null default now(),
  verified_at timestamptz
);
create index if not exists ch_events_user_idx on public.challenge_events(user_id);
create index if not exists ch_events_pod_idx on public.challenge_events(pod_id);
create index if not exists ch_events_source_idx on public.challenge_events(source);

-- User challenge bindings
create table if not exists public.user_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_key text not null,
  sink_pod_id uuid not null references public.pods(id) on delete cascade,
  status text not null default 'on',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, challenge_key)
);

-- Plaid items & accounts
create table if not exists public.plaid_items (
  item_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  access_token_enc text not null,
  institution_name text,
  status text not null default 'ok',
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists plaid_items_user_idx on public.plaid_items(user_id);

create table if not exists public.plaid_accounts (
  id uuid primary key default gen_random_uuid(),
  item_id text not null references public.plaid_items(item_id) on delete cascade,
  account_id text not null unique,
  name text,
  mask text,
  type text,
  subtype text,
  official_name text
);
create index if not exists plaid_accounts_item_idx on public.plaid_accounts(item_id);

-- Transactions
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null references public.plaid_items(item_id) on delete cascade,
  account_id text not null,
  plaid_tx_id text not null unique,
  date date not null,
  name text not null,
  merchant_name text,
  amount_cents integer not null,
  pending boolean not null default false,
  category text[],
  created_at timestamptz not null default now()
);
create index if not exists tx_user_date_idx on public.transactions(user_id, date desc);
create index if not exists tx_item_idx on public.transactions(item_id);
create index if not exists tx_account_idx on public.transactions(account_id);

-- Recurring streams
create table if not exists public.recurring_streams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null references public.plaid_items(item_id) on delete cascade,
  stream_id text not null unique,
  merchant text,
  cadence text,
  next_date date,
  average_amount_cents integer,
  last_amount_cents integer,
  category text[],
  status text not null default 'active',
  created_at timestamptz not null default now()
);
create index if not exists rec_streams_user_next_idx on public.recurring_streams(user_id, next_date);

-- Roundups state
create table if not exists public.roundup_state (
  user_challenge_id uuid primary key references public.user_challenges(id) on delete cascade,
  pending_cents integer not null default 0,
  last_txn_sync_at timestamptz
);

-- Security: RLS
alter table public.pods enable row level security;
alter table public.challenge_events enable row level security;
alter table public.user_challenges enable row level security;
alter table public.plaid_items enable row level security;
alter table public.plaid_accounts enable row level security;
alter table public.transactions enable row level security;
alter table public.recurring_streams enable row level security;
alter table public.roundup_state enable row level security;

-- Policies
drop policy if exists "pods_owner_rw" on public.pods;
create policy "pods_owner_rw" on public.pods
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ch_events_owner_rw" on public.challenge_events;
create policy "ch_events_owner_rw" on public.challenge_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_challenges_owner_rw" on public.user_challenges;
create policy "user_challenges_owner_rw" on public.user_challenges
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "plaid_items_owner_rw" on public.plaid_items;
create policy "plaid_items_owner_rw" on public.plaid_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "plaid_accounts_owner_r" on public.plaid_accounts;
create policy "plaid_accounts_owner_r" on public.plaid_accounts
  for select using (exists(select 1 from public.plaid_items pi where pi.item_id = plaid_accounts.item_id and pi.user_id = auth.uid()));

drop policy if exists "transactions_owner_r" on public.transactions;
create policy "transactions_owner_r" on public.transactions
  for select using (auth.uid() = user_id);

drop policy if exists "rec_streams_owner_r" on public.recurring_streams;
create policy "rec_streams_owner_r" on public.recurring_streams
  for select using (auth.uid() = user_id);

drop policy if exists "roundup_state_owner_rw" on public.roundup_state;
create policy "roundup_state_owner_rw" on public.roundup_state
  for all using (exists(select 1 from public.user_challenges uc where uc.id = roundup_state.user_challenge_id and uc.user_id = auth.uid()))
  with check (exists(select 1 from public.user_challenges uc where uc.id = roundup_state.user_challenge_id and uc.user_id = auth.uid()));

-- Helpers: increment pending cents safely
create or replace function public.ensure_roundup_state(p_user_challenge_id uuid)
returns void as $$
begin
  insert into public.roundup_state(user_challenge_id) values (p_user_challenge_id)
  on conflict (user_challenge_id) do nothing;
end;
$$ language plpgsql security definer;

create or replace function public.increment_roundup_pending(p_user_challenge_id uuid, p_delta integer)
returns void as $$
begin
  update public.roundup_state
  set pending_cents = greatest(0, pending_cents + p_delta)
  where user_challenge_id = p_user_challenge_id;
end;
$$ language plpgsql security definer;


