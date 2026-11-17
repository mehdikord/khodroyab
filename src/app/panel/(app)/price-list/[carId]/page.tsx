import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Crown, UsersRound } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/user-auth";
import { getPriceListCarDetail } from "@/lib/price-list";
import { priceFieldsFor } from "@/lib/price-table-shared";
import { getEnabledPriceFields } from "@/lib/system-settings";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";
import { CURRENCY_LABELS, PRICE_CURRENCIES } from "@/lib/currency";
import { BrandLogo, PriceEquivalent, PriceTag } from "@/components/panel/price-list/price-list-ui";
import { getConversionRates } from "@/lib/market-rates";
import { CarOffersView } from "@/components/panel/price-list/CarOffersView";
import { CarMediaSlider } from "@/components/panel/price-list/CarMediaSlider";
import { CarSpecsDisclosure } from "@/components/panel/price-list/CarSpecsDisclosure";
import { PriceMarketTabs } from "@/components/panel/price-list/PriceMarketTabs";
import { PRICE_MARKETS, PRICE_MARKET_LABELS, parsePriceMarket, withPriceMarket } from "@/lib/price-market";
import type { CarMediaItem } from "@/lib/car-media-shared";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ carId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  // Only the car's name is used here, so collaborator prices are never needed.
  const detail = await getPriceListCarDetail(params.carId, false, null, { withSellerCodes: false });
  return {
    title: detail
      ? `لیست قیمت‌های ${detail.car.name} - ${detail.car.brandName} | خودرو یاب`
      : "لیست قیمت | خودرو یاب",
  };
}

