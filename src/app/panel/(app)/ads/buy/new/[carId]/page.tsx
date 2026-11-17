import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireCollaborator } from "@/lib/auth/user-auth";
import { getActiveUserCode } from "@/lib/user-codes";
import { listBuyAdColors } from "@/lib/buy-ads";
import { getCarChoice } from "@/lib/catalog";
import { BuyAdForm } from "@/components/panel/buy-ads/BuyAdForm";
import { VerificationRequired } from "@/components/panel/verification/VerificationRequired";

export const metadata: Metadata = {
  title: "ثبت آگهی خرید | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Second step of a new buy ad: year, mileage, colour and notes of the chosen car. */
export default async function NewBuyAdDetailsPage(props: { params: Promise<{ carId: string }> }) {
  const params = await props.params;
  const user = await requireCollaborator();
  if (!user.isPartner) return <VerificationRequired feature="ثبت آگهی خرید" />;

  if (!/^\d+$/.test(params.carId)) notFound();
  const userId = BigInt(user.id);
  const [car, colors, code] = await Promise.all([getCarChoice(params.carId), listBuyAdColors(), getActiveUserCode(userId)]);
  if (!car) notFound();

  return <BuyAdForm mode="create" ad={null} initialCar={car} brands={[]} colors={colors} buyerCode={code.code} />;
}
