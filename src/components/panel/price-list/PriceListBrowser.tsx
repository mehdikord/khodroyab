"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, SearchX, Tags, UsersRound, X } from "lucide-react";

import type { PriceListRow } from "@/lib/price-list";
import { PRICE_TABLE_PRICE_FIELDS, digitsOnly } from "@/lib/price-table-shared";
import { cn, toPersianDigits } from "@/lib/utils";
import { BrandLogo, ColorLabel, PriceTag } from "@/components/panel/price-list/price-list-ui";

interface PriceListBrowserProps {
  rows: PriceListRow[];
}

const headClass = "whitespace-nowrap px-3 py-3.5 text-right text-[11px] font-extrabold uppercase tracking-wider text-panel-muted";

function carHref(row: PriceListRow): string {
  return `/panel/price-list/${row.id}`;
}

function hasAnyPrice(row: PriceListRow): boolean {
  return row.sellerCount > 0;
}

/**
 * Market-wide price list: every price-table car with the lowest raw,
 * clearance and instant price across all sellers. Rows open the car's page
 * with every seller's prices.
 *
 * Desktop: a full table (the whole row is clickable). Below `lg`: cards.
 */
export function PriceListBrowser({ rows }: PriceListBrowserProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const [pricedOnly, setPricedOnly] = useState(false);

  const brands = useMemo(() => {
    const map = new Map<string, { name: string; image: string | null; count: number }>();
    for (const row of rows) {
      const current = map.get(row.brandName);
      if (current) current.count += 1;
      else map.set(row.brandName, { name: row.brandName, image: row.brandImage, count: 1 });
    }
    return Array.from(map.values());
  }, [rows]);

  const visibleRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const digits = digitsOnly(query);
    return rows.filter((row) => {
      if (brand && row.brandName !== brand) return false;
      if (pricedOnly && !hasAnyPrice(row)) return false;
      if (!normalized) return true;
      return (
        row.name.toLowerCase().includes(normalized) ||
        row.brandName.toLowerCase().includes(normalized) ||
        row.model.toLowerCase().includes(normalized) ||
        (row.colorName?.toLowerCase().includes(normalized) ?? false) ||
        (digits.length > 0 && (row.year.includes(digits) || row.model.includes(digits)))
      );
    });
  }, [rows, query, brand, pricedOnly]);

  const isFiltered = Boolean(query.trim() || brand || pricedOnly);

  function openRow(event: React.MouseEvent<HTMLTableRowElement>, row: PriceListRow) {
    // Let real links inside the row (and text selection) behave natively.
    if ((event.target as HTMLElement).closest("a")) return;
    if (window.getSelection()?.toString()) return;
    if (event.metaKey || event.ctrlKey) {
      window.open(carHref(row), "_blank", "noopener");
      return;
    }
    router.push(carHref(row));
  }

  function resetFilters() {
    setQuery("");
    setBrand(null);
    setPricedOnly(false);
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="admin-animate-in space-y-3 rounded-3xl border border-panel-line/[0.08] bg-panel-surface/80 p-3 backdrop-blur sm:p-4" style={{ animationDelay: "60ms" }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="group relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 start-0 flex w-11 items-center justify-center text-panel-faint transition-colors group-focus-within:text-panel-accent">
              <Search className="h-[18px] w-[18px]" />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در برند، نام، مدل، رنگ یا سال..."
              aria-label="جستجو در لیست قیمت"
              className="h-11 w-full rounded-xl border border-panel-line/[0.12] bg-panel-bg ps-11 pe-10 text-sm text-panel-text outline-none transition-all placeholder:text-panel-faint focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="پاک کردن جستجو"
                className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-panel-faint hover:text-panel-text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={pricedOnly}
            onClick={() => setPricedOnly((value) => !value)}
            className={cn(
              "inline-flex h-11 shrink-0 items-center justify-between gap-3 rounded-xl border px-3.5 text-xs font-bold transition-colors",
              pricedOnly
                ? "border-[#FF6A00]/45 bg-[#FF6A00]/10 text-panel-text"
                : "border-panel-line/[0.12] bg-panel-bg text-panel-muted hover:text-panel-text"
            )}
          >
            فقط خودروهای دارای قیمت
            <span
              aria-hidden="true"
              className={cn(
                "relative h-5 w-9 rounded-full transition-colors",
                pricedOnly ? "bg-[#FF6A00]" : "bg-panel-line/20"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
                  pricedOnly ? "start-[18px]" : "start-0.5"
                )}
              />
            </span>
          </button>
        </div>

        {brands.length > 1 && (
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setBrand(null)}
              aria-pressed={brand === null}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-xs font-bold transition-all",
                brand === null
                  ? "border-[#FF6A00]/50 bg-gradient-to-l from-[#FF6A00]/20 to-[#FF6A00]/5 text-panel-text"
                  : "border-panel-line/[0.1] bg-panel-bg text-panel-muted hover:border-panel-line/25 hover:text-panel-text"
              )}
            >
              <Tags className="h-4 w-4 text-panel-accent" />
              همه برندها
              <span className="rounded-md bg-panel-line/[0.08] px-1.5 py-0.5 text-[10px]">{toPersianDigits(rows.length)}</span>
            </button>
            {brands.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setBrand((current) => (current === item.name ? null : item.name))}
                aria-pressed={brand === item.name}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border pe-3.5 ps-1.5 text-xs font-bold transition-all",
                  brand === item.name
                    ? "border-[#FF6A00]/50 bg-gradient-to-l from-[#FF6A00]/20 to-[#FF6A00]/5 text-panel-text"
                    : "border-panel-line/[0.1] bg-panel-bg text-panel-muted hover:border-panel-line/25 hover:text-panel-text"
                )}
              >
                <BrandLogo name={item.name} image={item.image} className="h-7 w-7 rounded-lg" />
                {item.name}
                <span className="rounded-md bg-panel-line/[0.08] px-1.5 py-0.5 text-[10px]">{toPersianDigits(item.count)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {isFiltered && (
        <div className="flex items-center justify-between text-xs text-panel-muted">
          <span>
            {toPersianDigits(visibleRows.length)} خودرو از {toPersianDigits(rows.length)}
          </span>
          <button type="button" onClick={resetFilters} className="font-bold text-panel-accent hover:underline">
            حذف فیلترها
          </button>
        </div>
      )}

      {visibleRows.length === 0 ? (
        <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
              <SearchX className="h-7 w-7" />
            </span>
            <p className="mt-5 text-base font-extrabold text-panel-text">خودرویی با این مشخصات در لیست نیست</p>
            <p className="mt-2 text-xs text-panel-muted-2">عبارت جستجو یا فیلترها را تغییر دهید.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="admin-animate-in hidden overflow-hidden rounded-3xl border border-panel-line/[0.1] bg-panel-surface shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] lg:block" style={{ animationDelay: "100ms" }}>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-panel-line/[0.1] bg-panel-surface-2/70">
                  <th scope="col" className={cn(headClass, "ps-5")}>برند</th>
                  <th scope="col" className={headClass}>نام خودرو</th>
                  <th scope="col" className={headClass}>مدل</th>
                  <th scope="col" className={headClass}>رنگ</th>
                  <th scope="col" className={headClass}>سال ساخت</th>
                  {PRICE_TABLE_PRICE_FIELDS.map((field) => (
                    <th key={field.key} scope="col" className={headClass}>
                      {field.label}
                    </th>
                  ))}
                  <th scope="col" className="w-12 pe-4">
                    <span className="sr-only">مشاهده</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel-line/[0.06]">
                {visibleRows.map((row) => {
                  const priced = hasAnyPrice(row);
                  return (
                    <tr
                      key={row.id}
                      onClick={(event) => openRow(event, row)}
                      onMouseEnter={() => router.prefetch(carHref(row))}
                      className="group cursor-pointer transition-colors hover:bg-[#FF6A00]/[0.045]"
                    >
                      <td className="relative py-3.5 pe-3 ps-5">
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-2 start-0 w-[3px] rounded-full bg-[#FF6A00] opacity-0 shadow-[0_0_10px_#FF6A00] transition-opacity group-hover:opacity-100"
                        />
                        <div className="flex items-center gap-2.5">
                          <BrandLogo name={row.brandName} image={row.brandImage} />
                          <span className="whitespace-nowrap text-[13px] font-bold text-panel-text-2">{row.brandName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <Link
                          href={carHref(row)}
                          className="block text-sm font-extrabold text-panel-text outline-none transition-colors group-hover:text-panel-accent focus-visible:underline"
                        >
                          {row.name}
                        </Link>
                        <span className={cn("mt-1 inline-flex items-center gap-1 text-[10px] font-semibold", priced ? "text-panel-muted" : "text-panel-faint")}>
                          <UsersRound className="h-3 w-3" />
                          {priced ? `${toPersianDigits(row.sellerCount)} فروشنده` : "بدون قیمت"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3.5 text-panel-text-2">{toPersianDigits(row.model)}</td>
                      <td className="px-3 py-3.5 text-[13px]">
                        <ColorLabel name={row.colorName} code={row.colorCode} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3.5 text-panel-text-2">{toPersianDigits(row.year)}</td>
                      {PRICE_TABLE_PRICE_FIELDS.map((field) => (
                        <td key={field.key} className="px-3 py-3.5">
                          <PriceTag price={row.lowest[field.key]} />
                        </td>
                      ))}
                      <td className="pe-4 text-panel-faint">
                        <ChevronLeft className="h-5 w-5 transition-all group-hover:-translate-x-1 group-hover:text-panel-accent" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile / tablet cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
            {visibleRows.map((row, index) => {
              const priced = hasAnyPrice(row);
              return (
                <Link
                  key={row.id}
                  href={carHref(row)}
                  className="panel-card-in group relative overflow-hidden rounded-3xl border border-panel-line/[0.1] bg-panel-surface p-4 transition-all hover:border-[#FF6A00]/40 active:scale-[0.99]"
                  style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                >
                  <div className="pointer-events-none absolute -top-16 end-[-40px] h-32 w-32 rounded-full bg-[#FF6A00]/10 blur-2xl transition-opacity group-hover:opacity-100" aria-hidden="true" />

                  <div className="relative flex items-start gap-3">
                    <BrandLogo name={row.brandName} image={row.brandImage} className="h-11 w-11 rounded-2xl p-1.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-panel-muted">{row.brandName}</p>
                      <p className="mt-0.5 break-words text-[15px] font-black leading-6 text-panel-text">{row.name}</p>
                    </div>
                    <ChevronLeft className="mt-1 h-5 w-5 shrink-0 text-panel-faint transition-all group-hover:-translate-x-1 group-hover:text-panel-accent" />
                  </div>

                  <div className="relative mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="rounded-lg bg-panel-line/[0.06] px-2 py-1 font-semibold text-panel-text-2">مدل {toPersianDigits(row.model)}</span>
                    <span className="rounded-lg bg-panel-line/[0.06] px-2 py-1 font-semibold text-panel-text-2">سال {toPersianDigits(row.year)}</span>
                    <span className="rounded-lg bg-panel-line/[0.06] px-2 py-1 font-semibold">
                      <ColorLabel name={row.colorName} code={row.colorCode} />
                    </span>
                  </div>

                  <div className="relative mt-3 grid grid-cols-3 gap-2">
                    {PRICE_TABLE_PRICE_FIELDS.map((field) => (
                      <div key={field.key} className="rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 px-2 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-panel-muted">{field.label}</p>
                        <div className="mt-1.5 flex justify-center">
                          <PriceTag price={row.lowest[field.key]} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className={cn("relative mt-3 flex items-center gap-1.5 text-[11px] font-semibold", priced ? "text-panel-muted" : "text-panel-faint")}>
                    <UsersRound className="h-3.5 w-3.5" />
                    {priced ? `کمترین قیمت از بین ${toPersianDigits(row.sellerCount)} فروشنده` : "هنوز فروشنده‌ای قیمت ثبت نکرده است"}
                  </p>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
