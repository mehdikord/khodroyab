import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/user-auth";
import { getAdDetail } from "@/lib/panel-search";
import { getConversionRates } from "@/lib/market-rates";
import { toPersianDigits } from "@/lib/utils";
import type { UsdRateInfo } from "@/lib/currency";
import { AdDetailView } from "@/components/panel/ads/AdDetailView";

export const metadata: Metadata = {
  title: "جزئیات آگهی | خودرو یاب",
};

export const dynamic = "force-dynamic";

/**
 * Dedicated page of one sale ad. Guests may open any public ad (public prices
 * only); a signed-in owner also sees their own pending / rejected / inactive ad.
 */
export default async function AdDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();

  // Same cached open-market quote as the dashboard; never a fresh request per view.
  const [ad, rates] = await Promise.all([
    getAdDetail(params.id, { id: user?.id ?? null, isPartner: user?.isPartner ?? false }),
    getConversionRates(),
  ]);
  if (!ad) notFound();

  const usdRate: UsdRateInfo | null = rates?.usd
    ? {
        rialPerUsd: rates.usd.priceRial,
        // "1405/08/20 14:30:12" → "۱۴۰۵/۰۸/۲۰ ۱۴:۳۰"
        updatedAtLabel: rates.usd.updatedAtJalali ? toPersianDigits(rates.usd.updatedAtJalali.slice(0, 16)) : null,
      }
    : null;

  return (
    <AdDetailView
      ad={ad}
      usdRate={usdRate}
      viewer={{ signedIn: Boolean(user), name: user?.name ?? null, phone: user?.phone ?? null }}
    />
  );
}
