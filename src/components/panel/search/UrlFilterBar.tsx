"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpDown, ChevronDown, Loader2, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";

import { cn, toPersianDigits } from "@/lib/utils";

/** URL-backed filter values: free text `q`, a `sort` key and any select fields. */
export type UrlFilterValues = { q: string; sort: string } & Record<string, string>;

export interface UrlFilterField {
  key: string;
  label: string;
  /** Label of the empty ("any") choice. */
  emptyLabel: string;
  options: { value: string; label: string }[];
  /** Text of the removable chip shown while the filter is active. */
  chip: (optionLabel: string) => string;
}

interface UrlFilterBarProps {
  values: UrlFilterValues;
  defaults: UrlFilterValues;
  fields: UrlFilterField[];
  sorts: { value: string; label: string }[];
  placeholder: string;
  total: number;
  /** e.g. "آگهی تایید‌شده", shown after the result count. */
  totalLabel: string;
  ariaLabel: string;
}

function buildQuery(values: UrlFilterValues, defaults: UrlFilterValues): string {
  const params = new URLSearchParams();
  Object.keys(defaults).forEach((key) => {
    const value = values[key];
    if (value && value !== defaults[key]) params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

const selectClass =
  "h-11 w-full appearance-none rounded-xl border border-panel-line/[0.1] bg-panel-bg pe-9 ps-3 text-sm font-semibold text-panel-text outline-none transition-all hover:border-panel-line/20 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15";

/**
 * URL-driven search controls: instant text search (debounced), sort, and an
 * advanced filter panel. Every change navigates to the same page with new
 * query params so results are server-rendered and shareable.
 */
export function UrlFilterBar({ values, defaults, fields, sorts, placeholder, total, totalLabel, ariaLabel }: UrlFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(values.q);
  const [draft, setDraft] = useState<UrlFilterValues>(values);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const debounceRef = useRef<number | null>(null);

  // Keep local state in sync when the URL changes from elsewhere (back button, chips).
  useEffect(() => {
    setQuery(values.q);
    setDraft(values);
  }, [values]);

  function navigate(next: UrlFilterValues) {
    startTransition(() => {
      router.replace(`${pathname}${buildQuery(next, defaults)}`, { scroll: false });
    });
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => navigate({ ...values, q: value.trim() }), 350);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    navigate({ ...values, q: query.trim() });
  }

  function applyAdvanced() {
    navigate({ ...draft, q: query.trim() });
    setAdvancedOpen(false);
  }

  function clearAll() {
    setQuery("");
    setDraft(defaults);
    navigate(defaults);
    setAdvancedOpen(false);
  }

  function removeFilter(key: string) {
    if (key === "q") setQuery("");
    navigate({ ...values, [key]: defaults[key] });
  }

  const activeChips: { key: string; label: string }[] = [];
  if (values.q) activeChips.push({ key: "q", label: `جستجو: ${values.q}` });
  for (const field of fields) {
    const option = field.options.find((item) => item.value === values[field.key]);
    if (option) activeChips.push({ key: field.key, label: field.chip(option.label) });
  }
  const advancedCount = activeChips.filter((chip) => chip.key !== "q").length;

  return (
    <section aria-label={ariaLabel} className="space-y-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="group relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 start-0 flex w-11 items-center justify-center text-panel-faint transition-colors group-focus-within:text-panel-accent">
            {isPending ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <Search className="h-[18px] w-[18px]" />}
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder={placeholder}
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
              aria-label="مرتب‌سازی"
              value={values.sort}
              onChange={(event) => navigate({ ...values, q: query.trim(), sort: event.target.value })}
              className={cn(selectClass, "h-12 rounded-2xl bg-panel-surface ps-10")}
            >
              {sorts.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
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

      {advancedOpen && (
        <div className="admin-animate-fade rounded-2xl border border-panel-line/[0.1] bg-panel-surface p-4 shadow-card-depth">
          <div
            className={cn(
              "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
              fields.length >= 6 ? "xl:grid-cols-6" : fields.length === 5 ? "xl:grid-cols-5" : "xl:grid-cols-4"
            )}
          >
            {fields.map((field) => {
              const id = `filter-${field.key}`;
              return (
                <div key={field.key} className="space-y-1.5">
                  <label htmlFor={id} className="block text-[11px] font-semibold text-panel-muted">
                    {field.label}
                  </label>
                  <div className="relative">
                    <select
                      id={id}
                      value={draft[field.key] ?? ""}
                      onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })}
                      className={selectClass}
                    >
                      <option value="">{field.emptyLabel}</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-panel-faint" />
                  </div>
                </div>
              );
            })}
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
                  setDraft(values);
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

      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs text-panel-muted">
          <span className="font-extrabold text-panel-text">{toPersianDigits(total)}</span> {totalLabel}
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