/** Every seller's prices (enabled types only) for one price-list car (open to guests, public prices only). */
export default async function PriceListCarPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  // Same tab as the list the visitor came from (free zone by default).
  const market = parsePriceMarket(searchParams.market);
  const user = await getCurrentUser();
  const isPartner = user?.isPartner ?? false;
  // Same cached open-market quote as the dashboard and ads; never a fresh request per view.
  const [priceFields, rates] = await Promise.all([getEnabledPriceFields(), getConversionRates()]);
  const rialPerUsd = rates?.usd?.priceRial ?? null;

  const detail = await getPriceListCarDetail(params.carId, isPartner, user?.id ?? null, { enabled: priceFields, market });
  if (!detail) notFound();
  const { car, offers, lowest, lowestByColumn, columns } = detail;
  const fields = priceFieldsFor(priceFields);
  const years = Array.from(new Set(columns.map((column) => column.year))).sort((a, b) => Number(b) - Number(a));
  const sellerCount = offers.length;
  const currencies = PRICE_CURRENCIES.filter((currency) => lowest[currency]);
  // Videos first, then the photos.
  const media: CarMediaItem[] = [
    ...car.videos.map((url) => ({ type: "video" as const, url })),
    ...car.images.map((url) => ({ type: "image" as const, url })),
  ];

  return (
    <div className="space-y-5">
      <Link
        href={withPriceMarket("/panel/price-list", market)}
        className="admin-animate-in inline-flex items-center gap-1.5 text-xs font-bold text-panel-muted transition-colors hover:text-panel-text"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به لیست قیمت
      </Link>

      {/* Car hero: photo/video slider (start) · name, facts and best prices · collapsible description */}
      <section className="panel-card-in relative overflow-hidden rounded-[28px] border border-panel-line/[0.1] bg-panel-surface">
        <div className="panel-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-24 end-[-60px] h-56 w-56 rounded-full bg-[#FF6A00]/15 blur-3xl" aria-hidden="true" />

        <div className="relative grid gap-4 p-3 sm:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] sm:gap-5 sm:p-4 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
          <CarMediaSlider
            media={media}
            alt={`${car.brandName} ${car.name}`}
            className="aspect-[16/11] sm:aspect-auto sm:h-full sm:min-h-[13rem]"
            fallback={
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
                <BrandLogo name={car.brandName} image={car.brandImage} className="relative h-20 w-20 rounded-[22px] p-2.5" />
              </div>
            }
          />

          <div className="flex min-w-0 flex-col justify-center gap-3 px-1 pb-1 sm:py-1">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs font-bold text-panel-muted">
                <BrandLogo name={car.brandName} image={car.brandImage} className="h-6 w-6 rounded-lg p-0.5" />
                {car.brandName}
                <span className="text-panel-faint">·</span>
                <span className="font-semibold">لیست قیمت</span>
              </p>
              <h1 className="mt-1.5 break-words text-xl font-black leading-8 text-panel-text sm:text-2xl">{car.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="rounded-lg bg-panel-line/[0.06] px-2 py-1 font-semibold text-panel-text-2">مدل {toPersianDigits(car.model)}</span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-[#FF6A00]/10 px-2 py-1 font-bold text-panel-accent">
                  <UsersRound className="h-3.5 w-3.5" />
                  {toPersianDigits(sellerCount)} فروشنده
                </span>
                {years.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-panel-line/[0.06] px-2 py-1 font-semibold text-panel-text-2">
                    <CalendarDays className="h-3.5 w-3.5 text-panel-accent" />
                    {years.map((year) => toPersianDigits(year)).join("، ")}
                  </span>
                )}
              </div>
            </div>

            {/* Best prices: one compact strip per currency in use */}
            {currencies.length > 0 && (
              <div className="space-y-2">
                {currencies.map((currency) => {
                  const best = lowest[currency]!;
                  return (
                    <div
                      key={currency}
                      className={cn(
                        "grid gap-px overflow-hidden rounded-2xl border border-panel-line/[0.08] bg-panel-line/[0.08]",
                        fields.length === 1 ? "grid-cols-1" : fields.length === 2 ? "grid-cols-2" : "grid-cols-3"
                      )}
                    >
                      {fields.map((field) => (
                        <div key={field.key} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 bg-panel-bg/70 px-3 py-2.5 backdrop-blur">
                          <p className="flex items-center gap-1 text-[10px] font-bold text-panel-muted">
                            <Crown className="h-3 w-3 text-panel-success" />
                            کمترین {field.label.replace("قیمت ", "")}
                            {currencies.length > 1 && <span className="text-panel-faint">({CURRENCY_LABELS[currency]})</span>}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="flex flex-col items-end">
                              <PriceTag price={best[field.key]} currency={currency} best={Boolean(best[field.key])} />
                              <PriceEquivalent price={best[field.key]} currency={currency} rialPerUsd={rialPerUsd} className="mt-0.5" />
                            </span>
                            {isPartner && best[field.partnerKey] && (
                              <span className="inline-flex items-center gap-1">
                                <span className="text-[9px] font-bold text-sky-500/90">همکار</span>
                                <span className="flex flex-col items-end">
                                  <PriceTag price={best[field.partnerKey]} currency={currency} partner size="sm" />
                                  <PriceEquivalent price={best[field.partnerKey]} currency={currency} rialPerUsd={rialPerUsd} className="mt-0.5 text-sky-500/70" />
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {car.descriptionHtml && <CarSpecsDisclosure html={car.descriptionHtml} carName={car.name} />}
      </section>

      {/* Free zone / national plate: separate sellers and prices for the same car */}
      <PriceMarketTabs
        active={market}
        hrefs={{
          free_zone: withPriceMarket(`/panel/price-list/${car.id}`, "free_zone"),
          national: withPriceMarket(`/panel/price-list/${car.id}`, "national"),
        }}
        label={`قیمت‌های ${car.name} در منطقه آزاد یا پلاک ملی`}
        className="admin-animate-in sm:max-w-xl"
        badges={Object.fromEntries(
          PRICE_MARKETS.map((item) => [
            item,
            {
              caption: detail.sellerCountByMarket[item]
                ? `${toPersianDigits(detail.sellerCountByMarket[item])} فروشنده`
                : "هنوز قیمتی ثبت نشده",
            },
          ])
        )}
      />

      {offers.length === 0 ? (
        <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
              <UsersRound className="h-7 w-7" />
            </span>
            <p className="mt-5 text-base font-extrabold text-panel-text">هنوز فروشنده‌ای برای این خودرو در {PRICE_MARKET_LABELS[market]} قیمت ثبت نکرده است</p>
            {user?.collabrate && (
              <Link
                href={withPriceMarket("/panel/price-table", market)}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-5 text-sm font-bold text-panel-accent transition-colors hover:bg-[#FF6A00]/20"
              >
                ثبت قیمت در لیست قیمت من
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          <CarOffersView
            car={car}
            offers={offers}
            lowestByColumn={lowestByColumn}
            columns={columns}
            showPartner={isPartner}
            priceFields={priceFields}
            market={market}
            viewer={{ signedIn: Boolean(user), name: user?.name ?? null, phone: user?.phone ?? null }}
            carImage={car.images[0] ?? null}
            rialPerUsd={rialPerUsd}
          />
          <p className="text-[11px] leading-6 text-panel-faint">
            قیمت‌ها به دلار یا ریال (به انتخاب فروشنده) و توسط فروشندگان در جدول قیمتشان برای هر سال ساخت و رنگ جداگانه ثبت شده‌اند؛ هر ستون یک سال، رنگ و واحد قیمت است و
            «—» یعنی فروشنده برای آن سال و رنگ قیمتی ثبت نکرده است. کمترین قیمت هر ستون با نشان تاج سبز مشخص شده است. با انتخاب سال فقط قیمت‌های همان سال نمایش داده
            می‌شود، با دکمه ترتیب قیمت فروشندگان از ارزان‌ترین یا گران‌ترین مرتب می‌شوند و با زدن عنوان هر ستون، مرتب‌سازی بر اساس قیمت همان ستون انجام می‌شود. تاریخ زیر کد هر فروشنده، آخرین به‌روزرسانی قیمت‌های اوست.
            {rialPerUsd && (
              <>
                {" "}
                معادل‌های کوچک زیر هر قیمت (≈) تقریبی و بر اساس نرخ لحظه‌ای دلار آزاد ({formatPersianNumber(rialPerUsd)} ریال) محاسبه شده‌اند.
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
}
