import type { Niche, Platform, Tone } from "@/lib/types";

export const platforms: Array<{ value: Platform; label: string }> = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram Reels" },
  { value: "youtube_shorts", label: "YouTube Shorts" }
];

export const niches: Array<{ value: Niche; label: string }> = [
  { value: "fitness", label: "Fitness" },
  { value: "travel", label: "Travel" },
  { value: "food", label: "Food" },
  { value: "motivation", label: "Motivation" },
  { value: "finance", label: "Finance" },
  { value: "ai", label: "AI" },
  { value: "tech", label: "Tech" },
  { value: "education", label: "Education" },
  { value: "gaming", label: "Gaming" },
  { value: "custom", label: "Custom" }
];

export const tones: Array<{ value: Tone; label: string }> = [
  { value: "funny", label: "Funny" },
  { value: "educational", label: "Educational" },
  { value: "emotional", label: "Emotional" },
  { value: "storytelling", label: "Storytelling" },
  { value: "viral", label: "Viral" },
  { value: "luxury", label: "Luxury" },
  { value: "minimal", label: "Minimal" }
];

export const durations = [15, 30, 45, 60] as const;

export const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "layout-dashboard"
  },
  {
    href: "/workspace",
    label: "AI Workspace",
    icon: "sparkles"
  },
  {
    href: "/library",
    label: "Content Library",
    icon: "library-big"
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: "calendar-days"
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: "bar-chart-3"
  },
  {
    href: "/settings",
    label: "Settings",
    icon: "settings-2"
  }
] as const;
