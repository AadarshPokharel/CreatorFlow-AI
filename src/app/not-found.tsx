import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-lg text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-foreground/50">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">Page not found</h1>
        <p className="mt-4 text-sm leading-6 text-foreground/68">
          The route you were looking for does not exist in this CreatorFlow workspace.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className={buttonVariants()}>
            Home
          </Link>
          <Link href="/dashboard" className={buttonVariants({ variant: "secondary" })}>
            Dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
}
