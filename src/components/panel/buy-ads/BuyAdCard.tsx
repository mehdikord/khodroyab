import React from "react";
import Link from "next/link";
import { CalendarDays, Gavel, Lock, Quote } from "lucide-react";

import type { BuyAdRecord } from "@/lib/buy-ads-shared";
import { cn, toPersianDigits } from "@/lib/utils";
import { CURRENCY_LABELS } from "@/lib/currency";
import { CopyCodeButton } from "@/components/panel/search/CopyCodeButton";
import { SafeImage } from "@/components/panel/SafeImage";
import { SellerCodeBadge } from "@/components/panel/SellerCodeBadge";
import { BuyAdNoImage, BuyRequestBadge, BuySpecTiles } from "@/components/panel/buy-ads/buy-ad-ui";

interface BuyAdCardProps {
  ad: BuyAdRecord;
  /** Entrance animation delay in ms. */
  delay?: number;
  /** Live preview inside the form: no link, no entrance animation. */
  preview?: boolean;
  /** Show the number of price offers (verified collaborators only). */
  showOfferCount?: boolean;
}

/**
 * Public-safe card of a buy ad: the requested car, its year, mileage and
 * colour, the buyer's notes and the buyer's public code. Never shows the
 * buyer's name, photo or contact details.
 */
export function BuyAdCard({ ad, delay = 0, preview = false, showOfferCount = false }: BuyAdCardProps) {
  const title = `${ad.brandName} ${ad.carName}`.trim();

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-panel-line/[0.08] bg-panel-surface shadow-card-depth",
        !preview &&
          "panel-card-in transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/35 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8),0_0_30px_-8px_rgba(16,185,129,0.3)]"
      )}
      style={preview ? undefined : { animationDelay: `${delay}ms` }}
    >
      {!preview && <Link href={`/panel/ads/buy/${ad.id}`} aria-label={`مشاهده آگهی خرید ${title}`} className="absolute inset-0 z-[1] rounded-3xl" />}

      {/* Media: the car's catalogue photo, framed as a "wanted" poster */}
      <div className="relative aspect-[16/9] overflow-hidden bg-panel-media">
        {ad.imageUrl ? (
          <SafeImage
            src={ad.imageUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            fallback={<BuyAdNoImage />}
          />
        ) : (
          <BuyAdNoImage />
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel-surface via-panel-surface/30 to-transparent" />

        <div className="absolute start-3 top-3 z-[2]">
          {ad.code ? (
            <CopyCodeButton code={ad.code} />
          ) : (
            <span className="inline-flex rounded-xl border border-dashed border-[#FF6A00]/40 bg-panel-bg/85 px-2.5 py-1.5 font-mono text-sm font-extrabold tracking-[0.18em] text-panel-accent/70">
              ••••••
            </span>
          )}
        </div>

        <span className="absolute end-3 top-3 rounded-xl border border-panel-line/[0.12] bg-panel-bg/80 px-2.5 py-1 text-[11px] font-bold text-panel-text backdrop-blur-md">
          {ad.brandName || "برند"}
        </span>

        <BuyRequestBadge active={ad.isActive} className="absolute bottom-3 start-3" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4 pt-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-black text-panel-text">{title || "خودروی مورد نظر"}</h3>
          <p className="mt-0.5 truncate text-xs text-panel-muted">
            {ad.carTypeName && <>{ad.carTypeName} · </>}
            مدل <span className="font-semibold text-panel-text-2">{ad.carModel ? toPersianDigits(ad.carModel) : "—"}</span>
          </p>
        </div>

        <BuySpecTiles year={ad.year} mileage={ad.mileage} colorName={ad.colorName} colorCode={ad.colorCode} />

        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
          <span className="rounded-md border border-panel-line/[0.1] px-1.5 py-0.5 text-panel-muted">قیمت به {CURRENCY_LABELS[ad.currency]}</span>
          {ad.biddingOpen ? (
            showOfferCount && (
              <span className="inline-flex items-center gap-1 rounded-md border border-[#FF6A00]/30 bg-[#FF6A00]/[0.08] px-1.5 py-0.5 text-panel-accent">
                <Gavel className="h-3 w-3" />
                {ad.offerCount > 0 ? `${toPersianDigits(ad.offerCount)} پیشنهاد قیمت` : "اولین پیشنهاد را بدهید"}
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md border border-red-500/25 bg-red-500/[0.08] px-1.5 py-0.5 text-panel-danger-2">
              <Lock className="h-3 w-3" />
              قیمت‌دهی بسته
            </span>
          )}
        </div>

        {ad.description && (
          <p className="relative line-clamp-2 break-words rounded-2xl border border-dashed border-panel-line/[0.1] px-3 py-2 ps-8 text-xs leading-6 text-panel-text-2">
            <Quote className="absolute start-2.5 top-2.5 h-3.5 w-3.5 -scale-x-100 text-panel-faint" />
            {ad.description}
          </p>
        )}

        <div className="mt-auto">
          {ad.buyerCode ? (
            <SellerCodeBadge code={ad.buyerCode} label="کد خریدار" />
          ) : (
            preview && (
              <p className="rounded-2xl border border-dashed border-[#FF6A00]/30 px-3 py-2.5 text-[11px] font-bold text-panel-muted">
                به جای نام شما، فقط <span className="text-panel-accent">کد کاربری</span> نمایش داده می‌شود.
              </p>
            )
          )}
        </div>

        <div className="flex items-center justify-between border-t border-panel-line/[0.06] pt-3 text-[10px] text-panel-faint">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {ad.createdAtLabel}
          </span>
          {ad.code && <span className="font-mono tracking-wider">#{toPersianDigits(ad.code)}</span>}
        </div>
      </div>
    </article>
  );
}
