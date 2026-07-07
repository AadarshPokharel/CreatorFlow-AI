"use server";

import { revalidatePath } from "next/cache";

import { requireViewer } from "@/lib/auth/session";
import { rateLimit } from "@/lib/security/rate-limit";
import { persistGeneratedProject, queueProjectExport } from "@/lib/server/content";
import { workspaceGenerationSchema } from "@/lib/validations/workspace";

export async function generateContentAction(payload: unknown) {
  const parsed = workspaceGenerationSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid generation request."
    };
  }

  const viewer = await requireViewer();
  const limit = rateLimit(`generate:${viewer.id}`, 10, 60_000);

  if (!limit.allowed) {
    return {
      success: false as const,
      error: "Generation rate limit reached. Try again in a minute."
    };
  }

  const result = await persistGeneratedProject(viewer.id, parsed.data);

  revalidatePath("/dashboard");
  revalidatePath("/library");
  revalidatePath("/workspace");

  return {
    success: true as const,
    projectId: result.projectId,
    generated: result.generated
  };
}

export async function queueExportAction(projectId: string) {
  const result = await queueProjectExport(projectId);
  return {
    success: true as const,
    ...result
  };
}
