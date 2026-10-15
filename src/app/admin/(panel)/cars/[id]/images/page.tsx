import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { carImageToRecord } from "@/lib/car-images";
import { CarImagesManager } from "@/components/admin/cars/CarImagesManager";

export const metadata: Metadata = {
  title: "مدیریت تصاویر خودرو | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function CarImagesPage({ params }: PageProps) {
  await requireAdmin();

  let carId: bigint;
  try {
    carId = BigInt(params.id);
  } catch {
    return notFound();
  }

  const car = await prisma.car.findUnique({
    where: { id: carId },
    select: { name: true },
  });

  if (!car) {
    return notFound();
  }

  const images = await prisma.carImage.findMany({
    where: { carId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <CarImagesManager
      carId={params.id}
      carName={car.name}
      initialImages={images.map(carImageToRecord)}
    />
  );
}
