import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/user-auth";
import { carRecordInclude, carToRecord } from "@/lib/cars";
import { colorToRecord } from "@/lib/colors";
import { optionRecordInclude, optionToRecord } from "@/lib/options";
import { saleTermToRecord } from "@/lib/sale-terms";
import { MyAdForm } from "@/components/panel/ads/MyAdForm";

export const metadata: Metadata = {
  title: "ثبت آگهی جدید | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Second step of a new ad: the details of the chosen car. */
export default async function NewAdDetailsPage({ params }: { params: { carId: string } }) {
  await requireUser();

  if (!/^\d+$/.test(params.carId)) notFound();
  const car = await prisma.car.findUnique({ where: { id: BigInt(params.carId) }, include: carRecordInclude });
  if (!car) notFound();

  const [saleTerms, colors, options] = await Promise.all([
    prisma.saleTerm.findMany({ where: { isActive: true }, orderBy: { title: "asc" } }),
    prisma.color.findMany({ orderBy: { name: "asc" } }),
    prisma.option.findMany({ where: { isActive: true }, include: optionRecordInclude, orderBy: { id: "asc" } }),
  ]);

  return (
    <MyAdForm
      mode="create"
      ad={null}
      initialCarId={car.id.toString()}
      cars={[carToRecord(car)]}
      saleTerms={saleTerms.map(saleTermToRecord)}
      colors={colors.map(colorToRecord)}
      options={options.map(optionToRecord)}
    />
  );
}
