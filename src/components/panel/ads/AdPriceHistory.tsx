"use client";

import React, { useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, Minus, TrendingDown, TrendingUp } from "lucide-react";

import type { SearchAdSaleTerm } from "@/lib/panel-search-shared";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";
import { PriceHistoryChart } from "@/components/panel/search/PriceHistoryChart";

function percent(delta: number, base: number): string {
  if (!base) return "";
  return `${toPersianDigits(Math.abs((delta / base) * 100).toFixed(1))}٪`;
}

/** Full price timeline of one sale term: headline, chart, stats and history. */
function PriceHistoryPanel({ term }: { term: SearchAdSaleTerm }) {
  const hasDelta = term.delta !== null && term.delta !== 0;
  const delta = term.delta ?? 0;
  const up = delta > 0;
  const flat = !hasDelta;
  const first = term.history[0];
  const last = term.history[term.history.length - 1];
  const totalDelta = last.price - first.price;
  const changes = term.history.length - 1;
  const prices = term.history.map((p) => p.price);
  const highest = Math.max(...prices);
  const lowest = Math.min(...prices);

  return (
    <div className="space-y-5">
      {/* Headline */}
      <div className="relative overflow-hidden rounded-3xl border border-panel-line/[0.08] bg-panel-bg p-4">
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -end-10 -top-10 h-40 w-40 rounded-full blur-3xl",
            flat ? "bg-[#FF6A00]/15" : up ? "bg-emerald-500/20" : "bg-red-500/20"
          )}
        />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold text-panel-muted-2">قیمت فعلی</p>
            <p dir="rtl" className="mt-1 text-2xl font-black tabular-nums text-panel-text">
              {formatPersianNumber(term.currentPrice)}
              <span className="ms-1 text-xs font-semibold text-panel-muted-2">تومان</span>
            </p>
            {term.previousPrice !== null && (
              <p className="mt-1 text-[11px] text-panel-faint">
                قیمت قبلی: <span className="tabular-nums line-through decoration-red-400/60">{formatPersianNumber(term.previousPrice)}</span>
              </p>
            )}
          </div>
          {flat ? (
            <div className="flex flex-col items-end self-end rounded-2xl border border-[#FF6A00]/25 bg-[#FF6A00]/[0.08] px-3 py-2 text-end sm:self-auto">
              <span className="inline-flex items-center gap-1 text-sm font-black text-panel-accent-soft">
                <Minus className="h-4 w-4" />
                بدون تغییر
              </span>
              <span className="mt-0.5 text-[10px] font-bold text-panel-accent-soft/70">قیمت از ابتدا ثابت بوده است</span>
            </div>
          ) : (
            <div
              className={cn(
                "flex flex-col items-end self-end rounded-2xl border px-3 py-2 text-end sm:self-auto",
                up ? "border-emerald-500/30 bg-emerald-500/10" : "border-red-500/30 bg-red-500/10"
              )}
            >
              <span className={cn("inline-flex items-center gap-1 text-sm font-black tabular-nums", up ? "text-panel-success" : "text-panel-danger")}>
                {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span dir="ltr">
                  {up ? "+" : "−"}
                  {formatPersianNumber(Math.abs(delta))}
                </span>
              </span>
              <span className={cn("mt-0.5 text-[10px] font-bold", up ? "text-panel-success-2/80" : "text-panel-danger-2/80")}>
                {up ? "افزایش" : "کاهش"} {term.previousPrice ? percent(delta, term.previousPrice) : ""} نسبت به قبل
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-3xl border border-panel-line/[0.08] bg-gradient-to-b from-panel-surface to-panel-bg p-2 pt-3">
        <PriceHistoryChart points={term.history} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "قیمت اولیه", value: formatPersianNumber(first.price), tone: "text-panel-text" },
          {
            label: "تغییر کل",
            value: `${totalDelta > 0 ? "+" : totalDelta < 0 ? "−" : ""}${formatPersianNumber(Math.abs(totalDelta))}`,
            tone: totalDelta > 0 ? "text-panel-success" : totalDelta < 0 ? "text-panel-danger" : "text-panel-text",
          },
          { label: "بیشترین", value: formatPersianNumber(highest), tone: "text-panel-text" },
          { label: "کمترین", value: formatPersianNumber(lowest), tone: "text-panel-text" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-panel-line/[0.07] bg-panel-bg/70 px-3 py-2.5">
            <p className="text-[10px] font-bold text-panel-faint">{stat.label}</p>
            <p dir="ltr" className={cn("mt-0.5 text-start text-xs font-black tabular-nums", stat.tone)}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div>
        <p className="mb-2 flex items-center justify-between text-[11px] font-extrabold text-panel-muted-2">
          <span>تاریخچه تغییرات</span>
          <span className="rounded-md bg-panel-line/[0.05] px-1.5 py-0.5 text-[10px] text-panel-muted">
            {toPersianDigits(changes)} تغییر
          </span>
        </p>
        <ol className="relative space-y-2 before:absolute before:bottom-3 before:start-[15px] before:top-3 before:w-px before:bg-panel-line/[0.08]">
          {[...term.history].reverse().map((point, i, arr) => {
            const prev = arr[i + 1];
            const d = prev ? point.price - prev.price : null;
            const isLatest = i === 0;
            return (
              <li
                key={`${point.at}-${i}`}
                className={cn(
                  "relative flex items-center gap-3 rounded-2xl border px-3 py-2.5 ps-10",
                  isLatest ? "border-[#FF6A00]/25 bg-[#FF6A00]/[0.06]" : "border-panel-line/[0.06] bg-panel-line/[0.02]"
                )}
              >
                <span
                  className={cn(
                    "absolute start-[9px] flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-panel-surface",
                    d === null ? "bg-panel-faint" : d > 0 ? "bg-emerald-400" : d < 0 ? "bg-red-400" : "bg-panel-faint",
                    isLatest && "ring-4 ring-[#FF6A00]/20"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p dir="rtl" className="text-sm font-black tabular-nums text-panel-text">
                    {formatPersianNumber(point.price)} <span className="text-[10px] font-semibold text-panel-muted-2">تومان</span>
                  </p>
                  <p className="text-[10px] text-panel-faint">
                    {point.dateLabel} · {point.timeLabel}
                    {isLatest && <span className="ms-1.5 font-bold text-panel-accent-soft">قیمت فعلی</span>}
                  </p>
                </div>
                {d === null ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-panel-line/[0.05] px-1.5 py-1 text-[10px] font-bold text-panel-muted">
                    <Minus className="h-3 w-3" />
                    اولیه
                  </span>
                ) : (
                  <span
                    dir="ltr"
                    className={cn(
                      "inline-flex items-center gap-1 rounded-lg px-1.5 py-1 text-[11px] font-extrabold tabular-nums",
                      d > 0 ? "bg-emerald-500/[0.12] text-panel-success" : "bg-red-500/[0.12] text-panel-danger"
                    )}
                  >
                    {d > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {d > 0 ? "+" : "−"}
                    {formatPersianNumber(Math.abs(d))}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

/** Price history section of the ad page, with one tab per sale term. */
export function AdPriceHistory({ terms }: { terms: SearchAdSaleTerm[] }) {
  const [activeId, setActiveId] = useState(terms[0]?.id);
  const active = terms.find((term) => term.id === activeId) ?? terms[0];
  if (!active) return null;

  return (
    <div className="space-y-4">
      {terms.length > 1 && (
        <div role="tablist" aria-label="شرایط فروش" className="panel-no-scrollbar flex gap-2 overflow-x-auto">
          {terms.map((term) => {
            const selected = term.id === active.id;
            return (
              <button
                key={term.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(term.id)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-bold transition-colors",
                  selected
                    ? "border-[#FF6A00]/50 bg-[#FF6A00]/15 text-panel-accent"
                    : "border-panel-line/[0.1] bg-panel-surface text-panel-muted hover:border-panel-line/20 hover:text-panel-text"
                )}
              >
                {term.title}
              </button>
            );
          })}
        </div>
      )}
      <PriceHistoryPanel key={active.id} term={active} />
    </div>
  );
}
