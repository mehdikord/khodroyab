import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdminAccess } from "@/lib/auth/guards";
import { getAdminBuyAdDetail } from "@/lib/admin-buy-ads";
import { BuyAdDetailManager } from "@/components/admin/buy-ads/BuyAdDetailManager";

export const metadata: Metadata = {
  title: "جزئیات آگهی خرید | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function AdminBuyAdDetailPage({ params }: PageProps) {
  await requireAdminAccess("ads");

  const ad = await getAdminBuyAdDetail(params.id);
  if (!ad) notFound();

  return <BuyAdDetailManager ad={ad} />;
}
