import React from "react";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AD_STATUS_LABELS, type AdStatus } from "@/lib/ad-status";
import { cn } from "@/lib/utils";

const STYLES: Record<AdStatus, { className: string; icon: LucideIcon }> = {
  pending: {
    className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    icon: Clock3,
  },
  approved: {
    className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    icon: CheckCircle2,
  },
  rejected: {
    className: "border-red-500/25 bg-red-500/10 text-red-300",
    icon: XCircle,
  },
};

interface AdStatusBadgeProps {
  status: AdStatus;
  size?: "sm" | "md";
  className?: string;
}

/** Moderation-status pill for sale ads. Works in server and client components. */
export function AdStatusBadge({ status, size = "md", className }: AdStatusBadgeProps) {
  const { className: tone, icon: Icon } = STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-bold leading-none",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        tone,
        className
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {AD_STATUS_LABELS[status]}
    </span>
  );
}
