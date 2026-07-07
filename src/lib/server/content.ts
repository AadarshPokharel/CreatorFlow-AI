import { createClient } from "@supabase/supabase-js";

import { LocalCreativeEngine } from "@/lib/ai/creative-engine";
import {
  getDemoAutoGenerateSettings,
  getDemoDashboardSnapshot,
  getDemoProjects
} from "@/lib/demo-data";
import { env, hasSupabaseEnv } from "@/lib/env";
import { getViewer } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { pickRangeValue } from "@/lib/utils";
import { MockVideoRenderer } from "@/lib/video/render-engine";
import type { AutoGenerateSettings, WorkspaceGenerationInput } from "@/lib/types";

export async function getDashboardSnapshot() {
  const snapshot = getDemoDashboardSnapshot();
  const viewer = await getViewer();

  if (viewer) {
    snapshot.viewer = viewer;
  }

  if (!hasSupabaseEnv || !viewer) {
    return snapshot;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return snapshot;
  }

  const { data: settings } = await supabase
    .from("user_settings")
    .select("auto_generate_enabled, min_daily_drafts, max_daily_drafts")
    .eq("user_id", viewer.id)
    .maybeSingle();

  if (settings) {
    snapshot.autoGenerate = {
      enabled: settings.auto_generate_enabled ?? snapshot.autoGenerate.enabled,
      minDailyDrafts:
        settings.min_daily_drafts ?? snapshot.autoGenerate.minDailyDrafts,
      maxDailyDrafts:
        settings.max_daily_drafts ?? snapshot.autoGenerate.maxDailyDrafts
    };
  }

  return snapshot;
}

export async function saveAutoGenerateSettings(
  viewerId: string,
  settings: AutoGenerateSettings
) {
  if (!hasSupabaseEnv) {
    return settings;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return settings;
  }

  await supabase.from("user_settings").upsert(
    {
      user_id: viewerId,
      auto_generate_enabled: settings.enabled,
      min_daily_drafts: settings.minDailyDrafts,
      max_daily_drafts: settings.maxDailyDrafts
    },
    {
      onConflict: "user_id"
    }
  );

  return settings;
}

export async function getWorkspaceSnapshot() {
  return {
    projects: getDemoProjects().slice(0, 3),
    autoGenerate: getDemoAutoGenerateSettings()
  };
}

export async function getLibraryProjects() {
  return getDemoProjects();
}

export async function getCalendarProjects() {
  return getDemoDashboardSnapshot().calendar;
}

export async function getAnalyticsSnapshot() {
  const projects = getDemoProjects();
  const totals = projects.reduce(
    (accumulator, project) => {
      accumulator.views += project.metrics.views;
      accumulator.likes += project.metrics.likes;
      accumulator.comments += project.metrics.comments;
      accumulator.shares += project.metrics.shares;
      accumulator.followersGained += project.metrics.followersGained;
      accumulator.watchTimeSeconds += project.metrics.watchTimeSeconds;
      return accumulator;
    },
    {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      followersGained: 0,
      watchTimeSeconds: 0
    }
  );

  return {
    totals,
    bestTimes: [
      { day: "Monday", time: "12:30 PM", platform: "Instagram Reels" },
      { day: "Wednesday", time: "3:00 PM", platform: "YouTube Shorts" },
      { day: "Friday", time: "7:15 PM", platform: "TikTok" }
    ],
    topContent: [...projects].sort((a, b) => b.metrics.views - a.metrics.views),
    weeklyTrend: [54, 62, 59, 76, 82, 88, 94]
  };
}

