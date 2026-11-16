"use client";

import React from "react";
import Link from "next/link";
import { Anchor } from "lucide-react";

import { PRICE_MARKETS, PRICE_MARKET_LABELS, type PriceMarket } from "@/lib/price-market";
import { cn } from "@/lib/utils";

/** Tiny national licence plate: white plate with the blue strip at its left end. */
function PlateGlyph({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      dir="ltr"
      className={cn("relative flex h-[18px] w-7 overflow-hidden rounded-[4px] border border-current bg-white/90", className)}
    >
      <span className="h-full w-[7px] bg-[#1E5BD8]" />
      <span className="flex flex-1 items-center justify-center gap-[2px] px-[2px]">
        <span className="h-[2px] w-full rounded bg-[#0B0E13]/70" />
      </span>
    </span>
  );
}

export function PriceMarketIcon({ market, className }: { market: PriceMarket; className?: string }) {
  return market === "national" ? <PlateGlyph className={className} /> : <Anchor className={cn("h-[18px] w-[18px]", className)} />;
}

interface TabBadge {
  /** Short line under the label, e.g. "۱۲ خودرو · ۴ فروشنده". */
  caption?: string;
  /** Unsaved changes in this tab. */
  dirty?: boolean;
}

type PriceMarketTabsProps = {
  active: PriceMarket;
  badges?: Partial<Record<PriceMarket, TabBadge>>;
  className?: string;
  /** Accessible name of the control. */
  label?: string;
} & (
  | {
      /**
       * Link mode: each tab is a page (public lists). Plain URLs, not a
       * function, so server components can render this client component.
       */
      hrefs: Record<PriceMarket, string>;
      onSelect?: never;
      panelIdFor?: never;
    }
  | {
      /** Tab mode: both panels live on the page (editors). */
      onSelect: (market: PriceMarket) => void;
      /** Id of each tab's panel (for `aria-controls`). */
      panelIdFor: (market: PriceMarket) => string;
      hrefs?: never;
    }
);

/**
 * The switch between the two separate price lists (free zone / national
 * plate): a two-up segmented control with a sliding highlight, an icon,
 * the list's name and an optional caption per tab. Full width and
 * thumb-sized on phones.
 */
export function PriceMarketTabs({ active, badges, className, label = "نوع لیست قیمت", ...mode }: PriceMarketTabsProps) {
  const isTabs = "onSelect" in mode && typeof mode.onSelect === "function";

  function onKeyDown(event: React.KeyboardEvent) {
    if (!isTabs) return;
    // RTL: the next tab is to the left.
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const index = PRICE_MARKETS.indexOf(active);
    const next = PRICE_MARKETS[(index + (event.key === "ArrowLeft" ? 1 : -1) + PRICE_MARKETS.length) % PRICE_MARKETS.length];
    mode.onSelect!(next);
    window.requestAnimationFrame(() => document.getElementById(`market-tab-${next}`)?.focus());
  }

  const content = (market: PriceMarket) => {
    const on = market === active;
    const badge = badges?.[market];
    return (
      <>
        <span
          className={cn(
            "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300",
            on ? "border-[#07090C]/15 bg-[#07090C]/15 text-[#07090C]" : "border-panel-line/[0.1] bg-panel-bg/70 text-panel-accent"
          )}
        >
          <PriceMarketIcon market={market} />
          {badge?.dirty && (
            <span className="absolute -end-1 -top-1 flex h-3 w-3" title="تغییرات ذخیره‌نشده">
              <span className="absolute inset-0 rounded-full bg-amber-400 motion-safe:animate-ping" />
              <span className="relative h-3 w-3 rounded-full border-2 border-panel-surface bg-amber-400" />
            </span>
          )}
        </span>
        <span className="min-w-0 text-start">
          <span className={cn("block truncate text-sm font-black leading-6", on ? "text-[#07090C]" : "text-panel-text")}>
            {PRICE_MARKET_LABELS[market]}
          </span>
          {badge?.caption && (
            <span className={cn("block truncate text-[10px] font-bold leading-4", on ? "text-[#07090C]/70" : "text-panel-muted")}>{badge.caption}</span>
          )}
        </span>
      </>
    );
  };

  const tabClass = (market: PriceMarket) =>
    cn(
      "relative z-[1] flex min-h-[3.5rem] min-w-0 items-center gap-2.5 rounded-2xl px-2.5 py-2 transition-colors duration-300 sm:px-3",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/60 active:scale-[0.99]",
      market !== active && "hover:bg-panel-line/[0.04]"
    );

  return (
    <div
      {...(isTabs ? { role: "tablist", "aria-label": label, onKeyDown } : { role: "navigation", "aria-label": label })}
      className={cn(
        "relative grid grid-cols-2 gap-1.5 rounded-[22px] border border-panel-line/[0.1] bg-panel-surface p-1.5 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {/* Sliding highlight: cell width = (100% - 2·padding - gap) / 2 */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-1.5 w-[calc(50%-0.5625rem)] rounded-2xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] shadow-[0_10px_30px_-10px_rgba(255,106,0,0.8)] transition-[inset-inline-start] duration-300 ease-out motion-reduce:transition-none",
          active === PRICE_MARKETS[0] ? "start-1.5" : "start-[calc(50%+0.1875rem)]"
        )}
      />
      {PRICE_MARKETS.map((market) =>
        isTabs ? (
          <button
            key={market}
            id={`market-tab-${market}`}
            type="button"
            role="tab"
            aria-selected={market === active}
            aria-controls={mode.panelIdFor!(market)}
            tabIndex={market === active ? 0 : -1}
            onClick={() => mode.onSelect!(market)}
            className={tabClass(market)}
          >
            {content(market)}
          </button>
        ) : (
          <Link
            key={market}
            href={mode.hrefs![market]}
            scroll={false}
            aria-current={market === active ? "page" : undefined}
            className={tabClass(market)}
          >
            {content(market)}
          </Link>
        )
      )}
    </div>
  );
}
