"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/(auth)/actions";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={() => {
        setIsPending(true);
        startTransition(async () => {
          await signOutAction();
          router.push("/login");
          router.refresh();
          setIsPending(false);
        });
      }}
      aria-label="Sign out"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
}
