import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { carOptionToRecord } from "@/lib/car-options";
import { optionToRecord } from "@/lib/options";
import { CarOptionsManager } from "@/components/admin/cars/CarOptionsManager";

export const metadata: Metadata = {
  title: "مدیریت ویژگی‌های خودرو | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function CarOptionsPage({ params }: PageProps) {
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

  const [carOptions, allOptions] = await Promise.all([
    prisma.carOption.findMany({
      where: { carId },
      include: {
        option: {
          include: {
            optionItems: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.option.findMany({
      include: {
        optionItems: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <CarOptionsManager
      carId={params.id}
      carName={car.name}
      initialCarOptions={carOptions.map(carOptionToRecord)}
      allOptions={allOptions.map(optionToRecord)}
    />
  );
}
