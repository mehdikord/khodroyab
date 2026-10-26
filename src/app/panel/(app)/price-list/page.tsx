import React from "react";
import type { Metadata } from "next";
import { CarFront, ListOrdered, Sparkles, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { requireUser } from "@/lib/auth/user-auth";
import { countPriceListSellers, listPriceListRows } from "@/lib/price-list";
import { toPersianDigits } from "@/lib/utils";
import { LiveClock } from "@/components/panel/search/LiveClock";
import { PriceListBrowser } from "@/components/panel/price-list/PriceListBrowser";

export const metadata: Metadata = {
  title: "لیست قیمت | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

function StatTile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 px-3 py-2.5 backdrop-blur">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF6A00]/10 text-panel-accent">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-lg font-black leading-6 text-panel-text">{toPersianDigits(value)}</span>
        <span className="block truncate text-[10px] font-bold text-panel-muted">{label}</span>
      </span>
    </div>
  );
}

/**
 * Market-wide price list: every car the admin allowed in price tables with the
 * lowest raw, clearance and instant price any seller has entered.
 */
export default async function PanelPriceListPage() {
  await requireUser();

  const [rows, sellerCount] = await Promise.all([listPriceListRows(), countPriceListSellers()]);
  const pricedCount = rows.filter((row) => row.sellerCount > 0).length;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="panel-card-in relative overflow-hidden rounded-[32px] border border-panel-line/[0.1] bg-panel-surface">
        <div className="panel-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-24 end-[-60px] h-64 w-64 rounded-full bg-[#FF6A00]/20 blur-3xl" aria-hidden="true" />

        <div className="relative space-y-5 px-5 py-6 sm:px-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-xl font-black text-panel-text sm:text-2xl">
                <ListOrdered className="h-6 w-6 text-panel-accent" />
                لیست قیمت
              </h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs leading-6 text-panel-muted sm:text-sm">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-panel-accent" />
                کمترین قیمت خام، ترخیصی و فوری هر خودرو از بین جدول قیمت همه فروشندگان
              </p>
            </div>
            <LiveClock className="self-start" />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:max-w-xl sm:gap-3">
            <StatTile icon={CarFront} label="خودرو در لیست" value={rows.length} />
            <StatTile icon={ListOrdered} label="دارای قیمت" value={pricedCount} />
            <StatTile icon={UsersRound} label="فروشنده فعال" value={sellerCount} />
          </div>
        </div>
      </section>

      {rows.length === 0 ? (
        <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
              <ListOrdered className="h-7 w-7" />
            </span>
            <p className="mt-5 text-base font-extrabold text-panel-text">هنوز خودرویی برای لیست قیمت تعریف نشده است</p>
            <p className="mt-2 text-xs text-panel-muted-2">پس از تعیین خودروها توسط مدیر، لیست قیمت اینجا نمایش داده می‌شود.</p>
          </div>
        </div>
      ) : (
        <>
          <PriceListBrowser rows={rows} />
          <p className="text-[11px] leading-6 text-panel-faint">
            همه قیمت‌ها به دلار هستند. هر ستون کمترین قیمتی است که فروشندگان در جدول قیمت خود ثبت کرده‌اند؛ «---» یعنی هنوز کسی آن قیمت
            را ثبت نکرده است. برای دیدن قیمت همه فروشندگان روی هر ردیف بزنید.
          </p>
        </>
      )}
    </div>
  );
}
