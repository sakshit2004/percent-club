-- Create profiles table for user data
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  agent_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create RLS policies
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- Create pods table for savings goals
create table if not exists public.pods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_amount decimal(10,2) not null,
  current_amount decimal(10,2) default 0,
  target_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for pods
alter table public.pods enable row level security;

-- Create RLS policies for pods
create policy "pods_select_own"
  on public.pods for select
  using (auth.uid() = user_id);

create policy "pods_insert_own"
  on public.pods for insert
  with check (auth.uid() = user_id);

create policy "pods_update_own"
  on public.pods for update
  using (auth.uid() = user_id);

create policy "pods_delete_own"
  on public.pods for delete
  using (auth.uid() = user_id);

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, agent_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', null),
    coalesce(new.raw_user_meta_data ->> 'agent_name', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Create trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
