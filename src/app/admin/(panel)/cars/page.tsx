import React from "react";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { requireAdminAccess } from "@/lib/auth/guards";
import { carRecordInclude, carToRecord } from "@/lib/cars";
import { carTypeToRecord } from "@/lib/car-types";
import { carSearchWhere, listBrandChoices } from "@/lib/catalog";
import { idParam, pageWindow, requestedPage, searchQuery, type SearchParams } from "@/lib/pagination";
import { CarsManager } from "@/components/admin/cars/CarsManager";

export const metadata: Metadata = {
  title: "مدیریت خودروها | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

const CARS_PAGE_SIZE = 20;

/** Cars catalogue, paginated on the server (`?q=`, `?brand=`, `?type=`, `?page=`). */
export default async function AdminCarsPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  await requireAdminAccess("cars");

  const q = searchQuery(searchParams);
  const brandId = idParam(searchParams.brand);
  const carTypeId = idParam(searchParams.type);

  const and: Prisma.CarWhereInput[] = [];
  const search = carSearchWhere(q);
  if (search) and.push(search);
  if (brandId !== null) and.push({ brandId });
  if (carTypeId !== null) and.push({ carTypeId });
  const where: Prisma.CarWhereInput = and.length > 0 ? { AND: and } : {};

  // Every brand for the filter, active brands only for the form.
  const [total, allCount, brands, activeBrands, carTypes] = await Promise.all([
    prisma.car.count({ where }),
    prisma.car.count(),
    listBrandChoices(),
    prisma.brand.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.carType.findMany({ orderBy: { name: "asc" } }),
  ]);
  const window = pageWindow(total, requestedPage(searchParams), CARS_PAGE_SIZE);
  const cars = await prisma.car.findMany({
    where,
    include: carRecordInclude,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: window.skip,
    take: window.take,
  });

  return (
    <CarsManager
      initialCars={cars.map(carToRecord)}
      total={total}
      allCount={allCount}
      page={window.page}
      pageCount={window.pageCount}
      pageSize={CARS_PAGE_SIZE}
      filters={{ q, brandId: brandId?.toString() ?? "", carTypeId: carTypeId?.toString() ?? "" }}
      filterBrands={brands}
      brands={activeBrands.map((brand) => ({ id: brand.id.toString(), name: brand.name }))}
      carTypes={carTypes.map(carTypeToRecord)}
    />
  );
}
