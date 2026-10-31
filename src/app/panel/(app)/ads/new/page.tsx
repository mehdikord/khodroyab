import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/user-auth";
import { AdCarPicker, type AdCarChoice } from "@/components/panel/ads/AdCarPicker";

export const metadata: Metadata = {
  title: "انتخاب خودرو | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** First step of a new ad: pick the car from the catalogue. */
export default async function NewAdCarPage() {
  await requireUser();

  const cars = await prisma.car.findMany({
    include: {
      brand: { select: { name: true } },
      carType: { select: { name: true } },
      carImages: { select: { imageUrl: true }, orderBy: { id: "asc" }, take: 1 },
    },
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
  });

  const choices: AdCarChoice[] = cars.map((car) => ({
    id: car.id.toString(),
    name: car.name,
    model: car.model,
    brandId: car.brandId.toString(),
    brandName: car.brand.name,
    carTypeName: car.carType.name,
    imageUrl: car.carImages[0]?.imageUrl ?? null,
  }));

  return <AdCarPicker cars={choices} />;
}
