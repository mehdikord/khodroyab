import "server-only";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { PRICE_TABLE_PRICE_FIELDS, type PriceTablePriceField } from "@/lib/price-table-shared";

/** The three USD prices of a row; `null` when nobody / the seller left it blank. */
export type PriceListPrices = Record<PriceTablePriceField, string | null>;

/** Catalogue side of a price-list car (shared by the list and the detail page). */
export interface PriceListCarInfo {
  id: string;
  name: string;
  model: string;
  year: string;
  brandName: string;
  brandImage: string | null;
  /** Colour the admin set on the car itself. */
  colorName: string | null;
  colorCode: string | null;
}

/** One row of the market-wide price list: a car and the lowest price per field. */
export interface PriceListRow extends PriceListCarInfo {
  lowest: PriceListPrices;
  /** Number of sellers that priced this car (at least one of the three prices). */
  sellerCount: number;
}

/** One seller's prices for a car, as shown on the car's price page. */
export interface PriceListOffer extends PriceListPrices {
  userId: string;
  userName: string;
  userImage: string | null;
  /** Colour the seller picked in their price table. */
  colorName: string | null;
  colorCode: string | null;
  updatedAt: string;
}

export interface PriceListCarDetail {
  car: PriceListCarInfo;
  offers: PriceListOffer[];
  lowest: PriceListPrices;
}

/** Only active accounts with at least one filled price count towards the list. */
const pricedEntryWhere = {
  user: { isActive: true },
  OR: [{ priceUsd: { not: null } }, { clearancePrice: { not: null } }, { instantPrice: { not: null } }],
} satisfies Prisma.UserPriceTableEntryWhereInput;

const carInfoSelect = {
  id: true,
  name: true,
  model: true,
  year: true,
  brand: { select: { name: true, image: true } },
  color: { select: { name: true, code: true } },
} satisfies Prisma.CarSelect;

type CarInfoRow = Prisma.CarGetPayload<{ select: typeof carInfoSelect }>;

function toCarInfo(car: CarInfoRow): PriceListCarInfo {
  return {
    id: car.id.toString(),
    name: car.name,
    model: car.model,
    year: car.year,
    brandName: car.brand.name,
    brandImage: car.brand.image,
    colorName: car.color?.name ?? null,
    colorCode: car.color?.code ?? null,
  };
}

/** Numeric order of two digit-only price strings (no leading zeros). */
export function compareDigitPrices(a: string, b: string): number {
  if (a.length !== b.length) return a.length - b.length;
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Lowest non-blank value of each price field across the given rows. */
function lowestPrices(rows: PriceListPrices[]): PriceListPrices {
  const lowest: PriceListPrices = { priceUsd: null, clearancePrice: null, instantPrice: null };
  for (const row of rows) {
    for (const { key } of PRICE_TABLE_PRICE_FIELDS) {
      const value = row[key];
      if (value && (lowest[key] === null || compareDigitPrices(value, lowest[key]!) < 0)) lowest[key] = value;
    }
  }
  return lowest;
}

/**
 * Every car the admin allowed in price tables, with the lowest raw, clearance
 * and instant price any active seller entered for it.
 */
export async function listPriceListRows(): Promise<PriceListRow[]> {
  const cars = await prisma.car.findMany({
    where: { priceTable: true },
    select: {
      ...carInfoSelect,
      priceTableEntries: {
        where: pricedEntryWhere,
        select: { priceUsd: true, clearancePrice: true, instantPrice: true },
      },
    },
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }, { year: "desc" }, { id: "asc" }],
  });

  return cars.map((car) => ({
    ...toCarInfo(car),
    lowest: lowestPrices(car.priceTableEntries),
    sellerCount: car.priceTableEntries.length,
  }));
}

/** Sort offers by raw, then clearance, then instant price; blanks last. */
function compareOffers(a: PriceListOffer, b: PriceListOffer): number {
  for (const { key } of PRICE_TABLE_PRICE_FIELDS) {
    const x = a[key];
    const y = b[key];
    if (x === y) continue;
    if (x === null) return 1;
    if (y === null) return -1;
    return compareDigitPrices(x, y);
  }
  return a.userName.localeCompare(b.userName, "fa");
}

/**
 * One price-list car with every active seller's prices for it. Returns null
 * for unknown ids or cars the admin has not allowed in price tables.
 */
export async function getPriceListCarDetail(carIdRaw: string): Promise<PriceListCarDetail | null> {
  if (!/^\d{1,20}$/.test(carIdRaw)) return null;

  const car = await prisma.car.findFirst({
    where: { id: BigInt(carIdRaw), priceTable: true },
    select: {
      ...carInfoSelect,
      priceTableEntries: {
        where: pricedEntryWhere,
        select: {
          priceUsd: true,
          clearancePrice: true,
          instantPrice: true,
          updatedAt: true,
          color: { select: { name: true, code: true } },
          user: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });
  if (!car) return null;

  const offers: PriceListOffer[] = car.priceTableEntries
    .map((entry) => ({
      userId: entry.user.id.toString(),
      userName: entry.user.name,
      userImage: entry.user.image,
      colorName: entry.color?.name ?? null,
      colorCode: entry.color?.code ?? null,
      priceUsd: entry.priceUsd,
      clearancePrice: entry.clearancePrice,
      instantPrice: entry.instantPrice,
      updatedAt: entry.updatedAt.toISOString(),
    }))
    .sort(compareOffers);

  return { car: toCarInfo(car), offers, lowest: lowestPrices(offers) };
}

/** How many distinct active sellers have priced at least one price-list car. */
export async function countPriceListSellers(): Promise<number> {
  const sellers = await prisma.userPriceTableEntry.groupBy({
    by: ["userId"],
    where: { ...pricedEntryWhere, car: { priceTable: true } },
  });
  return sellers.length;
}
