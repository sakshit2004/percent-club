-- Social schema for real-time communities, follows, posts, comments, likes, challenges, notifications, presence
-- Run this in your Supabase SQL editor. RLS is enabled; policies assume authenticated users.

-- Extensions
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null check (handle ~ '^[a-zA-Z0-9_]{3,20}$'),
  name text not null,
  avatar_url text,
  bio text,
  privacy text not null default 'public' check (privacy in ('public','protected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_profiles_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.touch_profiles_updated_at();

alter table public.profiles enable row level security;

create policy "profiles_read_all" on public.profiles
  for select using (true);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Follows
create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  followee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'accepted' check (status in ('accepted','requested','blocked')),
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id)
);

alter table public.follows enable row level security;

create policy "follows_read_related" on public.follows
  for select using (
    follower_id = auth.uid() or followee_id = auth.uid() or
    exists(select 1 from public.profiles p where p.id = auth.uid())
  );

create policy "follows_insert_self" on public.follows
  for insert with check (follower_id = auth.uid());

create policy "follows_delete_self" on public.follows
  for delete using (follower_id = auth.uid() or followee_id = auth.uid());

-- Communities
create table if not exists public.communities (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  cover_url text,
  visibility text not null default 'public' check (visibility in ('public','private','invite')),
  tags text[] not null default '{}',
  rules text,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.communities enable row level security;

create policy "communities_read_public_or_member" on public.communities
  for select using (
    visibility = 'public' or
    exists (
      select 1 from public.community_members m
      where m.community_id = id and m.user_id = auth.uid() and m.status = 'joined'
    ) or owner_id = auth.uid()
  );

create policy "communities_insert_owner" on public.communities
  for insert with check (owner_id = auth.uid());

create policy "communities_update_owner_admin" on public.communities
  for update using (
    owner_id = auth.uid() or exists (
      select 1 from public.community_members m
      where m.community_id = id and m.user_id = auth.uid() and m.role in ('owner','admin') and m.status = 'joined'
    )
  );

-- Community members
create table if not exists public.community_members (
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','moderator','member')),
  status text not null default 'joined' check (status in ('joined','requested','invited')),
  created_at timestamptz not null default now(),
  primary key (community_id, user_id)
);

alter table public.community_members enable row level security;

create policy "community_members_read_public_or_self" on public.community_members
  for select using (
    exists(select 1 from public.communities c where c.id = community_id and (
      c.visibility = 'public' or c.owner_id = auth.uid()
    )) or user_id = auth.uid() or
    exists(select 1 from public.community_members m where m.community_id = community_id and m.user_id = auth.uid() and m.status = 'joined')
  );

create policy "community_members_insert_self_request" on public.community_members
  for insert with check (
    user_id = auth.uid()
  );

create policy "community_members_update_admin_or_self" on public.community_members
  for update using (
    user_id = auth.uid() or exists (
      select 1 from public.community_members m
      where m.community_id = community_id and m.user_id = auth.uid() and m.role in ('owner','admin','moderator') and m.status = 'joined'
    )
  );

create policy "community_members_delete_self_or_admin" on public.community_members
  for delete using (
    user_id = auth.uid() or exists (
      select 1 from public.community_members m
      where m.community_id = community_id and m.user_id = auth.uid() and m.role in ('owner','admin') and m.status = 'joined'
    )
  );

-- Posts
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  community_id uuid references public.communities(id) on delete cascade,
  text text not null,
  image_url text,
  link_url text,
  visibility text not null default 'public' check (visibility in ('public','followers')),
  is_removed boolean not null default false,
  removed_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_posts_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at before update on public.posts
for each row execute function public.touch_posts_updated_at();

alter table public.posts enable row level security;

create policy "posts_read_visibility" on public.posts
  for select using (
    is_removed = false and (
      community_id is null and (
        visibility = 'public' or exists (
          select 1 from public.follows f where f.followee_id = author_id and f.follower_id = auth.uid() and f.status = 'accepted'
        ) or author_id = auth.uid()
      ) or
      community_id is not null and (
        exists(
          select 1 from public.communities c where c.id = community_id and c.visibility = 'public'
        ) or exists (
          select 1 from public.community_members m where m.community_id = community_id and m.user_id = auth.uid() and m.status = 'joined'
        )
      )
    )
  );

create policy "posts_insert_self" on public.posts
  for insert with check (
    author_id = auth.uid() and (
      community_id is null or exists (
        select 1 from public.community_members m where m.community_id = posts.community_id and m.user_id = auth.uid() and m.status = 'joined'
      )
    )
  );

create policy "posts_update_owner_or_moderator" on public.posts
  for update using (
    author_id = auth.uid() or (
      community_id is not null and exists (
        select 1 from public.community_members m
        where m.community_id = posts.community_id and m.user_id = auth.uid() and m.role in ('owner','admin','moderator') and m.status = 'joined'
      )
    )
  );

create policy "posts_delete_owner_or_moderator" on public.posts
  for delete using (
    author_id = auth.uid() or (
      community_id is not null and exists (
        select 1 from public.community_members m
        where m.community_id = posts.community_id and m.user_id = auth.uid() and m.role in ('owner','admin','moderator') and m.status = 'joined'
      )
    )
  );

-- Likes
create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.post_likes enable row level security;

create policy "post_likes_read_visible" on public.post_likes
  for select using (
    exists (select 1 from public.posts p where p.id = post_id)
  );

create policy "post_likes_insert_self" on public.post_likes
  for insert with check (user_id = auth.uid());

create policy "post_likes_delete_self" on public.post_likes
  for delete using (user_id = auth.uid());

-- Comments
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "comments_read_visible" on public.comments
  for select using (exists (select 1 from public.posts p where p.id = post_id));

create policy "comments_insert_self" on public.comments
  for insert with check (
    user_id = auth.uid() and exists (select 1 from public.posts p where p.id = post_id)
  );

create policy "comments_delete_self_or_moderator" on public.comments
  for delete using (
    user_id = auth.uid() or exists (
      select 1 from public.posts p join public.community_members m on m.community_id = p.community_id
      where p.id = post_id and m.user_id = auth.uid() and m.role in ('owner','admin','moderator') and m.status = 'joined'
    )
  );

-- Challenges
create table if not exists public.challenges (
  id uuid primary key default uuid_generate_v4(),
  community_id uuid references public.communities(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  rules text,
  proof_type text not null check (proof_type in ('text','image','link')),
  status text not null default 'active' check (status in ('draft','active','completed','expired')),
  created_at timestamptz not null default now()
);

alter table public.challenges enable row level security;

create policy "challenges_read_public_or_member" on public.challenges
  for select using (
    community_id is null or exists (
      select 1 from public.communities c where c.id = community_id and (
        c.visibility = 'public' or exists (
          select 1 from public.community_members m where m.community_id = c.id and m.user_id = auth.uid() and m.status = 'joined'
        )
      )
    )
  );

create policy "challenges_insert_creator" on public.challenges
  for insert with check (
    creator_id = auth.uid() and (
      community_id is null or exists (
        select 1 from public.community_members m where m.community_id = challenges.community_id and m.user_id = auth.uid() and m.status = 'joined'
      )
    )
  );

create policy "challenges_update_creator_or_mod" on public.challenges
  for update using (
    creator_id = auth.uid() or exists (
      select 1 from public.community_members m where m.community_id = challenges.community_id and m.user_id = auth.uid() and m.role in ('owner','admin','moderator') and m.status = 'joined'
    )
  );

-- Challenge participants
create table if not exists public.challenge_participants (
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'invited' check (status in ('invited','accepted','declined','completed')),
  progress numeric not null default 0,
  proof text,
  verified_by uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (challenge_id, user_id)
);

alter table public.challenge_participants enable row level security;

create policy "challenge_participants_read_related" on public.challenge_participants
  for select using (
    user_id = auth.uid() or exists (
      select 1 from public.challenges ch where ch.id = challenge_id and (
        ch.creator_id = auth.uid() or exists (
          select 1 from public.community_members m where m.community_id = ch.community_id and m.user_id = auth.uid() and m.status = 'joined'
        )
      )
    )
  );

create policy "challenge_participants_insert_self" on public.challenge_participants
  for insert with check (user_id = auth.uid());

create policy "challenge_participants_update_self_or_creator" on public.challenge_participants
  for update using (
    user_id = auth.uid() or exists (
      select 1 from public.challenges ch where ch.id = challenge_id and ch.creator_id = auth.uid()
    )
  );

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "notifications_read_own" on public.notifications
  for select using (user_id = auth.uid());

create policy "notifications_insert_system_or_self" on public.notifications
  for insert with check (user_id = auth.uid());

create policy "notifications_update_own" on public.notifications
  for update using (user_id = auth.uid());

-- Activity
create table if not exists public.activities (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid not null references public.profiles(id) on delete cascade,
  verb text not null,
  object_type text not null,
  object_id uuid,
  target_type text,
  target_id uuid,
  community_id uuid,
  created_at timestamptz not null default now()
);

alter table public.activities enable row level security;

create policy "activities_read_related" on public.activities
  for select using (true);

create policy "activities_insert_self" on public.activities
  for insert with check (actor_id = auth.uid());

-- Presence (ephemeral; can be updated every 30s)
create table if not exists public.presence (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  last_seen timestamptz not null default now()
);

alter table public.presence enable row level security;

create policy "presence_read_all" on public.presence
  for select using (true);

create policy "presence_upsert_self" on public.presence
  for insert with check (user_id = auth.uid());

create policy "presence_update_self" on public.presence
  for update using (user_id = auth.uid());

-- Helper views
create or replace view public.v_posts_with_counts as
select p.*,
  coalesce(l.likes_count, 0) as likes_count,
  coalesce(c.comments_count, 0) as comments_count
from public.posts p
left join (
  select post_id, count(*)::int as likes_count from public.post_likes group by post_id
) l on l.post_id = p.id
left join (
  select post_id, count(*)::int as comments_count from public.comments group by post_id
) c on c.post_id = p.id;

grant select on public.v_posts_with_counts to anon, authenticated;

-- Realtime: enable replication
-- In Supabase UI, ensure Realtime is enabled for these tables: posts, post_likes, comments, follows, community_members, communities, challenges, challenge_participants, notifications, presence.

-- Notifications triggers
create or replace function public.notify_follow() returns trigger as $$
begin
  if (new.status = 'accepted') then
    insert into public.notifications(user_id, type, payload)
    values (new.followee_id, 'follow.accepted', jsonb_build_object('follower_id', new.follower_id));
  elsif (new.status = 'requested') then
    insert into public.notifications(user_id, type, payload)
    values (new.followee_id, 'follow.requested', jsonb_build_object('follower_id', new.follower_id));
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_notify_follow on public.follows;
create trigger trg_notify_follow after insert or update on public.follows
for each row execute function public.notify_follow();

create or replace function public.notify_like() returns trigger as $$
declare
  post_author uuid;
begin
  select author_id into post_author from public.posts where id = new.post_id;
  if post_author is not null and post_author <> new.user_id then
    insert into public.notifications(user_id, type, payload)
    values (post_author, 'post.liked', jsonb_build_object('post_id', new.post_id, 'by', new.user_id));
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_notify_like on public.post_likes;
create trigger trg_notify_like after insert on public.post_likes
for each row execute function public.notify_like();

create or replace function public.notify_comment() returns trigger as $$
declare
  post_author uuid;
begin
  select author_id into post_author from public.posts where id = new.post_id;
  if post_author is not null and post_author <> new.user_id then
    insert into public.notifications(user_id, type, payload)
    values (post_author, 'post.commented', jsonb_build_object('post_id', new.post_id, 'by', new.user_id, 'comment_id', new.id));
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_notify_comment on public.comments;
create trigger trg_notify_comment after insert on public.comments
for each row execute function public.notify_comment();

create or replace function public.notify_community_join_request() returns trigger as $$
declare
  owner uuid;
begin
  if new.status = 'requested' then
    select owner_id into owner from public.communities where id = new.community_id;
    if owner is not null then
      insert into public.notifications(user_id, type, payload)
      values (owner, 'community.join_requested', jsonb_build_object('community_id', new.community_id, 'user_id', new.user_id));
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_notify_join_request on public.community_members;
create trigger trg_notify_join_request after insert or update on public.community_members
for each row execute function public.notify_community_join_request();

create or replace function public.notify_challenge_events() returns trigger as $$
begin
  if tg_table_name = 'challenge_participants' then
    if new.status = 'invited' then
      insert into public.notifications(user_id, type, payload)
      values (new.user_id, 'challenge.invited', jsonb_build_object('challenge_id', new.challenge_id));
    elsif new.status = 'accepted' then
      insert into public.notifications(user_id, type, payload)
      values (new.user_id, 'challenge.accepted', jsonb_build_object('challenge_id', new.challenge_id));
    elsif new.status = 'completed' then
      insert into public.notifications(user_id, type, payload)
      values (new.user_id, 'challenge.completed', jsonb_build_object('challenge_id', new.challenge_id));
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_notify_challenge on public.challenge_participants;
create trigger trg_notify_challenge after insert or update on public.challenge_participants
for each row execute function public.notify_challenge_events();

