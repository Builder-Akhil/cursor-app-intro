-- Fable v0.1 hangar: profiles, story/vision logbook, waitlist, private image locker.
-- Apply on the dedicated Fable Supabase project only (not the invoice database).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'Friend',
  email text not null,
  hope text,
  stuck text,
  becoming text,
  nature_place text,
  season_word text,
  category text check (category in ('seeker', 'builder', 'healer', 'wanderer')),
  onboarding_complete boolean not null default false,
  ambience_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('story', 'vision')),
  status text not null default 'ready' check (status in ('ready', 'generating', 'failed')),
  source text not null default 'template' check (source in ('template', 'ai')),
  title text not null,
  body text not null default '',
  prompt text,
  image_url text,
  image_path text,
  answers_snapshot jsonb not null default '{}'::jsonb,
  category_snapshot text not null check (category_snapshot in ('seeker', 'builder', 'healer', 'wanderer')),
  model text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index entries_user_created_idx on public.entries (user_id, created_at desc);
create index entries_user_type_idx on public.entries (user_id, type);

create table public.waitlist (
  email text primary key,
  joined_at timestamptz not null default now(),
  constraint waitlist_email_looks_valid check (position('@' in email) > 1)
);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger entries_set_updated_at
  before update on public.entries
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Hangar badge: every new Auth user gets a profile row.
-- security definer so the insert is not blocked by RLS.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), 'Friend'),
    coalesce(new.email, '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.normalize_waitlist_email()
returns trigger
language plpgsql
as $$
begin
  new.email := lower(trim(new.email));
  return new;
end;
$$;

create trigger waitlist_normalize_email
  before insert or update on public.waitlist
  for each row execute function public.normalize_waitlist_email();

-- ---------------------------------------------------------------------------
-- Grants: least privilege. Anon may only join the waitlist.
-- ---------------------------------------------------------------------------

revoke all on table public.profiles from anon, authenticated, public;
revoke all on table public.entries from anon, authenticated, public;
revoke all on table public.waitlist from anon, authenticated, public;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.entries to authenticated;
grant insert on table public.waitlist to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security — the canopy lock. UI is not enough.
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.entries enable row level security;
alter table public.waitlist enable row level security;

alter table public.profiles force row level security;
alter table public.entries force row level security;
alter table public.waitlist force row level security;

create policy profiles_select_own
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy profiles_insert_own
  on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));

create policy profiles_update_own
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy entries_select_own
  on public.entries for select to authenticated
  using (user_id = (select auth.uid()));

create policy entries_insert_own
  on public.entries for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy entries_update_own
  on public.entries for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy entries_delete_own
  on public.entries for delete to authenticated
  using (user_id = (select auth.uid()));

create policy waitlist_insert_anyone
  on public.waitlist for insert to anon, authenticated
  with check (true);

-- No select/update/delete on waitlist for clients. Dashboard / service role only.

-- ---------------------------------------------------------------------------
-- Private locker for later AI hero images. Empty until that engine is wired.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('vision-images', 'vision-images', false)
on conflict (id) do nothing;

create policy vision_images_select_own
  on storage.objects for select to authenticated
  using (
    bucket_id = 'vision-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy vision_images_insert_own
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'vision-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy vision_images_update_own
  on storage.objects for update to authenticated
  using (
    bucket_id = 'vision-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'vision-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy vision_images_delete_own
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'vision-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
