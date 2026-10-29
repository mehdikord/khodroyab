"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownWideNarrow, Building2, ChevronLeft, X } from "lucide-react";

import type { PriceListCarInfo, PriceListOffer, PriceListPricesByColumn } from "@/lib/price-list";
import { PRICE_TABLE_PRICE_FIELDS, type PriceColumn, type PriceTablePriceField } from "@/lib/price-table-shared";
import { cn, toPersianDigits } from "@/lib/utils";
import { BrandLogo, ColumnHeading, UserAvatar, YearPrices } from "@/components/panel/price-list/price-list-ui";
import { HorizontalScroller } from "@/components/panel/price-list/HorizontalScroller";

interface CarOffersViewProps {
  car: PriceListCarInfo;
  /** One entry per seller, with all of their (year, colour) tiers. */
  offers: PriceListOffer[];
  /** Lowest price per field for each column, across sellers (for the crowns). */
  lowestByColumn: PriceListPricesByColumn;
  /** (year, colour) columns, oldest year first. */
  columns: PriceColumn[];
  /** Signed-in user, so their own row can be marked. */
  currentUserId: string;
}

const headClass = "whitespace-nowrap px-3 py-3.5 text-right text-[11px] font-extrabold uppercase tracking-wider text-panel-muted";

/** Numeric order of two digit-only price strings (mirrors `compareDigitPrices` on the server). */
function compareDigits(a: string, b: string): number {
  if (a.length !== b.length) return a.length - b.length;
  return a < b ? -1 : a > b ? 1 : 0;
}

/** The value an offer is sorted by: the field in one column, or the seller's lowest across all columns. */
function sortValue(offer: PriceListOffer, key: PriceTablePriceField, column: string | null): string | null {
  if (column) return offer.byColumn[column]?.[key] ?? null;
  let lowest: string | null = null;
  for (const prices of Object.values(offer.byColumn)) {
    const value = prices[key];
    if (value && (lowest === null || compareDigits(value, lowest) < 0)) lowest = value;
  }
  return lowest;
}

/** Sort by the chosen price first (blanks last), then by the remaining prices. */
function sortOffers(offers: PriceListOffer[], primary: PriceTablePriceField, column: string | null): PriceListOffer[] {
  const order = [primary, ...PRICE_TABLE_PRICE_FIELDS.map((f) => f.key).filter((key) => key !== primary)];
  return [...offers].sort((a, b) => {
    for (const key of order) {
      const x = sortValue(a, key, column);
      const y = sortValue(b, key, column);
      if (x === y) continue;
      if (x === null) return 1;
      if (y === null) return -1;
      return compareDigits(x, y);
    }
    return a.userName.localeCompare(b.userName, "fa");
  });
}

function sellerHref(offer: PriceListOffer): string {
  return `/panel/sellers/${offer.userId}`;
}

function YouBadge() {
  return (
    <span className="rounded-md border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-1.5 py-0.5 text-[9px] font-black text-panel-accent">
      شما
    </span>
  );
}

function CompanyIcon() {
  return <Building2 className="h-3.5 w-3.5 shrink-0 text-panel-accent" aria-label="مجموعه" />;
}

/**
 * Every seller's prices for one car: one row per seller and one column per
 * (production year, colour), oldest year first. Each cell holds the raw,
 * clearance and instant price; a seller without prices for that column shows
 * "—". The lowest price of each field within a column gets a crown. Sortable
 * by any field, across all columns or (by clicking a column header) within one.
 *
 * Desktop: table with the seller column pinned and the price columns
 * scrolling horizontally. Below `lg`: cards with a scrollable strip.
 */
