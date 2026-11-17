import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdminAccess } from "@/lib/auth/guards";
import { carRecordInclude, carToRecord } from "@/lib/cars";
import { listBrandChoices, priceTableCarWhere, type PriceTableFilters } from "@/lib/catalog";
import { pageWindow, requestedPage, searchQuery, single, type SearchParams } from "@/lib/pagination";
import { PriceTableManager } from "@/components/admin/price-table/PriceTableManager";

export const metadata: Metadata = {
  title: "مدیریت جدول قیمت | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

const PRICE_TABLE_PAGE_SIZE = 25;

/**
 * Admin chooses which catalogue cars customers may list in their personal
 * price tables (`cars.price_table`). Paginated on the server (`?q=`,
 * `?brand=`, `?status=`, `?page=`); bulk actions apply to every match.
 */
export default async function AdminPriceTablePage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  await requireAdminAccess("price_table");

  const rawStatus = single(searchParams.status);
  const brand = single(searchParams.brand);
  const filters: PriceTableFilters = {
    q: searchQuery(searchParams),
    brandId: /^\d{1,20}$/.test(brand) ? brand : "",
    status: rawStatus === "enabled" || rawStatus === "disabled" ? rawStatus : "",
  };

  const where = priceTableCarWhere(filters);
  const baseWhere = priceTableCarWhere(filters, false); // search + brand, any status

  const [total, baseTotal, baseEnabled, allCount, allEnabled, brands] = await Promise.all([
    prisma.car.count({ where }),
    prisma.car.count({ where: baseWhere }),
    prisma.car.count({ where: { AND: [baseWhere, { priceTable: true }] } }),
    prisma.car.count(),
    prisma.car.count({ where: { priceTable: true } }),
    listBrandChoices({ carWhere: {} }),
  ]);
  const window = pageWindow(total, requestedPage(searchParams), PRICE_TABLE_PAGE_SIZE);
  const cars = await prisma.car.findMany({
    where,
    include: carRecordInclude,
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }, { id: "asc" }],
    skip: window.skip,
    take: window.take,
  });

  return (
    <PriceTableManager
      initialCars={cars.map(carToRecord)}
      filters={filters}
      brands={brands}
      total={total}
      page={window.page}
      pageCount={window.pageCount}
      pageSize={PRICE_TABLE_PAGE_SIZE}
      counts={{ all: baseTotal, enabled: baseEnabled, catalogue: allCount, catalogueEnabled: allEnabled }}
    />
  );
}
