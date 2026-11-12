import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, ChevronLeft, Coins, EyeOff, Gavel, Lock, Megaphone, MessageSquareQuote, RefreshCw } from "lucide-react";

import type { BuyAdDetailRecord, BuyAdOffersState } from "@/lib/buy-ads-shared";
import { CURRENCY_LABELS } from "@/lib/currency";
import type { SearchAdRecord } from "@/lib/panel-search-shared";
import { formatMileage, toPersianDigits } from "@/lib/utils";
import { AdGallery } from "@/components/panel/ads/AdGallery";
import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import { SafeImage } from "@/components/panel/SafeImage";
import { CopyCodeButton } from "@/components/panel/search/CopyCodeButton";
import { SellerCodeBadge } from "@/components/panel/SellerCodeBadge";
import { BuyAdNoImage, BuyRequestBadge, BuySpecTiles } from "@/components/panel/buy-ads/buy-ad-ui";
import { BuyAdOwnerActions } from "@/components/panel/buy-ads/BuyAdOwnerActions";
import { BuyAdOffersPanel } from "@/components/panel/buy-ads/BuyAdOffersPanel";

const cardClass = "rounded-3xl border border-panel-line/[0.08] bg-panel-surface p-4 shadow-card-depth sm:p-5";

function SectionTitle({ icon: Icon, children }: { icon: typeof Megaphone; children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-2.5 text-sm font-extrabold text-panel-text">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-panel-accent">
        <Icon className="h-4 w-4" />
      </span>
      {children}
    </h2>
  );
}

interface BuyAdDetailViewProps {
  ad: BuyAdDetailRecord;
  /** Public sale ads of the same car: offers that may satisfy this request. */
  matches: { ads: SearchAdRecord[]; total: number };
  /** Initial state of the live price-offers panel (it refreshes itself). */
  offers: BuyAdOffersState;
}

