import React from "react";
import type { Metadata } from "next";

import { requireUser } from "@/lib/auth/user-auth";
import { getMarketRates } from "@/lib/market-rates";
import { CurrencyRates } from "@/components/panel/dashboard/CurrencyRates";

export const metadata: Metadata = {
  title: "داشبورد | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/**
 * Customer dashboard: greeting and live USD/EUR rates in rial (rendered on the
 * server, then refreshed by the client every 30 seconds).
 */
export default async function PanelDashboardPage() {
  const [user, rates] = await Promise.all([requireUser(), getMarketRates()]);
  const firstName = user.name.trim().split(/\s+/)[0] || user.name;

  return (
    <div className="space-y-6">
      <div className="admin-animate-in">
        <h1 className="text-xl font-black text-panel-text sm:text-2xl">سلام، {firstName} 👋</h1>
        <p className="mt-1 text-xs text-panel-muted sm:text-sm">به پنل کاربری خودرو یاب خوش آمدید.</p>
      </div>

      <CurrencyRates initialRates={rates} />
    </div>
  );
}
