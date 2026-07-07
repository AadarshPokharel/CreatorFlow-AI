"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  LibraryBig,
  Settings2,
  Sparkles
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/constants";

const icons = {
  "layout-dashboard": LayoutDashboard,
  sparkles: Sparkles,
  "library-big": LibraryBig,
  "calendar-days": CalendarDays,
  "bar-chart-3": BarChart3,
  "settings-2": Settings2
};

export function Sidebar({
  onNavigate
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col rounded-[28px] border border-white/10 bg-slate-950/70 p-4 backdrop-blur-2xl">
      <div className="mb-8 px-3 pt-2">
        <Badge>CreatorFlow AI</Badge>
        <h1 className="mt-4 font-display text-2xl font-semibold">Original short-form, organized.</h1>
        <p className="mt-2 text-sm leading-6 text-foreground/62">
          Generate original drafts, keep assets creator-owned, and manage the full publishing pipeline from one workspace.
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = icons[item.icon];
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-white/12 text-white"
                  : "text-foreground/68 hover:bg-white/8 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[24px] border border-primary/20 bg-primary/10 p-4">
        <p className="text-sm font-semibold text-primary">Compliance first</p>
        <p className="mt-2 text-sm leading-6 text-foreground/70">
          CreatorFlow AI is designed for original, legal content only. No scraping, reposting, or downloading from social platforms.
        </p>
      </div>
    </aside>
  );
}
