import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireCollaborator } from "@/lib/auth/user-auth";
import { getActiveUserCode } from "@/lib/user-codes";
import { listBuyAdCarChoices, listBuyAdColors } from "@/lib/buy-ads";
import { BuyAdForm } from "@/components/panel/buy-ads/BuyAdForm";
import { VerificationRequired } from "@/components/panel/verification/VerificationRequired";

export const metadata: Metadata = {
  title: "ثبت آگهی خرید | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Second step of a new buy ad: year, mileage, colour and notes of the chosen car. */
export default async function NewBuyAdDetailsPage({ params }: { params: { carId: string } }) {
  const user = await requireCollaborator();
  if (!user.isPartner) return <VerificationRequired feature="ثبت آگهی خرید" />;

  if (!/^\d+$/.test(params.carId)) notFound();
  const userId = BigInt(user.id);
  const [cars, colors, code] = await Promise.all([listBuyAdCarChoices(BigInt(params.carId)), listBuyAdColors(), getActiveUserCode(userId)]);
  if (cars.length === 0) notFound();

  return <BuyAdForm mode="create" ad={null} initialCarId={cars[0].id} cars={cars} colors={colors} buyerCode={code.code} />;
}