export async function getSettingsSnapshot() {
  const viewer = await getViewer();
  const base = {
    profile: {
      fullName: viewer?.fullName ?? "Creator",
      email: viewer?.email ?? "creator@creatorflow.ai",
      bio: "Building a calm, high-output short-form content system."
    },
    avatarUrl: viewer?.avatarUrl ?? null,
    autoGenerate: getDemoAutoGenerateSettings(),
    aiPreferences: {
      defaultTone: "educational",
      originalityGuardrails: "strict",
      preferredDuration: 30
    },
    notifications: {
      email: true,
      inApp: true,
      weeklySummary: true
    },
    storageUsage: {
      usedMb: 620,
      totalMb: 2048
    },
    apiKeys: [
      { provider: "OpenAI-compatible", status: "Not connected" },
      { provider: "ElevenLabs / Voice", status: "Not connected" },
      { provider: "Cloud Renderer", status: "Not connected" }
    ]
  };

  if (!hasSupabaseEnv || !viewer) {
    return base;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return base;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bio, avatar_url")
    .eq("id", viewer.id)
    .maybeSingle();

  const { data: settings } = await supabase
    .from("user_settings")
    .select(
      "auto_generate_enabled, min_daily_drafts, max_daily_drafts, ai_preferences, notification_preferences"
    )
    .eq("user_id", viewer.id)
    .maybeSingle();

  return {
    ...base,
    profile: {
      fullName: profile?.full_name ?? base.profile.fullName,
      email: viewer.email,
      bio: profile?.bio ?? base.profile.bio
    },
    avatarUrl: profile?.avatar_url ?? base.avatarUrl,
    autoGenerate: {
      enabled: settings?.auto_generate_enabled ?? base.autoGenerate.enabled,
      minDailyDrafts:
        settings?.min_daily_drafts ?? base.autoGenerate.minDailyDrafts,
      maxDailyDrafts:
        settings?.max_daily_drafts ?? base.autoGenerate.maxDailyDrafts
    },
    aiPreferences: {
      ...base.aiPreferences,
      ...(settings?.ai_preferences ?? {})
    },
    notifications: {
      ...base.notifications,
      ...(settings?.notification_preferences ?? {})
    }
  };
}

export async function persistGeneratedProject(
  viewerId: string,
  input: WorkspaceGenerationInput
) {
  const engine = new LocalCreativeEngine();
  const generated = await engine.generate(input);

  if (!hasSupabaseEnv) {
    return {
      projectId: `demo-${crypto.randomUUID()}`,
      generated
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      projectId: `demo-${crypto.randomUUID()}`,
      generated
    };
  }

  const workspaceId = await ensureWorkspace(viewerId);

  if (!workspaceId) {
    return {
      projectId: `demo-${crypto.randomUUID()}`,
      generated
    };
  }
  const projectTitle =
    generated.seoTitle.length > 80
      ? generated.seoTitle.slice(0, 80)
      : generated.seoTitle;

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      workspace_id: workspaceId,
      title: projectTitle,
      platform: input.platform,
      niche: input.niche,
      tone: input.tone,
      duration_seconds: input.durationSeconds,
      status: "draft",
      notes: input.notes ?? null,
      created_by_ai: true
    })
    .select("id")
    .single();

  if (projectError || !project) {
    return {
      projectId: `demo-${crypto.randomUUID()}`,
      generated
    };
  }

  await supabase.from("content_scripts").insert({
    project_id: project.id,
    hook: generated.hook,
    script: generated.script,
    shot_list: generated.shotList,
    voiceover_script: generated.voiceoverScript,
    cta: generated.cta,
    seo_title: generated.seoTitle,
    thumbnail_idea: generated.thumbnailIdea,
    compliance_note: generated.complianceNote
  });

  await supabase.from("content_captions").insert({
    project_id: project.id,
    caption: generated.caption,
    hashtags: generated.hashtags
  });

  await supabase.from("notifications").insert({
    user_id: viewerId,
    kind: "content-generated",
    title: "New original draft created",
    body: `${projectTitle} is ready in your workspace.`
  });

  return {
    projectId: project.id,
    generated
  };
}

export async function queueProjectExport(projectId: string) {
  const renderer = new MockVideoRenderer();
  return renderer.queueExport(projectId);
}

