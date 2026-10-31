"use client";

import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import { SearchableSelect, type SearchableSelectOption } from "@/components/admin/ui/SearchableSelect";
import type { CarRecord } from "@/lib/cars";
import { AD_STATUSES, AD_STATUS_LABELS, type AdStatus } from "@/lib/ad-status";
import { cn, toPersianDigits } from "@/lib/utils";

export interface AdsFilterValues {
  q: string;
  brandId: string;
  carId: string;
  userId: string;
  status: AdStatus | "";
  active: "" | "1" | "0";
}

export interface AdsUserOption {
  id: string;
  name: string;
  phone: string;
}

interface AdsFiltersProps {
  filters: AdsFilterValues;
  cars: CarRecord[];
  users: AdsUserOption[];
  statusCounts: Record<AdStatus, number>;
}

/** Map filter keys to the (shorter) URL parameter names. */
const PARAM_KEYS: Record<keyof AdsFilterValues, string> = {
  q: "q",
  brandId: "brand",
  carId: "car",
  userId: "user",
  status: "status",
  active: "active",
};

export function AdsFilters({ filters, cars, users, statusCounts }: AdsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(filters.q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Push a new set of filters to the URL (resets pagination). */
  function apply(patch: Partial<AdsFilterValues>) {
    const next: AdsFilterValues = { ...filters, q: query, ...patch };
    const params = new URLSearchParams(searchParams.toString());
    (Object.keys(PARAM_KEYS) as (keyof AdsFilterValues)[]).forEach((key) => {
      const value = next[key];
      if (value) params.set(PARAM_KEYS[key], value);
      else params.delete(PARAM_KEYS[key]);
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

  const brandOptions = useMemo<SearchableSelectOption[]>(() => {
    const map = new Map<string, { name: string; count: number }>();
    for (const car of cars) {
      const entry = map.get(car.brandId) ?? { name: car.brandName, count: 0 };
      entry.count += 1;
      map.set(car.brandId, entry);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[1].name.localeCompare(b[1].name, "fa"))
      .map(([id, { name, count }]) => ({ value: id, label: name, description: `${toPersianDigits(count)} خودرو` }));
  }, [cars]);

  const carOptions = useMemo<SearchableSelectOption[]>(
    () =>
      cars
        .filter((car) => !filters.brandId || car.brandId === filters.brandId)
        .map((car) => ({
          value: car.id,
          label: filters.brandId ? car.name : `${car.brandName} ${car.name}`,
          description: `${car.carTypeName} · مدل ${toPersianDigits(car.model)}`,
          keywords: `${car.model} ${car.slug}`,
        })),
    [cars, filters.brandId]
  );

  const userOptions = useMemo<SearchableSelectOption[]>(
    () => users.map((user) => ({ value: user.id, label: user.name, description: user.phone, keywords: user.phone })),
    [users]
  );

  const hasActiveFilters = Boolean(
    filters.q || filters.brandId || filters.carId || filters.userId || filters.status || filters.active
  );

  const totalAll = statusCounts.pending + statusCounts.approved + statusCounts.rejected;

  return (
    <div className="space-y-4 rounded-3xl border border-white/[0.07] bg-[#0D1117] p-4 sm:p-5">
      {/* Status chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="me-1 inline-flex items-center gap-1.5 text-xs font-bold text-[#8B93A1]">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          وضعیت تایید
        </span>
        {([["", "همه", totalAll], ...AD_STATUSES.map((s) => [s, AD_STATUS_LABELS[s], statusCounts[s]] as const)] as const).map(
          ([value, label, count]) => {
            const selected = filters.status === value;
            return (
              <button
                key={value || "all"}
                type="button"
                onClick={() => apply({ status: value as AdStatus | "" })}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition-colors",
                  selected
                    ? value === "approved"
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
                      : value === "rejected"
                        ? "border-red-500/40 bg-red-500/15 text-red-200"
                        : value === "pending"
                          ? "border-amber-500/40 bg-amber-500/15 text-amber-200"
                          : "border-[#FF6A00]/40 bg-[#FF6A00]/15 text-[#FF8A2A]"
                    : "border-white/[0.08] bg-[#07090C] text-[#9BA3AE] hover:border-white/20 hover:text-[#F5F5F5]"
                )}
              >
                {label}
                <span className="font-mono text-[10px] opacity-80">{toPersianDigits(count)}</span>
              </button>
            );
          }
        )}
        {isPending && <Loader2 className="ms-1 h-4 w-4 animate-spin text-[#FF8A2A]" />}
      </div>

      {/* Search + selects */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="relative lg:col-span-4">
          <Search className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E6672]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو: کد آگهی، نام یا موبایل کاربر، برند، خودرو، مدل، سال…"
            className="h-12 w-full rounded-xl border border-white/[0.12] bg-[#07090C] pe-11 ps-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
        </div>
        <SearchableSelect
          className="lg:col-span-2"
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
          searchPlaceholder="جستجوی خودرو، مدل، سال…"
          emptyText="خودرویی پیدا نشد"
        />
        <SearchableSelect
          className="lg:col-span-3"
          value={filters.userId}
          onChange={(value) => apply({ userId: value })}
          options={userOptions}
          clearable
          placeholder="همه کاربران"
          searchPlaceholder="جستجوی نام یا موبایل کاربر…"
          emptyText="کاربری پیدا نشد"
        />
      </div>

      {/* Active filter + reset */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-white/[0.08] bg-[#07090C] p-1">
          {([
            ["", "همه"],
            ["1", "فعال"],
            ["0", "غیرفعال"],
          ] as const).map(([value, label]) => (
            <button
              key={value || "all"}
              type="button"
              onClick={() => apply({ active: value })}
              className={cn(
                "h-8 rounded-lg px-3 text-xs font-bold transition-colors",
                filters.active === value ? "bg-[#FF6A00]/15 text-[#FF8A2A]" : "text-[#8B93A1] hover:text-[#F5F5F5]"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              apply({ q: "", brandId: "", carId: "", userId: "", status: "", active: "" });
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 text-xs font-semibold text-[#9BA3AE] transition-colors hover:border-red-500/40 hover:text-red-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            پاک کردن فیلترها
          </button>
        )}
      </div>
    </div>
  );
}
