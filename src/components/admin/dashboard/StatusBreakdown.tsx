import React from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, PauseCircle, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AD_STATUS_LABELS, type AdStatus } from "@/lib/ad-status";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

/**
 * Segment order is approved → pending → rejected: the adjacent pairs
 * (emerald/amber, amber/red) are the CVD-safe ones; emerald/red are never
 * neighbours.
 */
const SEGMENTS: { status: AdStatus; icon: LucideIcon; fill: string; dot: string; text: string }[] = [
  { status: "approved", icon: CheckCircle2, fill: "bg-emerald-400", dot: "bg-emerald-400", text: "text-emerald-300" },
  { status: "pending", icon: Clock3, fill: "bg-amber-400", dot: "bg-amber-400", text: "text-amber-300" },
  { status: "rejected", icon: XCircle, fill: "bg-red-400", dot: "bg-red-400", text: "text-red-300" },
];

interface StatusBreakdownProps {
  counts: Record<AdStatus, number>;
  inactive: number;
}

/** Part-to-whole stacked bar of ad moderation states + legend with counts. */
export function StatusBreakdown({ counts, inactive }: StatusBreakdownProps) {
  const total = counts.approved + counts.pending + counts.rejected;
  const approvalRate = total > 0 ? Math.round((counts.approved / total) * 100) : 0;

  return (
    <div className="flex h-full flex-col gap-5">
      {/* Hero ratio */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold text-[#9BA3AE]">نرخ تایید آگهی‌ها</p>
          <p className="mt-1 text-3xl font-black leading-none text-[#F5F5F5]">
            {toPersianDigits(approvalRate)}
            <span className="text-lg font-bold text-[#9BA3AE]">٪</span>
          </p>
        </div>
        <p className="text-[11px] text-[#8B93A1]">
          از مجموع <span className="font-bold text-[#D2D7DF]">{formatPersianNumber(total)}</span> آگهی
        </p>
      </div>

      {/* Stacked bar with 2px surface gaps */}
      <div
        role="img"
        aria-label={SEGMENTS.map((s) => `${AD_STATUS_LABELS[s.status]}: ${toPersianDigits(counts[s.status])}`).join("، ")}
        className="flex h-4 w-full gap-[2px] overflow-visible rounded-full bg-white/[0.05]"
        dir="ltr"
      >
        {total === 0 ? null : (
          SEGMENTS.map((segment) => {
            const value = counts[segment.status];
            if (value === 0) return null;
            const pct = (value / total) * 100;
            return (
              <div
                key={segment.status}
                className="group relative h-full min-w-[6px] first:rounded-s-full last:rounded-e-full"
                style={{ width: `${pct}%` }}
              >
                <div className={cn("h-full w-full rounded-[inherit] transition-opacity group-hover:opacity-80", segment.fill)} />
                <div
                  dir="rtl"
                  className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/[0.1] bg-[#171B21] px-2.5 py-1.5 text-[11px] text-[#F5F5F5] shadow-[0_12px_30px_rgba(0,0,0,0.6)] group-hover:block"
                >
                  {AD_STATUS_LABELS[segment.status]} · {formatPersianNumber(value)} ({toPersianDigits(Math.round(pct))}٪)
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Legend */}
      <ul className="space-y-2">
        {SEGMENTS.map((segment) => {
          const value = counts[segment.status];
          const pct = total > 0 ? Math.round((value / total) * 100) : 0;
          const Icon = segment.icon;
          return (
            <li key={segment.status}>
              <Link
                href={`/admin/ads?status=${segment.status}`}
                className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-white/[0.08] hover:bg-white/[0.03]"
              >
                <span aria-hidden="true" className={cn("h-2.5 w-2.5 shrink-0 rounded-full", segment.dot)} />
                <Icon className={cn("h-4 w-4 shrink-0", segment.text)} />
                <span className="flex-1 text-xs font-semibold text-[#D2D7DF]">{AD_STATUS_LABELS[segment.status]}</span>
                <span className="font-mono text-[11px] tabular-nums text-[#8B93A1]">{toPersianDigits(pct)}٪</span>
                <span className="w-10 text-end text-sm font-extrabold tabular-nums text-[#F5F5F5]">
                  {formatPersianNumber(value)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[11px] text-[#8B93A1]">
        <PauseCircle className="h-3.5 w-3.5 text-[#5E6672]" />
        <span className="flex-1">آگهی‌های غیرفعال (پنهان از سایت)</span>
        <span className="font-bold text-[#D2D7DF]">{formatPersianNumber(inactive)}</span>
      </div>
    </div>
  );
}
