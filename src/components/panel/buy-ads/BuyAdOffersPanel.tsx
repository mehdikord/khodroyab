"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Crown,
  Gavel,
  Loader2,
  Lock,
  LockOpen,
  Pencil,
  RefreshCw,
  Send,
  Sparkles,
  Trophy,
  Undo2,
  Users,
  WifiOff,
  X,
} from "lucide-react";

import {
  setBuyAdBiddingAction,
  submitBuyAdOfferAction,
  withdrawBuyAdOfferAction,
  type BuyAdOffersResult,
} from "@/app/panel/(app)/ads/buy/actions";
import { CopyCodeButton } from "@/components/panel/search/CopyCodeButton";
import { BUY_AD_OFFER_MAX_DIGITS, BUY_AD_OFFER_POLL_MS, type BuyAdOffer, type BuyAdOffersState } from "@/lib/buy-ads-shared";
import { CURRENCY_LABELS } from "@/lib/currency";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

const POLL_SECONDS = Math.round(BUY_AD_OFFER_POLL_MS / 1000);
/** How long a moved / changed row stays highlighted. */
const HIGHLIGHT_MS = 4500;

type Movement = { kind: "up" | "down" | "new" | "changed"; by: number };

/* ───────────────────────── helpers ───────────────────────── */

function toAsciiDigits(value: string): string {
  return value.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0)).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

/** Keep digits only, without leading zeros, capped at the accepted length. */
function cleanDigits(value: string): string {
  return toAsciiDigits(value).replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, BUY_AD_OFFER_MAX_DIGITS);
}

/** "1250000" → "1,250,000" (ASCII, for the LTR input). */
function groupDigits(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Compare two digit strings numerically (prices may exceed 2^53 in theory). */
function compareDigits(a: string, b: string): number {
  const x = BigInt(a || "0");
  const y = BigInt(b || "0");
  return x < y ? -1 : x > y ? 1 : 0;
}

function diffDigits(a: string, b: string): string {
  return (BigInt(a) - BigInt(b)).toString();
}

/* ───────────────────────── small pieces ───────────────────────── */

/** Countdown ring around the refresh button; the arc empties until the next poll. */
function RefreshRing({ secondsLeft, busy, paused, onRefresh }: { secondsLeft: number; busy: boolean; paused: boolean; onRefresh: () => void }) {
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const progress = paused ? 0 : secondsLeft / POLL_SECONDS;
  return (
    <button
      type="button"
      onClick={onRefresh}
      disabled={busy}
      title="به‌روزرسانی فوری"
      aria-label={busy ? "در حال به‌روزرسانی" : `به‌روزرسانی خودکار تا ${toPersianDigits(secondsLeft)} ثانیه دیگر؛ برای به‌روزرسانی فوری بزنید`}
      className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-panel-muted transition-colors hover:text-panel-accent disabled:cursor-wait"
    >
      <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="18" cy="18" r={radius} fill="none" strokeWidth="2.5" className="stroke-panel-line/[0.1]" />
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          stroke="#FF6A00"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin text-panel-accent" />
      ) : (
        <>
          <span className="font-mono text-[11px] font-black tabular-nums group-hover:hidden">{toPersianDigits(secondsLeft)}</span>
          <RefreshCw className="hidden h-4 w-4 group-hover:block" />
        </>
      )}
    </button>
  );
}

