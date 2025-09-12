create table if not exists public.conversations(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  agent text not null default 'penny',
  created_at timestamptz not null default now()
);
alter table public.conversations enable row level security;
create policy if not exists conv_owner on public.conversations for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.messages(
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null,
  content jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;
create policy if not exists msg_owner on public.messages for all
  using (exists(select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid()))
  with check (exists(select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid()));

create table if not exists public.agent_actions(
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  tool_name text not null,
  args jsonb not null,
  result jsonb,
  created_at timestamptz not null default now()
);
alter table public.agent_actions enable row level security;
create policy if not exists act_owner on public.agent_actions for all
  using (exists(select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid()))
  with check (exists(select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid()));


