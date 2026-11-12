"use client";

import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDownWideNarrow, Loader2, RotateCcw, Search } from "lucide-react";

import { SearchableSelect, type SearchableSelectOption } from "@/components/admin/ui/SearchableSelect";
import {
  ADMIN_BUY_AD_FILTER_DEFAULTS,
  ADMIN_BUY_AD_PARAM_KEYS,
  ADMIN_BUY_AD_SORTS,
  ADMIN_BUY_AD_SORT_LABELS,
  type AdminBuyAdCounts,
  type AdminBuyAdFilterOptions,
  type AdminBuyAdFilterValues,
  type AdminBuyAdSort,
} from "@/lib/admin-buy-ads-shared";
import { CURRENCY_LABELS, PRICE_CURRENCIES, type PriceCurrency } from "@/lib/currency";
import { cn, toPersianDigits } from "@/lib/utils";

interface BuyAdsFiltersProps {
  filters: AdminBuyAdFilterValues;
  options: AdminBuyAdFilterOptions;
  counts: AdminBuyAdCounts;
}

const selectClass =
  "h-12 w-full rounded-xl border border-white/[0.12] bg-[#07090C] px-3 text-sm text-[#F5F5F5] outline-none transition-all focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15";

export function BuyAdsFilters({ filters, options, counts }: BuyAdsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(filters.q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Push a new set of filters to the URL (resets pagination). */
  function apply(patch: Partial<AdminBuyAdFilterValues>) {
    const next: AdminBuyAdFilterValues = { ...filters, q: query.trim(), ...patch };
    const params = new URLSearchParams(searchParams.toString());
    (Object.keys(ADMIN_BUY_AD_PARAM_KEYS) as (keyof AdminBuyAdFilterValues)[]).forEach((key) => {
      const value = next[key];
      if (value && value !== ADMIN_BUY_AD_FILTER_DEFAULTS[key]) params.set(ADMIN_BUY_AD_PARAM_KEYS[key], value);
      else params.delete(ADMIN_BUY_AD_PARAM_KEYS[key]);
    });
    params.delete("page");
    const search = params.toString();
    startTransition(() => {
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    });
  }

  // Debounced free-text search.
  useEffect(() => {
    if (query === filters.q) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => apply({ q: query.trim() }), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const brandOptions = useMemo<SearchableSelectOption[]>(
    () =>
      options.brands.map((brand) => ({
        value: brand.id,
        label: brand.name,
        description: brand.description ? `${toPersianDigits(brand.description)} خودرو` : undefined,
      })),
    [options.brands]
  );

  const carOptions = useMemo<SearchableSelectOption[]>(
    () =>
      options.cars
        .filter((car) => !filters.brandId || car.brandId === filters.brandId)
        .map((car) => ({ value: car.id, label: car.name, description: car.description ? toPersianDigits(car.description) : undefined })),
    [options.cars, filters.brandId]
  );

  const userOptions = useMemo<SearchableSelectOption[]>(
    () => options.users.map((user) => ({ value: user.id, label: user.name, description: user.description, keywords: user.description })),
    [options.users]
  );

  const colorOptions = useMemo<SearchableSelectOption[]>(
    () => options.colors.map((color) => ({ value: color.id, label: color.name })),
    [options.colors]
  );

  const hasActiveFilters = (Object.keys(ADMIN_BUY_AD_FILTER_DEFAULTS) as (keyof AdminBuyAdFilterValues)[]).some(
    (key) => key !== "sort" && filters[key] !== ADMIN_BUY_AD_FILTER_DEFAULTS[key]
  );

  return (
    <div className="space-y-4 rounded-3xl border border-white/[0.07] bg-[#0D1117] p-4 sm:p-5">
      {/* Quick state chips */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <Segmented
          label="وضعیت"
          value={filters.active}
          onChange={(value) => apply({ active: value })}
          items={[
            ["", "همه", counts.total],
            ["1", "فعال", counts.active],
            ["0", "متوقف", counts.paused],
          ]}
        />
        <Segmented
          label="قیمت‌دهی"
          value={filters.bidding}
          onChange={(value) => apply({ bidding: value })}
          items={[
            ["", "همه", counts.total],
            ["1", "باز", counts.biddingOpen],
            ["0", "بسته", counts.biddingClosed],
          ]}
        />
        <Segmented
          label="پیشنهاد"
          value={filters.offers}
          onChange={(value) => apply({ offers: value })}
          items={[
            ["", "همه", counts.total],
            ["1", "دارای پیشنهاد", counts.withOffers],
            ["0", "بدون پیشنهاد", counts.total - counts.withOffers],
          ]}
        />
        {isPending && <Loader2 className="h-4 w-4 animate-spin text-[#FF8A2A]" />}
      </div>

      {/* Search + selects */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
        <div className="relative sm:col-span-2 lg:col-span-5">
          <Search className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E6672]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو: کد آگهی، نام/موبایل/کد کاربر، برند، خودرو، رنگ، سال، توضیحات…"
            className="h-12 w-full rounded-xl border border-white/[0.12] bg-[#07090C] pe-11 ps-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
        </div>
        <SearchableSelect
          className="lg:col-span-3"
          value={filters.userId}
          onChange={(value) => apply({ userId: value })}
          options={userOptions}
          clearable
          placeholder="همه خریداران"
          searchPlaceholder="جستجوی نام یا موبایل…"
          emptyText="کاربری پیدا نشد"
        />
        <div className="relative lg:col-span-4">
          <ArrowDownWideNarrow className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E6672]" />
          <select
            aria-label="مرتب‌سازی"
            value={filters.sort}
            onChange={(e) => apply({ sort: e.target.value as AdminBuyAdSort })}
            className={cn(selectClass, "appearance-none pe-9")}
          >
            {ADMIN_BUY_AD_SORTS.map((sort) => (
              <option key={sort} value={sort}>
                مرتب‌سازی: {ADMIN_BUY_AD_SORT_LABELS[sort]}
              </option>
            ))}
          </select>
        </div>

        <SearchableSelect
          className="lg:col-span-3"
          value={filters.brandId}
          onChange={(value) => apply({ brandId: value, carId: "" })}
          options={brandOptions}
          clearable
          placeholder="همه برندها"
          searchPlaceholder="جستجوی برند…"
          emptyText="برندی پیدا نشد"
        />
        <SearchableSelect
          className="lg:col-span-3"
          value={filters.carId}
          onChange={(value) => apply({ carId: value })}
          options={carOptions}
          clearable
          placeholder={filters.brandId ? "همه خودروهای این برند" : "همه خودروها"}
          searchPlaceholder="جستجوی خودرو…"
          emptyText="خودرویی پیدا نشد"
        />
        <SearchableSelect
          className="lg:col-span-2"
          value={filters.colorId}
          onChange={(value) => apply({ colorId: value })}
          options={colorOptions}
          clearable
          placeholder="همه رنگ‌ها"
          searchPlaceholder="جستجوی رنگ…"
          emptyText="رنگی پیدا نشد"
        />
        <select
          aria-label="سال از"
          value={filters.yearFrom}
          onChange={(e) => apply({ yearFrom: e.target.value })}
          className={cn(selectClass, "lg:col-span-1")}
        >
          <option value="">سال از</option>
          {options.years.map((year) => (
            <option key={year} value={year}>
              {toPersianDigits(year)}
            </option>
          ))}
        </select>
        <select
          aria-label="سال تا"
          value={filters.yearTo}
          onChange={(e) => apply({ yearTo: e.target.value })}
          className={cn(selectClass, "lg:col-span-1")}
        >
          <option value="">سال تا</option>
          {options.years.map((year) => (
            <option key={year} value={year}>
              {toPersianDigits(year)}
            </option>
          ))}
        </select>
        <select
          aria-label="واحد پول"
          value={filters.currency}
          onChange={(e) => apply({ currency: e.target.value as PriceCurrency | "" })}
          className={cn(selectClass, "lg:col-span-2")}
        >
          <option value="">همه ارزها</option>
          {PRICE_CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {CURRENCY_LABELS[currency]}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              setQuery("");
              apply({ ...ADMIN_BUY_AD_FILTER_DEFAULTS, sort: filters.sort });
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 text-xs font-semibold text-[#9BA3AE] transition-colors hover:border-red-500/40 hover:text-red-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            پاک کردن فیلترها
          </button>
        </div>
      )}
    </div>
  );
}

function Segmented({
  label,
  value,
  items,
  onChange,
}: {
  label: string;
  value: "" | "1" | "0";
  items: (readonly ["" | "1" | "0", string, number])[];
  onChange: (value: "" | "1" | "0") => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-[#8B93A1]">{label}</span>
      <div className="inline-flex rounded-xl border border-white/[0.08] bg-[#07090C] p-1">
        {items.map(([itemValue, itemLabel, count]) => (
          <button
            key={itemValue || "all"}
            type="button"
            aria-pressed={value === itemValue}
            onClick={() => onChange(itemValue)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-colors",
              value === itemValue ? "bg-[#FF6A00]/15 text-[#FF8A2A]" : "text-[#8B93A1] hover:text-[#F5F5F5]"
            )}
          >
            {itemLabel}
            <span className="font-mono text-[10px] opacity-80">{toPersianDigits(count)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
