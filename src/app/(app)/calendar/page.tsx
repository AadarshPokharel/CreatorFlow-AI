import { CalendarClock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCalendarProjects } from "@/lib/server/content";

const statusStyles = {
  draft: "bg-white/8 text-foreground/70",
  ready: "bg-primary/15 text-primary",
  scheduled: "bg-secondary/15 text-secondary",
  posted: "bg-accent/15 text-accent",
  missed: "bg-danger/15 text-danger"
} as const;

export default async function CalendarPage() {
  const entries = await getCalendarProjects();
  const monthStart = new Date("2026-07-01T00:00:00.000Z");
  const totalDays = 31;
  const startOffset = monthStart.getUTCDay();
  const cells = Array.from(
    { length: startOffset + totalDays },
    (_, index) => index - startOffset + 1
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Calendar"
        title="Monthly planner for July 2026"
        description="Track draft, ready, scheduled, posted, and missed content in a single publishing grid."
      />

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Posting planner</CardTitle>
            <CardDescription className="mt-2">
              A clear month view helps keep production, review, and publishing aligned.
            </CardDescription>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/8 p-3">
            <CalendarClock className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-3 text-center text-xs uppercase tracking-[0.2em] text-foreground/45">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-7 gap-3">
          {cells.map((day, index) => {
            const dayEntries =
              day > 0
                ? entries.filter((entry) => {
                    const entryDate = new Date(entry.date);
                    return entryDate.getUTCDate() === day;
                  })
                : [];

            return (
              <div
                key={index}
                className="min-h-32 rounded-[24px] border border-white/10 bg-white/5 p-3"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground/78">
                    {day > 0 ? day : ""}
                  </span>
                  {dayEntries.length ? <Badge>{dayEntries.length}</Badge> : null}
                </div>
                <div className="space-y-2">
                  {dayEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`rounded-2xl px-3 py-2 text-xs ${statusStyles[entry.status]}`}
                    >
                      <p className="font-medium">{entry.title}</p>
                      <p className="mt-1 uppercase tracking-[0.18em] opacity-80">
                        {entry.platform.replace("_", " ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
