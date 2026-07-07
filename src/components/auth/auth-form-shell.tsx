import type { ReactNode } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export function AuthFormShell({
  title,
  description,
  footer,
  children
}: {
  title: string;
  description: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="surface noise-overlay relative w-full max-w-md rounded-[32px] p-8">
      <div className="mb-8">
        <Badge>CreatorFlow AI</Badge>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-foreground/68">{description}</p>
      </div>

      {children}

      {footer ? <div className="mt-6 text-sm text-foreground/62">{footer}</div> : null}

      <p className="mt-6 text-xs leading-5 text-foreground/45">
        By continuing, you confirm your workflow will create original content and will not scrape, download, or repost copyrighted material from social platforms.
      </p>
      <Link href="/" className="mt-6 inline-flex text-sm text-primary">
        Back to overview
      </Link>
    </div>
  );
}
