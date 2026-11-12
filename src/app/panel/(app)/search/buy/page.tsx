import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, ShoppingBag } from "lucide-react";

import { requireUser } from "@/lib/auth/user-auth";
import {
  buyAdFiltersToQuery,
  getBuyAdSearchOptions,
  hasActiveBuyAdFilters,
  parseBuyAdFilters,
  searchBuyAds,
} from "@/lib/buy-ads";
import { LiveClock } from "@/components/panel/search/LiveClock";
import { SearchPagination } from "@/components/panel/search/SearchPagination";
import { BuyAdFilters } from "@/components/panel/buy-ads/BuyAdFilters";
import { BuyAdCard } from "@/components/panel/buy-ads/BuyAdCard";

export const metadata: Metadata = {
  title: "آگهی‌های خرید | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

const PATHNAME = "/panel/search/buy";

type SearchParams = Record<string, string | string[] | undefined>;

/** Every active buy ad in the system, with text search, filters, sorting and pagination. */
export default async function BuyAdsSearchPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireUser();

  const filters = parseBuyAdFilters(searchParams);
  const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const requestedPage = Math.max(1, Number.parseInt(pageRaw ?? "", 10) || 1);

  const [result, options] = await Promise.all([searchBuyAds(filters, requestedPage), getBuyAdSearchOptions()]);

  const hasFilters = hasActiveBuyAdFilters(filters);
  const baseQuery = buyAdFiltersToQuery(filters);
  const filtersKey = JSON.stringify(filters);

  return (
    <div className="space-y-5">
      <div className="admin-animate-in flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-panel-text sm:text-2xl">آگهی‌های خرید</h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-panel-muted sm:text-sm">
            <ShoppingBag className="h-3.5 w-3.5 text-panel-accent" />
            درخواست‌های خرید همکاران؛ اگر خودروی مورد نظر را دارید، با کد خریدار پیگیری کنید
          </p>
        </div>
        <LiveClock className="self-start" />
      </div>

      <div className="admin-animate-in" style={{ animationDelay: "60ms" }}>
        <BuyAdFilters key={filtersKey} filters={filters} options={options} total={result.total} />
      </div>

      {result.ads.length === 0 ? (
        <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-16 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
              {hasFilters ? <SearchX className="h-7 w-7" /> : <ShoppingBag className="h-7 w-7" />}
            </span>
            <p className="mt-5 text-base font-extrabold text-panel-text">
              {hasFilters ? "آگهی خریدی مطابق فیلترهای شما پیدا نشد" : "هنوز آگهی خریدی ثبت نشده است"}
            </p>
            <p className="mt-2 text-xs leading-6 text-panel-muted-2">
              {hasFilters ? "عبارت جستجو را تغییر دهید یا برخی فیلترها را بردارید." : "به‌محض ثبت اولین درخواست خرید توسط همکاران، اینجا نمایش داده می‌شود."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {hasFilters && (
                <Link
                  href={PATHNAME}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-panel-line/[0.1] bg-panel-line/[0.03] px-5 text-sm font-bold text-panel-text-2 transition-colors hover:border-[#FF6A00]/40 hover:text-panel-text"
                >
                  حذف همه فیلترها
                </Link>
              )}
              {user.isPartner && (
                <Link
                  href="/panel/ads/buy/new"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] shadow-orange-subtle transition-all hover:brightness-110"
                >
                  ثبت آگهی خرید
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div key={`${filtersKey}:${result.page}`} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {result.ads.map((ad, index) => (
              <BuyAdCard key={ad.id} ad={ad} delay={Math.min(index, 8) * 45} showOfferCount={user.isPartner} />
            ))}
          </div>
          <SearchPagination page={result.page} pageCount={result.pageCount} baseQuery={baseQuery} pathname={PATHNAME} />
        </>
      )}
    </div>
  );
}
