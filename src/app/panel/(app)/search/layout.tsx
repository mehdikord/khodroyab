import React from "react";

import { getCurrentUser } from "@/lib/auth/user-auth";
import { countPublicSaleAds } from "@/lib/panel-search";
import { countPublicBuyAds } from "@/lib/buy-ads";
import { AdKindTabs } from "@/components/panel/ads/AdKindTabs";

export const dynamic = "force-dynamic";

/**
 * Car search: the sale / buy tabs stay mounted while the user switches between them.
 * Guests only have the sale ads (buy ads are for members), so they get no tabs.
 */
export default async function SearchTabsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) return <>{children}</>;
  const [saleCount, buyCount] = await Promise.all([countPublicSaleAds(), countPublicBuyAds()]);

  return (
    <div className="space-y-5">
      <AdKindTabs
        layoutKey="search"
        baseHref="/panel/search"
        saleCount={saleCount}
        buyCount={buyCount}
        saleHint="خودروهای آماده فروش، تایید‌شده توسط مدیریت"
        buyHint="خودروهایی که همکاران به دنبال خرید آن هستند"
      />
      {children}
    </div>
  );
}
