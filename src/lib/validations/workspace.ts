import { z } from "zod";

export const workspaceGenerationSchema = z
  .object({
    platform: z.enum(["tiktok", "instagram", "youtube_shorts"]),
    niche: z.enum([
      "fitness",
      "travel",
      "food",
      "motivation",
      "finance",
      "ai",
      "tech",
      "education",
      "gaming",
      "custom"
    ]),
    tone: z.enum([
      "funny",
      "educational",
      "emotional",
      "storytelling",
      "viral",
      "luxury",
      "minimal"
    ]),
    durationSeconds: z.union([
      z.literal(15),
      z.literal(30),
      z.literal(45),
      z.literal(60)
    ]),
    customNiche: z.string().max(60).optional(),
    notes: z.string().max(300).optional()
  })
  .superRefine((value, context) => {
    if (value.niche === "custom" && !value.customNiche?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Add a custom niche when Custom is selected.",
        path: ["customNiche"]
      });
    }
  });

export const autoGenerateSchema = z
  .object({
    enabled: z.boolean(),
    minDailyDrafts: z.number().min(0).max(25),
    maxDailyDrafts: z.number().min(0).max(25)
  })
  .refine((value) => value.maxDailyDrafts >= value.minDailyDrafts, {
    message: "Max daily drafts must be greater than or equal to min daily drafts.",
    path: ["maxDailyDrafts"]
  });

export const manualMetricsSchema = z.object({
  views: z.number().min(0),
  likes: z.number().min(0),
  comments: z.number().min(0),
  shares: z.number().min(0),
  followersGained: z.number().min(0),
  watchTimeSeconds: z.number().min(0)
});
