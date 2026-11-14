import React from "react";
import type { Metadata } from "next";

import { getCurrentUser } from "@/lib/auth/user-auth";
import { getMarketRates } from "@/lib/market-rates";
import { countPublicSaleAds } from "@/lib/panel-search";
import { CurrencyRates } from "@/components/panel/dashboard/CurrencyRates";
import { SearchAdsCard } from "@/components/panel/dashboard/SearchAdsCard";

export const metadata: Metadata = {
  title: "خودرو یاب — داشبورد",
};

export const dynamic = "force-dynamic";

/**
 * Dashboard and the site's home page, open to everyone: greeting, the card
 * leading to the sale-ad search, and live USD/EUR rates in rial (rendered on
 * the server, then refreshed by the client every 30 seconds).
 */
export default async function PanelDashboardPage() {
  const [user, rates, saleCount] = await Promise.all([getCurrentUser(), getMarketRates(), countPublicSaleAds()]);
  const firstName = user ? user.name.trim().split(/\s+/)[0] || user.name : null;

  return (
    <div className="space-y-6">
      <div className="admin-animate-in">
        {firstName ? (
          <>
            <h1 className="text-xl font-black text-panel-text sm:text-2xl">سلام، {firstName} 👋</h1>
            <p className="mt-1 text-xs text-panel-muted sm:text-sm">به پنل کاربری خودرو یاب خوش آمدید.</p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-black text-panel-text sm:text-2xl">به خودرو یاب خوش آمدید 👋</h1>
            <p className="mt-1 text-xs text-panel-muted sm:text-sm">آگهی‌های فروش خودرو، لیست قیمت و نرخ لحظه‌ای ارز در یک نگاه.</p>
          </>
        )}
      </div>

      <SearchAdsCard saleCount={saleCount} />

      <CurrencyRates initialRates={rates} />
    </div>
  );
}
