import React from "react";
import { Activity, ArrowDownRight, ArrowUpRight } from "lucide-react";

import type { SearchAdSaleTerm } from "@/lib/panel-search-shared";
import { cn, formatPersianNumber } from "@/lib/utils";

interface PriceDeltaBadgeProps {
  term: SearchAdSaleTerm;
}

/**
 * Sale-term chip for ad cards: the title badge plus, when the price has
 * changed, a green/red "+۱۵,۰۰۰,۰۰۰ / −۱۵,۰۰۰,۰۰۰" delta badge. The full price
 * history lives on the ad's page, which the surrounding card links to.
 */
export function PriceDeltaBadge({ term }: PriceDeltaBadgeProps) {
  const hasDelta = term.delta !== null && term.delta !== 0;
  const delta = term.delta ?? 0;
  const up = delta > 0;

  return (
    <>
      <span className="rounded-lg border border-[#FF6A00]/25 bg-[#FF6A00]/[0.08] px-2 py-1 text-[11px] font-bold text-panel-accent-soft">
        {term.title}
      </span>
      {hasDelta && (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-lg border px-1.5 py-1 text-[11px] font-extrabold tabular-nums",
            up ? "border-emerald-500/35 bg-emerald-500/[0.12] text-panel-success" : "border-red-500/35 bg-red-500/[0.12] text-panel-danger"
          )}
        >
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          <span dir="ltr">
            {up ? "+" : "−"}
            {formatPersianNumber(Math.abs(delta))}
          </span>
          <Activity className="h-3 w-3 opacity-50" />
        </span>
      )}
    </>
  );
}
