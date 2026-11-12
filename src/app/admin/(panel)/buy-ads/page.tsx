import React from "react";
import type { Metadata } from "next";

import { requireAdminAccess } from "@/lib/auth/guards";
import { getAdminBuyAdCounts, getAdminBuyAdFilterOptions, listAdminBuyAds, parseAdminBuyAdFilters } from "@/lib/admin-buy-ads";
import { BuyAdsManager } from "@/components/admin/buy-ads/BuyAdsManager";

export const metadata: Metadata = {
  title: "آگهی‌های خرید | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function AdminBuyAdsPage({ searchParams }: PageProps) {
  await requireAdminAccess("ads");

  const filters = parseAdminBuyAdFilters(searchParams);
  const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const requestedPage = Math.max(1, Number.parseInt(pageRaw ?? "", 10) || 1);

  const [result, counts, options] = await Promise.all([
    listAdminBuyAds(filters, requestedPage),
    getAdminBuyAdCounts(),
    getAdminBuyAdFilterOptions(),
  ]);

  // Remount the manager when the query changes so its local list state resets.
  const stateKey = JSON.stringify({ ...filters, page: result.page });

  return (
    <BuyAdsManager
      key={stateKey}
      ads={result.ads}
      total={result.total}
      page={result.page}
      pageCount={result.pageCount}
      pageSize={result.pageSize}
      filters={filters}
      counts={counts}
      options={options}
    />
  );
}
