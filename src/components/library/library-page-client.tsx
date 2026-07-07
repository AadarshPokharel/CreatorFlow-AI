"use client";

import { Heart, Search, Trash2, Copy, Archive } from "lucide-react";
import { useDeferredValue, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SectionHeading } from "@/components/ui/section-heading";
import { duplicateProject, formatDate } from "@/lib/utils";
import { useCreatorFlowStore } from "@/store/creator-flow-store";
import type { ContentProject } from "@/lib/types";

type SortOption = "newest" | "oldest" | "views" | "engagement";

export function LibraryPageClient({
  initialProjects
}: {
  initialProjects: ContentProject[];
}) {
  const globalSearchQuery = useCreatorFlowStore((state) => state.searchQuery);
  const deferredQuery = useDeferredValue(globalSearchQuery);
  const [projects, setProjects] = useState(initialProjects);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredProjects = projects
    .filter((project) => {
      const matchesQuery =
        !deferredQuery ||
        project.title.toLowerCase().includes(deferredQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(deferredQuery.toLowerCase())) ||
        (project.folder ?? "").toLowerCase().includes(deferredQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || project.status === statusFilter;

      return matchesQuery && matchesStatus;
    })
    .sort((left, right) => {
      switch (sortBy) {
        case "oldest":
          return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
        case "views":
          return right.metrics.views - left.metrics.views;
        case "engagement":
          return right.metrics.engagementRate - left.metrics.engagementRate;
        default:
          return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      }
    });

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Content Library"
        title="Search, sort, archive, favorite, duplicate, and organize every project."
        description="Your library keeps scripts, captions, hashtags, folders, tags, statuses, and performance context together so nothing disappears after posting."
      />

      <Card>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <Input
              value={globalSearchQuery}
              onChange={(event) =>
                useCreatorFlowStore.getState().setSearchQuery(event.target.value)
              }
              placeholder="Search titles, folders, or tags"
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="ready">Ready</option>
            <option value="scheduled">Scheduled</option>
            <option value="posted">Posted</option>
            <option value="missed">Missed</option>
          </Select>
          <Select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="views">Most views</option>
            <option value="engagement">Best engagement</option>
          </Select>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredProjects.map((project) => (
          <Card key={project.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{project.folder ?? "Unfiled"}</Badge>
                  <Badge>{project.platform.replace("_", " ")}</Badge>
                  <Badge>{project.status}</Badge>
                </div>
                <CardTitle className="mt-4">{project.title}</CardTitle>
                <CardDescription className="mt-2">
                  {formatDate(project.createdAt)} • {project.durationSeconds}s • {project.metrics.views.toLocaleString()} views
                </CardDescription>
              </div>
              <button
                type="button"
                onClick={() =>
                  setProjects((current) =>
                    current.map((item) =>
                      item.id === project.id ? { ...item, favorite: !item.favorite } : item
                    )
                  )
                }
                className="rounded-2xl border border-white/10 bg-white/6 p-3"
                aria-label="Toggle favorite"
              >
                <Heart
                  className={`h-5 w-5 ${project.favorite ? "fill-secondary text-secondary" : "text-foreground/55"}`}
                />
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-foreground/68">
              {project.content.caption}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-foreground/60"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setProjects((current) => [duplicateProject(project), ...current])
                }
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setProjects((current) =>
                    current.map((item) =>
                      item.id === project.id
                        ? { ...item, status: "archived", archived: true }
                        : item
                    )
                  )
                }
              >
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setProjects((current) => current.filter((item) => item.id !== project.id))
                }
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
