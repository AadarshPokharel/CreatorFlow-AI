"use client";

import { create } from "zustand";

import type { GeneratedContentBundle } from "@/lib/types";

type CreatorFlowState = {
  sidebarOpen: boolean;
  generatedDraft: GeneratedContentBundle | null;
  projectId: string | null;
  searchQuery: string;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setGeneratedDraft: (
    payload: GeneratedContentBundle | null,
    projectId?: string | null
  ) => void;
  setSearchQuery: (query: string) => void;
};

export const useCreatorFlowStore = create<CreatorFlowState>((set) => ({
  sidebarOpen: false,
  generatedDraft: null,
  projectId: null,
  searchQuery: "",
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setGeneratedDraft: (generatedDraft, projectId = null) =>
    set({ generatedDraft, projectId }),
  setSearchQuery: (searchQuery) => set({ searchQuery })
}));
