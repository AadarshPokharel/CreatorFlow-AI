import type {
  AutoGenerateSettings,
  CalendarEntry,
  ContentProject,
  DashboardMetric,
  DashboardSnapshot,
  NotificationItem,
  Suggestion,
  Viewer
} from "@/lib/types";

const demoViewer: Viewer = {
  id: "demo-user",
  email: "creator@creatorflow.ai",
  fullName: "Aadarsh Pokharel",
  avatarUrl: null,
  role: "owner"
};

const demoProjects: ContentProject[] = [
  {
    id: "proj-1",
    title: "3 AI Prompts That Save 2 Hours a Day",
    platform: "youtube_shorts",
    niche: "ai",
    tone: "educational",
    durationSeconds: 45,
    status: "scheduled",
    createdAt: "2026-07-06T09:30:00.000Z",
    scheduledFor: "2026-07-07T15:00:00.000Z",
    notes: "Pair with keyboard B-roll and UI closeups.",
    folder: "July Launch",
    tags: ["AI", "Workflow", "Shorts"],
    favorite: true,
    archived: false,
    metrics: {
      views: 12040,
      likes: 1180,
      comments: 86,
      shares: 150,
      followersGained: 74,
      watchTimeSeconds: 18200,
      engagementRate: 11.7
    },
    content: {
      idea: "Explain three prompt formats that improve creator workflows.",
      hook: "If your content workflow still starts with a blank page, use these three prompts.",
      script:
        "Open with the pain point. Show one prompt for research, one for scripting, and one for repurposing. End with a simple challenge to test one today.",
      shotList: [
        "Fast close-up of Notion board with empty cards.",
        "On-screen text introducing Prompt 1.",
        "Screen recording of a prompt turning into a script outline.",
        "Talking-head breakdown with bold captions."
      ],
      voiceoverScript:
        "Most creators waste time starting from zero. These three prompt formats help you research faster, structure faster, and ship faster.",
      cta: "Comment 'prompt' if you want a full template pack.",
      caption:
        "Three original prompt formats I use to turn blank ideas into publish-ready short-form content.",
      seoTitle: "3 AI Prompt Formats for Short-Form Creators",
      hashtags: ["#creatorflow", "#aishorts", "#contentsystem", "#prompting"],
      thumbnailIdea:
        "Split-screen layout with 'Blank Page' on left and '3 Prompt System' on right.",
      complianceNote:
        "Built from original educational concepts and creator-owned workflow examples."
    }
  },
  {
    id: "proj-2",
    title: "1 Minute Minimal Desk Reset",
    platform: "instagram",
    niche: "tech",
    tone: "minimal",
    durationSeconds: 30,
    status: "draft",
    createdAt: "2026-07-06T08:00:00.000Z",
    scheduledFor: null,
    notes: "Ambient music + satisfying transitions.",
    folder: "Studio Aesthetic",
    tags: ["Minimal", "Desk", "Routine"],
    favorite: false,
    archived: false,
    metrics: {
      views: 4210,
      likes: 540,
      comments: 18,
      shares: 29,
      followersGained: 21,
      watchTimeSeconds: 5200,
      engagementRate: 8.4
    },
    content: {
      idea: "A clean desk reset that frames focus as a creative ritual.",
      hook: "This 60-second reset makes my desk feel brand new.",
      script:
        "Start with visual clutter, clear the desk in rhythmic cuts, add one standout object, and end on a calm overhead shot.",
      shotList: [
        "Messy desk before shot.",
        "Fast wipes removing loose items.",
        "Monitor lighting up with warm gradient wallpaper.",
        "Top-down finished setup."
      ],
      voiceoverScript:
        "When I need a mental reset, I start with the desk. Less clutter, better focus, easier filming.",
      cta: "Save this for your next reset day.",
      caption:
        "A tiny studio ritual that makes filming feel lighter every time.",
      seoTitle: "Minimal Desk Reset for Better Focus",
      hashtags: ["#desksetup", "#minimalcreator", "#focusritual"],
      thumbnailIdea:
        "Dark background with warm desk lamp glow and bold 'RESET' text.",
      complianceNote:
        "Uses original workspace footage and creator-owned environment details."
    }
  },
  {
    id: "proj-3",
    title: "Travel Story: Missed Train, Better Memory",
    platform: "tiktok",
    niche: "travel",
    tone: "storytelling",
    durationSeconds: 60,
    status: "posted",
    createdAt: "2026-07-05T10:00:00.000Z",
    scheduledFor: "2026-07-05T19:00:00.000Z",
    notes: "Narrative pacing worked well.",
    folder: "Travel Stories",
    tags: ["Storytime", "Travel"],
    favorite: true,
    archived: false,
    metrics: {
      views: 38900,
      likes: 3920,
      comments: 212,
      shares: 607,
      followersGained: 320,
      watchTimeSeconds: 80400,
      engagementRate: 12.2
    },
    content: {
      idea: "Tell a small failure story that turns into a meaningful memory.",
      hook: "Missing that train was the best thing that happened on the trip.",
      script:
        "Open on the mistake, build tension with the missed departure, then reveal the unexpected local moment that made the day unforgettable.",
      shotList: [
        "Station board and packed bag shot.",
        "Clock close-up for tension.",
        "Street cafe detail shots.",
        "Golden hour walking scene."
      ],
      voiceoverScript:
        "I thought I ruined the day when I missed the train, but slowing down led to the part of the trip I still remember most.",
      cta: "Tell me the travel mistake that turned into a great memory.",
      caption:
        "Sometimes the missed plan becomes the real story.",
      seoTitle: "Travel Story About a Missed Train That Became a Favorite Memory",
      hashtags: ["#travelstory", "#tiktoktravel", "#storytime"],
      thumbnailIdea:
        "Platform sign + bold text reading 'MISSED IT'.",
      complianceNote:
        "Entirely based on original travel storytelling and creator-owned footage."
    }
  },
  {
    id: "proj-4",
    title: "Finance Rule: The 24 Hour Pause",
    platform: "instagram",
    niche: "finance",
    tone: "luxury",
    durationSeconds: 15,
    status: "ready",
    createdAt: "2026-07-04T11:15:00.000Z",
    scheduledFor: "2026-07-08T12:30:00.000Z",
    notes: "Use moody closeups and soft gold text.",
    folder: "Money Mindset",
    tags: ["Finance", "Habits"],
    favorite: false,
    archived: false,
    metrics: {
      views: 9700,
      likes: 810,
      comments: 41,
      shares: 99,
      followersGained: 58,
      watchTimeSeconds: 8800,
      engagementRate: 9.8
    },
    content: {
      idea: "Frame patience as a luxury habit in spending decisions.",
      hook: "If I still want it after 24 hours, then I consider buying it.",
      script:
        "Open on a tempting purchase, pause the action, then explain the 24-hour rule as a status-building habit instead of deprivation.",
      shotList: [
        "Luxury item close-up.",
        "Hand hovering over checkout button.",
        "Text overlay: 24-hour pause.",
        "Calm talking-head payoff."
      ],
      voiceoverScript:
        "The fastest way to spend less impulsively is to stop treating patience like punishment.",
      cta: "Save this rule for your next impulse purchase.",
      caption:
        "Financial discipline can look elegant too.",
      seoTitle: "The 24 Hour Rule for Smarter Spending",
      hashtags: ["#financecreator", "#moneyhabits", "#luxurymindset"],
      thumbnailIdea:
        "High-contrast product shot with subtle gold '24H' badge.",
      complianceNote:
        "Built from original educational framing and non-infringing examples."
    }
  }
];

