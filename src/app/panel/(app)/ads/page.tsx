import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/user-auth";
import { carRecordInclude, carToRecord } from "@/lib/cars";
import { saleTermToRecord } from "@/lib/sale-terms";
import { userCarInclude, userCarToRecord } from "@/lib/user-cars";
import { MyAdsManager } from "@/components/panel/ads/MyAdsManager";

export const metadata: Metadata = {
  title: "آگهی‌های من | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** The customer's own sale ads: create, review status, edit. */
export default async function PanelAdsPage() {
  const user = await requireUser();
  const userId = BigInt(user.id);

  const [ads, cars, saleTerms] = await Promise.all([
    prisma.userCar.findMany({
      where: { userId },
      include: userCarInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
    prisma.car.findMany({
      include: carRecordInclude,
      orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
    }),
    prisma.saleTerm.findMany({ where: { isActive: true }, orderBy: { title: "asc" } }),
  ]);

  return (
    <MyAdsManager
      initialAds={ads.map(userCarToRecord)}
      cars={cars.map(carToRecord)}
      saleTerms={saleTerms.map(saleTermToRecord)}
    />
  );
}
