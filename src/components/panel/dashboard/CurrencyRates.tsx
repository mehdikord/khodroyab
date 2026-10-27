"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Clock3, Minus, RefreshCw } from "lucide-react";

import { MARKET_RATES_POLL_MS, type CurrencyRate, type MarketRates } from "@/lib/market-rates-shared";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface CurrencyRatesProps {
  initialRates: MarketRates | null;
}

type Status = "live" | "loading" | "error";
type Flash = "up" | "down" | null;

const CURRENCIES = [
  { key: "usd", title: "دلار آمریکا", code: "USD", symbol: "$", glow: "from-emerald-500/25" },
  { key: "eur", title: "یورو", code: "EUR", symbol: "€", glow: "from-sky-500/25" },
] as const;

const RING_RADIUS = 15;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

function formatRial(value: number | null): string {
  return value === null ? "---" : formatPersianNumber(value);
}

/** "۱۴۰۵/۰۸/۰۳ ۱۹:۵۹" from the upstream Jalali timestamp (seconds dropped). */
function formatJalali(value: string | null): string | null {
  if (!value) return null;
  return toPersianDigits(value.replace(/:\d{2}$/, ""));
}

/** Seconds-to-next-refresh ring around the manual refresh button. */
function CountdownRing({ progress, spinning, onClick, disabled }: { progress: number; spinning: boolean; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title="به‌روزرسانی همین حالا"
      aria-label="به‌روزرسانی قیمت‌ها"
      className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-panel-muted transition-colors hover:text-panel-accent disabled:cursor-wait"
    >
      <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="18" cy="18" r={RING_RADIUS} fill="none" strokeWidth="2.5" className="stroke-panel-line/15" />
        <circle
          cx="18"
          cy="18"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="stroke-[#FF6A00] transition-[stroke-dashoffset] duration-1000 ease-linear"
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH * (1 - progress)}
        />
      </svg>
      <RefreshCw className={cn("h-3.5 w-3.5", spinning && "animate-spin")} />
    </button>
  );
}

function ChangePill({ rate }: { rate: CurrencyRate }) {
  const change = rate.changeRial ?? 0;
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";
  const Icon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;
  return (
    <span
      dir="ltr"
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 rounded-full border px-2 py-0.5 text-[11px] font-extrabold tabular-nums",
        direction === "up" && "border-emerald-500/35 bg-emerald-500/10 text-panel-success",
        direction === "down" && "border-red-500/35 bg-red-500/10 text-panel-danger",
        direction === "flat" && "border-panel-line/15 bg-panel-line/[0.05] text-panel-muted"
      )}
    >
      <Icon className="h-3 w-3" />
      {rate.changePct !== null && <span>{toPersianDigits(`${Math.abs(rate.changePct).toFixed(2)}%`)}</span>}
    </span>
  );
}

function RateCard({
  meta,
  rate,
  flash,
  delay,
}: {
  meta: (typeof CURRENCIES)[number];
  rate: CurrencyRate | null;
  flash: Flash;
  delay: number;
}) {
  const updated = formatJalali(rate?.updatedAtJalali ?? null);
  return (
    <article
      className="panel-card-in relative overflow-hidden rounded-2xl border border-panel-line/[0.1] bg-panel-surface px-4 py-3.5 transition-colors hover:border-[#FF6A00]/30"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn("pointer-events-none absolute -top-12 end-[-30px] h-28 w-28 rounded-full bg-gradient-to-br to-transparent blur-2xl", meta.glow)} aria-hidden="true" />

      <div className="relative flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6A00] to-[#FF8A2A] text-lg font-black text-[#07090C]">
          {meta.symbol}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-panel-text">{meta.title}</h3>
            <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-panel-faint">{meta.code}</span>
          </div>
          {rate ? (
            <p
              key={`${rate.priceRial}-${flash ?? "none"}`}
              className={cn(
                "mt-0.5 flex items-baseline gap-1.5 rounded-lg tabular-nums",
                flash === "up" && "rate-flash-up",
                flash === "down" && "rate-flash-down"
              )}
            >
              <span className="text-xl font-black leading-7 text-panel-text">{formatRial(rate.priceRial)}</span>
              <span className="text-[11px] font-bold text-panel-accent">ریال</span>
            </p>
          ) : (
            <div className="mt-1.5 h-6 w-32 animate-pulse rounded-lg bg-panel-line/[0.08]" aria-hidden="true" />
          )}
        </div>

        {rate && <ChangePill rate={rate} />}
      </div>

      {rate && (
        <div className="relative mt-2 flex items-center justify-between gap-2 border-t border-panel-line/[0.06] pt-2 text-[10px] font-semibold text-panel-faint">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3 w-3" />
            {updated ?? "---"}
          </span>
          {rate.stale && (
            <span className="font-bold text-panel-warning" title="بازار بسته است یا منبع هنوز قیمت جدیدی منتشر نکرده">
              آخرین قیمت بازار
            </span>
          )}
        </div>
      )}
    </article>
  );
}