/** The headline of the auction: the lowest offer, large, with who sent it. */
function BestOfferHero({
  best,
  highest,
  count,
  currencyName,
  reduceMotion,
}: {
  best: BuyAdOffer;
  highest: BuyAdOffer;
  count: number;
  currencyName: string;
  reduceMotion: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#FF6A00]/40 bg-gradient-to-l from-[#FF6A00]/[0.16] via-[#FF6A00]/[0.06] to-panel-bg/60 p-4 sm:p-5">
      <div aria-hidden="true" className="pointer-events-none absolute -start-10 -top-12 h-36 w-36 rounded-full bg-[#FF6A00]/20 blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-xs font-extrabold text-panel-accent">
            <Trophy className="h-4 w-4" />
            کمترین پیشنهاد فعلی
            {best.isMine && <span className="rounded-md bg-[#FF6A00] px-1.5 py-px text-[10px] font-black text-[#07090C]">شما</span>}
          </p>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={best.price}
              initial={reduceMotion ? false : { y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { y: -14, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-1 break-all text-3xl font-black leading-tight tabular-nums text-panel-text sm:text-4xl"
            >
              {formatPersianNumber(best.price)}
              <span className="ms-2 text-sm font-extrabold text-panel-muted">{currencyName}</span>
            </motion.p>
          </AnimatePresence>
          {best.bidderCode && (
            <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-panel-muted">
              کد کاربر:
              <CopyCodeButton code={best.bidderCode} label="کد کاربر" className="px-2 py-0.5 text-xs tracking-[0.12em] shadow-none" />
            </div>
          )}
        </div>
        <dl className="grid shrink-0 grid-cols-2 gap-2 sm:w-56">
          <div className="rounded-xl border border-panel-line/[0.08] bg-panel-surface/70 px-3 py-2">
            <dt className="text-[10px] font-bold text-panel-faint">تعداد پیشنهاد</dt>
            <dd className="mt-0.5 text-base font-black tabular-nums text-panel-text">{toPersianDigits(count)}</dd>
          </div>
          <div className="min-w-0 rounded-xl border border-panel-line/[0.08] bg-panel-surface/70 px-3 py-2">
            <dt className="text-[10px] font-bold text-panel-faint">بیشترین</dt>
            <dd className="mt-0.5 truncate text-base font-black tabular-nums text-panel-text-2">{formatPersianNumber(highest.price)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFB347] via-[#FF8A2A] to-[#FF6A00] text-[#07090C] shadow-[0_0_24px_-4px_rgba(255,106,0,0.7)]">
        <Crown className="h-5 w-5" strokeWidth={2.4} />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border font-mono text-base font-black tabular-nums",
        rank <= 3 ? "border-[#FF6A00]/30 bg-[#FF6A00]/[0.08] text-panel-accent" : "border-panel-line/[0.08] bg-panel-line/[0.03] text-panel-muted"
      )}
    >
      {toPersianDigits(rank)}
    </span>
  );
}

function MovementBadge({ movement }: { movement: Movement }) {
  const config = {
    up: { icon: ArrowUp, text: `${toPersianDigits(movement.by)} پله بالا`, className: "border-emerald-500/35 bg-emerald-500/[0.12] text-panel-success" },
    down: { icon: ArrowDown, text: `${toPersianDigits(movement.by)} پله پایین`, className: "border-red-500/30 bg-red-500/[0.1] text-panel-danger-2" },
    new: { icon: Sparkles, text: "جدید", className: "border-[#FF6A00]/35 bg-[#FF6A00]/[0.12] text-panel-accent" },
    changed: { icon: RefreshCw, text: "تغییر قیمت", className: "border-sky-500/30 bg-sky-500/[0.1] text-sky-500" },
  }[movement.kind];
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      className={cn("inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-extrabold", config.className)}
    >
      <config.icon className="h-2.5 w-2.5" />
      {config.text}
    </motion.span>
  );
}

/** Decorative rows behind the lock for viewers who may not see the offers. */
function LockedPreview() {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <ol aria-hidden="true" className="pointer-events-none select-none space-y-2 blur-[6px]">
        {[1, 2, 3].map((rank) => (
          <li key={rank} className="flex items-center gap-3 rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 p-3">
            <RankMedal rank={rank} />
            <span className="h-5 w-32 rounded-lg bg-panel-line/[0.12]" />
            <span className="ms-auto h-7 w-24 rounded-xl bg-[#FF6A00]/20" />
          </li>
        ))}
      </ol>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-panel-surface/40 px-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF6A00]/30 bg-panel-surface text-panel-accent shadow-orange-subtle">
          <Lock className="h-5 w-5" />
        </span>
        <p className="mt-3 text-sm font-extrabold text-panel-text">پیشنهادهای قیمت مخصوص همکاران است</p>
        <p className="mt-1 max-w-sm text-[11px] leading-5 text-panel-muted">
          فقط همکاران احراز‌هویت‌شده می‌توانند پیشنهادهای قیمت را ببینند و پیشنهاد ثبت کنند.
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────── panel ───────────────────────── */

interface BuyAdOffersPanelProps {
  initialState: BuyAdOffersState;
}

/**
 * Live price offers of a buy ad (auction style). Collaborators send one offer
 * each and may edit or withdraw it; the list is sorted from the lowest price
 * and refreshes itself every 20 seconds, animating rows to their new places.
 * The owner only watches, copies bidder codes and opens/closes bidding.
 */
export function BuyAdOffersPanel({ initialState }: BuyAdOffersPanelProps) {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [movements, setMovements] = useState<Record<string, Movement>>({});
  const [secondsLeft, setSecondsLeft] = useState(POLL_SECONDS);
  const [fetching, setFetching] = useState(false);
  const [offline, setOffline] = useState(false);
  const [paused, setPaused] = useState(false);

  const [editing, setEditing] = useState(initialState.myOffer === null);
  const [draft, setDraft] = useState(initialState.myOffer?.price ?? "");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<"withdraw" | "bidding" | null>(null);
  const [isPending, startTransition] = useTransition();

  const stateRef = useRef(state);
  const highlightTimers = useRef<number[]>([]);
  const currencyName = CURRENCY_LABELS[state.currency];

  /** Replace the panel state and highlight the rows whose place or price changed. */
  const applyState = useCallback((next: BuyAdOffersState) => {
    const previous = stateRef.current;
    const previousRanks = new Map(previous.offers.map((offer, index) => [offer.id, { rank: index + 1, price: offer.price }]));
    const changes: Record<string, Movement> = {};
    next.offers.forEach((offer, index) => {
      const before = previousRanks.get(offer.id);
      const rank = index + 1;
      if (!before) {
        changes[offer.id] = { kind: "new", by: 0 };
      } else if (before.rank !== rank) {
        changes[offer.id] = { kind: before.rank > rank ? "up" : "down", by: Math.abs(before.rank - rank) };
      } else if (before.price !== offer.price) {
        changes[offer.id] = { kind: "changed", by: 0 };
      }
    });

    stateRef.current = next;
    setState(next);
    if (Object.keys(changes).length > 0) {
      setMovements((current) => ({ ...current, ...changes }));
      const timer = window.setTimeout(() => {
        setMovements((current) => {
          const rest = { ...current };
          for (const id of Object.keys(changes)) delete rest[id];
          return rest;
        });
      }, HIGHLIGHT_MS);
      highlightTimers.current.push(timer);
    }
  }, []);

  useEffect(() => () => highlightTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const refresh = useCallback(async () => {
    setFetching(true);
    try {
      const response = await fetch(`/api/panel/buy-ads/${stateRef.current.adId}/offers`, { cache: "no-store" });
      if (!response.ok) throw new Error(String(response.status));
      applyState((await response.json()) as BuyAdOffersState);
      setOffline(false);
    } catch {
      setOffline(true);
    } finally {
      setFetching(false);
      setSecondsLeft(POLL_SECONDS);
    }
  }, [applyState]);

  // Poll every 20 s while the page is visible; catch up as soon as it is shown again.
  useEffect(() => {
    if (!state.canView) return;
    const onVisibility = () => {
      const hidden = document.visibilityState === "hidden";
      setPaused(hidden);
      if (!hidden) void refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [state.canView, refresh]);

  useEffect(() => {
    if (!state.canView || paused || fetching) return;
    const timer = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [state.canView, paused, fetching]);

  useEffect(() => {
    if (secondsLeft === 0 && !fetching) void refresh();
  }, [secondsLeft, fetching, refresh]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!confirm) return;
    const timer = window.setTimeout(() => setConfirm(null), 5000);
    return () => window.clearTimeout(timer);
  }, [confirm]);

  function handleResult(result: BuyAdOffersResult, success: string, afterSuccess?: (next: BuyAdOffersState) => void) {
    if (result.ok) {
      applyState(result.state);
      setError(null);
      setNotice(success);
      afterSuccess?.(result.state);
    } else {
      if (result.state) applyState(result.state);
      setError(result.message);
    }
    setSecondsLeft(POLL_SECONDS);
  }

  function submitOffer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!draft) {
      setError("مبلغ پیشنهادی را وارد کنید");
      return;
    }
    if (state.myOffer && state.myOffer.price === draft) {
      setEditing(false);
      return;
    }
    const isUpdate = state.myOffer !== null;
    startTransition(async () => {
      const result = await submitBuyAdOfferAction(state.adId, draft);
      handleResult(result, isUpdate ? "پیشنهاد شما به‌روزرسانی شد" : "پیشنهاد شما ثبت شد", (next) => {
        setEditing(false);
        setDraft(next.myOffer?.price ?? draft);
      });
    });
  }

  function withdraw() {
    if (confirm !== "withdraw") {
      setConfirm("withdraw");
      return;
    }
    setConfirm(null);
    startTransition(async () => {
      const result = await withdrawBuyAdOfferAction(state.adId);
      handleResult(result, "پیشنهاد شما حذف شد", () => {
        setDraft("");
        setEditing(true);
      });
    });
  }

  function toggleBidding() {
    if (confirm !== "bidding") {
      setConfirm("bidding");
      return;
    }
    setConfirm(null);
    const open = !state.biddingOpen;
    startTransition(async () => {
      const result = await setBuyAdBiddingAction(state.adId, open);
      // Also refresh the server-rendered status badge in the ad summary.
      handleResult(result, open ? "قیمت‌دهی دوباره باز شد" : "قیمت‌دهی بسته شد؛ پیشنهادها ذخیره ماندند", () => router.refresh());
    });
  }

  const offers = state.offers;
  const best = offers[0] ?? null;
  const highest = offers.length > 0 ? offers[offers.length - 1] : null;

  /** Where the draft would land: equal prices queue behind the earlier ones. */
  const predictedRank = useMemo(() => {
    if (!draft) return null;
    const others = offers.filter((offer) => !offer.isMine);
    return others.filter((offer) => compareDigits(offer.price, draft) <= 0).length + 1;
  }, [draft, offers]);

  const isPartnerBidder = state.canView && !state.isOwner;
  const springLayout = reduceMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 380, damping: 34, mass: 0.9 };

  return (
    <section
      aria-labelledby="offers-title"
      className="relative overflow-hidden rounded-3xl border-2 border-[#FF6A00]/35 bg-panel-surface shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6),0_0_56px_-12px_rgba(255,106,0,0.4)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#FF6A00]/[0.09] to-transparent" />
      <div aria-hidden="true" className="admin-grid-bg pointer-events-none absolute inset-x-0 top-0 h-40 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <div className="relative space-y-4 p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6A00] to-[#FF8A2A] text-[#07090C] shadow-orange-glow">
              <Gavel className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h2 id="offers-title" className="text-lg font-black text-panel-text sm:text-xl">
                پیشنهادهای قیمت
              </h2>
              <p className="mt-0.5 text-[11px] font-semibold text-panel-muted">کمترین مبلغ پیشنهادی در صدر فهرست قرار می‌گیرد</p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full border border-panel-line/[0.12] bg-panel-bg/70 px-2 py-0.5 text-[10px] font-extrabold text-panel-text-2">
                  واحد: {currencyName}
                </span>
                {state.biddingOpen ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/[0.1] px-2 py-0.5 text-[10px] font-extrabold text-panel-success">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70 motion-reduce:animate-none" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    قیمت‌دهی باز
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/[0.1] px-2 py-0.5 text-[10px] font-extrabold text-panel-danger-2">
                    <Lock className="h-2.5 w-2.5" />
                    قیمت‌دهی بسته
                  </span>
                )}
              </div>
            </div>
          </div>

          {state.canView && (
            <div className="flex shrink-0 items-center gap-1.5">
              {offline && (
                <span title="ارتباط برقرار نشد؛ دوباره تلاش می‌شود" className="text-panel-warning">
                  <WifiOff className="h-4 w-4" />
                </span>
              )}
              <RefreshRing secondsLeft={secondsLeft} busy={fetching} paused={paused} onRefresh={() => void refresh()} />
            </div>
          )}
        </div>

        {!state.canView ? (
          <LockedPreview />
        ) : (
          <>
            {/* Headline: the lowest offer */}
            {best && highest && (
              <BestOfferHero best={best} highest={highest} count={offers.length} currencyName={currencyName} reduceMotion={Boolean(reduceMotion)} />
            )}

            {/* Owner controls */}
            {state.isOwner && (
              <div className="flex flex-col gap-3 rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 p-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] leading-5 text-panel-muted">
                  شما ثبت‌کننده این آگهی هستید و فقط پیشنهادها را می‌بینید. با زدن روی کد هر کاربر، آن را کپی کنید.
                </p>
                <button
                  type="button"
                  onClick={toggleBidding}
                  disabled={isPending}
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-xs font-extrabold transition-all active:scale-[0.98] disabled:opacity-60",
                    confirm === "bidding"
                      ? state.biddingOpen
                        ? "bg-red-500 text-white shadow-[0_0_22px_-4px_rgba(239,68,68,0.65)]"
                        : "bg-emerald-500 text-white shadow-[0_0_22px_-4px_rgba(16,185,129,0.65)]"
                      : state.biddingOpen
                        ? "border border-red-500/35 bg-red-500/[0.08] text-panel-danger-2 hover:bg-red-500/[0.15]"
                        : "border border-emerald-500/35 bg-emerald-500/[0.08] text-panel-success hover:bg-emerald-500/[0.15]"
                  )}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : state.biddingOpen ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <LockOpen className="h-4 w-4" />
                  )}
                  {confirm === "bidding"
                    ? state.biddingOpen
                      ? "مطمئنید؟ بستن قیمت‌دهی"
                      : "مطمئنید؟ بازگشایی"
                    : state.biddingOpen
                      ? "بستن قیمت‌دهی"
                      : "بازگشایی قیمت‌دهی"}
                </button>
              </div>
            )}

            {/* Bidder composer */}
            {isPartnerBidder && state.canBid && (
              <div className="rounded-2xl border border-[#FF6A00]/25 bg-panel-bg/70 p-3 sm:p-4">
                {state.myOffer && !editing ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-panel-muted">پیشنهاد شما</p>
                      <p className="mt-0.5 text-xl font-black tabular-nums text-panel-text">
                        {formatPersianNumber(state.myOffer.price)} <span className="text-xs font-bold text-panel-muted-2">{currencyName}</span>
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-panel-accent">
                        {state.myOffer.rank === 1 ? <Trophy className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
                        {state.myOffer.rank === 1
                          ? "کمترین پیشنهاد متعلق به شماست"
                          : `رتبه ${toPersianDigits(state.myOffer.rank)} از ${toPersianDigits(offers.length)}`}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:flex">
                      <button
                        type="button"
                        onClick={() => {
                          setDraft(state.myOffer?.price ?? "");
                          setEditing(true);
                          setError(null);
                        }}
                        disabled={isPending}
                        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-4 text-xs font-extrabold text-[#07090C] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                      >
                        <Pencil className="h-4 w-4" />
                        ویرایش پیشنهاد
                      </button>
                      <button
                        type="button"
                        onClick={withdraw}
                        disabled={isPending}
                        className={cn(
                          "inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border px-4 text-xs font-extrabold transition-all disabled:opacity-60",
                          confirm === "withdraw"
                            ? "border-red-500 bg-red-500 text-white"
                            : "border-panel-line/[0.12] text-panel-muted hover:border-red-500/40 hover:bg-red-500/10 hover:text-panel-danger-2"
                        )}
                      >
                        <Undo2 className="h-4 w-4" />
                        {confirm === "withdraw" ? "مطمئنید؟ انصراف" : "انصراف از پیشنهاد"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={submitOffer} noValidate className="space-y-2.5">
                    <label htmlFor="offer-price" className="flex items-center justify-between gap-2 text-xs font-extrabold text-panel-text">
                      {state.myOffer ? "ویرایش پیشنهاد شما" : "پیشنهاد قیمت شما"}
                      {best && (
                        <span className="text-[10px] font-bold text-panel-muted">
                          کمترین پیشنهاد فعلی: <span className="tabular-nums text-panel-accent">{formatPersianNumber(best.price)}</span>
                        </span>
                      )}
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <div className="relative flex-1">
                        <input
                          id="offer-price"
                          type="text"
                          inputMode="numeric"
                          dir="ltr"
                          autoComplete="off"
                          value={groupDigits(draft)}
                          onChange={(event) => setDraft(cleanDigits(event.target.value))}
                          disabled={isPending}
                          placeholder="0"
                          aria-describedby="offer-price-hint"
                          className="h-14 w-full rounded-2xl border border-panel-line/[0.12] bg-panel-surface pe-4 ps-16 text-start font-mono text-xl font-black tabular-nums text-panel-text outline-none transition-all placeholder:text-panel-faint hover:border-panel-line/20 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15 disabled:opacity-60"
                        />
                        <span className="pointer-events-none absolute inset-y-0 start-0 flex w-14 items-center justify-center border-e border-panel-line/[0.08] text-xs font-extrabold text-panel-muted">
                          {currencyName}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {state.myOffer && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(false);
                              setDraft(state.myOffer?.price ?? "");
                              setError(null);
                            }}
                            disabled={isPending}
                            aria-label="لغو ویرایش"
                            className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-panel-line/[0.12] text-panel-muted transition-colors hover:text-panel-text"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          type="submit"
                          disabled={isPending || !draft}
                          className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                        >
                          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-4 w-4 -scale-x-100" />}
                          {state.myOffer ? "ذخیره پیشنهاد" : "ثبت پیشنهاد"}
                        </button>
                      </div>
                    </div>
                    <p id="offer-price-hint" className="min-h-[1.25rem] text-[11px] font-semibold text-panel-muted">
                      {draft ? (
                        <>
                          <span className="tabular-nums text-panel-text-2">
                            {formatPersianNumber(draft)} {currencyName}
                          </span>
                          {predictedRank !== null && (
                            <span className={cn("ms-2", predictedRank === 1 ? "text-panel-success" : "text-panel-muted")}>
                              ·{" "}
                              {predictedRank === 1
                                ? "با این مبلغ در صدر لیست قرار می‌گیرید"
                                : `با این مبلغ در رتبه ${toPersianDigits(predictedRank)} قرار می‌گیرید`}
                            </span>
                          )}
                        </>
                      ) : (
                        "هر همکار یک پیشنهاد دارد و می‌تواند آن را تا بسته‌شدن قیمت‌دهی ویرایش کند."
                      )}
                    </p>
                  </form>
                )}
              </div>
            )}

            {isPartnerBidder && !state.canBid && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/25 bg-red-500/[0.06] px-4 py-3">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-panel-danger-2" />
                <p className="text-[11px] leading-5 text-panel-text-2">
                  قیمت‌دهی این آگهی بسته شده است. آخرین پیشنهادها به همین صورت ذخیره مانده‌اند.
                  {state.myOffer && (
                    <>
                      {" "}
                      پیشنهاد شما: <span className="font-black tabular-nums text-panel-text">{formatPersianNumber(state.myOffer.price)}</span>{" "}
                      {currencyName} (رتبه {toPersianDigits(state.myOffer.rank)}).
                    </>
                  )}
                </p>
              </div>
            )}

            {(error || notice) && (
              <p
                role={error ? "alert" : "status"}
                className={cn(
                  "admin-animate-fade flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold",
                  error ? "bg-red-500/10 text-panel-danger" : "bg-emerald-500/10 text-panel-success"
                )}
              >
                {error ? <AlertCircle className="h-3.5 w-3.5 shrink-0" /> : <Sparkles className="h-3.5 w-3.5 shrink-0" />}
                {error ?? notice}
              </p>
            )}

            {/* Ranked list */}
            {offers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-panel-line/[0.12] px-4 py-10 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-bg text-panel-faint">
                  <Gavel className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-extrabold text-panel-text">هنوز پیشنهادی ثبت نشده است</p>
                <p className="mt-1 text-[11px] text-panel-muted">
                  {state.isOwner ? "پیشنهادهای همکاران به‌محض ثبت، اینجا نمایش داده می‌شوند." : state.canBid ? "اولین پیشنهاد را شما ثبت کنید." : ""}
                </p>
              </div>
            ) : (
              <LayoutGroup>
                <div className="flex items-center gap-2 pt-1">
                  <h3 className="text-xs font-extrabold text-panel-text-2">رتبه‌بندی پیشنهادها</h3>
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-panel-line/[0.12]" />
                  <span className="text-[10px] font-bold text-panel-faint">از کمترین به بیشترین</span>
                </div>
                <motion.ol layout className="space-y-2" aria-label="پیشنهادهای قیمت، از کمترین به بیشترین">
                  <AnimatePresence initial={false}>
                    {offers.map((offer, index) => (
                      <OfferRow
                        key={offer.id}
                        offer={offer}
                        rank={index + 1}
                        best={best}
                        currencyName={currencyName}
                        movement={movements[offer.id]}
                        layoutTransition={springLayout}
                        reduceMotion={Boolean(reduceMotion)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.ol>
              </LayoutGroup>
            )}

            <p className="text-center text-[10px] text-panel-faint">
              {paused
                ? "به‌روزرسانی خودکار تا بازگشت به این صفحه متوقف است"
                : `فهرست هر ${toPersianDigits(POLL_SECONDS)} ثانیه به‌صورت خودکار به‌روز می‌شود · کمترین مبلغ در صدر`}
            </p>
          </>
        )}
      </div>
    </section>
  );
}

