import { SettingsPageClient } from "@/components/settings/settings-page-client";
import { getSettingsSnapshot } from "@/lib/server/content";

export default async function SettingsPage() {
  const snapshot = await getSettingsSnapshot();
  return <SettingsPageClient snapshot={snapshot} />;
}
