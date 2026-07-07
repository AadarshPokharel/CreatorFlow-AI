import { LibraryPageClient } from "@/components/library/library-page-client";
import { getLibraryProjects } from "@/lib/server/content";

export default async function LibraryPage() {
  const initialProjects = await getLibraryProjects();
  return <LibraryPageClient initialProjects={initialProjects} />;
}
