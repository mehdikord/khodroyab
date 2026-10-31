import React from "react";
import Link from "next/link";
import { Activity, ArrowRight, Building2, CalendarDays, ChevronLeft, Clock3, EyeOff, HandCoins, ListChecks, Pencil, UserRound, XCircle } from "lucide-react";

import { AdStatusBadge } from "@/components/admin/ads/AdStatusBadge";
import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import { AdGallery } from "@/components/panel/ads/AdGallery";
import { AdPriceHistory } from "@/components/panel/ads/AdPriceHistory";
import { SafeImage } from "@/components/panel/SafeImage";
import { CopyCodeButton } from "@/components/panel/search/CopyCodeButton";
import type { AdDetailRecord } from "@/lib/panel-search-shared";
import { formatPersianNumber, toPersianDigits } from "@/lib/utils";

const cardClass = "rounded-3xl border border-panel-line/[0.08] bg-panel-surface p-4 shadow-card-depth sm:p-5";

function SectionTitle({ icon: Icon, children }: { icon: typeof HandCoins; children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-2.5 text-sm font-extrabold text-panel-text">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-panel-accent">
        <Icon className="h-4 w-4" />
      </span>
      {children}
    </h2>
  );
}

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-panel-line/[0.06] bg-panel-line/[0.02] px-3 py-2.5">
      <dt className="text-[10px] font-bold text-panel-faint">{label}</dt>
      <dd className="mt-0.5 text-sm font-extrabold text-panel-text">{children}</dd>
    </div>
  );
}

