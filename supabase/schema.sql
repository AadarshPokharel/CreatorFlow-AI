create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'platform_type') then
    create type public.platform_type as enum ('tiktok', 'instagram', 'youtube_shorts');
  end if;

  if not exists (select 1 from pg_type where typname = 'niche_type') then
    create type public.niche_type as enum (
      'fitness',
      'travel',
      'food',
      'motivation',
      'finance',
      'ai',
      'tech',
      'education',
      'gaming',
      'custom'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'tone_type') then
    create type public.tone_type as enum (
      'funny',
      'educational',
      'emotional',
      'storytelling',
      'viral',
      'luxury',
      'minimal'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'content_status_type') then
    create type public.content_status_type as enum (
      'draft',
      'ready',
      'scheduled',
      'posted',
      'missed',
      'archived'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'asset_type_enum') then
    create type public.asset_type_enum as enum (
      'image',
      'video',
      'audio',
      'subtitle',
      'overlay',
      'thumbnail'
    );
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.is_workspace_member(target_workspace uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members workspace_member
    where workspace_member.workspace_id = target_workspace
      and workspace_member.user_id = auth.uid()
  );
$$;

create or replace function public.is_workspace_owner(target_workspace uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members workspace_member
    where workspace_member.workspace_id = target_workspace
      and workspace_member.user_id = auth.uid()
      and workspace_member.role = 'owner'
  );
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'editor', 'viewer')),
  created_at timestamptz not null default timezone('utc', now()),
  unique (workspace_id, user_id)
);

create table if not exists public.folders (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  parent_folder_id uuid references public.folders(id) on delete set null,
  name text not null,
  color text default '#38bdf8',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  folder_id uuid references public.folders(id) on delete set null,
  title text not null,
  platform public.platform_type not null,
  niche public.niche_type not null,
  tone public.tone_type not null,
  duration_seconds integer not null check (duration_seconds in (15, 30, 45, 60)),
  status public.content_status_type not null default 'draft',
  notes text,
  is_favorite boolean not null default false,
  archived_at timestamptz,
  scheduled_for timestamptz,
  created_by_ai boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.content_scripts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  hook text not null,
  script text not null,
  shot_list jsonb not null default '[]'::jsonb,
  voiceover_script text not null,
  cta text,
  seo_title text,
  thumbnail_idea text,
  compliance_note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.content_captions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  caption text not null,
  hashtags text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.project_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  asset_type public.asset_type_enum not null,
  label text not null,
  storage_path text,
  source_kind text not null check (source_kind in ('user-upload', 'ai-generated', 'licensed')),
  duration_seconds numeric,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.video_exports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued', 'processing', 'ready', 'failed')),
  export_url text,
  include_subtitles boolean not null default true,
  include_progress_bar boolean not null default true,
  text_overlay_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.project_analytics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  metric_date date not null default current_date,
  views integer not null default 0,
  likes integer not null default 0,
  comments integer not null default 0,
  shares integer not null default 0,
  followers_gained integer not null default 0,
  watch_time_seconds integer not null default 0,
  engagement_rate numeric(6,2) not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (project_id, metric_date)
);

create table if not exists public.calendar_entries (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  entry_date date not null,
  status public.content_status_type not null default 'draft',
  title text not null,
  platform public.platform_type not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  color text not null default '#f59e0b',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (workspace_id, name)
);

