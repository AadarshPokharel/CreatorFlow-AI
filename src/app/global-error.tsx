"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="surface max-w-lg rounded-[32px] p-8 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-danger">Something broke</p>
          <h1 className="mt-4 font-display text-3xl font-semibold">
            CreatorFlow hit an unexpected error.
          </h1>
          <p className="mt-4 text-sm leading-6 text-foreground/68">{error.message}</p>
          <Button className="mt-6" onClick={reset}>
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
