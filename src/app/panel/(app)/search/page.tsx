import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, Sparkles } from "lucide-react";

import { requireUser } from "@/lib/auth/user-auth";
import {
  getSearchOptions,
  isSearchSort,
  searchApprovedAds,
  type SearchFilterValues,
} from "@/lib/panel-search";
import { LiveClock } from "@/components/panel/search/LiveClock";
import { SearchFilters } from "@/components/panel/search/SearchFilters";
import { AdCard } from "@/components/panel/search/AdCard";
import { SearchPagination } from "@/components/panel/search/SearchPagination";

export const metadata: Metadata = {
  title: "جستجوی خودرو | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

const PATHNAME = "/panel/search";

type SearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function parseFilters(searchParams: SearchParams): SearchFilterValues {
  const sortRaw = single(searchParams.sort);
  return {
    q: single(searchParams.q).trim().slice(0, 100),
    brand: single(searchParams.brand).slice(0, 20),
    carType: single(searchParams.carType).slice(0, 20),
    saleTerm: single(searchParams.saleTerm).slice(0, 20),
    color: single(searchParams.color).slice(0, 20),
    yearFrom: single(searchParams.yearFrom).slice(0, 4),
    yearTo: single(searchParams.yearTo).slice(0, 4),
    sort: isSearchSort(sortRaw) ? sortRaw : "newest",
  };
}

/** Query string of the active filters, used to build pagination links. */
function filtersToQuery(filters: SearchFilterValues): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.carType) params.set("carType", filters.carType);
  if (filters.saleTerm) params.set("saleTerm", filters.saleTerm);
  if (filters.color) params.set("color", filters.color);
  if (filters.yearFrom) params.set("yearFrom", filters.yearFrom);
  if (filters.yearTo) params.set("yearTo", filters.yearTo);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  const query = params.toString();
  return query ? `?${query}` : "";
}

/**
 * Customer car search: every approved, active sale ad in the system, with
 * text search, advanced filters, sorting and pagination.
 */
export default async function PanelSearchPage({ searchParams }: { searchParams: SearchParams }) {
  await requireUser();

  const filters = parseFilters(searchParams);
  const requestedPage = Math.max(1, Number.parseInt(single(searchParams.page), 10) || 1);

  const [result, options] = await Promise.all([searchApprovedAds(filters, requestedPage), getSearchOptions()]);

  const hasFilters =
    Boolean(filters.q || filters.brand || filters.carType || filters.saleTerm || filters.color || filters.yearFrom || filters.yearTo);
  const baseQuery = filtersToQuery(filters);
  const filtersKey = JSON.stringify(filters);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="admin-animate-in flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-panel-text sm:text-2xl">جستجوی خودرو</h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-panel-muted sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 text-panel-accent" />
            همه آگهی‌های تایید‌شده توسط مدیریت خودرو یاب
          </p>
        </div>
        <LiveClock className="self-start" />
      </div>

      {/* Controls */}
      <div className="admin-animate-in" style={{ animationDelay: "60ms" }}>
        <SearchFilters key={filtersKey} filters={filters} options={options} total={result.total} />
      </div>

      {/* Results */}
      {result.ads.length === 0 ? (
        <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-16 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
              <SearchX className="h-7 w-7" />
            </span>
            <p className="mt-5 text-base font-extrabold text-panel-text">
              {hasFilters ? "آگهی‌ای مطابق فیلترهای شما پیدا نشد" : "هنوز آگهی تایید‌شده‌ای ثبت نشده است"}
            </p>
            <p className="mt-2 text-xs leading-6 text-panel-muted-2">
              {hasFilters
                ? "عبارت جستجو را تغییر دهید یا برخی فیلترها را بردارید."
                : "به‌محض تایید اولین آگهی توسط مدیریت، اینجا نمایش داده می‌شود."}
            </p>
            {hasFilters && (
              <Link
                href={PATHNAME}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-panel-line/[0.1] bg-panel-line/[0.03] px-5 text-sm font-bold text-panel-text-2 transition-colors hover:border-[#FF6A00]/40 hover:text-panel-text"
              >
                حذف همه فیلترها
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          <div key={`${filtersKey}:${result.page}`} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {result.ads.map((ad, index) => (
              <AdCard key={ad.id} ad={ad} delay={Math.min(index, 8) * 45} />
            ))}
          </div>
          <SearchPagination page={result.page} pageCount={result.pageCount} baseQuery={baseQuery} pathname={PATHNAME} />
        </>
      )}
    </div>
  );
}
