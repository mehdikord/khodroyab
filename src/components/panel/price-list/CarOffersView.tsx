"use client";

import React, { useMemo, useState } from "react";
import { ArrowDownWideNarrow, ArrowUpDown, CalendarDays, History, X } from "lucide-react";

import type { PriceListCarInfo, PriceListOffer, PriceListPricesByColumn } from "@/lib/price-list";
import {
  ALL_PRICE_FIELD_KEYS,
  PRICE_TABLE_ALL_PRICE_KEYS,
  priceFieldsFor,
  type PriceColumn,
  type PriceTableAnyPriceField,
  type PriceTablePriceField,
} from "@/lib/price-table-shared";
import { cn, toPersianDigits } from "@/lib/utils";
import { BrandLogo, ColumnHeading, YearPrices } from "@/components/panel/price-list/price-list-ui";
import { SellerCodeBadge } from "@/components/panel/SellerCodeBadge";
import { HorizontalScroller } from "@/components/panel/price-list/HorizontalScroller";
import { PurchaseRequestButton } from "@/components/panel/purchase-requests/PurchaseRequestButton";
import type { PurchaseRequestTarget, PurchaseRequestViewer } from "@/lib/purchase-requests-shared";
import { CURRENCY_LABELS } from "@/lib/currency";

interface CarOffersViewProps {
  car: PriceListCarInfo;
  /** One entry per seller, with all of their (year, colour) tiers. */
  offers: PriceListOffer[];
  /** Lowest price per field for each column, across sellers (for the crowns). */
  lowestByColumn: PriceListPricesByColumn;
  /** (year, colour) columns, oldest year first. */
  columns: PriceColumn[];
  /** The viewer is a verified collaborator: show collaborator prices too. */
  showPartner: boolean;
  /** Price types in use (pricing settings); sorting offers only these. */
  priceFields?: readonly PriceTablePriceField[];
  /** Who is looking: drives the per-seller purchase-request form. */
  viewer: PurchaseRequestViewer;
  /** Cover photo of the car, for the request form's header. */
  carImage?: string | null;
}

type YearOrder = "newest" | "oldest";

/** "آخرین به‌روزرسانی ۱۴۰۵/۰۸/۲۴" under a seller's code. */
function UpdatedAt({ label, className }: { label: string; className?: string }) {
  return (
    <p className={cn("flex items-center gap-1 text-[10px] font-semibold text-panel-muted-2", className)}>
      <History className="h-3 w-3 shrink-0 text-panel-faint" aria-hidden="true" />
      آخرین به‌روزرسانی
      <span className="font-mono tabular-nums text-panel-text-2">{label}</span>
    </p>
  );
}

const headClass = "whitespace-nowrap px-3 py-3.5 text-right text-[11px] font-extrabold uppercase tracking-wider text-panel-muted";

