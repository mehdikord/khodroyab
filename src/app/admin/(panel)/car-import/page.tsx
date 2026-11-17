import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdminAccess } from "@/lib/auth/guards";
import { DivarImportManager } from "@/components/admin/car-import/DivarImportManager";

export const metadata: Metadata = {
  title: "ورود اطلاعات | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Bulk import of brands and cars from the Divar export (`data/cars.json`). */
export default async function AdminCarImportPage() {
  await requireAdminAccess("cars");

  const carTypes = await prisma.carType.findMany({
    select: { id: true, name: true },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });

  return (
    <DivarImportManager
      carTypes={carTypes.map((type) => ({ id: type.id.toString(), name: type.name }))}
    />
  );
}
