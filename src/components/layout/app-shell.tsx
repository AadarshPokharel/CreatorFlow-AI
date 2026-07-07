import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import type { NotificationItem, Viewer } from "@/lib/types";

export function AppShell({
  children,
  viewer,
  notifications
}: {
  children: ReactNode;
  viewer: Viewer;
  notifications: NotificationItem[];
}) {
  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1600px] gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="rounded-[32px] border border-white/10 bg-slate-950/45 p-4 backdrop-blur-2xl sm:p-6">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <MobileNav />
          </div>
          <Topbar viewer={viewer} notifications={notifications} />
          {children}
        </main>
      </div>
    </div>
  );
}