export async function runDailyAutoGeneration() {
  if (
    !hasSupabaseEnv ||
    !env.supabaseServiceRoleKey ||
    !env.supabaseUrl ||
    !env.supabaseAnonKey
  ) {
    return { processed: 0 };
  }

  const adminClient = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
  const engine = new LocalCreativeEngine();

  const { data: users } = await adminClient
    .from("user_settings")
    .select(
      "user_id, auto_generate_enabled, min_daily_drafts, max_daily_drafts, ai_preferences"
    )
    .eq("auto_generate_enabled", true);

  if (!users?.length) {
    return { processed: 0 };
  }

  let processed = 0;

  for (const settings of users) {
    const amount = pickRangeValue(
      settings.min_daily_drafts ?? 1,
      settings.max_daily_drafts ?? 1
    );

    const workspaceId = await ensureWorkspaceWithAdmin(adminClient, settings.user_id);

    for (let index = 0; index < amount; index += 1) {
      const generated = await engine.generate({
        platform: "instagram",
        niche: "ai",
        tone: (settings.ai_preferences?.defaultTone as WorkspaceGenerationInput["tone"]) ?? "educational",
        durationSeconds:
          (settings.ai_preferences?.preferredDuration as WorkspaceGenerationInput["durationSeconds"]) ??
          30
      });

      const { data: project } = await adminClient
        .from("projects")
        .insert({
          workspace_id: workspaceId,
          title: `${generated.seoTitle} ${index + 1}`,
          platform: "instagram",
          niche: "ai",
          tone:
            (settings.ai_preferences?.defaultTone as WorkspaceGenerationInput["tone"]) ??
            "educational",
          duration_seconds:
            (settings.ai_preferences?.preferredDuration as WorkspaceGenerationInput["durationSeconds"]) ??
            30,
          status: "draft",
          created_by_ai: true
        })
        .select("id")
        .single();

      if (!project) {
        continue;
      }

      await adminClient.from("content_scripts").insert({
        project_id: project.id,
        hook: generated.hook,
        script: generated.script,
        shot_list: generated.shotList,
        voiceover_script: generated.voiceoverScript,
        cta: generated.cta,
        seo_title: generated.seoTitle,
        thumbnail_idea: generated.thumbnailIdea,
        compliance_note: generated.complianceNote
      });

      await adminClient.from("content_captions").insert({
        project_id: project.id,
        caption: generated.caption,
        hashtags: generated.hashtags
      });
    }

    await adminClient.from("notifications").insert({
      user_id: settings.user_id,
      kind: "daily-auto-generate",
      title: "Daily drafts generated",
      body: `${amount} original video draft${amount === 1 ? "" : "s"} were added to your library today.`
    });

    processed += 1;
  }

  return { processed };
}

async function ensureWorkspace(userId: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data: existing } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing?.workspace_id) {
    return existing.workspace_id as string;
  }

  const slug = `studio-${userId.slice(0, 8)}`;
  const { data: workspace } = await supabase
    .from("workspaces")
    .insert({
      owner_id: userId,
      name: "My Creator Studio",
      slug
    })
    .select("id")
    .single();

  if (workspace?.id) {
    await supabase.from("workspace_members").upsert(
      {
        workspace_id: workspace.id,
        user_id: userId,
        role: "owner"
      },
      { onConflict: "workspace_id,user_id" }
    );
  }

  return workspace?.id as string | null;
}

async function ensureWorkspaceWithAdmin(
  adminClient: ReturnType<typeof createClient>,
  userId: string
) {
  const { data: existing } = await adminClient
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing?.workspace_id) {
    return existing.workspace_id as string;
  }

  const { data: workspace } = await adminClient
    .from("workspaces")
    .insert({
      owner_id: userId,
      name: "My Creator Studio",
      slug: `studio-${userId.slice(0, 8)}`
    })
    .select("id")
    .single();

  if (workspace?.id) {
    await adminClient.from("workspace_members").upsert(
      {
        workspace_id: workspace.id,
        user_id: userId,
        role: "owner"
      },
      { onConflict: "workspace_id,user_id" }
    );
  }

  return workspace?.id as string;
}
