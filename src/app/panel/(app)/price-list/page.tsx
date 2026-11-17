import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CarFront, ListOrdered, PencilLine, Sparkles, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/user-auth";
import { getPriceListMarketStats, listPriceListRows } from "@/lib/price-list";
import { PRICE_MARKET_LABELS, PRICE_MARKET_TITLES, PRICE_MARKETS, parsePriceMarket, withPriceMarket } from "@/lib/price-market";
import { PriceMarketTabs } from "@/components/panel/price-list/PriceMarketTabs";
import { getConversionRates } from "@/lib/market-rates";
import { getEnabledPriceFields } from "@/lib/system-settings";
import { priceFieldsFor } from "@/lib/price-table-shared";
import { formatPersianNumber, joinFa, toPersianDigits } from "@/lib/utils";
import { LiveClock } from "@/components/panel/search/LiveClock";
import { PriceListBrowser } from "@/components/panel/price-list/PriceListBrowser";

export const metadata: Metadata = {
  title: "لیست قیمت | خودرو یاب",
};

export const dynamic = "force-dynamic";

function StatTile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    // Phones: icon above the number so the label gets the full tile width.
    <div className="flex min-w-0 flex-col items-start gap-1.5 rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 px-2.5 py-2.5 backdrop-blur sm:flex-row sm:items-center sm:gap-3 sm:px-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FF6A00]/10 text-panel-accent sm:h-9 sm:w-9">
        <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-lg font-black leading-6 text-panel-text">{toPersianDigits(value)}</span>
        <span className="block text-[10px] font-bold leading-4 text-panel-muted">{label}</span>
      </span>
    </div>
  );
}

/**
 * Market-wide price list: every car the admin allowed in price tables with the
 * lowest price of each enabled type any seller has entered, with that seller's code.
 */
interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PanelPriceListPage(props: PageProps) {
  const searchParams = await props.searchParams;
  // Two separate lists with the same cars and features: free zone (default) and national plate.
  const market = parsePriceMarket(searchParams.market);
  const user = await getCurrentUser();
  const isPartner = user?.isPartner ?? false;

  const priceFields = await getEnabledPriceFields();
  // "خام، ترخیصی و فوری" — whichever price types are in use.
  const fieldNames = joinFa(priceFieldsFor(priceFields).map((field) => field.label.replace("قیمت ", "")));
  // Same cached open-market quote as the dashboard and ads; never a fresh request per view.
  const [rows, marketStats, rates] = await Promise.all([
    listPriceListRows(isPartner, priceFields, market),
    getPriceListMarketStats(priceFields),
    getConversionRates(),
  ]);
  const sellerCount = marketStats[market].sellers;
  const rialPerUsd = rates?.usd?.priceRial ?? null;
  // "1405/08/20 14:30:12" → "۱۴۰۵/۰۸/۲۰ ۱۴:۳۰"
  const rateUpdatedAt = rates?.usd?.updatedAtJalali ? toPersianDigits(rates.usd.updatedAtJalali.slice(0, 16)) : null;
  const pricedCount = rows.filter((row) => row.sellerCount > 0).length;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="panel-card-in relative overflow-hidden rounded-[32px] border border-panel-line/[0.1] bg-panel-surface">
        <div className="panel-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-24 end-[-60px] h-64 w-64 rounded-full bg-[#FF6A00]/20 blur-3xl" aria-hidden="true" />

        <div className="relative space-y-5 px-5 py-6 sm:px-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-xl font-black text-panel-text sm:text-2xl">
                <ListOrdered className="h-6 w-6 text-panel-accent" />
                لیست قیمت
                <span className="rounded-lg bg-[#FF6A00]/10 px-2 py-0.5 text-sm font-extrabold text-panel-accent">{PRICE_MARKET_LABELS[market]}</span>
              </h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs leading-6 text-panel-muted sm:text-sm">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-panel-accent" />
                کمترین قیمت {fieldNames} {PRICE_MARKET_TITLES[market]} به تفکیک سال ساخت و رنگ، از بین جدول قیمت همه فروشندگان
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              {/* Sellers (verified collaborators) edit their own price list */}
              {isPartner && (
                <Link
                  href={withPriceMarket("/panel/price-table", market)}
                  className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] shadow-orange-subtle transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 active:scale-[0.98]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -start-1/2 w-1/3 skew-x-[-20deg] bg-white/30 opacity-0 transition-all duration-700 group-hover:start-[120%] group-hover:opacity-100"
                  />
                  <PencilLine className="h-[18px] w-[18px]" />
                  لیست قیمت من
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                </Link>
              )}
              <LiveClock className="self-start sm:self-end" />
            </div>
          </div>

          <PriceMarketTabs
            active={market}
            hrefs={{
              free_zone: withPriceMarket("/panel/price-list", "free_zone"),
              national: withPriceMarket("/panel/price-list", "national"),
            }}
            label="لیست قیمت منطقه آزاد یا پلاک ملی"
            className="sm:max-w-xl"
            badges={Object.fromEntries(
              PRICE_MARKETS.map((item) => [
                item,
                { caption: `${toPersianDigits(marketStats[item].cars)} خودرو · ${toPersianDigits(marketStats[item].sellers)} فروشنده` },
              ])
            )}
          />

          <div className="grid grid-cols-3 gap-2 sm:max-w-xl sm:gap-3">
            <StatTile icon={CarFront} label="خودرو در لیست" value={rows.length} />
            <StatTile icon={ListOrdered} label="دارای قیمت" value={pricedCount} />
            <StatTile icon={UsersRound} label="فروشنده فعال" value={sellerCount} />
          </div>
        </div>
      </section>

      {rows.length === 0 ? (
        <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
              <ListOrdered className="h-7 w-7" />
            </span>
            <p className="mt-5 text-base font-extrabold text-panel-text">هنوز خودرویی برای لیست قیمت تعریف نشده است</p>
            <p className="mt-2 text-xs text-panel-muted-2">پس از تعیین خودروها توسط مدیر، لیست قیمت اینجا نمایش داده می‌شود.</p>
          </div>
        </div>
      ) : (
        <>
          <PriceListBrowser key={market} rows={rows} showPartner={isPartner} rialPerUsd={rialPerUsd} priceFields={priceFields} market={market} />
          <p className="text-[11px] leading-6 text-panel-faint">
            قیمت‌ها به دلار یا ریال (به انتخاب فروشنده) هستند. هر ستون یک سال ساخت، رنگ و واحد قیمت است و کمترین قیمت {fieldNames} آن را از بین جدول قیمت فروشندگان،
            همراه با کد فروشنده‌ای که آن قیمت را ثبت کرده، نشان می‌دهد؛ «—» یعنی برای آن سال و رنگ قیمتی ثبت نشده است. برای دیدن قیمت همه فروشندگان روی هر ردیف بزنید.
            {rialPerUsd && (
              <>
                {" "}
                معادل‌های کوچک زیر هر قیمت (≈) تقریبی و بر اساس نرخ لحظه‌ای دلار آزاد ({formatPersianNumber(rialPerUsd)} ریال
                {rateUpdatedAt && <> · {rateUpdatedAt}</>}) محاسبه شده‌اند.
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
}
