import "server-only";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { hasCompanyName, publicDisplayName } from "@/lib/display-name";
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

/** Prices keyed by production year (e.g. `{"2025": {...}}`); a missing year means "not priced". */
export type PriceListPricesByYear = Record<string, PriceListPrices>;

/** One row of the market-wide price list: a car and, per production year, the lowest price of each field. */
export interface PriceListRow extends PriceListCarInfo {
  /** Lowest price per field for each year any seller priced. */
  byYear: PriceListPricesByYear;
  /** Number of sellers that priced this car (at least one year tier). */
  sellerCount: number;
  /** Distinct production years sellers priced, oldest first. */
  years: string[];
}

/** One seller's prices for a car (all of their years), as shown on the car's price page. */
export interface PriceListOffer {
  userId: string;
  /** Public name: the seller's business name when set, else their own name. */
  userName: string;
  /** True when `userName` is a business name. */
  isCompany: boolean;
  userImage: string | null;
  /** Colour the seller picked in their price table. */
  colorName: string | null;
  colorCode: string | null;
  /** The seller's prices per production year (only the years they priced). */
  byYear: PriceListPricesByYear;
  updatedAt: string;
}

export interface PriceListCarDetail {
  car: PriceListCarInfo;
  /** One entry per seller. */
  offers: PriceListOffer[];
  /** Lowest price per field across all sellers and years. */
  lowest: PriceListPrices;
  /** Lowest price per field for each year, across sellers. */
  lowestByYear: PriceListPricesByYear;
  /** Distinct production years among the offers, oldest first. */
  years: string[];
}

/** Only active accounts with at least one priced year tier count towards the list. */
const pricedEntryWhere = {
  user: { isActive: true },
  prices: { some: {} },
} satisfies Prisma.UserPriceTableEntryWhereInput;

const tierSelect = {
  year: true,
  priceUsd: true,
  clearancePrice: true,
  instantPrice: true,
} satisfies Prisma.UserPriceTablePriceSelect;

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

/** Distinct years of the given tiers, oldest first (the order of the year columns). */
function distinctYears(rows: { year: string }[]): string[] {
  return Array.from(new Set(rows.map((row) => row.year))).sort((a, b) => Number(a) - Number(b));
}

/** Lowest price per field for each year among the given tiers. */
function lowestPricesByYear(tiers: (PriceListPrices & { year: string })[]): PriceListPricesByYear {
  const groups = new Map<string, PriceListPrices[]>();
  for (const tier of tiers) groups.set(tier.year, [...(groups.get(tier.year) ?? []), tier]);
  return Object.fromEntries(Array.from(groups, ([year, rows]) => [year, lowestPrices(rows)]));
}

/**
 * Every car the admin allowed in price tables, with the lowest raw, clearance
 * and instant price any active seller entered for it, per production year.
 */
export async function listPriceListRows(): Promise<PriceListRow[]> {
  const cars = await prisma.car.findMany({
    where: { priceTable: true },
    select: {
      ...carInfoSelect,
      priceTableEntries: {
        where: pricedEntryWhere,
        select: { prices: { select: tierSelect } },
      },
    },
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }, { year: "desc" }, { id: "asc" }],
  });

  return cars.map((car) => {
    const tiers = car.priceTableEntries.flatMap((entry) => entry.prices);
    return {
      ...toCarInfo(car),
      byYear: lowestPricesByYear(tiers),
      sellerCount: car.priceTableEntries.length,
      years: distinctYears(tiers),
    };
  });
}

/** Lowest value of a field across all of a seller's years (`null` when none). */
function sellerLowest(offer: PriceListOffer, key: PriceTablePriceField): string | null {
  return lowestPrices(Object.values(offer.byYear))[key];
}

/** Sort sellers by their lowest raw, then clearance, then instant price (blanks last). */
function compareOffers(a: PriceListOffer, b: PriceListOffer): number {
  for (const { key } of PRICE_TABLE_PRICE_FIELDS) {
    const x = sellerLowest(a, key);
    const y = sellerLowest(b, key);
    if (x === y) continue;
    if (x === null) return 1;
    if (y === null) return -1;
    return compareDigitPrices(x, y);
  }
  return a.userName.localeCompare(b.userName, "fa");
}

/**
 * One price-list car with every active seller's prices for it, one offer per
 * seller holding all of their years. Returns null for unknown ids or cars the
 * admin has not allowed in price tables.
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
          updatedAt: true,
          color: { select: { name: true, code: true } },
          user: { select: { id: true, name: true, companyName: true, image: true } },
          prices: { select: tierSelect, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
        },
      },
    },
  });
  if (!car) return null;

  const offers: PriceListOffer[] = car.priceTableEntries
    .map((entry) => ({
      userId: entry.user.id.toString(),
      userName: publicDisplayName(entry.user),
      isCompany: hasCompanyName(entry.user),
      userImage: entry.user.image,
      colorName: entry.color?.name ?? null,
      colorCode: entry.color?.code ?? null,
      byYear: Object.fromEntries(
        entry.prices.map(({ year, ...prices }) => [year, prices] as const)
      ),
      updatedAt: entry.updatedAt.toISOString(),
    }))
    .sort(compareOffers);

  const tiers = car.priceTableEntries.flatMap((entry) => entry.prices);
  return {
    car: toCarInfo(car),
    offers,
    lowest: lowestPrices(tiers),
    lowestByYear: lowestPricesByYear(tiers),
    years: distinctYears(tiers),
  };
}

/** How many distinct active sellers have priced at least one price-list car. */
export async function countPriceListSellers(): Promise<number> {
  const sellers = await prisma.userPriceTableEntry.groupBy({
    by: ["userId"],
    where: { ...pricedEntryWhere, car: { priceTable: true } },
  });
  return sellers.length;
}
