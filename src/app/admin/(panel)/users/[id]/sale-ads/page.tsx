import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { userToRecord } from "@/lib/users";
import { carToRecord } from "@/lib/cars";
import { saleTermToRecord } from "@/lib/sale-terms";
import { userCarInclude, userCarToRecord } from "@/lib/user-cars";
import { SaleAdsManager } from "@/components/admin/users/sale-ads/SaleAdsManager";

export const metadata: Metadata = {
  title: "مدیریت آگهی‌های فروش کاربر | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function AdminUserSaleAdsPage({ params }: PageProps) {
  await requireAdmin();

  let userId: bigint;
  try {
    userId = BigInt(params.id);
  } catch {
    return notFound();
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return notFound();
  }

  const [userCars, cars, saleTerms] = await Promise.all([
    prisma.userCar.findMany({
      where: { userId },
      include: userCarInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
    prisma.car.findMany({
      include: { brand: true, carType: true },
      orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
    }),
    prisma.saleTerm.findMany({
      where: { isActive: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <SaleAdsManager
      user={userToRecord(user)}
      initialAds={userCars.map(userCarToRecord)}
      cars={cars.map(carToRecord)}
      saleTerms={saleTerms.map(saleTermToRecord)}
    />
  );
}
