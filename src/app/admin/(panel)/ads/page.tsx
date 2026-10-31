import React from "react";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { carRecordInclude, carToRecord } from "@/lib/cars";
import { saleTermToRecord } from "@/lib/sale-terms";
import { colorToRecord } from "@/lib/colors";
import { optionRecordInclude, optionToRecord } from "@/lib/options";
import { userCarInclude, userCarToRecord } from "@/lib/user-cars";
import { isAdStatus, type AdStatus } from "@/lib/ad-status";
import { normalizeDigits } from "@/lib/validation/admin";
import { AdsManager, type AdsFilterValues, type AdsStatusCounts } from "@/components/admin/ads/AdsManager";

export const metadata: Metadata = {
  title: "همه آگهی‌ها | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

const ADS_PAGE_SIZE = 20;

type SearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function toBigIntOrNull(value: string): bigint | null {
  if (!/^\d+$/.test(value)) return null;
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

interface PageProps {
  searchParams: SearchParams;
}

export default async function AdminAllAdsPage({ searchParams }: PageProps) {
  await requireAdmin();

  /* ───── Parse filters from the URL ───── */
  const filters: AdsFilterValues = {
    q: single(searchParams.q).trim().slice(0, 100),
    brandId: single(searchParams.brand),
    carId: single(searchParams.car),
    userId: single(searchParams.user),
    status: isAdStatus(single(searchParams.status)) ? (single(searchParams.status) as AdStatus) : "",
    active: single(searchParams.active) === "1" ? "1" : single(searchParams.active) === "0" ? "0" : "",
  };
  const requestedPage = Math.max(1, Number.parseInt(single(searchParams.page), 10) || 1);

  /* ───── Build the Prisma where clause ───── */
  const where: Prisma.UserCarWhereInput = {};
  const and: Prisma.UserCarWhereInput[] = [];

  if (filters.q) {
    const digits = normalizeDigits(filters.q);
    const or: Prisma.UserCarWhereInput[] = [
      { user: { name: { contains: filters.q } } },
      { car: { name: { contains: filters.q } } },
      { car: { model: { contains: filters.q } } },
      { car: { brand: { name: { contains: filters.q } } } },
    ];
    if (digits) {
      or.push({ code: { contains: digits } });
      or.push({ user: { phone: { contains: digits } } });
      or.push({ year: { contains: digits } });
    }
    and.push({ OR: or });
  }

  const carId = toBigIntOrNull(filters.carId);
  const brandId = toBigIntOrNull(filters.brandId);
  const userId = toBigIntOrNull(filters.userId);
  if (carId !== null) and.push({ carId });
  else if (brandId !== null) and.push({ car: { brandId } });
  if (userId !== null) and.push({ userId });
  if (filters.status) and.push({ status: filters.status });
  if (filters.active) and.push({ isActive: filters.active === "1" });
  if (and.length > 0) where.AND = and;

  /* ───── Load everything in parallel ───── */
  const [total, statusGroups, cars, saleTerms, users, colors, options] = await Promise.all([
    prisma.userCar.count({ where }),
    prisma.userCar.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.car.findMany({
      include: carRecordInclude,
      orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
    }),
    prisma.saleTerm.findMany({ where: { isActive: true }, orderBy: { title: "asc" } }),
    prisma.user.findMany({ select: { id: true, name: true, phone: true }, orderBy: { name: "asc" } }),
    prisma.color.findMany({ orderBy: { name: "asc" } }),
    prisma.option.findMany({ where: { isActive: true }, include: optionRecordInclude, orderBy: { id: "asc" } }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / ADS_PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);

  const ads = await prisma.userCar.findMany({
    where,
    include: userCarInclude,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * ADS_PAGE_SIZE,
    take: ADS_PAGE_SIZE,
  });

  const statusCounts: AdsStatusCounts = { pending: 0, approved: 0, rejected: 0 };
  for (const group of statusGroups) {
    statusCounts[group.status] = group._count._all;
  }

  // Remount the manager when the query changes so its local list state resets.
  const stateKey = JSON.stringify({ ...filters, page });

  return (
    <AdsManager
      key={stateKey}
      ads={ads.map(userCarToRecord)}
      total={total}
      page={page}
      pageCount={pageCount}
      pageSize={ADS_PAGE_SIZE}
      filters={filters}
      statusCounts={statusCounts}
      cars={cars.map(carToRecord)}
      saleTerms={saleTerms.map(saleTermToRecord)}
      colors={colors.map(colorToRecord)}
      options={options.map(optionToRecord)}
      users={users.map((user) => ({ id: user.id.toString(), name: user.name, phone: user.phone }))}
    />
  );
}
