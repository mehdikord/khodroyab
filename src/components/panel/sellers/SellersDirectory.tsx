"use client";

import React, { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, ChevronLeft, Fingerprint, Search, SearchX, Store, X } from "lucide-react";

import { groupSellerCode, SellerMonogram } from "@/components/panel/sellers/seller-ui";
import { cn, toPersianDigits } from "@/lib/utils";

export interface DirectorySeller {
  name: string;
  code: string;
}

/** Persian / Arabic digits → ASCII, spaces removed (for code search). */
function asciiDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

/**
 * The sellers directory: hero with the count and an instant search (name or
 * code), then one card per seller (monogram, name, code) linking to their
 * profile with their ads.
 */
export function SellersDirectory({ sellers }: { sellers: DirectorySeller[] }) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);

  const results = useMemo(() => {
    const text = deferred.trim();
    if (!text) return sellers;
    const digits = asciiDigits(text).replace(/\s+/g, "");
    return sellers.filter((seller) => seller.name.includes(text) || (/^\d+$/.test(digits) && seller.code.includes(digits)));
  }, [sellers, deferred]);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="panel-card-in relative isolate overflow-hidden rounded-[32px] border border-panel-line/[0.1] bg-panel-surface">
        <div className="panel-ambient pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="admin-grid-bg pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-28 end-[-70px] -z-10 h-72 w-72 rounded-full bg-[#FF6A00]/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 start-[-40px] -z-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" aria-hidden="true" />

        <div className="space-y-5 px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-start gap-4">
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#FF6A00]/40 bg-[#FF6A00]/15 text-panel-accent shadow-[0_0_40px_-8px_rgba(255,106,0,0.7)]">
              <Store className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h1 className="text-xl font-black text-panel-text sm:text-2xl">فروشندگان خودرو یاب</h1>
              <p className="mt-1.5 text-xs leading-6 text-panel-muted sm:text-sm">
                فروشندگان همکار و احراز هویت‌شده؛ برای دیدن آگهی‌های هر فروشنده روی کارت او بزنید.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-panel-faint" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="جستجوی نام یا کد فروشنده…"
                aria-label="جستجوی فروشنده"
                className="h-12 w-full rounded-2xl border border-panel-line/[0.12] bg-panel-bg/80 pe-11 ps-11 text-sm text-panel-text outline-none backdrop-blur transition-all placeholder:text-panel-faint hover:border-panel-line/25 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="پاک کردن جستجو"
                  className="absolute end-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-panel-muted hover:bg-panel-line/[0.08] hover:text-panel-text"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <span className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 px-4 text-xs font-bold text-panel-muted backdrop-blur">
              <BadgeCheck className="h-4 w-4 text-panel-success" />
              <span className="font-black text-panel-text">{toPersianDigits(deferred.trim() ? results.length : sellers.length)}</span>
              {deferred.trim() ? `از ${toPersianDigits(sellers.length)} فروشنده` : "فروشنده فعال"}
            </span>
          </div>
        </div>
      </section>

      {/* Cards */}
      {results.length === 0 ? (
        <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
              {sellers.length === 0 ? <Store className="h-7 w-7" /> : <SearchX className="h-7 w-7" />}
            </span>
            <p className="mt-5 text-base font-extrabold text-panel-text">
              {sellers.length === 0 ? "هنوز فروشنده فعالی ثبت نشده است" : "فروشنده‌ای با این نام یا کد پیدا نشد"}
            </p>
            {sellers.length > 0 && <p className="mt-2 text-xs text-panel-muted-2">نام دیگری را امتحان کنید یا کد ۸ رقمی فروشنده را وارد کنید.</p>}
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((seller, index) => (
            <li key={seller.code} className="panel-card-in" style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}>
              <Link
                href={`/panel/sellers/${seller.code}`}
                className={cn(
                  "group relative flex items-center gap-3.5 overflow-hidden rounded-3xl border border-panel-line/[0.08] bg-panel-surface p-3.5 pe-3 transition-all duration-300",
                  "hover:-translate-y-0.5 hover:border-[#FF6A00]/40 hover:shadow-[0_22px_44px_-20px_rgba(0,0,0,0.8),0_0_30px_-10px_rgba(255,106,0,0.45)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 active:scale-[0.99]"
                )}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -start-1/3 w-1/4 skew-x-[-20deg] bg-gradient-to-l from-transparent via-[#FF6A00]/10 to-transparent opacity-0 transition-all duration-700 group-hover:start-[110%] group-hover:opacity-100"
                />
                <SellerMonogram name={seller.name} className="h-14 w-14 text-base" />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 break-words text-sm font-extrabold leading-6 text-panel-text">{seller.name}</span>
                  <span className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-panel-line/[0.08] bg-panel-bg/70 px-2 py-1">
                    <Fingerprint className="h-3.5 w-3.5 text-panel-accent" />
                    <span dir="ltr" className="font-mono text-[12px] font-bold tracking-[0.14em] text-panel-text-2">
                      {toPersianDigits(groupSellerCode(seller.code))}
                    </span>
                  </span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-panel-line/[0.05] text-panel-muted transition-all group-hover:bg-[#FF6A00] group-hover:text-[#07090C]">
                  <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
