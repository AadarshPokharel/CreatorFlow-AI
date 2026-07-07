import { z } from "zod";

export const settingsPreferencesSchema = z.object({
  defaultTone: z.enum([
    "funny",
    "educational",
    "emotional",
    "storytelling",
    "viral",
    "luxury",
    "minimal"
  ]),
  preferredDuration: z.union([
    z.literal(15),
    z.literal(30),
    z.literal(45),
    z.literal(60)
  ]),
  originalityGuardrails: z.enum(["strict", "balanced"]),
  email: z.boolean(),
  inApp: z.boolean(),
  weeklySummary: z.boolean()
});
