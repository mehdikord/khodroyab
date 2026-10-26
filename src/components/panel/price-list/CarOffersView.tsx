"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownWideNarrow, ChevronLeft } from "lucide-react";

import type { PriceListCarInfo, PriceListOffer, PriceListPrices } from "@/lib/price-list";
import { PRICE_TABLE_PRICE_FIELDS, type PriceTablePriceField } from "@/lib/price-table-shared";
import { cn, toPersianDigits } from "@/lib/utils";
import { BrandLogo, ColorLabel, PriceTag, UserAvatar } from "@/components/panel/price-list/price-list-ui";

interface CarOffersViewProps {
  car: PriceListCarInfo;
  offers: PriceListOffer[];
  lowest: PriceListPrices;
  /** Signed-in user, so their own row can be marked. */
  currentUserId: string;
}

const headClass = "whitespace-nowrap px-3 py-3.5 text-right text-[11px] font-extrabold uppercase tracking-wider text-panel-muted";

/** Numeric order of two digit-only price strings (mirrors `compareDigitPrices` on the server). */
function compareDigits(a: string, b: string): number {
  if (a.length !== b.length) return a.length - b.length;
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Sort by the chosen price first (blanks last), then by the remaining prices. */
function sortOffers(offers: PriceListOffer[], primary: PriceTablePriceField): PriceListOffer[] {
  const order = [primary, ...PRICE_TABLE_PRICE_FIELDS.map((f) => f.key).filter((key) => key !== primary)];
  return [...offers].sort((a, b) => {
    for (const key of order) {
      const x = a[key];
      const y = b[key];
      if (x === y) continue;
      if (x === null) return 1;
      if (y === null) return -1;
      return compareDigits(x, y);
    }
    return 0;
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

/**
 * Every seller's prices for one car. Sortable by any of the three prices; the
 * lowest price of each column is highlighted. Desktop: table; below `lg`: cards.
 */
export function CarOffersView({ car, offers, lowest, currentUserId }: CarOffersViewProps) {
  const [sortBy, setSortBy] = useState<PriceTablePriceField>("priceUsd");
  const sorted = useMemo(() => sortOffers(offers, sortBy), [offers, sortBy]);

  const isBest = (offer: PriceListOffer, key: PriceTablePriceField) =>
    offer[key] !== null && offer[key] === lowest[key];

  return (
    <div className="space-y-4">
      {/* Sort control */}
      <div className="admin-animate-in flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style={{ animationDelay: "120ms" }}>
        <h2 className="text-base font-black text-panel-text">
          قیمت فروشندگان
          <span className="ms-2 rounded-lg bg-panel-line/[0.06] px-2 py-0.5 text-[11px] font-bold text-panel-muted">
            {toPersianDigits(offers.length)} فروشنده
          </span>
        </h2>
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Desktop table */}
      <div className="admin-animate-in hidden overflow-hidden rounded-3xl border border-panel-line/[0.1] bg-panel-surface shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] lg:block" style={{ animationDelay: "160ms" }}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-panel-line/[0.1] bg-panel-surface-2/70">
              <th scope="col" className={cn(headClass, "ps-5")}>نام کاربر</th>
              <th scope="col" className={headClass}>نام خودرو</th>
              <th scope="col" className={headClass}>برند</th>
              <th scope="col" className={headClass}>مدل</th>
              <th scope="col" className={headClass}>رنگ</th>
              <th scope="col" className={headClass}>سال ساخت</th>
              {PRICE_TABLE_PRICE_FIELDS.map((field) => (
                <th key={field.key} scope="col" className={cn(headClass, sortBy === field.key && "text-panel-accent")}>
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-panel-line/[0.06]">
            {sorted.map((offer, index) => {
              const mine = offer.userId === currentUserId;
              return (
                <tr key={offer.userId} className={cn("transition-colors", mine ? "bg-[#FF6A00]/[0.05]" : "hover:bg-panel-line/[0.03]")}>
                  <td className="py-3 pe-3 ps-5">
                    <Link href={sellerHref(offer)} className="group/seller flex items-center gap-2.5">
                      <span className="w-5 shrink-0 text-center font-mono text-[11px] text-panel-faint">{toPersianDigits(index + 1)}</span>
                      <UserAvatar name={offer.userName} image={offer.userImage} className="transition-transform group-hover/seller:scale-105" />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate text-[13px] font-extrabold text-panel-text transition-colors group-hover/seller:text-panel-accent">
                            {offer.userName}
                          </span>
                          {mine && <YouBadge />}
                        </span>
                        <span className="text-[10px] text-panel-faint">مشاهده پروفایل</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-[13px] font-bold text-panel-text-2">{car.name}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap text-[13px] text-panel-text-2">
                      <BrandLogo name={car.brandName} image={car.brandImage} className="h-6 w-6 rounded-lg p-0.5" />
                      {car.brandName}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-panel-text-2">{toPersianDigits(car.model)}</td>
                  <td className="px-3 py-3 text-[13px]">
                    <ColorLabel name={offer.colorName} code={offer.colorCode} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-panel-text-2">{toPersianDigits(car.year)}</td>
                  {PRICE_TABLE_PRICE_FIELDS.map((field) => (
                    <td key={field.key} className="px-3 py-3">
                      <PriceTag price={offer[field.key]} best={isBest(offer, field.key)} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
                    <span className="truncate text-sm font-black text-panel-text">{offer.userName}</span>
                    {mine && <YouBadge />}
                  </span>
                  <span className="text-[10px] text-panel-faint">مشاهده پروفایل فروشنده</span>
                </span>
                <ChevronLeft className="h-5 w-5 text-panel-faint transition-all group-hover:-translate-x-1 group-hover:text-panel-accent" />
              </Link>

              <div className="space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-panel-line/[0.06] py-1 pe-2 ps-1 font-semibold text-panel-text-2">
                    <BrandLogo name={car.brandName} image={car.brandImage} className="h-5 w-5 rounded-md p-0.5" />
                    {car.brandName} · {car.name}
                  </span>
                  <span className="rounded-lg bg-panel-line/[0.06] px-2 py-1 font-semibold text-panel-text-2">مدل {toPersianDigits(car.model)}</span>
                  <span className="rounded-lg bg-panel-line/[0.06] px-2 py-1 font-semibold text-panel-text-2">سال {toPersianDigits(car.year)}</span>
                  <span className="rounded-lg bg-panel-line/[0.06] px-2 py-1 font-semibold">
                    <ColorLabel name={offer.colorName} code={offer.colorCode} />
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {PRICE_TABLE_PRICE_FIELDS.map((field) => (
                    <div
                      key={field.key}
                      className={cn(
                        "rounded-2xl border px-2 py-2.5 text-center",
                        sortBy === field.key ? "border-[#FF6A00]/30 bg-[#FF6A00]/[0.04]" : "border-panel-line/[0.08] bg-panel-bg/60"
                      )}
                    >
                      <p className="text-[10px] font-bold text-panel-muted">{field.label}</p>
                      <div className="mt-1.5 flex justify-center">
                        <PriceTag price={offer[field.key]} best={isBest(offer, field.key)} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
