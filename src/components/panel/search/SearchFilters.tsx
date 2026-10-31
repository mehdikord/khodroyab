"use client";

import React, { useEffect, useId, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpDown, ChevronDown, Loader2, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";

import { cn, toPersianDigits } from "@/lib/utils";
import {
  SEARCH_SORTS,
  SEARCH_SORT_LABELS,
  type SearchFilterValues,
  type SearchOptions,
  type SearchSort,
} from "@/lib/panel-search-shared";

interface SearchFiltersProps {
  filters: SearchFilterValues;
  options: SearchOptions;
  total: number;
}

type FilterKey = keyof SearchFilterValues;

const DEFAULTS: SearchFilterValues = {
  q: "",
  brand: "",
  carType: "",
  saleTerm: "",
  color: "",
  yearFrom: "",
  yearTo: "",
  sort: "newest",
};

function buildQuery(values: SearchFilterValues): string {
  const params = new URLSearchParams();
  (Object.keys(DEFAULTS) as FilterKey[]).forEach((key) => {
    const value = values[key];
    if (value && value !== DEFAULTS[key]) params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

const selectClass =
  "h-11 w-full appearance-none rounded-xl border border-panel-line/[0.1] bg-panel-bg pe-9 ps-3 text-sm font-semibold text-panel-text outline-none transition-all hover:border-panel-line/20 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15";

function Select({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[11px] font-semibold text-panel-muted">
        {label}
      </label>
      <div className="relative">
        <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={selectClass}>
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-panel-faint" />
      </div>
    </div>
  );
}

/**
 * URL-driven search controls: instant text search (debounced), sort, and an
 * advanced filter panel. Every change navigates to the same page with new
 * query params so results are server-rendered and shareable.
 */
export function SearchFilters({ filters, options, total }: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const ids = {
    q: useId(),
    sort: useId(),
    brand: useId(),
    carType: useId(),
    saleTerm: useId(),
    color: useId(),
    yearFrom: useId(),
    yearTo: useId(),
  };

  const [query, setQuery] = useState(filters.q);
  const [draft, setDraft] = useState<SearchFilterValues>(filters);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const debounceRef = useRef<number | null>(null);

  // Keep local state in sync when the URL changes from elsewhere (back button, chips).
  useEffect(() => {
    setQuery(filters.q);
    setDraft(filters);
  }, [filters]);

  function navigate(values: SearchFilterValues) {
    startTransition(() => {
      router.replace(`${pathname}${buildQuery(values)}`, { scroll: false });
    });
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      navigate({ ...filters, q: value.trim() });
    }, 350);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    navigate({ ...filters, q: query.trim() });
  }

  function applyAdvanced() {
    navigate({ ...draft, q: query.trim() });
    setAdvancedOpen(false);
  }

  function clearAll() {
    setQuery("");
    setDraft(DEFAULTS);
    navigate(DEFAULTS);
    setAdvancedOpen(false);
  }

  function removeFilter(key: FilterKey) {
    const next = { ...filters, [key]: DEFAULTS[key] };
    if (key === "q") setQuery("");
    navigate(next);
  }

  const brandName = options.brands.find((b) => b.id === filters.brand)?.name;
  const carTypeName = options.carTypes.find((t) => t.id === filters.carType)?.name;
  const saleTermName = options.saleTerms.find((s) => s.id === filters.saleTerm)?.name;
  const colorName = options.colors.find((c) => c.id === filters.color)?.name;

  const activeChips: { key: FilterKey; label: string }[] = [];
  if (filters.q) activeChips.push({ key: "q", label: `جستجو: ${filters.q}` });
  if (brandName) activeChips.push({ key: "brand", label: `برند: ${brandName}` });
  if (carTypeName) activeChips.push({ key: "carType", label: `نوع: ${carTypeName}` });
  if (saleTermName) activeChips.push({ key: "saleTerm", label: `شرایط: ${saleTermName}` });
  if (colorName) activeChips.push({ key: "color", label: `رنگ: ${colorName}` });
  if (filters.yearFrom) activeChips.push({ key: "yearFrom", label: `از سال ${toPersianDigits(filters.yearFrom)}` });
  if (filters.yearTo) activeChips.push({ key: "yearTo", label: `تا سال ${toPersianDigits(filters.yearTo)}` });

  const advancedCount = ["brand", "carType", "saleTerm", "color", "yearFrom", "yearTo"].filter(
    (key) => filters[key as FilterKey]
  ).length;

  return (
    <section aria-label="جستجو و فیلتر آگهی‌ها" className="space-y-3">
      {/* Primary row: search + sort + advanced toggle */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="group relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 start-0 flex w-11 items-center justify-center text-panel-faint transition-colors group-focus-within:text-panel-accent">
            {isPending ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <Search className="h-[18px] w-[18px]" />}
          </span>
          <input
            id={ids.q}
            type="search"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="جستجو بر اساس نام خودرو، مدل، برند، کد آگهی یا نام فروشنده…"
            aria-label="جستجو"
            enterKeyHint="search"
            className="h-12 w-full rounded-2xl border border-panel-line/[0.1] bg-panel-surface pe-10 ps-11 text-sm text-panel-text outline-none transition-all placeholder:text-panel-faint hover:border-panel-line/20 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
          {query && (
            <button
              type="button"
              onClick={() => handleQueryChange("")}
              aria-label="پاک کردن جستجو"
              className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-panel-faint transition-colors hover:text-panel-text"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-52 sm:flex-none">
            <span className="pointer-events-none absolute inset-y-0 start-0 flex w-10 items-center justify-center text-panel-faint">
              <ArrowUpDown className="h-4 w-4" />
            </span>
            <select
              id={ids.sort}
              aria-label="مرتب‌سازی"
              value={filters.sort}
              onChange={(event) => navigate({ ...filters, q: query.trim(), sort: event.target.value as SearchSort })}
              className={cn(selectClass, "h-12 rounded-2xl bg-panel-surface ps-10")}
            >
              {SEARCH_SORTS.map((sort) => (
                <option key={sort} value={sort}>
                  {SEARCH_SORT_LABELS[sort]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-panel-faint" />
          </div>

          <button
            type="button"
            onClick={() => setAdvancedOpen((open) => !open)}
            aria-expanded={advancedOpen}
            className={cn(
              "relative inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl border px-4 text-sm font-bold transition-colors",
              advancedOpen || advancedCount > 0
                ? "border-[#FF6A00]/40 bg-[#FF6A00]/10 text-panel-accent"
                : "border-panel-line/[0.1] bg-panel-surface text-panel-text-2 hover:border-panel-line/20 hover:text-panel-text"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">فیلتر پیشرفته</span>
            <span className="sm:hidden">فیلتر</span>
            {advancedCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF6A00] px-1.5 text-[10px] font-extrabold text-[#07090C]">
                {toPersianDigits(advancedCount)}
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Advanced panel */}
      {advancedOpen && (
        <div className="admin-animate-fade rounded-2xl border border-panel-line/[0.1] bg-panel-surface p-4 shadow-card-depth">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <Select id={ids.brand} label="برند" value={draft.brand} onChange={(brand) => setDraft({ ...draft, brand })}>
              <option value="">همه برندها</option>
              {options.brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </Select>
            <Select
              id={ids.carType}
              label="نوع خودرو"
              value={draft.carType}
              onChange={(carType) => setDraft({ ...draft, carType })}
            >
              <option value="">همه انواع</option>
              {options.carTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
            <Select
              id={ids.saleTerm}
              label="شرایط فروش"
              value={draft.saleTerm}
              onChange={(saleTerm) => setDraft({ ...draft, saleTerm })}
            >
              <option value="">همه شرایط</option>
              {options.saleTerms.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.name}
                </option>
              ))}
            </Select>
            <Select id={ids.color} label="رنگ" value={draft.color} onChange={(color) => setDraft({ ...draft, color })}>
              <option value="">همه رنگ‌ها</option>
              {options.colors.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              ))}
            </Select>
            <Select
              id={ids.yearFrom}
              label="از سال ساخت"
              value={draft.yearFrom}
              onChange={(yearFrom) => setDraft({ ...draft, yearFrom })}
            >
              <option value="">بدون محدودیت</option>
              {options.years.map((year) => (
                <option key={year} value={year}>
                  {toPersianDigits(year)}
                </option>
              ))}
            </Select>
            <Select id={ids.yearTo} label="تا سال ساخت" value={draft.yearTo} onChange={(yearTo) => setDraft({ ...draft, yearTo })}>
              <option value="">بدون محدودیت</option>
              {options.years.map((year) => (
                <option key={year} value={year}>
                  {toPersianDigits(year)}
                </option>
              ))}
            </Select>
          </div>

          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-panel-muted transition-colors hover:bg-panel-line/[0.04] hover:text-panel-text"
            >
              <RotateCcw className="h-4 w-4" />
              حذف همه فیلترها
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft(filters);
                  setAdvancedOpen(false);
                }}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-panel-line/[0.1] bg-panel-line/[0.03] px-4 text-sm font-bold text-panel-text-2 transition-colors hover:border-panel-line/20 sm:flex-none"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={applyAdvanced}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] transition-all hover:brightness-110 sm:flex-none"
              >
                اعمال فیلتر
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result count + active chips */}
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs text-panel-muted">
          <span className="font-extrabold text-panel-text">{toPersianDigits(total)}</span> آگهی تایید‌شده
          {activeChips.length > 0 && " مطابق فیلترها"}
        </p>
        {activeChips.length > 0 && (
          <div className="panel-no-scrollbar flex flex-1 items-center gap-1.5 overflow-x-auto">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => removeFilter(chip.key)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 py-1 pe-2 ps-3 text-[11px] font-bold text-panel-accent transition-colors hover:bg-[#FF6A00]/20"
              >
                {chip.label}
                <X className="h-3 w-3" />
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold text-panel-muted transition-colors hover:text-panel-text"
            >
              پاک کردن همه
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
