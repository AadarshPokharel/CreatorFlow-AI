"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { UseFormRegisterReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatCompactNumber } from "@/lib/utils";
import { manualMetricsSchema } from "@/lib/validations/workspace";

type MetricsValues = z.infer<typeof manualMetricsSchema>;

export function AnalyticsPageClient({
  snapshot
}: {
  snapshot: Awaited<
    ReturnType<typeof import("@/lib/server/content").getAnalyticsSnapshot>
  >;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<MetricsValues>({
    resolver: zodResolver(manualMetricsSchema),
    defaultValues: {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      followersGained: 0,
      watchTimeSeconds: 0
    }
  });

  const handleSubmit = form.handleSubmit((values) => {
    startTransition(() => {
      const engagementRate =
        ((values.likes + values.comments + values.shares) /
          Math.max(values.views, 1)) *
        100;
      setMessage(
        `Metrics captured. Calculated engagement rate: ${engagementRate.toFixed(1)}%.`
      );
      form.reset();
    });
  });

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Analytics"
        title="Track manual metrics, top content, and best posting windows."
        description="Use this space to review how your original content is performing and where the strongest publishing patterns are emerging."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Views" value={formatCompactNumber(snapshot.totals.views)} />
        <SummaryCard label="Likes" value={formatCompactNumber(snapshot.totals.likes)} />
        <SummaryCard label="Shares" value={formatCompactNumber(snapshot.totals.shares)} />
        <SummaryCard
          label="Followers gained"
          value={formatCompactNumber(snapshot.totals.followersGained)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Weekly momentum</CardTitle>
              <CardDescription className="mt-2">
                Seven-day performance trend across your short-form content.
              </CardDescription>
            </div>
            <Badge>7 days</Badge>
          </div>
          <div className="mt-8 flex h-64 items-end gap-3">
            {snapshot.weeklyTrend.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-3">
                <div
                  className="w-full rounded-t-2xl bg-gradient-to-t from-primary via-secondary to-accent"
                  style={{ height: `${value * 2}px` }}
                />
                <span className="text-xs text-foreground/45">D{index + 1}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Best posting times</CardTitle>
          <CardDescription className="mt-2">
            High-performing windows based on recent results.
          </CardDescription>
          <div className="mt-6 space-y-3">
            {snapshot.bestTimes.map((slot) => (
              <div
                key={`${slot.day}-${slot.time}`}
                className="rounded-2xl border border-white/10 bg-white/6 p-4"
              >
                <p className="font-medium">{slot.day}</p>
                <p className="mt-1 text-sm text-foreground/62">{slot.time}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-primary">
                  {slot.platform}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <CardTitle>Top-performing content</CardTitle>
          <CardDescription className="mt-2">
            The strongest projects in your current library.
          </CardDescription>
          <div className="mt-6 space-y-3">
            {snapshot.topContent.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-white/10 bg-white/6 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="mt-1 text-sm text-foreground/62">
                      {project.metrics.views.toLocaleString()} views • {project.metrics.engagementRate}% engagement
                    </p>
                  </div>
                  <Badge>{project.platform.replace("_", " ")}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground/68">
                  {project.content.hook}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Manual metrics entry</CardTitle>
          <CardDescription className="mt-2">
            Add imported or hand-entered results for any piece of content.
          </CardDescription>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <MetricInput label="Views" register={form.register("views", { valueAsNumber: true })} />
            <MetricInput label="Likes" register={form.register("likes", { valueAsNumber: true })} />
            <MetricInput
              label="Comments"
              register={form.register("comments", { valueAsNumber: true })}
            />
            <MetricInput
              label="Shares"
              register={form.register("shares", { valueAsNumber: true })}
            />
            <MetricInput
              label="Followers gained"
              register={form.register("followersGained", { valueAsNumber: true })}
            />
            <MetricInput
              label="Watch time (seconds)"
              register={form.register("watchTimeSeconds", { valueAsNumber: true })}
            />
            {message ? <p className="text-sm text-success">{message}</p> : null}
            <Button type="submit" className="w-full">
              Save Metrics
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <Card>
      <p className="text-sm text-foreground/55">{label}</p>
      <p className="mt-4 font-display text-4xl font-semibold">{value}</p>
    </Card>
  );
}

function MetricInput({
  label,
  register
}: {
  label: string;
  register: UseFormRegisterReturn;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground/78">{label}</label>
      <Input type="number" min={0} {...register} />
    </div>
  );
}
