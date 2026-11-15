"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { MARKET_RATES_POLL_MS, type CurrencyRate, type MarketRates } from "@/lib/market-rates-shared";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

type Flash = "up" | "down" | null;

/**
 * Slim live open-market dollar rate shown at the top of every panel page, for
 * guests and members alike. Polls the shared, server-cached rates endpoint
 * (never the upstream directly); a blinking dot marks it as live and the price
 * briefly flashes green/red when it changes. Hidden while no rate is known.
 */
export function DollarTicker() {
  const [rate, setRate] = useState<CurrencyRate | null>(null);
  const [flash, setFlash] = useState<Flash>(null);
  const lastPrice = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let flashTimer: ReturnType<typeof setTimeout> | undefined;

    async function load() {
      // Skip background tabs; the next visible tick catches up.
      if (document.visibilityState === "hidden" && lastPrice.current !== null) return;
      try {
        const response = await fetch("/api/panel/rates", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as MarketRates;
        const usd = data.usd;
        if (cancelled || !usd) return;
        const previous = lastPrice.current;
        if (previous !== null && usd.priceRial !== previous) {
          setFlash(usd.priceRial > previous ? "up" : "down");
          clearTimeout(flashTimer);
          flashTimer = setTimeout(() => setFlash(null), 1600);
        }
        lastPrice.current = usd.priceRial;
        setRate(usd);
      } catch {
        // Keep the last value; the ticker simply stays as it was.
      }
    }

    load();
    const interval = setInterval(load, MARKET_RATES_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(flashTimer);
    };
  }, []);

  if (!rate) return null;

  const change = rate.changeRial ?? 0;
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";
  // "1405/08/24 14:30:12" → "۱۴:۳۰"
  const time = rate.updatedAtJalali?.match(/\d{2}:\d{2}/)?.[0];

  return (
    <div className="admin-animate-in mb-3 flex justify-start">
      <div
        role="status"
        aria-live="polite"
        className="inline-flex max-w-full items-center gap-2 rounded-full border border-panel-line/[0.08] bg-panel-surface/80 py-1 pe-3 ps-2 text-[11px] backdrop-blur"
      >
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping",
              rate.stale ? "bg-panel-warning" : "bg-emerald-500"
            )}
          />
          <span className={cn("relative inline-flex h-2 w-2 rounded-full", rate.stale ? "bg-panel-warning" : "bg-emerald-500")} />
        </span>
        <span className="shrink-0 font-bold text-panel-muted">دلار آزاد</span>
        <span
          className={cn(
            "rounded-md px-1 font-black tabular-nums text-panel-text",
            flash === "up" && "rate-flash-up",
            flash === "down" && "rate-flash-down"
          )}
        >
          {formatPersianNumber(rate.priceRial)}
          <span className="ms-1 text-[9px] font-bold text-panel-muted-2">ریال</span>
        </span>
        {direction !== "flat" && rate.changePct !== null && (
          <span
            dir="ltr"
            className={cn(
              "inline-flex shrink-0 items-center text-[10px] font-extrabold tabular-nums",
              direction === "up" ? "text-panel-success" : "text-panel-danger"
            )}
          >
            {direction === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {toPersianDigits(`${Math.abs(rate.changePct).toFixed(2)}%`)}
          </span>
        )}
        {time && <span className="hidden shrink-0 text-[10px] text-panel-faint sm:inline">{toPersianDigits(time)}</span>}
      </div>
    </div>
  );
}
