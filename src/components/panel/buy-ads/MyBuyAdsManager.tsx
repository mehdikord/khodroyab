"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, ShoppingBag, Zap } from "lucide-react";

import type { BuyAdRecord } from "@/lib/buy-ads-shared";
import { MyBuyAdCard } from "@/components/panel/buy-ads/MyBuyAdCard";
import { cn, toPersianDigits } from "@/lib/utils";

interface MyBuyAdsManagerProps {
  ads: BuyAdRecord[];
  /** Verified collaborator: may create and change buy ads. */
  canPublish: boolean;
}

type StateFilter = "all" | "active" | "paused";

const FILTERS: { key: StateFilter; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "active", label: "فعال" },
  { key: "paused", label: "متوقف‌شده" },
];

function NewBuyAdButton({ className }: { className?: string }) {
  return (
    <Link
      href="/panel/ads/buy/new"
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] shadow-orange-subtle transition-all hover:brightness-110 active:scale-[0.98]",
        className
      )}
    >
      <Plus className="h-4 w-4" />
      ثبت آگهی خرید
    </Link>
  );
}

/** "My buy ads": the collaborator's car requests with an active / paused filter. */
export function MyBuyAdsManager({ ads, canPublish }: MyBuyAdsManagerProps) {
  const [filter, setFilter] = useState<StateFilter>("all");

  const counts = useMemo(() => {
    const active = ads.filter((ad) => ad.isActive).length;
    return { all: ads.length, active, paused: ads.length - active } satisfies Record<StateFilter, number>;
  }, [ads]);

  const visibleAds = useMemo(() => {
    if (filter === "active") return ads.filter((ad) => ad.isActive);
    if (filter === "paused") return ads.filter((ad) => !ad.isActive);
    return ads;
  }, [ads, filter]);

  return (
    <div className="space-y-5">
      <div className="admin-animate-in flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-panel-text sm:text-2xl">آگهی‌های خرید من</h1>
          <p className="mt-1 text-xs text-panel-muted sm:text-sm">
            {ads.length === 0
              ? "خودرویی را که دنبالش هستید ثبت کنید تا فروشندگان شما را پیدا کنند."
              : `${toPersianDigits(ads.length)} آگهی خرید · ${toPersianDigits(counts.active)} فعال در جستجو`}
          </p>
        </div>
        {canPublish && <NewBuyAdButton />}
      </div>

      {ads.length > 0 && (
        <div className="panel-no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {FILTERS.map((item) => {
            const active = filter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                aria-pressed={active}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-bold transition-colors",
                  active
                    ? "border-[#FF6A00]/50 bg-[#FF6A00]/15 text-panel-accent"
                    : "border-panel-line/[0.1] bg-panel-surface text-panel-muted hover:border-panel-line/20 hover:text-panel-text"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 font-mono text-[10px]",
                    active ? "bg-[#FF6A00]/20 text-panel-accent-soft" : "bg-panel-line/[0.05] text-panel-muted-2"
                  )}
                >
                  {toPersianDigits(counts[item.key])}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {ads.length === 0 ? (
        <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-72 bg-orange-flare opacity-70" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-panel-accent shadow-orange-subtle">
              <ShoppingBag className="h-7 w-7" />
            </span>
            <p className="mt-5 text-base font-extrabold text-panel-text">دنبال چه خودرویی هستید؟</p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-panel-muted-2">
              خودرو، سال ساخت، رنگ و کارکرد مورد نظرتان را ثبت کنید. آگهی خرید بدون نیاز به تایید مدیر، بلافاصله در جستجوی همه کاربران
              نمایش داده می‌شود.
            </p>
            <ul className="mx-auto mt-5 flex max-w-md flex-wrap justify-center gap-2 text-[11px] font-bold text-panel-text-2">
              {["انتشار فوری", "بدون قیمت‌گذاری", "فقط کد کاربری شما نمایش داده می‌شود"].map((item) => (
                <li key={item} className="inline-flex items-center gap-1 rounded-full border border-panel-line/[0.1] bg-panel-surface px-3 py-1">
                  <Zap className="h-3 w-3 text-panel-accent" />
                  {item}
                </li>
              ))}
            </ul>
            {canPublish && <NewBuyAdButton className="mt-6" />}
          </div>
        </div>
      ) : visibleAds.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-panel-line/[0.12] px-6 py-10 text-center">
          <p className="text-sm font-bold text-panel-muted">آگهی خریدی با این وضعیت ندارید</p>
          <button type="button" onClick={() => setFilter("all")} className="mt-3 text-xs font-bold text-panel-accent hover:underline">
            نمایش همه آگهی‌ها
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visibleAds.map((ad, index) => (
            <MyBuyAdCard key={ad.id} ad={ad} canEdit={canPublish} delay={Math.min(index, 6) * 45} />
          ))}
        </div>
      )}

      {counts.active > 0 && (
        <p className="text-center text-[11px] text-panel-faint">
          <Link href="/panel/search/buy" className="inline-flex items-center gap-1 font-bold text-panel-muted hover:text-panel-accent">
            <Search className="h-3 w-3" />
            مشاهده آگهی‌های خرید در جستجو
          </Link>
        </p>
      )}
    </div>
  );
}