export function CarOffersView({ car, offers, lowestByColumn, columns, currentUserId }: CarOffersViewProps) {
  const [sortBy, setSortBy] = useState<PriceTablePriceField>("priceUsd");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const sorted = useMemo(() => sortOffers(offers, sortBy, sortColumn), [offers, sortBy, sortColumn]);
  const sortedColumn = columns.find((column) => column.key === sortColumn) ?? null;

  const bestFor = (offer: PriceListOffer, key: string) => {
    const prices = offer.byColumn[key];
    const lowest = lowestByColumn[key];
    if (!prices || !lowest) return undefined;
    return Object.fromEntries(
      PRICE_TABLE_PRICE_FIELDS.map(({ key }) => [key, prices[key] !== null && prices[key] === lowest[key]])
    ) as Record<PriceTablePriceField, boolean>;
  };

  const toggleSortColumn = (key: string) => setSortColumn((current) => (current === key ? null : key));

  return (
    <div className="space-y-4">
      {/* Sort control */}
      <div className="admin-animate-in flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style={{ animationDelay: "120ms" }}>
        <h2 className="text-base font-black text-panel-text">
          قیمت فروشندگان
          <span className="ms-2 rounded-lg bg-panel-line/[0.06] px-2 py-0.5 text-[11px] font-bold text-panel-muted">
            {toPersianDigits(offers.length)} فروشنده · {toPersianDigits(columns.length)} سال و رنگ
          </span>
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden items-center gap-1 text-[11px] font-bold text-panel-muted sm:inline-flex">
            <ArrowDownWideNarrow className="h-4 w-4" />
            مرتب‌سازی
          </span>
          <div role="radiogroup" aria-label="مرتب‌سازی بر اساس" className="flex flex-1 rounded-xl border border-panel-line/[0.1] bg-panel-surface p-1 sm:flex-none">
            {PRICE_TABLE_PRICE_FIELDS.map((field) => (
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

      {/* Desktop table */}
      <HorizontalScroller
        className="admin-animate-in hidden lg:block"
        viewportClassName="rounded-3xl border border-panel-line/[0.1] bg-panel-surface shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]"
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-panel-line/[0.1] bg-panel-surface-2">
              <th scope="col" className={cn(headClass, "sticky right-0 z-20 min-w-[220px] bg-panel-surface-2 ps-5 shadow-[-10px_0_14px_-12px_rgba(0,0,0,0.6)]")}>
                نام کاربر
              </th>
              <th scope="col" className={headClass}>نام خودرو</th>
              <th scope="col" className={headClass}>برند</th>
              <th scope="col" className={headClass}>مدل</th>
              {columns.map((column, index) => {
                const active = sortColumn === column.key;
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
              const mine = offer.userId === currentUserId;
              return (
                <tr key={offer.userId} className={cn("group transition-colors", mine ? "bg-[#FF6A00]/[0.05]" : "hover:bg-panel-line/[0.03]")}>
                  <td
                    className={cn(
                      "sticky right-0 z-10 py-3 pe-3 ps-5 shadow-[-10px_0_14px_-12px_rgba(0,0,0,0.6)] transition-colors",
                      mine ? "bg-panel-surface-2" : "bg-panel-surface group-hover:bg-panel-surface-2"
                    )}
                  >
                    <Link href={sellerHref(offer)} className="group/seller flex items-center gap-2.5">
                      <span className="w-5 shrink-0 text-center font-mono text-[11px] text-panel-faint">{toPersianDigits(index + 1)}</span>
                      <UserAvatar name={offer.userName} image={offer.userImage} className="transition-transform group-hover/seller:scale-105" />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5">
                          {offer.isCompany && <CompanyIcon />}
                          <span className="truncate text-[13px] font-extrabold text-panel-text transition-colors group-hover/seller:text-panel-accent">
                            {offer.userName}
                          </span>
                          {mine && <YouBadge />}
                        </span>
                        <span className="text-[10px] text-panel-faint">مشاهده پروفایل</span>
                      </span>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-[13px] font-bold text-panel-text-2">{car.name}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap text-[13px] text-panel-text-2">
                      <BrandLogo name={car.brandName} image={car.brandImage} className="h-6 w-6 rounded-lg p-0.5" />
                      {car.brandName}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-panel-text-2">{toPersianDigits(car.model)}</td>
                  {columns.map((column, columnIndex) => (
                    <td
                      key={column.key}
                      className={cn(
                        "border-s border-panel-line/[0.06] px-3 py-3",
                        sortColumn === column.key ? "bg-[#FF6A00]/[0.035]" : columnIndex % 2 === 1 && "bg-panel-line/[0.02]"
                      )}
                    >
                      <YearPrices prices={offer.byColumn[column.key]} best={bestFor(offer, column.key)} highlight={sortBy} />
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
          const mine = offer.userId === currentUserId;
          return (
            <article
              key={offer.userId}
              className={cn(
                "panel-card-in overflow-hidden rounded-3xl border bg-panel-surface",
                mine ? "border-[#FF6A00]/40" : "border-panel-line/[0.1]"
              )}
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            >
              <Link
                href={sellerHref(offer)}
                className="group flex items-center gap-3 border-b border-panel-line/[0.08] px-4 py-3 transition-colors hover:bg-[#FF6A00]/[0.05]"
              >
                <UserAvatar name={offer.userName} image={offer.userImage} className="h-11 w-11" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    {offer.isCompany && <CompanyIcon />}
                    <span className="truncate text-sm font-black text-panel-text">{offer.userName}</span>
                    {mine && <YouBadge />}
                  </span>
                  <span className="text-[10px] text-panel-faint">مشاهده پروفایل فروشنده</span>
                </span>
                <ChevronLeft className="h-5 w-5 text-panel-faint transition-all group-hover:-translate-x-1 group-hover:text-panel-accent" />
              </Link>

              <div className="flex flex-wrap items-center gap-1.5 px-4 pt-3 text-[11px]">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-panel-line/[0.06] py-1 pe-2 ps-1 font-semibold text-panel-text-2">
                  <BrandLogo name={car.brandName} image={car.brandImage} className="h-5 w-5 rounded-md p-0.5" />
                  {car.brandName} · {car.name}
                </span>
                <span className="rounded-lg bg-panel-line/[0.06] px-2 py-1 font-semibold text-panel-text-2">مدل {toPersianDigits(car.model)}</span>
              </div>

              <HorizontalScroller variant="overlay" className="mt-3" viewportClassName="px-4 pb-1">
                <div className="flex w-max gap-2 pb-3">
                  {columns.map((column) => {
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
                        <YearPrices prices={offer.byColumn[column.key]} best={bestFor(offer, column.key)} highlight={sortBy} className="min-h-[70px]" />
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
