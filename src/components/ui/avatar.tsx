import { UserCircle2 } from "lucide-react";

import { getInitials } from "@/lib/utils";

export function Avatar({
  name,
  src,
  size = "md"
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm" ? "h-9 w-9 text-xs" : size === "lg" ? "h-14 w-14 text-base" : "h-11 w-11 text-sm";

  if (src) {
    return (
      <img
        alt={name}
        src={src}
        className={`${sizeClass} rounded-2xl border border-white/10 object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/8 font-semibold text-foreground/80`}
    >
      {name ? getInitials(name) : <UserCircle2 className="h-5 w-5" />}
    </div>
  );
}
