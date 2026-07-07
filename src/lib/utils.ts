import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ContentProject } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatDate(
  value: string | number | Date,
  options?: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...options
  }).format(new Date(value));
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function pickRangeValue(min: number, max: number) {
  if (min === max) {
    return min;
  }

  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

export function duplicateProject(project: ContentProject) {
  return {
    ...project,
    id: crypto.randomUUID(),
    title: `${project.title} Copy`,
    createdAt: new Date().toISOString(),
    status: "draft" as const
  };
}
