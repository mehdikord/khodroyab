import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { carRecordInclude, carToRecord } from "@/lib/cars";
import { brandToRecord } from "@/lib/brands";
import { carTypeToRecord } from "@/lib/car-types";
import { colorToRecord } from "@/lib/colors";
import { CarsManager } from "@/components/admin/cars/CarsManager";

export const metadata: Metadata = {
  title: "مدیریت خودروها | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default async function AdminCarsPage() {
  await requireAdmin();

  const [cars, brands, carTypes, colors] = await Promise.all([
    prisma.car.findMany({
      include: carRecordInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.carType.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.color.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <CarsManager
      initialCars={cars.map(carToRecord)}
      brands={brands.map(brandToRecord)}
      carTypes={carTypes.map(carTypeToRecord)}
      colors={colors.map(colorToRecord)}
    />
  );
}