create table if not exists public.project_tags (
  project_id uuid not null references public.projects(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (project_id, tag_id)
);

create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  theme text not null default 'dark' check (theme in ('dark', 'light', 'system')),
  auto_generate_enabled boolean not null default false,
  min_daily_drafts integer not null default 0 check (min_daily_drafts >= 0 and min_daily_drafts <= 25),
  max_daily_drafts integer not null default 0 check (max_daily_drafts >= 0 and max_daily_drafts <= 25),
  ai_preferences jsonb not null default '{"defaultTone":"educational","preferredDuration":30,"originalityGuardrails":"strict"}'::jsonb,
  notification_preferences jsonb not null default '{"email":true,"inApp":true,"weeklySummary":true}'::jsonb,
  export_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (max_daily_drafts >= min_daily_drafts)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'general',
  title text not null,
  body text not null,
  action_url text,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  label text not null,
  encrypted_value text,
  last_four text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists projects_workspace_id_idx on public.projects(workspace_id);
create index if not exists projects_status_idx on public.projects(status);
create index if not exists projects_scheduled_for_idx on public.projects(scheduled_for);
create index if not exists analytics_project_id_idx on public.project_analytics(project_id);
create index if not exists calendar_workspace_date_idx on public.calendar_entries(workspace_id, entry_date);
create index if not exists notifications_user_id_idx on public.notifications(user_id, created_at desc);
create index if not exists assets_project_id_idx on public.project_assets(project_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_workspaces_updated_at on public.workspaces;
create trigger set_workspaces_updated_at
before update on public.workspaces
for each row execute function public.set_updated_at();

drop trigger if exists set_folders_updated_at on public.folders;
create trigger set_folders_updated_at
before update on public.folders
for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_content_scripts_updated_at on public.content_scripts;
create trigger set_content_scripts_updated_at
before update on public.content_scripts
for each row execute function public.set_updated_at();

drop trigger if exists set_content_captions_updated_at on public.content_captions;
create trigger set_content_captions_updated_at
before update on public.content_captions
for each row execute function public.set_updated_at();

drop trigger if exists set_project_assets_updated_at on public.project_assets;
create trigger set_project_assets_updated_at
before update on public.project_assets
for each row execute function public.set_updated_at();

drop trigger if exists set_video_exports_updated_at on public.video_exports;
create trigger set_video_exports_updated_at
before update on public.video_exports
for each row execute function public.set_updated_at();

drop trigger if exists set_project_analytics_updated_at on public.project_analytics;
create trigger set_project_analytics_updated_at
before update on public.project_analytics
for each row execute function public.set_updated_at();

drop trigger if exists set_calendar_entries_updated_at on public.calendar_entries;
create trigger set_calendar_entries_updated_at
before update on public.calendar_entries
for each row execute function public.set_updated_at();

drop trigger if exists set_tags_updated_at on public.tags;
create trigger set_tags_updated_at
before update on public.tags
for each row execute function public.set_updated_at();

drop trigger if exists set_user_settings_updated_at on public.user_settings;
create trigger set_user_settings_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_user_api_keys_updated_at on public.user_api_keys;
create trigger set_user_api_keys_updated_at
before update on public.user_api_keys
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  created_workspace_id uuid;
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;

  insert into public.workspaces (owner_id, name, slug)
  values (
    new.id,
    'My Creator Studio',
    'studio-' || substr(replace(new.id::text, '-', ''), 1, 10)
  )
  returning id into created_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (created_workspace_id, new.id, 'owner')
  on conflict (workspace_id, user_id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.folders enable row level security;
alter table public.projects enable row level security;
alter table public.content_scripts enable row level security;
alter table public.content_captions enable row level security;
alter table public.project_assets enable row level security;
alter table public.video_exports enable row level security;
alter table public.project_analytics enable row level security;
alter table public.calendar_entries enable row level security;
alter table public.tags enable row level security;
alter table public.project_tags enable row level security;
alter table public.user_settings enable row level security;
alter table public.notifications enable row level security;
alter table public.user_api_keys enable row level security;

drop policy if exists "Profiles are viewable by the owner" on public.profiles;
create policy "Profiles are viewable by the owner"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Profiles are editable by the owner" on public.profiles;
create policy "Profiles are editable by the owner"
on public.profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Workspace members can view workspaces" on public.workspaces;
create policy "Workspace members can view workspaces"
on public.workspaces for select
using (public.is_workspace_member(id));

drop policy if exists "Owners can manage workspaces" on public.workspaces;
create policy "Owners can manage workspaces"
on public.workspaces for all
using (public.is_workspace_owner(id) or owner_id = auth.uid())
with check (owner_id = auth.uid() or public.is_workspace_owner(id));

drop policy if exists "Members can view workspace membership" on public.workspace_members;
create policy "Members can view workspace membership"
on public.workspace_members for select
using (public.is_workspace_member(workspace_id));

drop policy if exists "Owners can manage workspace membership" on public.workspace_members;
create policy "Owners can manage workspace membership"
on public.workspace_members for all
using (public.is_workspace_owner(workspace_id))
with check (public.is_workspace_owner(workspace_id));

drop policy if exists "Members can access folders" on public.folders;
create policy "Members can access folders"
on public.folders for all
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

drop policy if exists "Members can access projects" on public.projects;
create policy "Members can access projects"
on public.projects for all
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

drop policy if exists "Members can access scripts" on public.content_scripts;
create policy "Members can access scripts"
on public.content_scripts for all
using (
  exists (
    select 1
    from public.projects project
    where project.id = content_scripts.project_id
      and public.is_workspace_member(project.workspace_id)
  )
)
with check (
  exists (
    select 1
    from public.projects project
    where project.id = content_scripts.project_id
      and public.is_workspace_member(project.workspace_id)
  )
);

drop policy if exists "Members can access captions" on public.content_captions;
create policy "Members can access captions"
on public.content_captions for all
using (
  exists (
    select 1
    from public.projects project
    where project.id = content_captions.project_id
      and public.is_workspace_member(project.workspace_id)
  )
)
with check (
  exists (
    select 1
    from public.projects project
    where project.id = content_captions.project_id
      and public.is_workspace_member(project.workspace_id)
  )
);

drop policy if exists "Members can access assets" on public.project_assets;
create policy "Members can access assets"
on public.project_assets for all
using (
  exists (
    select 1
    from public.projects project
    where project.id = project_assets.project_id
      and public.is_workspace_member(project.workspace_id)
  )
)
with check (
  exists (
    select 1
    from public.projects project
    where project.id = project_assets.project_id
      and public.is_workspace_member(project.workspace_id)
  )
);

drop policy if exists "Members can access exports" on public.video_exports;
create policy "Members can access exports"
on public.video_exports for all
using (
  exists (
    select 1
    from public.projects project
    where project.id = video_exports.project_id
      and public.is_workspace_member(project.workspace_id)
  )
)
with check (
  exists (
    select 1
    from public.projects project
    where project.id = video_exports.project_id
      and public.is_workspace_member(project.workspace_id)
  )
);

drop policy if exists "Members can access analytics" on public.project_analytics;
create policy "Members can access analytics"
on public.project_analytics for all
using (
  exists (
    select 1
    from public.projects project
    where project.id = project_analytics.project_id
      and public.is_workspace_member(project.workspace_id)
  )
)
with check (
  exists (
    select 1
    from public.projects project
    where project.id = project_analytics.project_id
      and public.is_workspace_member(project.workspace_id)
  )
);

drop policy if exists "Members can access calendar entries" on public.calendar_entries;
create policy "Members can access calendar entries"
on public.calendar_entries for all
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

drop policy if exists "Members can access tags" on public.tags;
create policy "Members can access tags"
on public.tags for all
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

drop policy if exists "Members can access project tags" on public.project_tags;
create policy "Members can access project tags"
on public.project_tags for all
using (
  exists (
    select 1
    from public.projects project
    where project.id = project_tags.project_id
      and public.is_workspace_member(project.workspace_id)
  )
)
with check (
  exists (
    select 1
    from public.projects project
    where project.id = project_tags.project_id
      and public.is_workspace_member(project.workspace_id)
  )
);

drop policy if exists "Users can access their own settings" on public.user_settings;
create policy "Users can access their own settings"
on public.user_settings for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can access their own notifications" on public.notifications;
create policy "Users can access their own notifications"
on public.notifications for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can access their own api keys" on public.user_api_keys;
create policy "Users can access their own api keys"
on public.user_api_keys for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('creatorflow-assets', 'creatorflow-assets', true)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can read creatorflow assets" on storage.objects;
create policy "Authenticated users can read creatorflow assets"
on storage.objects for select
using (bucket_id = 'creatorflow-assets' and auth.uid() is not null);

drop policy if exists "Authenticated users can upload creatorflow assets" on storage.objects;
create policy "Authenticated users can upload creatorflow assets"
on storage.objects for insert
with check (bucket_id = 'creatorflow-assets' and auth.uid() is not null);

drop policy if exists "Authenticated users can update creatorflow assets" on storage.objects;
create policy "Authenticated users can update creatorflow assets"
on storage.objects for update
using (bucket_id = 'creatorflow-assets' and auth.uid() is not null)
with check (bucket_id = 'creatorflow-assets' and auth.uid() is not null);

drop policy if exists "Authenticated users can delete creatorflow assets" on storage.objects;
create policy "Authenticated users can delete creatorflow assets"
on storage.objects for delete
using (bucket_id = 'creatorflow-assets' and auth.uid() is not null);
