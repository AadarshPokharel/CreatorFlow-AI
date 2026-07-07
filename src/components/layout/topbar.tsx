"use client";

import { Bell, Search } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { useCreatorFlowStore } from "@/store/creator-flow-store";
import type { NotificationItem, Viewer } from "@/lib/types";

export function Topbar({
  viewer,
  notifications
}: {
  viewer: Viewer;
  notifications: NotificationItem[];
}) {
  const searchQuery = useCreatorFlowStore((state) => state.searchQuery);
  const setSearchQuery = useCreatorFlowStore((state) => state.setSearchQuery);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search drafts, captions, tags, or folders"
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount ? (
            <span className="absolute right-2 top-2 inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
          ) : null}
        </Button>
        <ThemeToggle />
        <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-3 py-2 sm:flex">
          <Avatar name={viewer.fullName} src={viewer.avatarUrl} size="sm" />
          <div className="text-right">
            <p className="text-sm font-medium">{viewer.fullName}</p>
            <p className="text-xs text-foreground/60">{viewer.email}</p>
          </div>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}
