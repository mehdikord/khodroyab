import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireCollaborator } from "@/lib/auth/user-auth";
import { getMyBuyAd, listBuyAdCarChoices, listBuyAdColors } from "@/lib/buy-ads";
import { BuyAdForm } from "@/components/panel/buy-ads/BuyAdForm";
import { VerificationRequired } from "@/components/panel/verification/VerificationRequired";

export const metadata: Metadata = {
  title: "ویرایش آگهی خرید | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Edit one of the user's own buy ads; another user's id simply does not exist. */
export default async function EditBuyAdPage({ params }: { params: { id: string } }) {
  const user = await requireCollaborator();
  if (!user.isPartner) return <VerificationRequired feature="ویرایش آگهی خرید" />;

  const ad = await getMyBuyAd(params.id, BigInt(user.id));
  if (!ad) notFound();

  const [cars, colors] = await Promise.all([listBuyAdCarChoices(), listBuyAdColors()]);
  return <BuyAdForm mode="edit" ad={ad} cars={cars} colors={colors} buyerCode={ad.buyerCode} />;
}
