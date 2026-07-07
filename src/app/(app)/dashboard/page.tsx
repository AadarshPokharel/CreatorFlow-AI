import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";
import { getDashboardSnapshot } from "@/lib/server/content";

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();
  return <DashboardPageClient snapshot={snapshot} />;
}
