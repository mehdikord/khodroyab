import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import { requireAdminAccess } from "@/lib/auth/guards";
import { carImageToRecord, carVideoToRecord } from "@/lib/car-images";
import { CarImagesManager } from "@/components/admin/cars/CarImagesManager";

export const metadata: Metadata = {
  title: "مدیریت تصاویر و ویدیوهای خودرو | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function CarImagesPage({ params }: PageProps) {
  await requireAdminAccess("cars");

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

  const [images, videos] = await Promise.all([
    prisma.carImage.findMany({ where: { carId }, orderBy: [{ createdAt: "asc" }, { id: "asc" }] }),
    prisma.carVideo.findMany({ where: { carId }, orderBy: [{ createdAt: "asc" }, { id: "asc" }] }),
  ]);

  return (
    <CarImagesManager
      carId={params.id}
      carName={car.name}
      initialImages={images.map(carImageToRecord)}
      initialVideos={videos.map(carVideoToRecord)}
    />
  );
}
