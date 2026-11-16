import React from "react";
import Link from "next/link";
import { BadgeCheck, ListOrdered, Megaphone } from "lucide-react";

import { SellerCodeBadge } from "@/components/panel/SellerCodeBadge";
import { SellerMonogram } from "@/components/panel/sellers/seller-ui";
import { cn, toPersianDigits } from "@/lib/utils";

interface SellerHeaderProps {
  name: string;
  code: string;
  adCount: number;
  priceListCount: number;
  /** Which section of the seller is open. */
  active: "ads" | "prices";
}

/**
 * Hero of a seller's public pages (profile with ads, price list): monogram,
 * name, verified badge and code, then a two-way switch between the seller's
 * ads and their price list.
 */
export function SellerHeader({ name, code, adCount, priceListCount, active }: SellerHeaderProps) {
  const sections = [
    { key: "ads", label: "آگهی‌ها", count: adCount, icon: Megaphone, href: `/panel/sellers/${code}` },
    { key: "prices", label: "لیست قیمت", count: priceListCount, icon: ListOrdered, href: `/panel/sellers/${code}/price-list` },
  ] as const;

  return (
    <section className="panel-card-in relative isolate overflow-hidden rounded-[32px] border border-panel-line/[0.1] bg-panel-surface">
      <div className="panel-ambient pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="admin-grid-bg pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-24 start-1/2 -z-10 h-64 w-[min(28rem,90vw)] -translate-x-1/2 rounded-full bg-[#FF6A00]/20 blur-3xl" aria-hidden="true" />

      <div className="flex flex-col items-center gap-4 px-5 pb-5 pt-7 text-center sm:flex-row sm:items-center sm:gap-6 sm:px-8 sm:text-start">
        <SellerMonogram name={name} className="h-20 w-20 rounded-[24px] text-2xl shadow-[0_0_60px_-12px_rgba(255,106,0,0.7)] sm:h-24 sm:w-24 sm:text-3xl [&>span]:rounded-[22px]" />
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-extrabold text-panel-success">
            <BadgeCheck className="h-3.5 w-3.5" />
            فروشنده احراز هویت‌شده
          </p>
          <h1 className="mt-2 break-words text-xl font-black leading-8 text-panel-text sm:text-3xl sm:leading-10">{name}</h1>
        </div>
        <SellerCodeBadge code={code} size="lg" className="shrink-0" />
      </div>

      {/* Ads ↔ price list */}
      <nav aria-label="بخش‌های فروشنده" className="grid grid-cols-2 gap-1.5 border-t border-panel-line/[0.08] p-2 sm:px-4">
        {sections.map((section) => {
          const on = section.key === active;
          const Icon = section.icon;
          return (
            <Link
              key={section.key}
              href={section.href}
              aria-current={on ? "page" : undefined}
              className={cn(
                "flex min-h-[3rem] min-w-0 items-center justify-center gap-1.5 rounded-2xl px-2 text-[13px] font-extrabold transition-all sm:gap-2 sm:px-3 sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 active:scale-[0.99]",
                on
                  ? "bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] text-[#07090C] shadow-orange-subtle"
                  : "border border-panel-line/[0.1] bg-panel-bg/60 text-panel-text-2 hover:border-[#FF6A00]/40 hover:text-panel-text"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">{section.label}</span>
              <span className={cn("shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-black", on ? "bg-[#07090C]/15" : "bg-panel-line/[0.08] text-panel-muted")}>
                {toPersianDigits(section.count)}
              </span>
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
