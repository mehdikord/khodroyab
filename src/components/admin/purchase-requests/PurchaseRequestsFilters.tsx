"use client";

import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDownWideNarrow, CalendarRange, Loader2, RotateCcw, Search } from "lucide-react";

import { SearchableSelect, type SearchableSelectOption } from "@/components/admin/ui/SearchableSelect";
import {
  ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS,
  ADMIN_PURCHASE_REQUEST_PARAM_KEYS,
  ADMIN_PURCHASE_REQUEST_SORTS,
  ADMIN_PURCHASE_REQUEST_SORT_LABELS,
  PURCHASE_REQUEST_SOURCES,
  PURCHASE_REQUEST_SOURCE_LABELS,
  PURCHASE_REQUEST_STATUSES,
  PURCHASE_REQUEST_STATUS_LABELS,
  type AdminPurchaseRequestCounts,
  type AdminPurchaseRequestFilterOptions,
  type AdminPurchaseRequestFilterValues,
  type AdminPurchaseRequestSort,
  type PurchaseRequestAudience,
} from "@/lib/purchase-requests-shared";
import { cn, toPersianDigits } from "@/lib/utils";

interface PurchaseRequestsFiltersProps {
  audience: PurchaseRequestAudience;
  filters: AdminPurchaseRequestFilterValues;
  options: AdminPurchaseRequestFilterOptions;
  counts: AdminPurchaseRequestCounts;
}

const selectClass =
  "h-12 w-full rounded-xl border border-white/[0.12] bg-[#07090C] px-3 text-sm text-[#F5F5F5] outline-none transition-all focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15";

/** Jalali "1405/08/24" (ASCII digits) of a day in Tehran. */
const jalaliDay = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Tehran",
});

const PERIODS = [
  { key: "today", label: "امروز", days: 0 },
  { key: "7", label: "۷ روز اخیر", days: 6 },
  { key: "30", label: "۳۰ روز اخیر", days: 29 },
  { key: "90", label: "۹۰ روز اخیر", days: 89 },
] as const;

