import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdminAccess } from "@/lib/auth/guards";
import { carTypeToRecord } from "@/lib/car-types";
import { CarTypesManager } from "@/components/admin/car-types/CarTypesManager";

export const metadata: Metadata = {
  title: "مدیریت انواع خودرو | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/**
 * Car types management module — full CRUD against the `car_types` table.
 */
export default async function AdminCarTypesPage() {
  await requireAdminAccess("cars");

  const carTypes = await prisma.carType.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return (
    <CarTypesManager initialCarTypes={carTypes.map(carTypeToRecord)} />
  );
}
