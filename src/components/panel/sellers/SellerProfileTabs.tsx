"use client";

import React, { useState } from "react";
import { Megaphone, Table2 } from "lucide-react";

import { cn, toPersianDigits } from "@/lib/utils";

type TabKey = "ads" | "price-table";

interface SellerProfileTabsProps {
  adsCount: number;
  priceTableCount: number;
  /** Rendered content of the "ads" tab (server-rendered, passed through). */
  adsPanel: React.ReactNode;
  /** Rendered content of the "price table" tab. */
  priceTablePanel: React.ReactNode;
}

/** Two-tab switcher on the public seller profile; "ads" is the default tab. */
export function SellerProfileTabs({ adsCount, priceTableCount, adsPanel, priceTablePanel }: SellerProfileTabsProps) {
  const [tab, setTab] = useState<TabKey>("ads");

  const tabs: { key: TabKey; label: string; icon: React.ElementType; count: number }[] = [
    { key: "ads", label: "آگهی‌ها", icon: Megaphone, count: adsCount },
    { key: "price-table", label: "جدول قیمت خودرو", icon: Table2, count: priceTableCount },
  ];

  return (
    <div className="admin-animate-in space-y-4" style={{ animationDelay: "120ms" }}>
      <div role="tablist" aria-label="بخش‌های پروفایل فروشنده" className="flex gap-1 rounded-2xl border border-panel-line/[0.1] bg-panel-surface p-1">
        {tabs.map((item) => {
          const Icon = item.icon;
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              id={`seller-tab-${item.key}`}
              aria-selected={active}
              aria-controls={`seller-panel-${item.key}`}
              onClick={() => setTab(item.key)}
              className={cn(
                "flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-3 text-xs font-extrabold transition-all sm:text-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40",
                active
                  ? "bg-gradient-to-b from-[#FF6A00]/[0.22] to-[#FF6A00]/[0.08] text-panel-text shadow-orange-subtle"
                  : "text-panel-muted hover:bg-panel-line/[0.04] hover:text-panel-text"
              )}
            >
              <Icon className={cn("h-4 w-4", active && "text-panel-accent")} />
              <span>{item.label}</span>
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                  active ? "bg-[#FF6A00]/20 text-panel-accent" : "bg-panel-line/[0.06] text-panel-muted-2"
                )}
              >
                {toPersianDigits(item.count)}
              </span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id="seller-panel-ads" aria-labelledby="seller-tab-ads" hidden={tab !== "ads"}>
        {adsPanel}
      </div>
      <div role="tabpanel" id="seller-panel-price-table" aria-labelledby="seller-tab-price-table" hidden={tab !== "price-table"}>
        {priceTablePanel}
      </div>
    </div>
  );
}
