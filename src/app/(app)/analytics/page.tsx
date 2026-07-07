import { AnalyticsPageClient } from "@/components/analytics/analytics-page-client";
import { getAnalyticsSnapshot } from "@/lib/server/content";

export default async function AnalyticsPage() {
  const snapshot = await getAnalyticsSnapshot();
  return <AnalyticsPageClient snapshot={snapshot} />;
}
