import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdminAccess } from "@/lib/auth/guards";
import { brandToRecord } from "@/lib/brands";
import { brandSearchWhere } from "@/lib/catalog";
import { pageWindow, requestedPage, searchQuery, single, type SearchParams } from "@/lib/pagination";
import { BrandsManager, type BrandsStatusFilter } from "@/components/admin/brands/BrandsManager";

export const metadata: Metadata = {
  title: "مدیریت برندها | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

const BRANDS_PAGE_SIZE = 20;

/**
 * Brands management module — full CRUD against the `brands` table, paginated
 * on the server (`?q=`, `?status=`, `?page=`) so only one page is loaded.
 */
export default async function AdminBrandsPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  await requireAdminAccess("cars");

  const q = searchQuery(searchParams);
  const rawStatus = single(searchParams.status);
  const status: BrandsStatusFilter = rawStatus === "active" || rawStatus === "inactive" ? rawStatus : "";

  const where = {
    ...(brandSearchWhere(q) ?? {}),
    ...(status ? { isActive: status === "active" } : {}),
  };

  const [total, allCount] = await Promise.all([prisma.brand.count({ where }), prisma.brand.count()]);
  const window = pageWindow(total, requestedPage(searchParams), BRANDS_PAGE_SIZE);
  const brands = await prisma.brand.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: window.skip,
    take: window.take,
  });

  return (
    <BrandsManager
      initialBrands={brands.map(brandToRecord)}
      total={total}
      allCount={allCount}
      page={window.page}
      pageCount={window.pageCount}
      pageSize={BRANDS_PAGE_SIZE}
      filters={{ q, status }}
    />
  );
}
