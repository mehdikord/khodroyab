"use client";

import React from "react";
import { CalendarDays, Clock3, EyeOff, HandCoins, Hash, Layers, Pencil, XCircle } from "lucide-react";

import type { UserCarRecord } from "@/lib/user-cars";
import type { AdStatus } from "@/lib/ad-status";
import { AdStatusBadge } from "@/components/admin/ads/AdStatusBadge";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface MyAdCardProps {
  ad: UserCarRecord;
  onEdit: (ad: UserCarRecord) => void;
  disabled?: boolean;
  highlighted?: boolean;
  delay?: number;
}

/** Guidance shown under the ad; approved ads need none (the badge says it all). */
const STATUS_HINT: Partial<Record<AdStatus, { icon: typeof Clock3; text: string; className: string }>> = {
  pending: {
    icon: Clock3,
    text: "در انتظار بررسی مدیر؛ پس از تایید در جستجو نمایش داده می‌شود.",
    className: "border-amber-500/20 bg-amber-500/[0.06] text-panel-warning",
  },
  rejected: {
    icon: XCircle,
    text: "توسط مدیر رد شده است. می‌توانید آگهی را ویرایش کنید تا دوباره بررسی شود.",
    className: "border-red-500/20 bg-red-500/[0.06] text-panel-danger",
  },
};

/** One of the customer's own ads, with status, prices and an edit action. */
export function MyAdCard({ ad, onEdit, disabled, highlighted, delay = 0 }: MyAdCardProps) {
  const hint = STATUS_HINT[ad.status];

  return (
    <article
      className={cn(
        "panel-card-in flex flex-col gap-4 rounded-3xl border bg-panel-surface p-4 shadow-card-depth transition-colors sm:p-5",
        highlighted ? "border-[#FF6A00]/50 shadow-[0_0_30px_-8px_rgba(255,106,0,0.4)]" : "border-panel-line/[0.08]"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top row: status · code · date · edit */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <AdStatusBadge status={ad.status} size="sm" />
          {!ad.isActive && (
            <span className="inline-flex items-center gap-1 rounded-full border border-panel-line/[0.1] bg-panel-line/[0.04] px-2 py-0.5 text-[10px] font-bold text-panel-muted">
              <EyeOff className="h-3 w-3" />
              غیرفعال توسط مدیر
            </span>
          )}
          <span
            dir="ltr"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#FF6A00]/35 bg-[#FF6A00]/[0.08] px-2 py-1 font-mono text-xs font-extrabold tracking-[0.18em] text-panel-accent"
          >
            <Hash className="h-3 w-3" />
            {toPersianDigits(ad.code)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1 text-[10px] text-panel-faint sm:flex">
            <CalendarDays className="h-3 w-3" />
            {ad.createdAtLabel}
          </span>
          <button
            type="button"
            onClick={() => onEdit(ad)}
            disabled={disabled}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-panel-line/[0.1] bg-panel-line/[0.03] px-3 text-[11px] font-bold text-panel-text-2 transition-colors hover:border-[#FF6A00]/40 hover:text-panel-text disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            ویرایش
          </button>
        </div>
      </div>
      <span className="-mt-2 flex items-center gap-1 text-[10px] text-panel-faint sm:hidden">
        <CalendarDays className="h-3 w-3" />
        {ad.createdAtLabel}
      </span>

      {/* Car */}
      <div>
        <h3 className="text-base font-black text-panel-text">
          {ad.brandName} {ad.carName}
        </h3>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-panel-muted">
          <span>
            مدل <span className="font-semibold text-panel-text-2">{ad.carModel}</span>
          </span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-panel-faint-2" />
          <span>
            سال <span className="font-semibold text-panel-text-2">{toPersianDigits(ad.carYear)}</span>
          </span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-panel-faint-2" />
          <span className="inline-flex items-center gap-1">
            <Layers className="h-3 w-3" />
            {toPersianDigits(ad.qautity)} دستگاه
          </span>
        </p>
        {ad.description && <p className="mt-2 text-xs leading-6 text-panel-text-2">{ad.description}</p>}
      </div>

      {/* Sale terms (the owner may see their own prices) */}
      <div>
        <p className="mb-1.5 flex items-center gap-1 text-[10px] text-panel-faint">
          <HandCoins className="h-3 w-3" />
          شرایط فروش
        </p>
        {ad.saleTerms.length === 0 ? (
          <p className="text-[11px] text-panel-faint">شرایط فروشی ثبت نشده است</p>
        ) : (
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {ad.saleTerms.map((term) => (
              <li
                key={term.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-panel-line/[0.06] bg-panel-line/[0.02] px-3 py-2"
              >
                <span className="truncate text-[11px] font-bold text-panel-text-2">{term.saleTermTitle}</span>
                <span className="shrink-0 text-[11px] font-extrabold tabular-nums text-panel-text">
                  {formatPersianNumber(term.price)} <span className="text-[10px] font-semibold text-panel-muted-2">تومان</span>
                  {term.perecentage && (
                    <span className="ms-1.5 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] text-panel-success">
                      {toPersianDigits(term.perecentage)}٪
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Status hint (pending / rejected only) */}
      {hint && (
        <div className={cn("flex items-start gap-2 rounded-xl border px-3 py-2.5 text-[11px] leading-5", hint.className)}>
          <hint.icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{hint.text}</span>
        </div>
      )}

    </article>
  );
}
