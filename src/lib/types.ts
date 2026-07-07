export type Platform = "tiktok" | "instagram" | "youtube_shorts";
export type Niche =
  | "fitness"
  | "travel"
  | "food"
  | "motivation"
  | "finance"
  | "ai"
  | "tech"
  | "education"
  | "gaming"
  | "custom";
export type Tone =
  | "funny"
  | "educational"
  | "emotional"
  | "storytelling"
  | "viral"
  | "luxury"
  | "minimal";
export type ContentStatus =
  | "draft"
  | "ready"
  | "scheduled"
  | "posted"
  | "missed"
  | "archived";
export type CalendarStatus =
  | "draft"
  | "ready"
  | "posted"
  | "missed"
  | "scheduled";
export type AssetType =
  | "image"
  | "video"
  | "audio"
  | "subtitle"
  | "overlay"
  | "thumbnail";

export interface Viewer {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  role: "owner" | "member";
}

export interface GeneratedContentBundle {
  idea: string;
  hook: string;
  script: string;
  shotList: string[];
  voiceoverScript: string;
  cta: string;
  caption: string;
  seoTitle: string;
  hashtags: string[];
  thumbnailIdea: string;
  complianceNote: string;
}

export interface ContentProject {
  id: string;
  title: string;
  platform: Platform;
  niche: Niche;
  tone: Tone;
  durationSeconds: 15 | 30 | 45 | 60;
  status: ContentStatus;
  createdAt: string;
  scheduledFor?: string | null;
  notes?: string | null;
  folder?: string | null;
  tags: string[];
  favorite: boolean;
  archived: boolean;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    followersGained: number;
    watchTimeSeconds: number;
    engagementRate: number;
  };
  content: GeneratedContentBundle;
}

export interface DashboardMetric {
  label: string;
  value: string;
  trend: string;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  strength: "high" | "medium" | "emerging";
}

export interface CalendarEntry {
  id: string;
  date: string;
  status: CalendarStatus;
  title: string;
  platform: Platform;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface AutoGenerateSettings {
  enabled: boolean;
  minDailyDrafts: number;
  maxDailyDrafts: number;
}

export interface DashboardSnapshot {
  viewer: Viewer;
  metrics: DashboardMetric[];
  todayContent: ContentProject[];
  scheduledContent: ContentProject[];
  drafts: ContentProject[];
  postedContent: ContentProject[];
  recentProjects: ContentProject[];
  suggestions: Suggestion[];
  notifications: NotificationItem[];
  calendar: CalendarEntry[];
  autoGenerate: AutoGenerateSettings;
}

export interface MediaAsset {
  id: string;
  projectId: string;
  type: AssetType;
  label: string;
  storagePath?: string | null;
  localPreviewUrl?: string | null;
  source: "user-upload" | "ai-generated" | "licensed";
  durationSeconds?: number | null;
}

export interface WorkspaceGenerationInput {
  platform: Platform;
  niche: Niche;
  tone: Tone;
  durationSeconds: 15 | 30 | 45 | 60;
  customNiche?: string;
  notes?: string;
}
