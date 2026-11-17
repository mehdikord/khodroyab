import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireCollaborator } from "@/lib/auth/user-auth";
import { getMyBuyAd, listBuyAdColors } from "@/lib/buy-ads";
import { listBrandChoices } from "@/lib/catalog";
import { carChoiceFromAd } from "@/lib/catalog-shared";
import { BuyAdForm } from "@/components/panel/buy-ads/BuyAdForm";
import { VerificationRequired } from "@/components/panel/verification/VerificationRequired";

export const metadata: Metadata = {
  title: "ویرایش آگهی خرید | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Edit one of the user's own buy ads; another user's id simply does not exist. */
export default async function EditBuyAdPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireCollaborator();
  if (!user.isPartner) return <VerificationRequired feature="ویرایش آگهی خرید" />;

  const ad = await getMyBuyAd(params.id, BigInt(user.id));
  if (!ad) notFound();

  // Brands only: the form fetches the chosen brand's cars on demand.
  const [brands, colors] = await Promise.all([listBrandChoices({ carWhere: {} }), listBuyAdColors()]);
  return (
    <BuyAdForm mode="edit" ad={ad} initialCar={carChoiceFromAd(ad)} brands={brands} colors={colors} buyerCode={ad.buyerCode} />
  );
}
