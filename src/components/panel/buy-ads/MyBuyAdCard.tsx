import React from "react";
import Link from "next/link";
import { CalendarDays, Gavel, Hash, Lock } from "lucide-react";

import type { BuyAdRecord } from "@/lib/buy-ads-shared";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";
import { CURRENCY_LABELS } from "@/lib/currency";
import { SafeImage } from "@/components/panel/SafeImage";
import { BuyAdNoImage, BuyRequestBadge, BuySpecTiles } from "@/components/panel/buy-ads/buy-ad-ui";
import { BuyAdOwnerActions } from "@/components/panel/buy-ads/BuyAdOwnerActions";

interface MyBuyAdCardProps {
  ad: BuyAdRecord;
  canEdit: boolean;
  delay?: number;
}

/** One of the user's own buy ads; the card opens the ad's page. */
export function MyBuyAdCard({ ad, canEdit, delay = 0 }: MyBuyAdCardProps) {
  const title = `${ad.brandName} ${ad.carName}`;

  return (
    <article
      className={cn(
        "panel-card-in relative flex flex-col gap-4 rounded-3xl border bg-panel-surface p-4 shadow-card-depth transition-colors sm:p-5",
        ad.isActive ? "border-panel-line/[0.08] hover:border-emerald-500/35" : "border-dashed border-panel-line/[0.12]"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link href={`/panel/ads/buy/${ad.id}`} aria-label={`مشاهده آگهی خرید ${title}`} className="absolute inset-0 z-[1] rounded-3xl" />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <BuyRequestBadge active={ad.isActive} />
          <span
            dir="ltr"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#FF6A00]/35 bg-[#FF6A00]/[0.08] px-2 py-1 font-mono text-xs font-extrabold tracking-[0.18em] text-panel-accent"
          >
            <Hash className="h-3 w-3" />
            {toPersianDigits(ad.code)}
          </span>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-panel-faint">
          <CalendarDays className="h-3 w-3" />
          {ad.createdAtLabel}
        </span>
      </div>

      <div className={cn("flex gap-3 transition-opacity", !ad.isActive && "opacity-70")}>
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-panel-media">
          {ad.imageUrl ? (
            <SafeImage src={ad.imageUrl} alt={title} loading="lazy" className="h-full w-full object-cover" fallback={<BuyAdNoImage compact />} />
          ) : (
            <BuyAdNoImage compact />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-black text-panel-text">{title}</h3>
          <p className="mt-0.5 truncate text-xs text-panel-muted">
            {ad.carTypeName} · مدل <span className="font-semibold text-panel-text-2">{toPersianDigits(ad.carModel)}</span>
          </p>
          {ad.description && <p className="mt-2 line-clamp-2 break-words text-xs leading-6 text-panel-text-2">{ad.description}</p>}
        </div>
      </div>

      <BuySpecTiles year={ad.year} mileage={ad.mileage} colorName={ad.colorName} colorCode={ad.colorCode} className={cn(!ad.isActive && "opacity-70")} />

      {/* Offers summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#FF6A00]/20 bg-gradient-to-l from-[#FF6A00]/[0.08] to-transparent px-3 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-panel-text-2">
          <Gavel className="h-3.5 w-3.5 text-panel-accent" />
          {ad.offerCount > 0 ? `${toPersianDigits(ad.offerCount)} پیشنهاد قیمت` : "هنوز پیشنهادی نرسیده"}
          {!ad.biddingOpen && (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-red-500/10 px-1.5 py-0.5 text-[10px] text-panel-danger-2">
              <Lock className="h-2.5 w-2.5" />
              بسته
            </span>
          )}
        </span>
        {ad.bestOffer && (
          <span className="text-[11px] text-panel-muted">
            کمترین:{" "}
            <span className="font-black tabular-nums text-panel-accent">
              {formatPersianNumber(ad.bestOffer)} {CURRENCY_LABELS[ad.currency]}
            </span>
          </span>
        )}
      </div>

      {canEdit && (
        <div className="border-t border-panel-line/[0.06] pt-3">
          <BuyAdOwnerActions id={ad.id} isActive={ad.isActive} canEdit={canEdit} />
        </div>
      )}
    </article>
  );
}
