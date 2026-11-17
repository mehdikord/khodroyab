import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import { requireCollaborator } from "@/lib/auth/user-auth";
import { listBrandChoices } from "@/lib/catalog";
import { carChoiceFromAd } from "@/lib/catalog-shared";
import { colorToRecord } from "@/lib/colors";
import { optionRecordInclude, optionToRecord } from "@/lib/options";
import { saleTermToRecord } from "@/lib/sale-terms";
import { userCarInclude, userCarToRecord } from "@/lib/user-cars";
import { MyAdForm } from "@/components/panel/ads/MyAdForm";
import { VerificationRequired } from "@/components/panel/verification/VerificationRequired";

export const metadata: Metadata = {
  title: "ویرایش آگهی | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Edit one of the customer's own ads; another customer's id simply does not exist. */
export default async function EditAdPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireCollaborator();
  if (!user.isPartner) return <VerificationRequired feature="ویرایش آگهی" />;

  if (!/^\d+$/.test(params.id)) notFound();
  const ad = await prisma.userCar.findFirst({
    where: { id: BigInt(params.id), userId: BigInt(user.id) },
    include: userCarInclude,
  });
  if (!ad) notFound();

  const record = userCarToRecord(ad);
  const [brands, saleTerms, colors, options] = await Promise.all([
    // Brands only: the form fetches the chosen brand's cars on demand.
    listBrandChoices({ carWhere: {} }),
    prisma.saleTerm.findMany({ where: { isActive: true }, orderBy: { title: "asc" } }),
    prisma.color.findMany({ orderBy: { name: "asc" } }),
    prisma.option.findMany({ where: { isActive: true }, include: optionRecordInclude, orderBy: { id: "asc" } }),
  ]);

  return (
    <MyAdForm
      mode="edit"
      ad={record}
      initialCar={carChoiceFromAd(record)}
      brands={brands}
      saleTerms={saleTerms.map(saleTermToRecord)}
      colors={colors.map(colorToRecord)}
      options={options.map(optionToRecord)}
    />
  );
}
