"use client";

import React from "react";
import { Crown } from "lucide-react";

import { isExpiringSoon, type ActiveSubscriptionSummary } from "@/lib/subscriptions-shared";
import { cn, toPersianDigits } from "@/lib/utils";

interface SubscriptionBadgeProps {
  subscription: ActiveSubscriptionSummary | null;
  onClick: () => void;
  disabled?: boolean;
}

/** Clickable remaining-days pill; opens the "add subscription" modal. */
export function SubscriptionBadge({ subscription, onClick, disabled }: SubscriptionBadgeProps) {
  const expiring = isExpiringSoon(subscription);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={subscription ? `${subscription.planName} — برای افزودن اشتراک کلیک کنید` : "برای افزودن اشتراک کلیک کنید"}
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors disabled:cursor-wait disabled:opacity-60",
        !subscription
          ? "border-white/[0.12] bg-white/[0.04] text-[#9AA2AF] hover:border-[#FF6A00]/40 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A]"
          : expiring
            ? "border-red-500/30 bg-red-500/10 text-red-400 hover:border-red-500/60 hover:bg-red-500/20"
            : "border-green-500/30 bg-green-500/10 text-green-400 hover:border-green-500/60 hover:bg-green-500/20"
      )}
    >
      <Crown className="h-3 w-3" />
      {subscription ? `${toPersianDigits(subscription.remainingDays)} روز` : "بدون اشتراک"}
    </button>
  );
}
