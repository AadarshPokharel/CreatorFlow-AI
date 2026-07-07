"use server";

import { revalidatePath } from "next/cache";

import { requireViewer } from "@/lib/auth/session";
import { saveAutoGenerateSettings } from "@/lib/server/content";
import { autoGenerateSchema } from "@/lib/validations/workspace";

export async function updateAutoGenerateSettingsAction(payload: unknown) {
  const parsed = autoGenerateSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid auto-generation settings."
    };
  }

  const viewer = await requireViewer();
  await saveAutoGenerateSettings(viewer.id, parsed.data);

  revalidatePath("/dashboard");
  revalidatePath("/settings");

  return {
    success: true as const,
    message: "Daily generation settings saved."
  };
}