const metrics: DashboardMetric[] = [
  { label: "Today's content", value: "04", trend: "+2 vs yesterday" },
  { label: "Scheduled", value: "11", trend: "Next post at 3:00 PM" },
  { label: "Drafts", value: "08", trend: "3 ready for polish" },
  { label: "Posted", value: "26", trend: "+18% this month" }
];

const suggestions: Suggestion[] = [
  {
    id: "suggestion-1",
    title: "Turn your best AI workflow post into a 3-part series",
    description:
      "The last educational post outperformed your baseline by 22%. Expand it into beginner, advanced, and behind-the-scenes angles.",
    strength: "high"
  },
  {
    id: "suggestion-2",
    title: "Shift travel storytelling uploads to early evening",
    description:
      "Story-led clips are keeping better retention when posted between 6 PM and 8 PM local time.",
    strength: "medium"
  },
  {
    id: "suggestion-3",
    title: "Batch two minimalist B-roll libraries this week",
    description:
      "You are reusing the same setup footage frequently. Two new lighting sets would unlock five future drafts.",
    strength: "emerging"
  }
];

const notifications: NotificationItem[] = [
  {
    id: "notification-1",
    title: "Tomorrow has 2 unscheduled drafts",
    body: "Assign publishing windows to keep your posting streak stable.",
    createdAt: "2026-07-06T12:00:00.000Z",
    read: false
  },
  {
    id: "notification-2",
    title: "Auto-generation paused on July 5",
    body: "Re-enable daily drafts to keep the idea pipeline active.",
    createdAt: "2026-07-06T08:30:00.000Z",
    read: false
  },
  {
    id: "notification-3",
    title: "New best posting window found",
    body: "Instagram Reels are performing strongest at 12:30 PM this week.",
    createdAt: "2026-07-05T18:40:00.000Z",
    read: true
  }
];

const calendar: CalendarEntry[] = [
  {
    id: "calendar-1",
    date: "2026-07-06T12:00:00.000Z",
    status: "draft",
    title: "Minimal Desk Reset",
    platform: "instagram"
  },
  {
    id: "calendar-2",
    date: "2026-07-07T15:00:00.000Z",
    status: "scheduled",
    title: "3 AI Prompts",
    platform: "youtube_shorts"
  },
  {
    id: "calendar-3",
    date: "2026-07-08T12:30:00.000Z",
    status: "ready",
    title: "24 Hour Pause",
    platform: "instagram"
  },
  {
    id: "calendar-4",
    date: "2026-07-05T19:00:00.000Z",
    status: "posted",
    title: "Missed Train Story",
    platform: "tiktok"
  }
];

const autoGenerate: AutoGenerateSettings = {
  enabled: true,
  minDailyDrafts: 2,
  maxDailyDrafts: 4
};

export function getDemoDashboardSnapshot(): DashboardSnapshot {
  return {
    viewer: demoViewer,
    metrics,
    todayContent: demoProjects.slice(0, 2),
    scheduledContent: demoProjects.filter((project) => project.status === "scheduled"),
    drafts: demoProjects.filter((project) => project.status === "draft"),
    postedContent: demoProjects.filter((project) => project.status === "posted"),
    recentProjects: demoProjects,
    suggestions,
    notifications,
    calendar,
    autoGenerate
  };
}

export function getDemoViewer() {
  return demoViewer;
}

export function getDemoProjects() {
  return demoProjects;
}

export function getDemoAutoGenerateSettings() {
  return autoGenerate;
}
