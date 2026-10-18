import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { carToRecord } from "@/lib/cars";
import { PriceTableManager } from "@/components/admin/price-table/PriceTableManager";

export const metadata: Metadata = {
  title: "مدیریت جدول قیمت | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/**
 * Admin chooses which catalogue cars customers may list in their personal
 * price tables (`cars.price_table`). Nothing else about a car is edited here.
 */
export default async function AdminPriceTablePage() {
  await requireAdmin();

  const cars = await prisma.car.findMany({
    include: { brand: true, carType: true },
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }, { year: "desc" }, { id: "asc" }],
  });

  return <PriceTableManager initialCars={cars.map(carToRecord)} />;
}
