import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { requireViewer } from "@/lib/auth/session";
import { getDemoDashboardSnapshot } from "@/lib/demo-data";

export default async function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  const viewer = await requireViewer();
  const notifications = getDemoDashboardSnapshot().notifications;

  return (
    <AppShell viewer={viewer} notifications={notifications}>
      {children}
    </AppShell>
  );
}
