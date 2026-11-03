import React from "react";
import { BadgeCheck, Clock3, FileQuestion, ShieldX } from "lucide-react";

import type { VerificationStatus } from "@/lib/verification-shared";
import { cn } from "@/lib/utils";

interface VerificationStatusBadgeProps {
  authenticaed: boolean;
  /** Status of the latest submission; null when the collaborator sent nothing yet. */
  status: VerificationStatus | null;
  className?: string;
}

/** Identity-verification state of a collaborator, as a compact pill. */
export function VerificationStatusBadge({ authenticaed, status, className }: VerificationStatusBadgeProps) {
  const state = authenticaed
    ? { label: "تایید شده", icon: BadgeCheck, tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" }
    : status === "pending"
      ? { label: "در انتظار بررسی", icon: Clock3, tone: "border-amber-500/30 bg-amber-500/10 text-amber-300" }
      : status === "rejected"
        ? { label: "رد شده", icon: ShieldX, tone: "border-red-500/30 bg-red-500/10 text-red-400" }
        : { label: "ارسال نشده", icon: FileQuestion, tone: "border-white/[0.1] bg-white/[0.03] text-[#8B93A1]" };
  const Icon = state.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold",
        state.tone,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {state.label}
    </span>
  );
}