/** Everything about one ad: photos, specs, features, sale terms, price history and seller. */
export function AdDetailView({ ad }: { ad: AdDetailRecord }) {
  const title = `${ad.brandName} ${ad.carName}`;

  return (
    <div className="space-y-5">
      <Link
        href={ad.isOwner ? "/panel/ads" : "/panel/search"}
        className="admin-animate-in inline-flex items-center gap-1.5 text-xs font-bold text-panel-muted hover:text-panel-text"
      >
        <ArrowRight className="h-3.5 w-3.5" />
        {ad.isOwner ? "آگهی‌های من" : "بازگشت به جستجو"}
      </Link>

      {/* Owner-only moderation notes */}
      {ad.isOwner && ad.status === "pending" && (
        <p className="flex items-start gap-2 rounded-2xl border border-amber-500/25 bg-amber-500/[0.07] px-4 py-3 text-xs leading-6 text-panel-warning">
          <Clock3 className="mt-1 h-3.5 w-3.5 shrink-0" />
          این آگهی در انتظار بررسی مدیر است و پس از تایید برای دیگران نمایش داده می‌شود.
        </p>
      )}
      {ad.isOwner && ad.status === "rejected" && (
        <p className="flex items-start gap-2 rounded-2xl border border-red-500/25 bg-red-500/[0.07] px-4 py-3 text-xs leading-6 text-panel-danger">
          <XCircle className="mt-1 h-3.5 w-3.5 shrink-0" />
          این آگهی توسط مدیر رد شده است. می‌توانید آن را ویرایش کنید تا دوباره بررسی شود.
        </p>
      )}
      {ad.isOwner && !ad.isActive && (
        <p className="flex items-start gap-2 rounded-2xl border border-panel-line/[0.1] bg-panel-line/[0.04] px-4 py-3 text-xs leading-6 text-panel-muted">
          <EyeOff className="mt-1 h-3.5 w-3.5 shrink-0" />
          این آگهی توسط مدیر غیرفعال شده و برای دیگران نمایش داده نمی‌شود.
        </p>
      )}

      {/* Phones stack gallery → summary → details; desktop keeps the summary in a side column. */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:grid-rows-[auto_1fr]">
        <div className="min-w-0 space-y-2 lg:col-start-1 lg:row-start-1">
          <AdGallery urls={ad.galleryUrls} alt={title} />
          {ad.galleryIsCatalogue && ad.galleryUrls.length > 0 && (
            <p className="text-[11px] text-panel-faint">تصویر نمایشی خودرو؛ فروشنده تصویری برای این آگهی ثبت نکرده است.</p>
          )}
        </div>

        {/* Summary, prices and seller */}
        <div className="min-w-0 space-y-5 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <section className={cardClass}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CopyCodeButton code={ad.code} />
              {ad.isOwner && <AdStatusBadge status={ad.status} size="sm" />}
            </div>
            <h1 className="mt-3 break-words text-xl font-black leading-8 text-panel-text">{title}</h1>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-panel-faint">
              <CalendarDays className="h-3 w-3" />
              {ad.createdAtLabel}
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-2">
              <Spec label="مدل">{toPersianDigits(ad.carModel)}</Spec>
              <Spec label="سال ساخت">{ad.carYear ? toPersianDigits(ad.carYear) : "—"}</Spec>
              <Spec label="رنگ">
                {ad.colorName && ad.colorCode ? (
                  <span className="inline-flex items-center gap-1.5">
                    <ColorSwatch code={ad.colorCode} className="h-3.5 w-3.5" />
                    {ad.colorName}
                  </span>
                ) : (
                  "—"
                )}
              </Spec>
              <Spec label="نوع خودرو">{ad.carTypeName}</Spec>
              <Spec label="تعداد">{toPersianDigits(ad.qautity)} دستگاه</Spec>
            </dl>

            {ad.description && <p className="mt-4 whitespace-pre-line break-words text-xs leading-7 text-panel-text-2">{ad.description}</p>}

            {ad.isOwner && (
              <Link
                href={`/panel/ads/${ad.id}/edit`}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-panel-line/[0.12] bg-panel-line/[0.03] text-sm font-bold text-panel-text-2 transition-colors hover:border-[#FF6A00]/40 hover:text-panel-text"
              >
                <Pencil className="h-4 w-4" />
                ویرایش آگهی
              </Link>
            )}
          </section>

          <section className={cardClass}>
            <SectionTitle icon={HandCoins}>شرایط فروش و قیمت</SectionTitle>
            {ad.saleTerms.length === 0 ? (
              <p className="text-xs text-panel-faint">شرایط فروشی ثبت نشده است.</p>
            ) : (
              <ul className="space-y-2">
                {ad.saleTerms.map((term) => (
                  <li key={term.id} className="rounded-2xl border border-panel-line/[0.06] bg-panel-line/[0.02] px-3 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-panel-text-2">{term.title}</span>
                      <span className="text-sm font-black tabular-nums text-panel-text">
                        {formatPersianNumber(term.currentPrice)} <span className="text-[10px] font-semibold text-panel-muted-2">تومان</span>
                      </span>
                    </div>
                    {(term.sale || term.perecentage) && (
                      <p className="mt-1.5 text-[11px] text-panel-success">
                        تخفیف:{" "}
                        {term.sale && `${formatPersianNumber(term.sale)} تومان`}
                        {term.sale && term.perecentage && " · "}
                        {term.perecentage && `${toPersianDigits(term.perecentage)}٪`}
                      </p>
                    )}
                    {term.description && <p className="mt-1.5 whitespace-pre-line break-words text-[11px] leading-6 text-panel-muted">{term.description}</p>}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <Link
            href={`/panel/sellers/${ad.userId}`}
            aria-label={`مشاهده پروفایل فروشنده ${ad.userName}`}
            className={`${cardClass} group flex items-center gap-3 transition-colors hover:border-[#FF6A00]/35`}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#FF6A00]/30 bg-[#FF6A00]/[0.1] text-base font-black text-panel-accent">
              {ad.userImage ? (
                <SafeImage src={ad.userImage} fallback={ad.userName.slice(0, 1)} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                ad.userName.slice(0, 1)
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1 text-[10px] text-panel-faint">
                {ad.userIsCompany ? <Building2 className="h-3 w-3" /> : <UserRound className="h-3 w-3" />}
                {ad.userIsCompany ? "مجموعه فروشنده" : "فروشنده"}
              </span>
              <span className="block truncate text-sm font-extrabold text-panel-text">{ad.userName}</span>
            </span>
            <ChevronLeft className="h-4 w-4 shrink-0 text-panel-faint-2 transition-all group-hover:-translate-x-0.5 group-hover:text-panel-accent" />
          </Link>
        </div>

        <div className="min-w-0 space-y-5 lg:col-start-1 lg:row-start-2">
          {ad.options.length > 0 && (
            <section className={cardClass}>
              <SectionTitle icon={ListChecks}>ویژگی‌های خودرو</SectionTitle>
              <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {ad.options.map((option) => (
                  <Spec key={option.optionId} label={option.name}>
                    <span className="break-words">{toPersianDigits(option.value)}</span>
                  </Spec>
                ))}
              </dl>
            </section>
          )}

          {ad.saleTerms.length > 0 && (
            <section className={cardClass}>
              <SectionTitle icon={Activity}>تاریخچه قیمت</SectionTitle>
              <AdPriceHistory terms={ad.saleTerms} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
