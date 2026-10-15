import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { saleTermToRecord } from "@/lib/sale-terms";
import { SaleTermsManager } from "@/components/admin/sale-terms/SaleTermsManager";

export const metadata: Metadata = {
  title: "مدیریت شرایط فروش | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default async function AdminSaleTermsPage() {
  await requireAdmin();

  const terms = await prisma.saleTerm.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return (
    <SaleTermsManager initialTerms={terms.map(saleTermToRecord)} />
  );
}
