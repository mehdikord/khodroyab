"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy, Fingerprint } from "lucide-react";

import { cn, toPersianDigits } from "@/lib/utils";

interface SellerCodeBadgeProps {
  code: string;
  /** Caption above the code. */
  label?: string;
  /** `lg`: ad detail / profile; `md`: cards; `sm`: table rows. */
  size?: "sm" | "md" | "lg";
  /** Marks the viewer's own code. */
  mine?: boolean;
  className?: string;
}

/** "1234 5678" — two groups of four digits read more easily. */
function groupCode(code: string): string {
  return code.length === 8 ? `${code.slice(0, 4)} ${code.slice(4)}` : code;
}

const SIZE = {
  sm: { box: "gap-2 px-2 py-1.5 rounded-xl", icon: "h-7 w-7 rounded-lg", iconInner: "h-3.5 w-3.5", code: "text-[13px] tracking-[0.14em]", label: "text-[9px]" },
  md: { box: "gap-2.5 px-2.5 py-2 rounded-2xl", icon: "h-9 w-9 rounded-xl", iconInner: "h-4 w-4", code: "text-base tracking-[0.16em]", label: "text-[10px]" },
  lg: { box: "gap-3 px-3.5 py-3 rounded-2xl", icon: "h-12 w-12 rounded-2xl", iconInner: "h-5 w-5", code: "text-xl tracking-[0.2em] sm:text-2xl", label: "text-[11px]" },
} as const;

/**
 * The seller's public code, shown instead of their name, photo and contact
 * details. Tapping anywhere on the badge copies the code.
 */
export function SellerCodeBadge({ code, label = "کد فروشنده", size = "md", mine, className }: SellerCodeBadgeProps) {
  const [copied, setCopied] = useState(false);
  const s = SIZE[size];

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard unavailable (insecure context / permissions): ignore silently.
    }
  }

  if (!code) return null;

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `${label} کپی شد` : `کپی ${label} ${toPersianDigits(code)}`}
      title={`کپی ${label}`}
      className={cn(
        "group/seller-code relative z-[2] flex w-full items-center border text-start transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40 active:scale-[0.99]",
        s.box,
        copied
          ? "border-emerald-500/40 bg-emerald-500/[0.1]"
          : "border-[#FF6A00]/30 bg-gradient-to-l from-[#FF6A00]/[0.12] to-[#FF6A00]/[0.03] hover:border-[#FF6A00]/55 hover:from-[#FF6A00]/[0.18]",
        className
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center border transition-colors",
          s.icon,
          copied ? "border-emerald-500/40 bg-emerald-500/15 text-panel-success" : "border-[#FF6A00]/35 bg-[#FF6A00]/[0.14] text-panel-accent"
        )}
      >
        <Fingerprint className={s.iconInner} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("flex items-center gap-1.5 font-bold text-panel-muted", s.label)}>
          {label}
          {mine && (
            <span className="rounded-md border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-1.5 py-px text-[9px] font-black text-panel-accent">شما</span>
          )}
        </span>
        <span
          dir="ltr"
          className={cn("mt-0.5 block text-end font-mono font-black tabular-nums", s.code, copied ? "text-panel-success" : "text-panel-text")}
        >
          {toPersianDigits(groupCode(code))}
        </span>
      </span>
      <span
        className={cn(
          "flex shrink-0 items-center gap-1 rounded-lg px-1.5 py-1 text-[10px] font-bold transition-colors",
          copied ? "text-panel-success" : "text-panel-faint group-hover/seller-code:text-panel-accent"
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {size !== "sm" && <span>{copied ? "کپی شد" : "کپی"}</span>}
      </span>
    </button>
  );
}