interface OfferRowProps {
  offer: BuyAdOffer;
  rank: number;
  best: BuyAdOffer | null;
  currencyName: string;
  movement?: Movement;
  layoutTransition: object;
  reduceMotion: boolean;
}

function OfferRow({ offer, rank, best, currencyName, movement, layoutTransition, reduceMotion }: OfferRowProps) {
  const isBest = rank === 1;
  const gap = best && !isBest ? diffDigits(offer.price, best.price) : null;
  const flash = movement && movement.kind !== "down";

  return (
    <motion.li
      layout="position"
      initial={reduceMotion ? false : { opacity: 0, x: -24, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.95, transition: { duration: 0.25 } }}
      transition={{ layout: layoutTransition, default: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
      className={cn(
        "relative flex items-center gap-3 overflow-hidden rounded-2xl border p-2.5 sm:p-3",
        isBest
          ? "border-[#FF6A00]/45 bg-gradient-to-l from-[#FF6A00]/[0.14] via-[#FF6A00]/[0.05] to-transparent"
          : offer.isMine
            ? "border-[#FF6A00]/30 bg-[#FF6A00]/[0.04]"
            : "border-panel-line/[0.07] bg-panel-bg/50"
      )}
    >
      {/* Highlight sweep for rows that just moved up, appeared or changed price */}
      {flash && !reduceMotion && (
        <motion.span
          aria-hidden="true"
          key={`${movement.kind}-${offer.price}`}
          initial={{ x: "120%", opacity: 0.9 }}
          animate={{ x: "-120%", opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-l from-transparent via-[#FF8A2A]/25 to-transparent"
        />
      )}

      <RankMedal rank={rank} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-1.5">
          <span className={cn("font-black tabular-nums", isBest ? "text-lg text-panel-accent sm:text-xl" : "text-base text-panel-text sm:text-lg")}>
            {formatPersianNumber(offer.price)}
          </span>
          <span className="text-[10px] font-bold text-panel-muted-2">{currencyName}</span>
          {offer.isMine && (
            <span className="rounded-md border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-1.5 py-px text-[9px] font-black text-panel-accent">شما</span>
          )}
          <AnimatePresence>{movement && <MovementBadge movement={movement} />}</AnimatePresence>
        </div>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[10px] text-panel-faint">
          {isBest ? (
            <span className="inline-flex items-center gap-0.5 font-bold text-panel-accent">
              <Trophy className="h-3 w-3" />
              کمترین پیشنهاد
            </span>
          ) : (
            gap && (
              <span className="tabular-nums">
                +{formatPersianNumber(gap)} نسبت به کمترین
              </span>
            )
          )}
          <span>
            {offer.updatedAtLabel}
            {offer.edited && " · ویرایش‌شده"}
          </span>
        </p>
      </div>

      {offer.bidderCode && (
        <div className="relative z-[2] shrink-0 text-end">
          <p className="mb-1 hidden text-[9px] font-bold text-panel-faint sm:block">کد کاربر</p>
          <CopyCodeButton code={offer.bidderCode} label="کد کاربر" className="px-2 py-1 text-xs tracking-[0.12em] shadow-none" />
        </div>
      )}
    </motion.li>
  );
}
