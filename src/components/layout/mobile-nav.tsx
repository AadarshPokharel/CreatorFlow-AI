"use client";

import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { useCreatorFlowStore } from "@/store/creator-flow-store";

export function MobileNav() {
  const sidebarOpen = useCreatorFlowStore((state) => state.sidebarOpen);
  const setSidebarOpen = useCreatorFlowStore((state) => state.setSidebarOpen);

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/65 p-4 backdrop-blur-sm lg:hidden">
          <div className="mb-4 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>
      ) : null}
    </>
  );
}
