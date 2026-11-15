import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdminAccess } from "@/lib/auth/guards";
import {
  PURCHASE_REQUEST_AUDIENCE_LABELS,
  getAdminPurchaseRequestCounts,
  getAdminPurchaseRequestFilterOptions,
  listAdminPurchaseRequests,
  parseAdminPurchaseRequestFilters,
  type PurchaseRequestAudience,
} from "@/lib/purchase-requests";
import { PurchaseRequestsManager } from "@/components/admin/purchase-requests/PurchaseRequestsManager";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { audience: string };
  searchParams: Record<string, string | string[] | undefined>;
}

function toAudience(value: string): PurchaseRequestAudience | null {
  return value === "public" || value === "members" ? value : null;
}

export function generateMetadata({ params }: PageProps): Metadata {
  const audience = toAudience(params.audience);
  return {
    title: `${audience ? PURCHASE_REQUEST_AUDIENCE_LABELS[audience] : "درخواست‌های خرید"} | پنل مدیریت خودرو یاب`,
    robots: "noindex, nofollow",
  };
}

/** Purchase requests of guests (`public`) or of signed-in customers (`members`); root only. */
export default async function AdminPurchaseRequestsPage({ params, searchParams }: PageProps) {
  await requireAdminAccess("root");
  const audience = toAudience(params.audience);
  if (!audience) notFound();

  const filters = parseAdminPurchaseRequestFilters(searchParams);
  const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const requestedPage = Math.max(1, Number.parseInt(pageRaw ?? "", 10) || 1);

  const [result, counts, options] = await Promise.all([
    listAdminPurchaseRequests(audience, filters, requestedPage),
    getAdminPurchaseRequestCounts(audience),
    getAdminPurchaseRequestFilterOptions(audience),
  ]);

  // Remount when the query changes so the manager's local list state resets.
  const stateKey = JSON.stringify({ audience, ...filters, page: result.page });

  return (
    <PurchaseRequestsManager
      key={stateKey}
      audience={audience}
      requests={result.requests}
      total={result.total}
      page={result.page}
      pageCount={result.pageCount}
      pageSize={result.pageSize}
      filters={filters}
      counts={counts}
      options={options}
    />
  );
}
