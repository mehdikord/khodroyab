import React from "react";

import prisma from "@/lib/prisma";
import { requireCollaborator } from "@/lib/auth/user-auth";
import { AdKindTabs } from "@/components/panel/ads/AdKindTabs";

export const dynamic = "force-dynamic";

/** "My ads": the sale / buy tabs stay mounted while the user switches between them. */
export default async function MyAdsTabsLayout({ children }: { children: React.ReactNode }) {
  const user = await requireCollaborator();
  const userId = BigInt(user.id);

  const [saleCount, buyCount] = await Promise.all([
    prisma.userCar.count({ where: { userId } }),
    prisma.userBuyAd.count({ where: { userId } }),
  ]);

  return (
    <div className="space-y-5">
      <AdKindTabs
        layoutKey="my-ads"
        baseHref="/panel/ads"
        saleCount={saleCount}
        buyCount={buyCount}
        saleHint="خودروهایی که برای فروش ثبت کرده‌اید"
        buyHint="خودروهایی که به دنبال خرید آن هستید"
      />
      {children}
    </div>
  );
}