/**
 * Live USD and EUR open-market rates in rial. Server-rendered first, then
 * refreshed every 30 seconds (paused while the tab is hidden). Compact cards;
 * a changed price flashes green (up) or red (down).
 */
export function CurrencyRates({ initialRates }: CurrencyRatesProps) {
  const [rates, setRates] = useState<MarketRates | null>(initialRates);
  const [status, setStatus] = useState<Status>(initialRates ? "live" : "error");
  const [flashes, setFlashes] = useState<Record<string, Flash>>({});
  const [nextAt, setNextAt] = useState(() => Date.now() + MARKET_RATES_POLL_MS);
  const [now, setNow] = useState(() => Date.now());

  const ratesRef = useRef(rates);
  ratesRef.current = rates;
  const loadingRef = useRef(false);

  const refresh = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setStatus("loading");
    try {
      const response = await fetch("/api/panel/rates", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const next = (await response.json()) as MarketRates;

      const previous = ratesRef.current;
      const changed: Record<string, Flash> = {};
      for (const { key } of CURRENCIES) {
        const before = previous?.[key]?.priceRial;
        const after = next[key]?.priceRial;
        if (before !== undefined && after !== undefined && before !== after) changed[key] = after > before ? "up" : "down";
      }
      setFlashes(changed);
      setRates(next);
      setStatus("live");
    } catch {
      setStatus("error");
    } finally {
      loadingRef.current = false;
      setNextAt(Date.now() + MARKET_RATES_POLL_MS);
    }
  }, []);

  // One-second tick drives the countdown and fires the refresh when due.
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const current = Date.now();
      setNow(current);
      if (current >= nextAt) void refresh();
    }, 1000);
    return () => window.clearInterval(timer);
  }, [nextAt, refresh]);

  // Coming back to the tab after a while: refresh straight away.
  useEffect(() => {
    function onVisible() {
      if (!document.hidden && Date.now() >= nextAt) void refresh();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [nextAt, refresh]);

  const secondsLeft = Math.max(0, Math.ceil((nextAt - now) / 1000));
  const progress = status === "loading" ? 1 : 1 - secondsLeft / (MARKET_RATES_POLL_MS / 1000);

  return (
    <section aria-labelledby="currency-rates-title" className="space-y-3">
      <div className="admin-animate-in flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 id="currency-rates-title" className="flex items-center gap-2 text-sm font-black text-panel-text">
            قیمت لحظه‌ای ارز
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-extrabold",
                status === "error"
                  ? "border-red-500/35 bg-red-500/10 text-panel-danger"
                  : "border-emerald-500/35 bg-emerald-500/10 text-panel-success"
              )}
            >
              <span className="relative flex h-2 w-2">
                {status !== "error" && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />}
                <span className={cn("relative inline-flex h-2 w-2 rounded-full", status === "error" ? "bg-red-500" : "bg-emerald-500")} />
              </span>
              {status === "error" ? "قطع" : "زنده"}
            </span>
          </h2>
          <p className="mt-0.5 text-[10px] text-panel-muted" aria-live="polite">
            {status === "loading"
              ? "در حال دریافت قیمت‌ها…"
              : status === "error"
                ? rates
                  ? "دریافت قیمت ناموفق بود؛ آخرین قیمت دریافت‌شده نمایش داده می‌شود."
                  : "دریافت قیمت ناموفق بود؛ دوباره تلاش می‌کنیم."
                : `به‌روزرسانی بعدی تا ${toPersianDigits(secondsLeft)} ثانیه دیگر`}
          </p>
        </div>
        <CountdownRing progress={progress} spinning={status === "loading"} onClick={() => void refresh()} disabled={status === "loading"} />
      </div>

      {status === "error" && !rates && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-semibold text-panel-danger-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          اتصال به منبع قیمت برقرار نشد.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-3xl">
        {CURRENCIES.map((meta, index) => (
          <RateCard key={meta.key} meta={meta} rate={rates?.[meta.key] ?? null} flash={flashes[meta.key] ?? null} delay={80 + index * 80} />
        ))}
      </div>

      <p className="text-[10px] text-panel-faint">منبع: بازار آزاد (TGJU) · قیمت‌ها به ریال</p>
    </section>
  );
}
