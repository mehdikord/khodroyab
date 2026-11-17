import "server-only";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { pageWindow, searchTokens } from "@/lib/pagination";
import {
  BRAND_CARS_LIMIT,
  CAR_PICKER_PAGE_SIZE,
  type BrandChoice,
  type CarChoice,
  type CarChoicePage,
  type PriceTableFilters,
} from "@/lib/catalog-shared";

/**
 * Catalogue queries for pickers and filters. Nothing here loads the whole car
 * table: callers get a light brand list, the cars of one brand, or one page
 * of a search.
 */

export const carChoiceSelect = {
  id: true,
  name: true,
  model: true,
  slug: true,
  brandId: true,
  brand: { select: { name: true } },
  carType: { select: { name: true } },
  carImages: { select: { imageUrl: true }, orderBy: { id: "asc" }, take: 1 },
} satisfies Prisma.CarSelect;

type CarChoiceRow = Prisma.CarGetPayload<{ select: typeof carChoiceSelect }>;

export function toCarChoice(car: CarChoiceRow): CarChoice {
  return {
    id: car.id.toString(),
    name: car.name,
    model: car.model,
    slug: car.slug,
    brandId: car.brandId.toString(),
    brandName: car.brand.name,
    carTypeName: car.carType.name,
    imageUrl: car.carImages[0]?.imageUrl ?? null,
  };
}

const carOrder: Prisma.CarOrderByWithRelationInput[] = [{ brand: { name: "asc" } }, { name: "asc" }, { id: "asc" }];

/** Every token must appear in the car's name, model, slug or brand name. */
export function carSearchWhere(query: string): Prisma.CarWhereInput | undefined {
  const tokens = searchTokens(query);
  if (tokens.length === 0) return undefined;
  return {
    AND: tokens.map((token) => ({
      OR: [
        { name: { contains: token } },
        { model: { contains: token } },
        { slug: { contains: token.toLowerCase() } },
        { brand: { name: { contains: token } } },
      ],
    })),
  };
}

/** Brands matching `name` (tokens), for the admin brands table. */
export function brandSearchWhere(query: string): Prisma.BrandWhereInput | undefined {
  const tokens = searchTokens(query);
  if (tokens.length === 0) return undefined;
  return {
    AND: tokens.map((token) => ({
      OR: [{ name: { contains: token } }, { slug: { contains: token.toLowerCase() } }],
    })),
  };
}

/**
 * Light brand list with car counts, sorted by name. `carWhere` narrows which
 * cars count (and drops brands with none), e.g. cars that have ads.
 */
export async function listBrandChoices(options: { carWhere?: Prisma.CarWhereInput; activeOnly?: boolean } = {}): Promise<BrandChoice[]> {
  const { carWhere, activeOnly = false } = options;
  const brands = await prisma.brand.findMany({
    where: {
      ...(activeOnly ? { isActive: true } : {}),
      ...(carWhere ? { cars: { some: carWhere } } : {}),
    },
    select: { id: true, name: true, _count: { select: { cars: carWhere ? { where: carWhere } : true } } },
    orderBy: [{ name: "asc" }, { id: "asc" }],
  });
  return brands.map((brand) => ({ id: brand.id.toString(), name: brand.name, carCount: brand._count.cars }));
}

/** Cars of one brand (capped), for a dependent "car" select. */
export async function listBrandCarChoices(brandId: bigint, carWhere?: Prisma.CarWhereInput): Promise<CarChoice[]> {
  const cars = await prisma.car.findMany({
    where: { brandId, ...(carWhere ?? {}) },
    select: carChoiceSelect,
    orderBy: [{ name: "asc" }, { id: "asc" }],
    take: BRAND_CARS_LIMIT,
  });
  return cars.map(toCarChoice);
}

/** One page of a free-text catalogue search, optionally within a brand. */
export async function searchCarChoices(params: {
  query?: string;
  brandId?: bigint | null;
  page?: number;
  pageSize?: number;
}): Promise<CarChoicePage> {
  const pageSize = Math.min(Math.max(params.pageSize ?? CAR_PICKER_PAGE_SIZE, 1), 60);
  const and: Prisma.CarWhereInput[] = [];
  const search = carSearchWhere(params.query ?? "");
  if (search) and.push(search);
  if (params.brandId) and.push({ brandId: params.brandId });
  const where: Prisma.CarWhereInput = and.length > 0 ? { AND: and } : {};

  const total = await prisma.car.count({ where });
  const window = pageWindow(total, params.page ?? 1, pageSize);
  const cars = await prisma.car.findMany({
    where,
    select: carChoiceSelect,
    orderBy: carOrder,
    skip: window.skip,
    take: window.take,
  });
  return { items: cars.map(toCarChoice), total, page: window.page, pageCount: window.pageCount };
}

/** A single car as a picker choice (e.g. the car an ad already uses). */
export async function getCarChoice(id: bigint | string | null | undefined): Promise<CarChoice | null> {
  if (id === null || id === undefined || id === "") return null;
  let carId: bigint;
  try {
    carId = typeof id === "bigint" ? id : BigInt(id);
  } catch {
    return null;
  }
  const car = await prisma.car.findUnique({ where: { id: carId }, select: carChoiceSelect });
  return car ? toCarChoice(car) : null;
}

/* ───────────────────────── Admin price-table filters ───────────────────────── */

export type { PriceTableFilters, PriceTableStatusFilter } from "@/lib/catalog-shared";

/** Cars matching the admin price-table screen's filters (search, brand, status). */
export function priceTableCarWhere(filters: PriceTableFilters, withStatus = true): Prisma.CarWhereInput {
  const and: Prisma.CarWhereInput[] = [];
  const search = carSearchWhere(filters.q);
  if (search) and.push(search);
  if (/^\d{1,20}$/.test(filters.brandId)) and.push({ brandId: BigInt(filters.brandId) });
  if (withStatus && filters.status) and.push({ priceTable: filters.status === "enabled" });
  return and.length > 0 ? { AND: and } : {};
}
