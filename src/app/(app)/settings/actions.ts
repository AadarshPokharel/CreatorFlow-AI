"use server";

import { revalidatePath } from "next/cache";

import { requireViewer } from "@/lib/auth/session";
import { env, hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validations/auth";
import { settingsPreferencesSchema } from "@/lib/validations/settings";

export async function saveProfileAction(payload: unknown) {
  const parsed = profileSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid profile details."
    };
  }

  const viewer = await requireViewer();

  if (!hasSupabaseEnv) {
    return {
      success: true as const,
      message: "Profile updated in demo mode."
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      success: false as const,
      error: "Supabase is not configured."
    };
  }

  await supabase.from("profiles").upsert(
    {
      id: viewer.id,
      full_name: parsed.data.fullName,
      bio: parsed.data.bio ?? null
    },
    { onConflict: "id" }
  );

  if (parsed.data.email !== viewer.email) {
    await supabase.auth.updateUser({ email: parsed.data.email });
  }

  revalidatePath("/settings");

  return {
    success: true as const,
    message: "Profile saved."
  };
}

export async function savePreferencesAction(payload: unknown) {
  const parsed = settingsPreferencesSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid preferences."
    };
  }

  const viewer = await requireViewer();

  if (!hasSupabaseEnv) {
    return {
      success: true as const,
      message: "Preferences updated in demo mode."
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      success: false as const,
      error: "Supabase is not configured."
    };
  }

  await supabase.from("user_settings").upsert(
    {
      user_id: viewer.id,
      ai_preferences: {
        defaultTone: parsed.data.defaultTone,
        preferredDuration: parsed.data.preferredDuration,
        originalityGuardrails: parsed.data.originalityGuardrails
      },
      notification_preferences: {
        email: parsed.data.email,
        inApp: parsed.data.inApp,
        weeklySummary: parsed.data.weeklySummary
      }
    },
    { onConflict: "user_id" }
  );

  revalidatePath("/settings");

  return {
    success: true as const,
    message: "Preferences saved."
  };
}

export async function uploadAvatarAction(formData: FormData) {
  const file = formData.get("avatar");

  if (!(file instanceof File)) {
    return {
      success: false as const,
      error: "Please select an image file."
    };
  }

  if (!hasSupabaseEnv) {
    return {
      success: true as const,
      message:
        "Avatar preview updated locally. Connect Supabase Storage for persistence.",
      url: null as string | null
    };
  }

  const viewer = await requireViewer();
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      success: false as const,
      error: "Supabase is not configured."
    };
  }

  const extension = file.name.split(".").pop() ?? "png";
  const filePath = `avatars/${viewer.id}/profile.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(env.supabaseStorageBucket)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type
    });

  if (uploadError) {
    return {
      success: false as const,
      error: uploadError.message
    };
  }

  const { data } = supabase.storage
    .from(env.supabaseStorageBucket)
    .getPublicUrl(filePath);

  await supabase.from("profiles").upsert(
    {
      id: viewer.id,
      avatar_url: data.publicUrl
    },
    { onConflict: "id" }
  );

  revalidatePath("/settings");

  return {
    success: true as const,
    message: "Profile picture updated.",
    url: data.publicUrl
  };
}
