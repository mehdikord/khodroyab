import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/user-auth";
import { getBuyAdDetail, getBuyAdOffersState } from "@/lib/buy-ads";
import { getSaleAdsForCar } from "@/lib/panel-search";
import { BuyAdDetailView } from "@/components/panel/buy-ads/BuyAdDetailView";

export const metadata: Metadata = {
  title: "جزئیات آگهی خرید | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Dedicated page of one buy ad: its live price offers and the sale ads of the same car. */
export default async function BuyAdDetailPage({ params }: { params: { id: string } }) {
  const user = await requireUser();

  const ad = await getBuyAdDetail(params.id, { id: user.id, isPartner: user.isPartner });
  if (!ad) notFound();

  const viewer = { id: user.id, isPartner: user.isPartner };
  const [matches, offers] = await Promise.all([getSaleAdsForCar(ad.carId, user.isPartner), getBuyAdOffersState(ad.id, viewer)]);
  if (!offers) notFound();
  return <BuyAdDetailView ad={ad} matches={matches} offers={offers} />;
}
