import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/user-auth";
import { getAdDetail } from "@/lib/panel-search";
import { getConversionRates } from "@/lib/market-rates";
import { toPersianDigits } from "@/lib/utils";
import type { UsdRateInfo } from "@/lib/currency";
import { AdDetailView } from "@/components/panel/ads/AdDetailView";

export const metadata: Metadata = {
  title: "جزئیات آگهی | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Dedicated page of one sale ad. */
export default async function AdDetailPage({ params }: { params: { id: string } }) {
  const user = await requireUser();

  // Same cached open-market quote as the dashboard; never a fresh request per view.
  const [ad, rates] = await Promise.all([
    getAdDetail(params.id, { id: user.id, isPartner: user.isPartner }),
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

  return <AdDetailView ad={ad} usdRate={usdRate} />;
}
