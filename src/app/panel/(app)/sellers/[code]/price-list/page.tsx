import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Car, History, ListOrdered, UsersRound } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/user-auth";
import { getPublicSellerByCode } from "@/lib/sellers";
import { listSellerPriceList } from "@/lib/price-list";
import { getConversionRates } from "@/lib/market-rates";
import { getEnabledPriceFields } from "@/lib/system-settings";
import { PRICE_MARKETS, PRICE_MARKET_LABELS, parsePriceMarket, withPriceMarket } from "@/lib/price-market";
import { formatPersianNumber, toPersianDigits } from "@/lib/utils";
import { SafeImage } from "@/components/panel/SafeImage";
import { SellerHeader } from "@/components/panel/sellers/SellerHeader";
import { PriceMarketTabs } from "@/components/panel/price-list/PriceMarketTabs";
import { BrandLogo, ColumnHeading, YearPrices, purchaseTierOptions } from "@/components/panel/price-list/price-list-ui";
import { PurchaseRequestButton } from "@/components/panel/purchase-requests/PurchaseRequestButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const seller = /^\d{8}$/.test(params.code) ? await getPublicSellerByCode(params.code) : null;
  return { title: seller ? `لیست قیمت ${seller.name} | خودرو یاب` : "لیست قیمت فروشنده | خودرو یاب" };
}

/**
 * One seller's price list (open to guests), as the two separate lists (free
 * zone / national plate tabs): every car they priced with their prices per
 * (year, colour), the small converted price, and a purchase-request button.
 */
export default async function SellerPriceListPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  if (!/^\d{8}$/.test(params.code)) notFound();
  const seller = await getPublicSellerByCode(params.code);
  if (!seller) notFound();
  const market = parsePriceMarket(searchParams.market);
  // Codes rotate: an old link moves to the seller's current code.
  if (seller.code !== params.code) redirect(withPriceMarket(`/panel/sellers/${seller.code}/price-list`, market));

  const user = await getCurrentUser();
  const showPartner = user?.isPartner ?? false;
  const isMine = user !== null && user.id === seller.userId.toString();
  const [priceFields, rates] = await Promise.all([getEnabledPriceFields(), getConversionRates()]);
  const { rows, countByMarket } = await listSellerPriceList(seller.userId, market, showPartner, priceFields);
  const rialPerUsd = rates?.usd?.priceRial ?? null;
  const viewer = { signedIn: Boolean(user), name: user?.name ?? null, phone: user?.phone ?? null };
  const base = `/panel/sellers/${seller.code}/price-list`;

  return (
    <div className="space-y-5">
      <Link
        href={`/panel/sellers/${seller.code}`}
        className="admin-animate-in inline-flex items-center gap-1.5 text-xs font-bold text-panel-muted transition-colors hover:text-panel-text"
      >
        <ArrowRight className="h-4 w-4" />
        پروفایل فروشنده
      </Link>

      <SellerHeader name={seller.name} code={seller.code} adCount={seller.adCount} priceListCount={seller.priceListCount} active="prices" />

      <PriceMarketTabs
        active={market}
        hrefs={{ free_zone: withPriceMarket(base, "free_zone"), national: withPriceMarket(base, "national") }}
        label="لیست قیمت منطقه آزاد یا پلاک ملی این فروشنده"
        className="admin-animate-in sm:max-w-xl"
        badges={Object.fromEntries(
          PRICE_MARKETS.map((item) => [item, { caption: `${toPersianDigits(countByMarket[item])} خودرو` }])
        )}
      />

      {rows.length === 0 ? (
        <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
              <ListOrdered className="h-7 w-7" />
            </span>
            <p className="mt-5 text-base font-extrabold text-panel-text">این فروشنده در {PRICE_MARKET_LABELS[market]} قیمتی ثبت نکرده است</p>
            <Link
              href={withPriceMarket("/panel/price-list", market)}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-5 text-sm font-bold text-panel-accent transition-colors hover:bg-[#FF6A00]/20"
            >
              لیست قیمت همه فروشندگان
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {rows.map((row, index) => {
            const carLabel = `${row.car.brandName} ${row.car.name} - مدل ${toPersianDigits(row.car.model)}`;
            return (
              <article
                key={row.car.id}
                className="panel-card-in min-w-0 overflow-hidden rounded-3xl border border-panel-line/[0.08] bg-panel-surface"
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              >
                {/* Car */}
                <div className="flex items-center gap-3 border-b border-panel-line/[0.07] p-3">
                  <div className="relative h-16 w-[5.5rem] shrink-0 overflow-hidden rounded-2xl bg-panel-media">
                    {row.car.image ? (
                      <SafeImage
                        src={row.car.image}
                        alt={carLabel}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        fallback={<Car className="m-auto mt-5 h-6 w-6 text-panel-faint" />}
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        <BrandLogo name={row.car.brandName} image={row.car.brandImage} className="h-10 w-10 rounded-xl p-1" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex min-w-0 items-center gap-1.5 text-[11px] font-bold text-panel-muted">
                      <BrandLogo name={row.car.brandName} image={row.car.brandImage} className="h-5 w-5 shrink-0 rounded-md p-0.5" />
                      <span className="truncate">{row.car.brandName}</span>
                    </p>
                    <h2 className="mt-0.5 truncate text-sm font-black text-panel-text sm:text-base">{row.car.name}</h2>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-panel-muted-2">
                      <span>مدل {toPersianDigits(row.car.model)}</span>
                      <span className="inline-flex items-center gap-1">
                        <History className="h-3 w-3" />
                        <span className="font-mono">{row.updatedAtLabel}</span>
                      </span>
                    </p>
                  </div>
                </div>

                {/* Prices per (year, colour) */}
                <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
                  {row.columns.map((column) => (
                    <div key={column.key} className="min-w-0 rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 px-2.5 py-2">
                      <p className="mb-1.5 border-b border-panel-line/[0.06] pb-1.5 text-[11px] font-bold text-panel-muted">
                        <ColumnHeading column={column} active />
                      </p>
                      <YearPrices
                        prices={row.byColumn[column.key]}
                        currency={column.currency}
                        showPartner={showPartner}
                        fields={priceFields}
                        rialPerUsd={rialPerUsd}
                      />
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 border-t border-panel-line/[0.07] px-3 py-2.5">
                  <Link
                    href={withPriceMarket(`/panel/price-list/${row.car.id}`, market)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-panel-line/[0.1] bg-panel-bg/60 px-3 text-[11px] font-bold text-panel-text-2 transition-colors hover:border-[#FF6A00]/40 hover:text-panel-text"
                  >
                    <UsersRound className="h-3.5 w-3.5 text-panel-accent" />
                    قیمت همه فروشندگان
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                  {!isMine && (
                    <PurchaseRequestButton
                      size="sm"
                      className="ms-auto"
                      viewer={viewer}
                      target={{
                        source: "price_list",
                        market,
                        carId: row.car.id,
                        carLabel,
                        sellerCode: seller.code,
                        imageUrl: row.car.image,
                        tiers: purchaseTierOptions(row.columns, row.byColumn, priceFields, showPartner),
                      }}
                    />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {rows.length > 0 && rialPerUsd && (
        <p className="text-[11px] leading-6 text-panel-faint">
          معادل‌های کوچک زیر هر قیمت (≈) تقریبی و بر اساس نرخ لحظه‌ای دلار آزاد ({formatPersianNumber(rialPerUsd)} ریال) محاسبه شده‌اند.
        </p>
      )}
    </div>
  );
}
