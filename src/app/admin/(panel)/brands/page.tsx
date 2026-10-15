import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { brandToRecord } from "@/lib/brands";
import { BrandsManager } from "@/components/admin/brands/BrandsManager";

export const metadata: Metadata = {
  title: "مدیریت برندها | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/**
 * Brands management module — full CRUD against the `brands` table.
 *
 * The page stays a thin server component: it enforces authorization, loads
 * the current brand list, and hands serialized records to the client
 * orchestrator (BrandsManager) which owns all mutations.
 */
export default async function AdminBrandsPage() {
  await requireAdmin();

  const brands = await prisma.brand.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return (
    <BrandsManager initialBrands={brands.map(brandToRecord)} />
  );
}