"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Car, ChevronLeft, Loader2, Search } from "lucide-react";

import { SafeImage } from "@/components/panel/SafeImage";
import { SearchableSelect } from "@/components/admin/ui/SearchableSelect";
import { brandOptionsOf, fetchCarPage } from "@/components/catalog/useCarSelection";
import { CAR_PICKER_PAGE_SIZE, type BrandChoice, type CarChoice, type CarChoicePage } from "@/lib/catalog-shared";
import { toPersianDigits } from "@/lib/utils";

/** @deprecated use `CarChoice` from `@/lib/catalog-shared`. */
export type AdCarChoice = CarChoice;

function NoImage() {
  return (
    <div className="flex h-full w-full items-center justify-center text-panel-faint">
      <Car className="h-8 w-8" strokeWidth={1.5} />
    </div>
  );
}

interface AdCarPickerProps {
  brands: BrandChoice[];
  /** First page, rendered on the server. */
  initialPage: CarChoicePage;
  /** Each car links to `${basePath}/${carId}`. */
  basePath?: string;
  backHref?: string;
  backLabel?: string;
  title?: string;
  subtitle?: string;
}

/**
 * First step of a new ad (sale or buy): search the catalogue and pick a car.
 * The catalogue is searched on the server one page at a time; further pages
 * load as the list is scrolled.
 */
export function AdCarPicker({
  brands,
  initialPage,
  basePath = "/panel/ads/new",
  backHref = "/panel/ads",
  backLabel = "آگهی‌های من",
  title = "ثبت آگهی جدید",
  subtitle = "خودروی مورد نظر را انتخاب کنید تا به مرحله ورود اطلاعات آگهی بروید.",
}: AdCarPickerProps) {
  const [query, setQuery] = useState("");
  const [brandId, setBrandId] = useState("");
  const [items, setItems] = useState<CarChoice[]>(initialPage.items);
  const [page, setPage] = useState(initialPage.page);
  const [pageCount, setPageCount] = useState(initialPage.pageCount);
  const [total, setTotal] = useState(initialPage.total);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  const brandOptions = useMemo(() => brandOptionsOf(brands), [brands]);

  async function load(nextPage: number, replace: boolean) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCarPage(
        { q: query.trim(), brandId, page: nextPage, size: CAR_PICKER_PAGE_SIZE },
        controller.signal
      );
      setItems((prev) => (replace ? result.items : [...prev, ...result.items]));
      setPage(result.page);
      setPageCount(result.pageCount);
      setTotal(result.total);
    } catch (err) {
      if ((err as { name?: string }).name !== "AbortError") setError("بارگذاری خودروها ناموفق بود.");
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }

  // New search or brand: restart from page 1 (debounced for typing).
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const timer = setTimeout(() => void load(1, true), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, brandId]);

  const hasMore = page < pageCount;

  // Infinite scroll: fetch the next page when the sentinel comes into view.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || loading || error) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void load(page + 1, false);
      },
      { rootMargin: "400px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, error, page]);

  useEffect(() => () => abortRef.current?.abort(), []);

  return (
    <div className="space-y-5">
      <div className="admin-animate-in">
        <Link href={backHref} className="inline-flex items-center gap-1.5 text-xs font-bold text-panel-muted hover:text-panel-text">
          <ArrowRight className="h-3.5 w-3.5" />
          {backLabel}
        </Link>
        <h1 className="mt-2 text-xl font-black text-panel-text sm:text-2xl">{title}</h1>
        <p className="mt-1 text-xs text-panel-muted sm:text-sm">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="group relative sm:col-span-2">
          <Search className="pointer-events-none absolute start-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-panel-faint" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجوی نام خودرو، برند یا مدل…"
            aria-label="جستجوی خودرو"
            className="h-12 w-full rounded-2xl border border-panel-line/[0.1] bg-panel-surface pe-4 ps-11 text-sm text-panel-text outline-none transition-all placeholder:text-panel-faint hover:border-panel-line/20 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
        </div>
        {brandOptions.length > 1 && (
          <SearchableSelect
            value={brandId}
            onChange={setBrandId}
            options={brandOptions}
            clearable
            placeholder="همه برندها"
            searchPlaceholder="جستجوی برند…"
            emptyText="برندی پیدا نشد"
          />
        )}
      </div>

      <p className="flex items-center gap-2 text-xs text-panel-muted" aria-live="polite">
        {loading && page <= 1 ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-panel-accent" />
            در حال جستجو…
          </>
        ) : (
          `${toPersianDigits(total)} خودرو`
        )}
      </p>

      {items.length === 0 && !loading ? (
        <div className="rounded-2xl border border-dashed border-panel-line/[0.12] px-6 py-12 text-center">
          <p className="text-sm font-bold text-panel-muted">
            {error ?? (!query && !brandId ? "هنوز خودرویی در سامانه تعریف نشده است" : "خودرویی با این مشخصات پیدا نشد")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((car) => (
            <Link
              key={car.id}
              href={`${basePath}/${car.id}`}
              className="group flex items-center gap-3 rounded-2xl border border-panel-line/[0.08] bg-panel-surface p-3 transition-colors hover:border-[#FF6A00]/40"
            >
              <span className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-panel-media">
                {car.imageUrl ? (
                  <SafeImage src={car.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" fallback={<NoImage />} />
                ) : (
                  <NoImage />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-extrabold text-panel-text">
                  {car.brandName} {car.name}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-panel-muted">
                  {car.carTypeName} · مدل {toPersianDigits(car.model)}
                </span>
              </span>
              <ChevronLeft className="h-4 w-4 shrink-0 text-panel-faint transition-all group-hover:-translate-x-0.5 group-hover:text-panel-accent" />
            </Link>
          ))}
        </div>
      )}

      {/* Infinite-scroll sentinel + manual fallback */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-2">
          <button
            type="button"
            onClick={() => void load(page + 1, false)}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-panel-line/[0.12] px-5 text-xs font-bold text-panel-text-2 transition-colors hover:border-[#FF6A00]/40 hover:text-panel-text disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {error ? "تلاش دوباره" : loading ? "در حال بارگذاری…" : "نمایش خودروهای بیشتر"}
          </button>
        </div>
      )}
    </div>
  );
}
