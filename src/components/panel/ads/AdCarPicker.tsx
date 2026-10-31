"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Car, ChevronLeft, Search } from "lucide-react";

import { SafeImage } from "@/components/panel/SafeImage";
import { cn, toPersianDigits } from "@/lib/utils";

export interface AdCarChoice {
  id: string;
  name: string;
  model: string;
  brandId: string;
  brandName: string;
  carTypeName: string;
  imageUrl: string | null;
}

function NoImage() {
  return (
    <div className="flex h-full w-full items-center justify-center text-panel-faint">
      <Car className="h-8 w-8" strokeWidth={1.5} />
    </div>
  );
}

/** First step of a new ad: search the catalogue and pick a car. */
export function AdCarPicker({ cars }: { cars: AdCarChoice[] }) {
  const [query, setQuery] = useState("");
  const [brandId, setBrandId] = useState("");

  const brands = useMemo(() => {
    const names = new Map<string, string>();
    for (const car of cars) names.set(car.brandId, car.brandName);
    return Array.from(names.entries()).map(([id, name]) => ({ id, name }));
  }, [cars]);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return cars.filter((car) => {
      if (brandId && car.brandId !== brandId) return false;
      if (!normalized) return true;
      return `${car.brandName} ${car.name} ${car.model} ${car.carTypeName}`.toLowerCase().includes(normalized);
    });
  }, [cars, query, brandId]);

  const chipClass = (active: boolean) =>
    cn(
      "inline-flex h-9 shrink-0 items-center rounded-full border px-3.5 text-xs font-bold transition-colors",
      active
        ? "border-[#FF6A00]/50 bg-[#FF6A00]/15 text-panel-accent"
        : "border-panel-line/[0.1] bg-panel-surface text-panel-muted hover:border-panel-line/20 hover:text-panel-text"
    );

  return (
    <div className="space-y-5">
      <div className="admin-animate-in">
        <Link href="/panel/ads" className="inline-flex items-center gap-1.5 text-xs font-bold text-panel-muted hover:text-panel-text">
          <ArrowRight className="h-3.5 w-3.5" />
          آگهی‌های من
        </Link>
        <h1 className="mt-2 text-xl font-black text-panel-text sm:text-2xl">ثبت آگهی جدید</h1>
        <p className="mt-1 text-xs text-panel-muted sm:text-sm">خودروی مورد نظر را انتخاب کنید تا به مرحله ورود اطلاعات آگهی بروید.</p>
      </div>

      <div className="group relative">
        <Search className="pointer-events-none absolute start-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-panel-faint" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="جستجوی نام خودرو، برند یا مدل…"
          aria-label="جستجوی خودرو"
          className="h-12 w-full rounded-2xl border border-panel-line/[0.1] bg-panel-surface pe-4 ps-11 text-sm text-panel-text outline-none transition-all placeholder:text-panel-faint hover:border-panel-line/20 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
        />
      </div>

      {brands.length > 1 && (
        <div className="panel-no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <button type="button" onClick={() => setBrandId("")} aria-pressed={!brandId} className={chipClass(!brandId)}>
            همه برندها
          </button>
          {brands.map((brand) => (
            <button key={brand.id} type="button" onClick={() => setBrandId(brand.id)} aria-pressed={brandId === brand.id} className={chipClass(brandId === brand.id)}>
              {brand.name}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-panel-line/[0.12] px-6 py-12 text-center">
          <p className="text-sm font-bold text-panel-muted">
            {cars.length === 0 ? "هنوز خودرویی در سامانه تعریف نشده است" : "خودرویی با این مشخصات پیدا نشد"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((car) => (
            <Link
              key={car.id}
              href={`/panel/ads/new/${car.id}`}
              className="group flex items-center gap-3 rounded-2xl border border-panel-line/[0.08] bg-panel-surface p-3 transition-colors hover:border-[#FF6A00]/40"
            >
              <span className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-panel-media">
                {car.imageUrl ? (
                  <SafeImage src={car.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" fallback={<NoImage />} />
                ) : (
                  <NoImage />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-extrabold text-panel-text">
                  {car.brandName} {car.name}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-panel-muted">
                  {car.carTypeName} · مدل {toPersianDigits(car.model)}
                </span>
              </span>
              <ChevronLeft className="h-4 w-4 shrink-0 text-panel-faint transition-all group-hover:-translate-x-0.5 group-hover:text-panel-accent" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
