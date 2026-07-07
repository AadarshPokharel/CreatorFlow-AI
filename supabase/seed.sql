do $$
declare
  demo_user_id uuid;
  workspace_id uuid;
  folder_id uuid;
  project_id uuid;
  tag_id uuid;
begin
  select id into demo_user_id from auth.users order by created_at asc limit 1;

  if demo_user_id is null then
    raise notice 'No auth.users record found. Create a user first, then rerun seed.sql.';
    return;
  end if;

  insert into public.profiles (id, full_name, bio)
  values (
    demo_user_id,
    'CreatorFlow Demo User',
    'Building an original short-form content operating system.'
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    bio = excluded.bio;

  insert into public.workspaces (owner_id, name, slug)
  values (
    demo_user_id,
    'CreatorFlow Demo Studio',
    'creatorflow-demo-studio'
  )
  on conflict (slug) do update
  set name = excluded.name
  returning id into workspace_id;

  if workspace_id is null then
    select id into workspace_id
    from public.workspaces
    where slug = 'creatorflow-demo-studio';
  end if;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (workspace_id, demo_user_id, 'owner')
  on conflict (workspace_id, user_id) do nothing;

  insert into public.user_settings (
    user_id,
    auto_generate_enabled,
    min_daily_drafts,
    max_daily_drafts
  )
  values (demo_user_id, true, 2, 4)
  on conflict (user_id) do update
  set
    auto_generate_enabled = excluded.auto_generate_enabled,
    min_daily_drafts = excluded.min_daily_drafts,
    max_daily_drafts = excluded.max_daily_drafts;

  insert into public.folders (workspace_id, name, color)
  values (workspace_id, 'July Launch', '#38bdf8')
  returning id into folder_id;

  insert into public.tags (workspace_id, name, color)
  values (workspace_id, 'AI', '#f59e0b')
  on conflict (workspace_id, name) do update
  set color = excluded.color
  returning id into tag_id;

  insert into public.projects (
    workspace_id,
    folder_id,
    title,
    platform,
    niche,
    tone,
    duration_seconds,
    status,
    notes,
    is_favorite,
    created_by_ai
  )
  values (
    workspace_id,
    folder_id,
    '3 AI Prompts That Save 2 Hours a Day',
    'youtube_shorts',
    'ai',
    'educational',
    45,
    'scheduled',
    'Pair with keyboard B-roll and UI closeups.',
    true,
    true
  )
  returning id into project_id;

  insert into public.content_scripts (
    project_id,
    hook,
    script,
    shot_list,
    voiceover_script,
    cta,
    seo_title,
    thumbnail_idea,
    compliance_note
  )
  values (
    project_id,
    'If your content workflow still starts with a blank page, use these three prompts.',
    'Open with the pain point. Show one prompt for research, one for scripting, and one for repurposing. End with a simple challenge to test one today.',
    '["Fast close-up of Notion board with empty cards.","On-screen text introducing Prompt 1.","Screen recording of a prompt turning into a script outline.","Talking-head breakdown with bold captions."]'::jsonb,
    'Most creators waste time starting from zero. These three prompt formats help you research faster, structure faster, and ship faster.',
    'Comment prompt if you want a full template pack.',
    '3 AI Prompt Formats for Short-Form Creators',
    'Split-screen layout with Blank Page on left and 3 Prompt System on right.',
    'Built from original educational concepts and creator-owned workflow examples.'
  )
  on conflict (project_id) do nothing;

  insert into public.content_captions (
    project_id,
    caption,
    hashtags
  )
  values (
    project_id,
    'Three original prompt formats I use to turn blank ideas into publish-ready short-form content.',
    array['#creatorflow', '#aishorts', '#contentsystem', '#prompting']
  )
  on conflict (project_id) do nothing;

  insert into public.project_tags (project_id, tag_id)
  values (project_id, tag_id)
  on conflict (project_id, tag_id) do nothing;

  insert into public.calendar_entries (
    workspace_id,
    project_id,
    entry_date,
    status,
    title,
    platform
  )
  values (
    workspace_id,
    project_id,
    date '2026-07-07',
    'scheduled',
    '3 AI Prompts That Save 2 Hours a Day',
    'youtube_shorts'
  );

  insert into public.project_analytics (
    project_id,
    metric_date,
    views,
    likes,
    comments,
    shares,
    followers_gained,
    watch_time_seconds,
    engagement_rate
  )
  values (
    project_id,
    current_date,
    12040,
    1180,
    86,
    150,
    74,
    18200,
    11.7
  )
  on conflict (project_id, metric_date) do update
  set
    views = excluded.views,
    likes = excluded.likes,
    comments = excluded.comments,
    shares = excluded.shares,
    followers_gained = excluded.followers_gained,
    watch_time_seconds = excluded.watch_time_seconds,
    engagement_rate = excluded.engagement_rate;

  insert into public.notifications (user_id, kind, title, body)
  values (
    demo_user_id,
    'seed',
    'CreatorFlow demo data loaded',
    'Your demo workspace now includes a seeded project, script, caption, analytics, and calendar entry.'
  );
end $$;