/** Everything about one buy ad: the requested car and specs, notes, the buyer's code, price offers and matching sale ads. */
export function BuyAdDetailView({ ad, matches, offers }: BuyAdDetailViewProps) {
  const title = `${ad.brandName} ${ad.carName}`;
  const searchAllHref = `/panel/search?${new URLSearchParams({ q: ad.carName, brand: ad.brandId }).toString()}`;

  return (
    <div className="space-y-5">
      <Link
        href={ad.isOwner ? "/panel/ads/buy" : "/panel/search/buy"}
        className="admin-animate-in inline-flex items-center gap-1.5 text-xs font-bold text-panel-muted hover:text-panel-text"
      >
        <ArrowRight className="h-3.5 w-3.5" />
        {ad.isOwner ? "آگهی‌های خرید من" : "بازگشت به آگهی‌های خرید"}
      </Link>

      {ad.isOwner && !ad.isActive && (
        <p className="flex items-start gap-2 rounded-2xl border border-panel-line/[0.1] bg-panel-line/[0.04] px-4 py-3 text-xs leading-6 text-panel-muted">
          <EyeOff className="mt-1 h-3.5 w-3.5 shrink-0" />
          این آگهی خرید متوقف شده و برای دیگران نمایش داده نمی‌شود. برای انتشار دوباره، آن را فعال کنید.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:grid-rows-[auto_1fr]">
        <div className="min-w-0 space-y-2 lg:col-start-1 lg:row-start-1">
          <AdGallery urls={ad.galleryUrls} alt={title} />
          {ad.galleryUrls.length > 0 && <p className="text-[11px] text-panel-faint">تصویر نمایشی خودروی درخواستی از کاتالوگ خودرو یاب.</p>}
        </div>

        {/* Summary and buyer */}
        <div className="min-w-0 space-y-5 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <section className={`${cardClass} relative overflow-hidden`}>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -end-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"
            />
            <div className="relative flex flex-wrap items-center justify-between gap-2">
              <CopyCodeButton code={ad.code} />
              <BuyRequestBadge active={ad.isActive} />
            </div>
            <p className="relative mt-4 text-[11px] font-extrabold tracking-wide text-panel-success">آگهی خرید · به دنبال خرید</p>
            <h1 className="relative mt-1 break-words text-xl font-black leading-8 text-panel-text sm:text-2xl">{title}</h1>
            <p className="relative mt-1 text-xs text-panel-muted">
              {ad.carTypeName} · مدل <span className="font-bold text-panel-text-2">{toPersianDigits(ad.carModel)}</span>
            </p>

            <BuySpecTiles year={ad.year} mileage={ad.mileage} colorName={ad.colorName} colorCode={ad.colorCode} size="lg" className="relative mt-4" />

            <div className="relative mt-3 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-panel-line/[0.1] bg-panel-bg/70 px-2.5 py-1 text-[11px] font-bold text-panel-text-2">
                <Coins className="h-3.5 w-3.5 text-panel-accent" />
                قیمت‌گذاری به {CURRENCY_LABELS[ad.currency]}
              </span>
              <span
                className={
                  ad.biddingOpen
                    ? "inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-2.5 py-1 text-[11px] font-bold text-panel-success"
                    : "inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/[0.08] px-2.5 py-1 text-[11px] font-bold text-panel-danger-2"
                }
              >
                {ad.biddingOpen ? <Gavel className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                {ad.biddingOpen ? "پذیرش پیشنهاد قیمت" : "قیمت‌دهی بسته"}
              </span>
            </div>

            <div className="relative mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-panel-faint">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                ثبت: {ad.createdAtLabel}
              </span>
              {ad.updatedAtLabel !== ad.createdAtLabel && (
                <span className="inline-flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  به‌روزرسانی: {ad.updatedAtLabel}
                </span>
              )}
            </div>

            {ad.canEdit && (
              <div className="relative mt-5 border-t border-panel-line/[0.06] pt-4">
                <BuyAdOwnerActions id={ad.id} isActive={ad.isActive} canEdit={ad.canEdit} variant="detail" afterDeleteHref="/panel/ads/buy" />
              </div>
            )}
          </section>

          <section className={cardClass}>
            <SellerCodeBadge code={ad.buyerCode} label="کد خریدار" size="lg" mine={ad.isOwner} />
            <p className="mt-2.5 text-[11px] leading-5 text-panel-faint">
              هویت خریدار محفوظ است و فقط کد کاربری او نمایش داده می‌شود. برای کپی، روی کد بزنید.
            </p>
          </section>
        </div>

        <div className="min-w-0 space-y-5 lg:col-start-1 lg:row-start-2">
          {/* The heart of a buy ad: live price offers */}
          <BuyAdOffersPanel initialState={offers} />

          <section className={cardClass}>
            <SectionTitle icon={MessageSquareQuote}>توضیحات خریدار</SectionTitle>
            {ad.description ? (
              <p className="whitespace-pre-line break-words text-sm leading-8 text-panel-text-2">{ad.description}</p>
            ) : (
              <p className="text-xs text-panel-faint">خریدار توضیحی ثبت نکرده است.</p>
            )}
          </section>

          {/* Secondary: a compact list of sale ads of the same car */}
          <section className="rounded-3xl border border-panel-line/[0.07] bg-panel-surface/60 p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-1.5 text-xs font-extrabold text-panel-text-2">
                <Megaphone className="h-3.5 w-3.5 text-panel-faint" />
                آگهی‌های فروش همین خودرو
              </h2>
              {matches.total > 0 && (
                <Link href={searchAllHref} className="inline-flex items-center gap-1 text-[11px] font-bold text-panel-muted hover:text-panel-accent">
                  مشاهده همه ({toPersianDigits(matches.total)})
                  <ArrowLeft className="h-3 w-3" />
                </Link>
              )}
            </div>
            {matches.ads.length === 0 ? (
              <p className="text-[11px] text-panel-faint">در حال حاضر آگهی فروش تایید‌شده‌ای برای این خودرو وجود ندارد.</p>
            ) : (
              <ul className="divide-y divide-panel-line/[0.06]">
                {matches.ads.map((match) => (
                  <li key={match.id}>
                    <Link href={`/panel/ads/${match.id}`} className="group flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                      <span className="h-11 w-14 shrink-0 overflow-hidden rounded-xl bg-panel-media">
                        {match.imageUrl ? (
                          <SafeImage src={match.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" fallback={<BuyAdNoImage compact />} />
                        ) : (
                          <BuyAdNoImage compact />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-extrabold text-panel-text group-hover:text-panel-accent">
                          {match.brandName} {match.carName}
                        </span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[10px] text-panel-muted">
                          <span>{toPersianDigits(match.carYear)}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatMileage(match.mileage)}</span>
                          {match.colorName && match.colorCode && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="inline-flex items-center gap-1">
                                <ColorSwatch code={match.colorCode} className="h-2.5 w-2.5" />
                                {match.colorName}
                              </span>
                            </>
                          )}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-[10px] tracking-wider text-panel-faint">#{toPersianDigits(match.code)}</span>
                      <ChevronLeft className="h-4 w-4 shrink-0 text-panel-faint transition-transform group-hover:-translate-x-0.5 group-hover:text-panel-accent" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
