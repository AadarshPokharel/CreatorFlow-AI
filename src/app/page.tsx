import Link from "next/link";
import { ArrowRight, CalendarDays, FolderTree, Sparkles, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const featureCards = [
  {
    icon: Sparkles,
    title: "AI Workspace",
    description:
      "Generate original ideas, hooks, scripts, shot lists, voiceovers, captions, hashtags, and thumbnail directions in one flow."
  },
  {
    icon: Video,
    title: "Video Generator Pipeline",
    description:
      "Organize creator-owned assets, subtitle plans, overlay notes, and export queues without ever touching scraped platform content."
  },
  {
    icon: FolderTree,
    title: "Content Library",
    description:
      "Search, sort, archive, duplicate, favorite, and tag every project while keeping folders and publishing states clean."
  },
  {
    icon: CalendarDays,
    title: "Planning + Analytics",
    description:
      "Map monthly cadence, track results, identify best posting times, and keep daily draft generation under control."
  }
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] rounded-[36px] border border-white/10 bg-slate-950/45 p-6 backdrop-blur-2xl sm:p-10">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(245,158,11,0.18),transparent_28%),rgba(255,255,255,0.03)] px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
          <div className="absolute inset-0 bg-grid-fade bg-[size:44px_44px] opacity-[0.08]" />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
            <div>
              <Badge>Original Content OS</Badge>
              <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Build short-form systems that feel premium, organized, and fully yours.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-foreground/72 sm:text-lg">
                CreatorFlow AI helps solo creators generate original short-form concepts for TikTok, Instagram Reels, and YouTube Shorts while managing scripts, assets, analytics, scheduling, and daily draft automation.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className={buttonVariants({ size: "lg" })}>
                  Launch CreatorFlow
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "lg" }),
                    "justify-center"
                  )}
                >
                  Explore Demo Dashboard
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-3 text-sm text-foreground/58">
                <span className="rounded-full border border-white/10 px-3 py-1.5">
                  Next.js 15
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1.5">
                  Supabase Auth + Storage
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1.5">
                  Modular AI Architecture
                </span>
              </div>
            </div>

            <Card className="p-0">
              <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6">
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg font-semibold">Daily Flow</p>
                  <Badge>Auto Generate</Badge>
                </div>
                <div className="mt-6 grid gap-4">
                  {[
                    "02 - 04 original drafts / day",
                    "Script + caption + hooks stored automatically",
                    "Calendar synced with draft status",
                    "Analytics highlights top-performing angles"
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-foreground/72"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-[24px] border border-primary/20 bg-primary/10 p-5">
                  <p className="text-sm font-semibold text-primary">
                    Content safety built in
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground/72">
                    The system is designed for original content only. No downloading, scraping, copying, or reposting from creator platforms.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading
            eyebrow="What’s Inside"
            title="Everything you need to go from idea to organized publishing."
            description="Built for solo creators first, and structured so workspaces, teams, integrations, AI agents, brand kits, and cloud video rendering can plug in later without major rewrites."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <div className="inline-flex rounded-2xl border border-white/10 bg-white/8 p-3">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-5">{title}</CardTitle>
                <CardDescription className="mt-3 leading-6">
                  {description}
                </CardDescription>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