/** URL-driven filters of the admin purchase-request lists. */
export function PurchaseRequestsFilters({ audience, filters, options, counts }: PurchaseRequestsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(filters.q);
  const [from, setFrom] = useState(filters.from);
  const [to, setTo] = useState(filters.to);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function apply(patch: Partial<AdminPurchaseRequestFilterValues>) {
    const next: AdminPurchaseRequestFilterValues = { ...filters, q: query.trim(), ...patch };
    const params = new URLSearchParams(searchParams.toString());
    (Object.keys(ADMIN_PURCHASE_REQUEST_PARAM_KEYS) as (keyof AdminPurchaseRequestFilterValues)[]).forEach((key) => {
      const value = next[key];
      if (value && value !== ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS[key]) params.set(ADMIN_PURCHASE_REQUEST_PARAM_KEYS[key], value);
      else params.delete(ADMIN_PURCHASE_REQUEST_PARAM_KEYS[key]);
    });
    params.delete("page");
    const search = params.toString();
    startTransition(() => router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false }));
  }

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
        description: brand.description ? `${toPersianDigits(brand.description)} درخواست` : undefined,
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
  const sellerOptions = useMemo<SearchableSelectOption[]>(
    () =>
      options.sellers.map((seller) => ({
        value: seller.id,
        label: seller.name,
        description: seller.description ? toPersianDigits(seller.description) : undefined,
        keywords: seller.description,
      })),
    [options.sellers]
  );
  const provinceOptions = useMemo<SearchableSelectOption[]>(
    () => options.provinces.map((province) => ({ value: province.id, label: province.name })),
    [options.provinces]
  );
  const cityOptions = useMemo<SearchableSelectOption[]>(
    () =>
      (filters.provinceId ? options.provinces.filter((p) => p.id === filters.provinceId) : options.provinces).flatMap((province) =>
        province.cities.map((city) => ({ value: city.id, label: city.name, description: province.name }))
      ),
    [options.provinces, filters.provinceId]
  );

  const hasActiveFilters = (Object.keys(ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS) as (keyof AdminPurchaseRequestFilterValues)[]).some(
    (key) => key !== "sort" && filters[key] !== ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS[key]
  );

  function applyPeriod(days: number) {
    const today = new Date();
    const start = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
    const nextFrom = jalaliDay.format(start);
    const nextTo = jalaliDay.format(today);
    setFrom(nextFrom);
    setTo(nextTo);
    apply({ from: nextFrom, to: nextTo });
  }

  const activePeriod = PERIODS.find((period) => {
    const today = new Date();
    return (
      filters.to === jalaliDay.format(today) &&
      filters.from === jalaliDay.format(new Date(today.getTime() - period.days * 24 * 60 * 60 * 1000))
    );
  })?.key;

  return (
    <div className="space-y-4 rounded-3xl border border-white/[0.07] bg-[#0D1117] p-4 sm:p-5">
      {/* Status chips */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip active={filters.status === ""} onClick={() => apply({ status: "" })} label="همه وضعیت‌ها" count={counts.total} />
        {PURCHASE_REQUEST_STATUSES.map((status) => (
          <Chip
            key={status}
            active={filters.status === status}
            onClick={() => apply({ status: filters.status === status ? "" : status })}
            label={PURCHASE_REQUEST_STATUS_LABELS[status]}
            count={counts.byStatus[status]}
            dot={status === "received" ? "bg-[#FF6A00]" : status === "in_progress" ? "bg-sky-400" : status === "completed" ? "bg-emerald-400" : status === "no_answer" ? "bg-amber-400" : "bg-red-400"}
          />
        ))}
        {isPending && <Loader2 className="my-auto h-4 w-4 shrink-0 animate-spin text-[#FF8A2A]" />}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <Segmented
          label="منبع"
          value={filters.source}
          onChange={(value) => apply({ source: value as AdminPurchaseRequestFilterValues["source"] })}
          items={[
            ["", "همه", counts.total],
            ...PURCHASE_REQUEST_SOURCES.map((source) => [source, PURCHASE_REQUEST_SOURCE_LABELS[source], counts.bySource[source]] as const),
          ]}
        />
        <Segmented
          label="مشاهده"
          value={filters.seen}
          onChange={(value) => apply({ seen: value as AdminPurchaseRequestFilterValues["seen"] })}
          items={[
            ["", "همه", counts.total],
            ["0", "مشاهده‌نشده", counts.unseen],
            ["1", "مشاهده‌شده", counts.total - counts.unseen],
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
        <div className="relative sm:col-span-2 lg:col-span-6">
          <Search className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E6672]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              audience === "public"
                ? "جستجو: شماره درخواست، نام، موبایل، شهر، کد فروشنده، کد آگهی، خودرو، توضیحات…"
                : "جستجو: شماره درخواست، نام/موبایل/کد کاربر، کد فروشنده، کد آگهی، خودرو، توضیحات…"
            }
            className="h-12 w-full rounded-xl border border-white/[0.12] bg-[#07090C] pe-11 ps-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
        </div>
        <SearchableSelect
          className="lg:col-span-3"
          value={filters.sellerId}
          onChange={(value) => apply({ sellerId: value })}
          options={sellerOptions}
          clearable
          placeholder="همه فروشندگان"
          searchPlaceholder="جستجوی نام یا موبایل فروشنده…"
          emptyText="فروشنده‌ای پیدا نشد"
        />
        <div className="relative lg:col-span-3">
          <ArrowDownWideNarrow className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E6672]" />
          <select
            aria-label="مرتب‌سازی"
            value={filters.sort}
            onChange={(e) => apply({ sort: e.target.value as AdminPurchaseRequestSort })}
            className={cn(selectClass, "appearance-none pe-9")}
          >
            {ADMIN_PURCHASE_REQUEST_SORTS.map((sort) => (
              <option key={sort} value={sort}>
                مرتب‌سازی: {ADMIN_PURCHASE_REQUEST_SORT_LABELS[sort]}
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
        {audience === "public" ? (
          <>
            <SearchableSelect
              className="lg:col-span-3"
              value={filters.provinceId}
              onChange={(value) => apply({ provinceId: value, cityId: "" })}
              options={provinceOptions}
              clearable
              placeholder="همه استان‌ها"
              searchPlaceholder="جستجوی استان…"
              emptyText="استانی پیدا نشد"
            />
            <SearchableSelect
              className="lg:col-span-3"
              value={filters.cityId}
              onChange={(value) => apply({ cityId: value })}
              options={cityOptions}
              clearable
              placeholder="همه شهرها"
              searchPlaceholder="جستجوی شهر…"
              emptyText="شهری پیدا نشد"
            />
          </>
        ) : (
          <div className="hidden lg:col-span-6 lg:block" />
        )}
      </div>

      {/* Date range */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-[#07090C]/60 p-3 lg:flex-row lg:items-center">
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-[#8B93A1]">
          <CalendarRange className="h-4 w-4 text-[#FF8A2A]" />
          تاریخ ثبت
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PERIODS.map((period) => (
            <button
              key={period.key}
              type="button"
              onClick={() => applyPeriod(period.days)}
              aria-pressed={activePeriod === period.key}
              className={cn(
                "h-9 rounded-lg border px-3 text-xs font-bold transition-colors",
                activePeriod === period.key
                  ? "border-[#FF6A00]/50 bg-[#FF6A00]/15 text-[#FF8A2A]"
                  : "border-white/[0.08] text-[#8B93A1] hover:text-[#F5F5F5]"
              )}
            >
              {period.label}
            </button>
          ))}
        </div>
        <form
          className="flex flex-1 flex-wrap items-center gap-2 lg:justify-end"
          onSubmit={(event) => {
            event.preventDefault();
            apply({ from: from.trim(), to: to.trim() });
          }}
        >
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="از ۱۴۰۵/۰۸/۰۱"
            aria-label="از تاریخ (شمسی)"
            dir="ltr"
            inputMode="numeric"
            className="h-9 w-32 rounded-lg border border-white/[0.12] bg-[#07090C] px-3 text-center font-mono text-xs text-[#F5F5F5] outline-none placeholder:text-[#5E6672] focus:border-[#FF6A00]"
          />
          <span className="text-xs text-[#5E6672]">تا</span>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="تا ۱۴۰۵/۰۸/۳۰"
            aria-label="تا تاریخ (شمسی)"
            dir="ltr"
            inputMode="numeric"
            className="h-9 w-32 rounded-lg border border-white/[0.12] bg-[#07090C] px-3 text-center font-mono text-xs text-[#F5F5F5] outline-none placeholder:text-[#5E6672] focus:border-[#FF6A00]"
          />
          <button type="submit" className="h-9 rounded-lg border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-3 text-xs font-bold text-[#FF8A2A] hover:bg-[#FF6A00]/20">
            اعمال
          </button>
        </form>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFrom("");
              setTo("");
              apply({ ...ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS, sort: filters.sort });
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

function Chip({ active, onClick, label, count, dot }: { active: boolean; onClick: () => void; label: string; count: number; dot?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-xs font-bold transition-all",
        active
          ? "border-[#FF6A00]/50 bg-gradient-to-l from-[#FF6A00]/20 to-[#FF6A00]/5 text-[#F5F5F5]"
          : "border-white/[0.08] bg-[#07090C] text-[#8B93A1] hover:border-white/20 hover:text-[#F5F5F5]"
      )}
    >
      {dot && <span className={cn("h-2 w-2 rounded-full", dot)} />}
      {label}
      <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px]">{toPersianDigits(count)}</span>
    </button>
  );
}

function Segmented({
  label,
  value,
  items,
  onChange,
}: {
  label: string;
  value: string;
  items: (readonly [string, string, number])[];
  onChange: (value: string) => void;
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
