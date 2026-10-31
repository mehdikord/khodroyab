import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/user-auth";
import { carRecordInclude, carToRecord } from "@/lib/cars";
import { colorToRecord } from "@/lib/colors";
import { optionRecordInclude, optionToRecord } from "@/lib/options";
import { saleTermToRecord } from "@/lib/sale-terms";
import { userCarInclude, userCarToRecord } from "@/lib/user-cars";
import { MyAdForm } from "@/components/panel/ads/MyAdForm";

export const metadata: Metadata = {
  title: "ویرایش آگهی | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Edit one of the customer's own ads; another customer's id simply does not exist. */
export default async function EditAdPage({ params }: { params: { id: string } }) {
  const user = await requireUser();

  if (!/^\d+$/.test(params.id)) notFound();
  const ad = await prisma.userCar.findFirst({
    where: { id: BigInt(params.id), userId: BigInt(user.id) },
    include: userCarInclude,
  });
  if (!ad) notFound();

  const [cars, saleTerms, colors, options] = await Promise.all([
    prisma.car.findMany({ include: carRecordInclude, orderBy: [{ brand: { name: "asc" } }, { name: "asc" }] }),
    prisma.saleTerm.findMany({ where: { isActive: true }, orderBy: { title: "asc" } }),
    prisma.color.findMany({ orderBy: { name: "asc" } }),
    prisma.option.findMany({ where: { isActive: true }, include: optionRecordInclude, orderBy: { id: "asc" } }),
  ]);

  return (
    <MyAdForm
      mode="edit"
      ad={userCarToRecord(ad)}
      cars={cars.map(carToRecord)}
      saleTerms={saleTerms.map(saleTermToRecord)}
      colors={colors.map(colorToRecord)}
      options={options.map(optionToRecord)}
    />
  );
}
