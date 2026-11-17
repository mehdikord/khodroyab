import React from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { requireAdminAccess } from "@/lib/auth/guards";
import { getAdminPurchaseRequestDetail } from "@/lib/purchase-requests";
import { PurchaseRequestDetailManager } from "@/components/admin/purchase-requests/PurchaseRequestDetailManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "جزئیات درخواست خرید | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

interface PageProps {
  params: Promise<{ audience: string; id: string }>;
}

/** One purchase request in full (root only). Opening it marks it as seen. */
export default async function AdminPurchaseRequestPage(props: PageProps) {
  const params = await props.params;
  await requireAdminAccess("root");
  if (params.audience !== "public" && params.audience !== "members") notFound();

  const result = await getAdminPurchaseRequestDetail(params.id);
  if (!result) notFound();

  // Keep the URL under the list the request belongs to (sidebar highlight, back link).
  const audience = result.request.isGuest ? "public" : "members";
  if (audience !== params.audience) redirect(`/admin/purchase-requests/${audience}/${result.request.id}`);

  return <PurchaseRequestDetailManager request={result.request} justSeen={result.justSeen} />;
}
