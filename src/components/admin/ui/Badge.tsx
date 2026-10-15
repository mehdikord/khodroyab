import React from "react";

import { cn } from "@/lib/utils";

type BadgeTone = "success" | "error" | "muted";

interface BadgeProps {
  tone: BadgeTone;
  children: React.ReactNode;
  className?: string;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  error: "border-red-500/25 bg-red-500/10 text-red-300",
  muted: "border-white/[0.1] bg-white/[0.05] text-[#9AA2AF]",
};

/** Small read-only status pill used inside tables and cards. */
export function Badge({ tone, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold leading-none",
        TONE_CLASSES[tone],
        className
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}