"use client";

import { motion } from "framer-motion";
import { Clock3, Flame, FolderClock, Sparkles, Wand2 } from "lucide-react";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { updateAutoGenerateSettingsAction } from "@/app/(app)/dashboard/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { Switch } from "@/components/ui/switch";
import { formatDate } from "@/lib/utils";
import { autoGenerateSchema } from "@/lib/validations/workspace";
import type { DashboardSnapshot } from "@/lib/types";

type AutoGenerateValues = z.infer<typeof autoGenerateSchema>;

export function DashboardPageClient({
  snapshot
}: {
  snapshot: DashboardSnapshot;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const form = useForm<AutoGenerateValues>({
    resolver: zodResolver(autoGenerateSchema),
    defaultValues: snapshot.autoGenerate
  });
  const enabled = form.watch("enabled");

  const handleSave = form.handleSubmit((values) => {
    setMessage(null);
    setError(null);
    setIsPending(true);

    startTransition(async () => {
      const result = await updateAutoGenerateSettingsAction(values);

      if (!result.success) {
        setError(result.error);
        setIsPending(false);
        return;
      }

      setMessage(result.message);
      setIsPending(false);
    });
  });

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Dashboard"
        title="Today’s creator operating system"
        description="Keep drafts, scheduled posts, analytics, recent projects, and the daily video generation pipeline visible in one place."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <p className="text-sm text-foreground/58">{metric.label}</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="font-display text-4xl font-semibold">{metric.value}</p>
                <Badge>{metric.trend}</Badge>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content queues</CardTitle>
              <CardDescription className="mt-2">
                A quick view of what needs attention today.
              </CardDescription>
            </div>
            <Badge>Live workflow</Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <QueueCard
              title="Today's content"
              items={snapshot.todayContent}
              emptyLabel="No content queued for today."
            />
            <QueueCard
              title="Scheduled content"
              items={snapshot.scheduledContent}
              emptyLabel="No scheduled content yet."
            />
            <QueueCard
              title="Drafts"
              items={snapshot.drafts}
              emptyLabel="No drafts waiting right now."
            />
            <QueueCard
              title="Posted content"
              items={snapshot.postedContent}
              emptyLabel="No posted items recorded yet."
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Calendar preview</CardTitle>
              <CardDescription className="mt-2">
                Upcoming publishing slots at a glance.
              </CardDescription>
            </div>
            <Badge>July 2026</Badge>
          </div>
          <div className="mt-6 space-y-3">
            {snapshot.calendar.map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl border border-white/10 bg-white/6 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{entry.title}</p>
                    <p className="mt-1 text-sm text-foreground/62">
                      {formatDate(entry.date)} • {labelPlatform(entry.platform)}
                    </p>
                  </div>
                  <Badge>{entry.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_420px]">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Daily video amount</CardTitle>
              <CardDescription className="mt-2 max-w-xl leading-6">
                Choose the minimum and maximum number of original video drafts CreatorFlow AI should create per day. Generated content stays original, legal, and appropriate.
              </CardDescription>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </div>

          <form onSubmit={handleSave} className="mt-6 space-y-5">
            <div className="flex items-center justify-between rounded-[24px] border border-white/10 bg-white/6 px-4 py-4">
              <div>
                <p className="font-medium">Auto Generate</p>
                <p className="text-sm text-foreground/60">
                  If ON, generate the selected number of original drafts daily. If OFF, pause daily generation.
                </p>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) => form.setValue("enabled", checked)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/78">Min drafts</label>
                <Input
                  type="number"
                  disabled={!enabled}
                  {...form.register("minDailyDrafts", { valueAsNumber: true })}
                />
                {form.formState.errors.minDailyDrafts ? (
                  <p className="text-sm text-danger">
                    {form.formState.errors.minDailyDrafts.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/78">Max drafts</label>
                <Input
                  type="number"
                  disabled={!enabled}
                  {...form.register("maxDailyDrafts", { valueAsNumber: true })}
                />
                {form.formState.errors.maxDailyDrafts ? (
                  <p className="text-sm text-danger">
                    {form.formState.errors.maxDailyDrafts.message}
                  </p>
                ) : null}
              </div>
            </div>

            {error ? <p className="text-sm text-danger">{error}</p> : null}
            {message ? <p className="text-sm text-success">{message}</p> : null}

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Daily Generation"}
            </Button>
          </form>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription className="mt-2">
                Recent reminders and system nudges.
              </CardDescription>
            </div>
            <BellBadge count={snapshot.notifications.filter((item) => !item.read).length} />
          </div>
          <div className="mt-5 space-y-3">
            {snapshot.notifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-2xl border border-white/10 bg-white/6 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="mt-1 text-sm leading-6 text-foreground/62">
                      {notification.body}
                    </p>
                  </div>
                  {!notification.read ? (
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-secondary" />
                  ) : null}
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-foreground/40">
                  {formatDate(notification.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_380px]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent projects</CardTitle>
              <CardDescription className="mt-2">
                The newest creator-owned concepts in your library.
              </CardDescription>
            </div>
            <FolderClock className="h-5 w-5 text-foreground/45" />
          </div>
          <div className="mt-5 space-y-3">
            {snapshot.recentProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-white/10 bg-white/6 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="mt-1 text-sm text-foreground/62">
                      {labelPlatform(project.platform)} • {labelStatus(project.status)} • {project.durationSeconds}s
                    </p>
                  </div>
                  <Badge>{project.folder ?? "Unfiled"}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground/68">
                  {project.content.hook}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI suggestions</CardTitle>
              <CardDescription className="mt-2">
                Strategy nudges based on current content patterns.
              </CardDescription>
            </div>
            <Wand2 className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-5 space-y-3">
            {snapshot.suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="rounded-2xl border border-white/10 bg-white/6 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="font-medium">{suggestion.title}</p>
                  <Badge>{suggestion.strength}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground/66">
                  {suggestion.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Analytics pulse</CardTitle>
              <CardDescription className="mt-2">
                A quick read on content momentum.
              </CardDescription>
            </div>
            <Flame className="h-5 w-5 text-secondary" />
          </div>
          <div className="mt-6 space-y-5">
            <SummaryBar label="Engagement rate" value={78} footnote="Avg 10.5%" />
            <SummaryBar label="Watch time quality" value={84} footnote="Strong completion on 30-45s content" />
            <SummaryBar label="Posting consistency" value={66} footnote="2 unscheduled drafts remain" />
          </div>
          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/6 p-4">
            <p className="text-sm font-medium">Best window this week</p>
            <div className="mt-3 flex items-center gap-3 text-sm text-foreground/68">
              <Clock3 className="h-4 w-4" />
              <span>Wednesday at 3:00 PM for educational Shorts</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SummaryBar({
  label,
  value,
  footnote
}: {
  label: string;
  value: number;
  footnote: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-foreground/52">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/8">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-foreground/48">{footnote}</p>
    </div>
  );
}

function BellBadge({ count }: { count: number }) {
  return (
    <div className="inline-flex rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-sm">
      {count} unread
    </div>
  );
}

function QueueCard({
  title,
  items,
  emptyLabel
}: {
  title: string;
  items: DashboardSnapshot["recentProjects"];
  emptyLabel: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-3 space-y-3">
        {items.length ? (
          items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-slate-950/35 p-3"
            >
              <p className="font-medium">{item.title}</p>
              <p className="mt-1 text-sm text-foreground/62">
                {labelPlatform(item.platform)} • {item.durationSeconds}s
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-foreground/56">{emptyLabel}</p>
        )}
      </div>
    </div>
  );
}

function labelPlatform(
  platform:
    | DashboardSnapshot["recentProjects"][number]["platform"]
    | DashboardSnapshot["calendar"][number]["platform"]
) {
  switch (platform) {
    case "instagram":
      return "Instagram";
    case "youtube_shorts":
      return "YouTube Shorts";
    default:
      return "TikTok";
  }
}

function labelStatus(status: DashboardSnapshot["recentProjects"][number]["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