/** Numeric order of two digit-only price strings (mirrors `compareDigitPrices` on the server). */
function compareDigits(a: string, b: string): number {
  if (a.length !== b.length) return a.length - b.length;
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * The value an offer is sorted by: the field in one column, or the seller's
 * lowest across the given (visible) columns.
 */
function sortValue(offer: PriceListOffer, key: PriceTablePriceField, column: string | null, columnKeys: string[]): string | null {
  if (column) return offer.byColumn[column]?.[key] ?? null;
  let lowest: string | null = null;
  for (const columnKey of columnKeys) {
    const value = offer.byColumn[columnKey]?.[key];
    if (value && (lowest === null || compareDigits(value, lowest) < 0)) lowest = value;
  }
  return lowest;
}

/**
 * Sort by the chosen price first (blanks last), then by the remaining prices.
 * Across all columns, sellers are grouped by currency first (dollar rows
 * first) so prices in different currencies are never compared; a single
 * column only ever holds one currency.
 */
function sortOffers(
  offers: PriceListOffer[],
  primary: PriceTablePriceField,
  fields: readonly PriceTablePriceField[],
  column: string | null,
  columnKeys: string[]
): PriceListOffer[] {
  const order = [primary, ...fields.filter((key) => key !== primary)];
  return [...offers].sort((a, b) => {
    if (!column && a.currency !== b.currency) return a.currency === "usd" ? -1 : 1;
    for (const key of order) {
      const x = sortValue(a, key, column, columnKeys);
      const y = sortValue(b, key, column, columnKeys);
      if (x === y) continue;
      if (x === null) return 1;
      if (y === null) return -1;
      return compareDigits(x, y);
    }
    return a.sellerCode.localeCompare(b.sellerCode);
  });
}

/**
 * Every seller's prices for one car: one row per seller and one column per
 * (production year, colour). Each cell holds the enabled prices; a seller
 * without prices for that column shows "—". The lowest price of each field
 * within a column gets a crown.
 *
 * Controls: a year filter (only that year's columns, and only sellers who
 * priced it), the column order (newest or oldest year first), the price type
 * to sort sellers by (when more than one is enabled), and sorting within one
 * column by clicking its header. Each seller shows their code and the
 * (Jalali) date they last updated their prices.
 *
 * Desktop: table with the seller column pinned and the price columns
 * scrolling horizontally. Below `lg`: cards with a scrollable strip.
 */
export function CarOffersView({
  car,
  offers,
  lowestByColumn,
  columns,
  showPartner,
  priceFields = ALL_PRICE_FIELD_KEYS,
  viewer,
  carImage = null,
}: CarOffersViewProps) {
  const fields = useMemo(() => priceFieldsFor(priceFields), [priceFields]);
  const fieldKeys = useMemo(() => fields.map((field) => field.key), [fields]);
  const [sortBy, setSortBy] = useState<PriceTablePriceField>(fieldKeys[0] ?? "instantPrice");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [yearOrder, setYearOrder] = useState<YearOrder>("newest");

  const years = useMemo(() => {
    const unique = Array.from(new Set(columns.map((column) => column.year)));
    return unique.sort((a, b) => (yearOrder === "newest" ? Number(b) - Number(a) : Number(a) - Number(b)));
  }, [columns, yearOrder]);

  /** Columns shown: the chosen year only (or all), ordered by year as chosen; colour order kept within a year. */
  const visibleColumns = useMemo(() => {
    const filtered = year ? columns.filter((column) => column.year === year) : columns;
    return [...filtered].sort((a, b) => (yearOrder === "newest" ? Number(b.year) - Number(a.year) : Number(a.year) - Number(b.year)));
  }, [columns, year, yearOrder]);
  const visibleKeys = useMemo(() => visibleColumns.map((column) => column.key), [visibleColumns]);

  const visibleOffers = useMemo(
    () => (year ? offers.filter((offer) => visibleKeys.some((key) => offer.byColumn[key])) : offers),
    [offers, year, visibleKeys]
  );
  const activeSortColumn = sortColumn && visibleKeys.includes(sortColumn) ? sortColumn : null;
  const sorted = useMemo(
    () => sortOffers(visibleOffers, sortBy, fieldKeys, activeSortColumn, visibleKeys),
    [visibleOffers, sortBy, fieldKeys, activeSortColumn, visibleKeys]
  );
  const sortedColumn = columns.find((column) => column.key === activeSortColumn) ?? null;

  const bestFor = (offer: PriceListOffer, key: string) => {
    const prices = offer.byColumn[key];
    const lowest = lowestByColumn[key];
    if (!prices || !lowest) return undefined;
    return Object.fromEntries(
      PRICE_TABLE_ALL_PRICE_KEYS.map((key) => [key, prices[key] !== null && prices[key] === lowest[key]])
    ) as Record<PriceTableAnyPriceField, boolean>;
  };

  /** Purchase-request target for one seller (never for the viewer's own prices). */
  const requestTarget = (offer: PriceListOffer): PurchaseRequestTarget | null =>
    offer.isMine || !offer.sellerCode
      ? null
      : {
          source: "price_list",
          carId: car.id,
          carLabel: `${car.brandName} ${car.name} - مدل ${toPersianDigits(car.model)}`,
          sellerCode: offer.sellerCode,
          imageUrl: carImage,
          tiers: columns
            .filter((column) => offer.byColumn[column.key])
            .map((column) => ({
              key: column.key,
              label: `${column.year} · ${column.colorName} · ${CURRENCY_LABELS[column.currency]}`,
              colorCode: column.colorCode,
            })),
        };

  const toggleSortColumn = (key: string) => setSortColumn((current) => (current === key ? null : key));

  const chipClass = (active: boolean) =>
    cn(
      "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-[11px] font-bold transition-all",
      active
        ? "border-[#FF6A00]/50 bg-gradient-to-l from-[#FF6A00]/20 to-[#FF6A00]/5 text-panel-text"
        : "border-panel-line/[0.1] bg-panel-surface text-panel-muted hover:border-panel-line/25 hover:text-panel-text"
    );

  return (
    <div className="space-y-4">
      {/* Heading + controls */}
      <div className="admin-animate-in space-y-3" style={{ animationDelay: "120ms" }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-black text-panel-text">
            قیمت فروشندگان
            <span className="ms-2 rounded-lg bg-panel-line/[0.06] px-2 py-0.5 text-[11px] font-bold text-panel-muted">
              {toPersianDigits(visibleOffers.length)} فروشنده · {toPersianDigits(visibleColumns.length)} سال و رنگ
            </span>
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {fields.length > 1 && (
              <>
                <span className="hidden items-center gap-1 text-[11px] font-bold text-panel-muted sm:inline-flex">
                  <ArrowDownWideNarrow className="h-4 w-4" />
                  مرتب‌سازی
                </span>
                <div role="radiogroup" aria-label="مرتب‌سازی بر اساس" className="flex flex-1 rounded-xl border border-panel-line/[0.1] bg-panel-surface p-1 sm:flex-none">
                  {fields.map((field) => (
                    <button
                      key={field.key}
                      type="button"
                      role="radio"
                      aria-checked={sortBy === field.key}
                      onClick={() => setSortBy(field.key)}
                      className={cn(
                        "flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-[11px] font-bold transition-all sm:flex-none",
                        sortBy === field.key
                          ? "bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] text-[#07090C] shadow-orange-subtle"
                          : "text-panel-muted hover:text-panel-text"
                      )}
                    >
                      {field.label}
                    </button>
                  ))}
                </div>
              </>
            )}
            {sortedColumn && (
              <button
                type="button"
                onClick={() => setSortColumn(null)}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-3 text-[11px] font-bold text-panel-accent"
              >
                فقط {toPersianDigits(sortedColumn.year)} · {sortedColumn.colorName}
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Year filter + year order */}
        <div className="flex items-center gap-2">
          <div
            role="radiogroup"
            aria-label="فیلتر سال ساخت"
            className="-mx-1 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <button type="button" role="radio" aria-checked={year === null} onClick={() => setYear(null)} className={chipClass(year === null)}>
              <CalendarDays className="h-3.5 w-3.5 text-panel-accent" />
              همه سال‌ها
            </button>
            {years.map((item) => (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={year === item}
                onClick={() => setYear((current) => (current === item ? null : item))}
                className={cn(chipClass(year === item), "font-mono")}
              >
                {toPersianDigits(item)}
              </button>
            ))}
          </div>
          {years.length > 1 && (
            <button
              type="button"
              onClick={() => setYearOrder((order) => (order === "newest" ? "oldest" : "newest"))}
              title="ترتیب ستون‌ها بر اساس سال ساخت"
              className="mb-1 inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-panel-line/[0.1] bg-panel-surface px-3 text-[11px] font-bold text-panel-muted transition-colors hover:text-panel-text"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-panel-accent" />
              {yearOrder === "newest" ? "جدیدترین سال اول" : "قدیمی‌ترین سال اول"}
            </button>
          )}
        </div>
      </div>

      {/* Desktop table */}
      <HorizontalScroller
        className="admin-animate-in hidden lg:block"
        viewportClassName="rounded-3xl border border-panel-line/[0.1] bg-panel-surface shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]"
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-panel-line/[0.1] bg-panel-surface-2">
              <th scope="col" className={cn(headClass, "sticky right-0 z-20 min-w-[220px] bg-panel-surface-2 ps-5 shadow-[-10px_0_14px_-12px_rgba(0,0,0,0.6)]")}>
                کد فروشنده
              </th>
              <th scope="col" className={headClass}>نام خودرو</th>
              <th scope="col" className={headClass}>برند</th>
              <th scope="col" className={headClass}>مدل</th>
              {visibleColumns.map((column, index) => {
                const active = activeSortColumn === column.key;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={active ? "ascending" : undefined}
                    className={cn(
                      headClass,
                      "min-w-[168px] border-s border-panel-line/[0.08] p-0",
                      active ? "bg-[#FF6A00]/[0.08]" : index % 2 === 1 && "bg-panel-line/[0.025]"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSortColumn(column.key)}
                      title="مرتب‌سازی بر اساس قیمت‌های این سال و رنگ"
                      className={cn(
                        "flex w-full items-center justify-between gap-2 px-3 py-3.5 transition-colors hover:text-panel-text",
                        active && "text-panel-accent"
                      )}
                    >
                      <ColumnHeading column={column} active />
                      <ArrowDownWideNarrow className={cn("h-3.5 w-3.5", active ? "text-panel-accent" : "text-panel-faint")} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-panel-line/[0.06]">
            {sorted.map((offer, index) => {
              const mine = offer.isMine;
              return (
                <tr key={offer.sellerCode || index} className={cn("group transition-colors", mine ? "bg-[#FF6A00]/[0.05]" : "hover:bg-panel-line/[0.03]")}>
                  <td
                    className={cn(
                      "sticky right-0 z-10 py-3 pe-3 ps-5 shadow-[-10px_0_14px_-12px_rgba(0,0,0,0.6)] transition-colors",
                      mine ? "bg-panel-surface-2" : "bg-panel-surface group-hover:bg-panel-surface-2"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 shrink-0 text-center font-mono text-[11px] text-panel-faint">{toPersianDigits(index + 1)}</span>
                      <div className="min-w-0 flex-1">
                        <SellerCodeBadge code={offer.sellerCode} size="sm" mine={mine} />
                        <UpdatedAt label={offer.updatedAtLabel} className="mt-1 ps-1" />
                        {requestTarget(offer) && (
                          <PurchaseRequestButton target={requestTarget(offer)!} viewer={viewer} size="sm" className="mt-2 w-full" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-[13px] font-bold text-panel-text-2">{car.name}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap text-[13px] text-panel-text-2">
                      <BrandLogo name={car.brandName} image={car.brandImage} className="h-6 w-6 rounded-lg p-0.5" />
                      {car.brandName}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-panel-text-2">{toPersianDigits(car.model)}</td>
                  {visibleColumns.map((column, columnIndex) => (
                    <td
                      key={column.key}
                      className={cn(
                        "border-s border-panel-line/[0.06] px-3 py-3",
                        activeSortColumn === column.key ? "bg-[#FF6A00]/[0.035]" : columnIndex % 2 === 1 && "bg-panel-line/[0.02]"
                      )}
                    >
                      <YearPrices
                        prices={offer.byColumn[column.key]}
                        currency={column.currency}
                        best={bestFor(offer, column.key)}
                        highlight={sortBy}
                        showPartner={showPartner}
                        fields={fieldKeys}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </HorizontalScroller>

      {/* Mobile / tablet cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
        {sorted.map((offer, index) => {
          const mine = offer.isMine;
          return (
            <article
              key={offer.sellerCode || index}
              className={cn(
                "panel-card-in overflow-hidden rounded-3xl border bg-panel-surface",
                mine ? "border-[#FF6A00]/40" : "border-panel-line/[0.1]"
              )}
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            >
              <div className="border-b border-panel-line/[0.08] px-4 py-3">
                <SellerCodeBadge code={offer.sellerCode} mine={mine} />
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <UpdatedAt label={offer.updatedAtLabel} className="ps-1" />
                  {requestTarget(offer) && <PurchaseRequestButton target={requestTarget(offer)!} viewer={viewer} size="sm" className="shrink-0" />}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 px-4 pt-3 text-[11px]">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-panel-line/[0.06] py-1 pe-2 ps-1 font-semibold text-panel-text-2">
                  <BrandLogo name={car.brandName} image={car.brandImage} className="h-5 w-5 rounded-md p-0.5" />
                  {car.brandName} · {car.name}
                </span>
                <span className="rounded-lg bg-panel-line/[0.06] px-2 py-1 font-semibold text-panel-text-2">مدل {toPersianDigits(car.model)}</span>
              </div>

              <HorizontalScroller variant="overlay" className="mt-3" viewportClassName="px-4 pb-1">
                <div className="flex w-max gap-2 pb-3">
                  {visibleColumns.map((column) => {
                    const priced = Boolean(offer.byColumn[column.key]);
                    return (
                      <div
                        key={column.key}
                        className={cn(
                          "w-[150px] shrink-0 rounded-2xl border px-2.5 py-2",
                          priced ? "border-panel-line/[0.08] bg-panel-bg/60" : "border-dashed border-panel-line/[0.1]"
                        )}
                      >
                        <p className="mb-1.5 border-b border-panel-line/[0.06] pb-1.5 text-[11px] font-bold text-panel-muted">
                          <ColumnHeading column={column} active={priced} />
                        </p>
                        <YearPrices
                          prices={offer.byColumn[column.key]}
                          currency={column.currency}
                          best={bestFor(offer, column.key)}
                          highlight={sortBy}
                          showPartner={showPartner}
                          fields={fieldKeys}
                        />
                      </div>
                    );
                  })}
                </div>
              </HorizontalScroller>
            </article>
          );
        })}
      </div>
    </div>
  );
}
