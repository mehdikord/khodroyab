import React from "react";
import Link from "next/link";
import { Building2, CalendarDays, Car, ChevronLeft, HandCoins, UserRound } from "lucide-react";

import type { SearchAdRecord } from "@/lib/panel-search-shared";
import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import { cn, toPersianDigits } from "@/lib/utils";
import { CopyCodeButton } from "@/components/panel/search/CopyCodeButton";
import { SafeImage } from "@/components/panel/SafeImage";
import { PriceDeltaBadge } from "@/components/panel/search/PriceDeltaBadge";

interface AdCardProps {
  ad: SearchAdRecord;
  /** Entrance animation delay in ms. */
  delay?: number;
  /** Hide the seller row (used on the seller's own profile page). */
  hideSeller?: boolean;
}

const MAX_TERMS = 3;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 1);
  return parts[0].slice(0, 1) + parts[1].slice(0, 1);
}

function NoImage() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-orange-flare opacity-60" aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-2 text-panel-faint">
        <Car className="h-10 w-10" strokeWidth={1.5} />
        <span className="text-[11px] font-semibold">بدون تصویر</span>
      </div>
    </div>
  );
}

/**
 * Public-safe ad card for the customer search: car identity, seller name,
 * cover photo, sale-term titles with their price-change badges and the
 * (copyable) ad code. The whole card opens the ad's page. Never shows the
 * seller's phone.
 */
export function AdCard({ ad, delay = 0, hideSeller = false }: AdCardProps) {
  const visibleTerms = ad.saleTerms.slice(0, MAX_TERMS);
  const hiddenTerms = ad.saleTerms.length - visibleTerms.length;

  return (
    <article
      className="panel-card-in group relative flex flex-col overflow-hidden rounded-3xl border border-panel-line/[0.08] bg-panel-surface shadow-card-depth transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF6A00]/35 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8),0_0_30px_-8px_rgba(255,106,0,0.35)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link href={`/panel/ads/${ad.id}`} aria-label={`مشاهده آگهی ${ad.brandName} ${ad.carName}`} className="absolute inset-0 z-[1] rounded-3xl" />

      {/* Media */}
      <div className="relative aspect-[16/10] overflow-hidden bg-panel-media">
        {ad.imageUrl ? (
          <SafeImage
            src={ad.imageUrl}
            alt={`${ad.brandName} ${ad.carName}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            fallback={<NoImage />}
          />
        ) : (
          <NoImage />
        )}

        {/* Bottom fade so overlays stay legible on bright photos */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-panel-surface via-panel-surface/60 to-transparent"
        />

        {/* Ad code – the most important piece of information */}
        <div className="absolute start-3 top-3 z-[2]">
          <CopyCodeButton code={ad.code} />
        </div>

        {/* Brand chip */}
        <div className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-xl border border-panel-line/[0.12] bg-panel-bg/80 py-1 pe-2.5 ps-1 backdrop-blur-md">
          <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-lg bg-panel-line/[0.06] text-[10px] font-bold text-panel-text-2">
            {ad.brandImage ? (
              <SafeImage
                src={ad.brandImage}
                fallback={ad.brandName.slice(0, 1)}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              ad.brandName.slice(0, 1)
            )}
          </span>
          <span className="text-[11px] font-bold text-panel-text">{ad.brandName}</span>
        </div>

        {/* Car type */}
        <span className="absolute bottom-3 end-3 rounded-lg border border-panel-line/[0.1] bg-panel-bg/70 px-2 py-0.5 text-[10px] font-semibold text-panel-text-2 backdrop-blur-sm">
          {ad.carTypeName}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="truncate text-base font-black text-panel-text">
            {ad.brandName} {ad.carName}
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-panel-muted">
            <span>
              مدل <span className="font-semibold text-panel-text-2">{ad.carModel}</span>
            </span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-panel-faint-2" />
            <span>
              سال ساخت <span className="font-semibold text-panel-text-2">{toPersianDigits(ad.carYear)}</span>
            </span>
            {ad.colorName && ad.colorCode && (
              <>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-panel-faint-2" />
                <span className="inline-flex items-center gap-1 font-semibold text-panel-text-2">
                  <ColorSwatch code={ad.colorCode} className="h-3 w-3" />
                  {ad.colorName}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Seller → public profile */}
        {!hideSeller && (
          <Link
            href={`/panel/sellers/${ad.userId}`}
            className="group/seller relative z-[2] -mx-1 flex items-center gap-3 rounded-2xl px-1 py-1 transition-colors hover:bg-panel-line/[0.04]"
            aria-label={`مشاهده پروفایل فروشنده ${ad.userName}`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#FF6A00]/30 bg-[#FF6A00]/[0.1] text-sm font-black text-panel-accent shadow-[0_8px_20px_-10px_rgba(255,106,0,0.7)] transition-transform group-hover/seller:scale-105">
              {ad.userImage ? (
                <SafeImage
                  src={ad.userImage}
                  fallback={initials(ad.userName)}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                initials(ad.userName)
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-[10px] text-panel-faint">
                {ad.userIsCompany ? <Building2 className="h-3 w-3" /> : <UserRound className="h-3 w-3" />}
                {ad.userIsCompany ? "مجموعه فروشنده" : "فروشنده"}
              </p>
              <p className="truncate text-sm font-extrabold text-panel-text transition-colors group-hover/seller:text-panel-accent-soft">
                {ad.userName}
              </p>
            </div>
            <ChevronLeft className="h-4 w-4 shrink-0 text-panel-faint-2 transition-all group-hover/seller:-translate-x-0.5 group-hover/seller:text-panel-accent" />
          </Link>
        )}

        {/* Sale terms */}
        <div className="mt-auto">
          <p className="mb-1.5 flex items-center gap-1 text-[10px] text-panel-faint">
            <HandCoins className="h-3 w-3" />
            شرایط فروش
          </p>
          {visibleTerms.length === 0 ? (
            <p className="text-[11px] text-panel-faint">شرایطی ثبت نشده است</p>
          ) : (
            <ul className="flex flex-wrap gap-1.5">
              {visibleTerms.map((term) => (
                <li key={term.id} className="inline-flex items-center gap-1">
                  <PriceDeltaBadge term={term} />
                </li>
              ))}
              {hiddenTerms > 0 && (
                <li className="rounded-lg border border-panel-line/[0.1] bg-panel-line/[0.04] px-2 py-1 text-[11px] font-bold text-panel-muted">
                  +{toPersianDigits(hiddenTerms)}
                </li>
              )}
            </ul>
          )}
        </div>

        <div className={cn("flex items-center justify-between border-t border-panel-line/[0.06] pt-3 text-[10px] text-panel-faint")}>
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {ad.createdAtLabel}
          </span>
          <span className="font-mono tracking-wider">#{toPersianDigits(ad.code)}</span>
        </div>
      </div>
    </article>
  );
}
