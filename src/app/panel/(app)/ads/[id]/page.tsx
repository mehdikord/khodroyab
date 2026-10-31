import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/user-auth";
import { getAdDetail } from "@/lib/panel-search";
import { AdDetailView } from "@/components/panel/ads/AdDetailView";

export const metadata: Metadata = {
  title: "جزئیات آگهی | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Dedicated page of one sale ad. */
export default async function AdDetailPage({ params }: { params: { id: string } }) {
  const user = await requireUser();

  const ad = await getAdDetail(params.id, user.id);
  if (!ad) notFound();

  return <AdDetailView ad={ad} />;
}
