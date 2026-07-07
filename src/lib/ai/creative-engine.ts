import { pickRangeValue } from "@/lib/utils";
import type { GeneratedContentBundle, WorkspaceGenerationInput } from "@/lib/types";

export interface CreativeEngine {
  generate(input: WorkspaceGenerationInput): Promise<GeneratedContentBundle>;
  generateBatch(
    input: WorkspaceGenerationInput,
    range: { min: number; max: number }
  ): Promise<GeneratedContentBundle[]>;
}

const toneFraming = {
  funny: "make the payoff feel clever and human",
  educational: "teach a practical insight in a tight sequence",
  emotional: "land on a meaningful personal takeaway",
  storytelling: "build a beginning, tension point, and resolution",
  viral: "front-load curiosity and pattern interrupts",
  luxury: "use elegant language and premium sensory detail",
  minimal: "keep the framing calm, spacious, and intentional"
} as const;

const nicheAngles = {
  fitness: "a simple habit that compounds over time",
  travel: "a moment that reveals a place through feeling",
  food: "one memorable detail that makes a meal worth trying",
  motivation: "a practical mindset shift instead of vague hype",
  finance: "a money habit that lowers friction or waste",
  ai: "an original workflow that saves creators time",
  tech: "a tiny setup or tool change that improves output",
  education: "a shortcut that makes learning easier to retain",
  gaming: "a strategic pattern, story beat, or challenge",
  custom: "a distinctive perspective the creator can own"
} as const;

export class LocalCreativeEngine implements CreativeEngine {
  async generate(input: WorkspaceGenerationInput) {
    const nicheLabel =
      input.niche === "custom" && input.customNiche
        ? input.customNiche
        : input.niche;

    const angle =
      input.niche === "custom" && input.customNiche
        ? input.customNiche
        : nicheAngles[input.niche];

    const toneNote = toneFraming[input.tone];
    const title = `${capitalize(nicheLabel)} idea for ${labelPlatform(
      input.platform
    )}`;

    return {
      idea: `Create an original ${input.durationSeconds}-second ${labelPlatform(
        input.platform
      )} concept around ${angle}.`,
      hook: `Stop scrolling if you want ${angle} without making it feel generic.`,
      script: `Open by naming the exact problem. Then show one concrete shift or insight, ${toneNote}, and end with a tight takeaway the viewer can try today.`,
      shotList: [
        "Open with a bold close-up and one-line text hook.",
        "Cut to creator-owned B-roll showing the problem in context.",
        "Move into a direct-to-camera explanation with large subtitles.",
        "End with a payoff frame and CTA."
      ],
      voiceoverScript: `Here is an original short-form idea for ${labelPlatform(
        input.platform
      )}. Focus on ${angle}, keep the pacing sharp, and ${toneNote}.`,
      cta: "Save this idea and comment if you want a follow-up variation.",
      caption: `An original ${labelPlatform(
        input.platform
      )} concept built around ${angle}. No trends to copy, just a format you can own.`,
      seoTitle: `${capitalize(title)}: ${capitalize(angle)}`,
      hashtags: [
        `#${sanitizeTag(nicheLabel)}`,
        `#${sanitizeTag(input.tone)}`,
        `#${sanitizeTag(labelPlatform(input.platform))}`,
        "#originalcontent"
      ],
      thumbnailIdea: `Use a dark cinematic background with a single bright keyword for "${capitalize(
        nicheLabel
      )}".`,
      complianceNote:
        "This draft is designed to stay original, creator-owned, and free of scraped or reposted third-party social content."
    };
  }

  async generateBatch(
    input: WorkspaceGenerationInput,
    range: { min: number; max: number }
  ) {
    const amount = pickRangeValue(range.min, range.max);
    const drafts = await Promise.all(
      Array.from({ length: amount }).map(async (_, index) => {
        const draft = await this.generate(input);
        return {
          ...draft,
          idea: `${draft.idea} Variation ${index + 1} explores a different angle.`
        };
      })
    );

    return drafts;
  }
}

function labelPlatform(platform: WorkspaceGenerationInput["platform"]) {
  switch (platform) {
    case "instagram":
      return "Instagram Reels";
    case "youtube_shorts":
      return "YouTube Shorts";
    default:
      return "TikTok";
  }
}

function sanitizeTag(input: string) {
  return input.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");
}

function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}
