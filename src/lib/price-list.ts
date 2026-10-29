import "server-only";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { hasCompanyName, publicDisplayName } from "@/lib/display-name";
import {
  PRICE_TABLE_PRICE_FIELDS,
  mergePriceColumns,
  priceColumnKey,
  type PriceColumn,
  type PriceTablePriceField,
} from "@/lib/price-table-shared";

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

/** Prices keyed by price column (`"<year>:<colorId>"`); a missing key means "not priced". */
export type PriceListPricesByColumn = Record<string, PriceListPrices>;

/** One row of the market-wide price list: a car and, per (year, colour), the lowest price of each field. */
export interface PriceListRow extends PriceListCarInfo {
  /** Lowest price per field for each (year, colour) any seller priced. */
  byColumn: PriceListPricesByColumn;
  /** Number of sellers that priced this car (at least one tier). */
  sellerCount: number;
  /** The (year, colour) columns priced for this car, in column order. */
  columns: PriceColumn[];
}

/** One seller's prices for a car (all of their tiers), as shown on the car's price page. */
export interface PriceListOffer {
  userId: string;
  /** Public name: the seller's business name when set, else their own name. */
  userName: string;
  /** True when `userName` is a business name. */
  isCompany: boolean;
  userImage: string | null;
  /** The seller's prices per (year, colour) column (only the ones they priced). */
  byColumn: PriceListPricesByColumn;
  updatedAt: string;
}

export interface PriceListCarDetail {
  car: PriceListCarInfo;
  /** One entry per seller. */
  offers: PriceListOffer[];
  /** Lowest price per field across all sellers and tiers. */
  lowest: PriceListPrices;
  /** Lowest price per field for each column, across sellers. */
  lowestByColumn: PriceListPricesByColumn;
  /** Every (year, colour) column among the offers, in column order. */
  columns: PriceColumn[];
}

/** Only active accounts with at least one priced year tier count towards the list. */
const pricedEntryWhere = {
  user: { isActive: true },
  prices: { some: {} },
} satisfies Prisma.UserPriceTableEntryWhereInput;

const tierSelect = {
  year: true,
  colorId: true,
  color: { select: { name: true, code: true } },
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

type TierRow = Prisma.UserPriceTablePriceGetPayload<{ select: typeof tierSelect }>;

function tierColumn(tier: TierRow): PriceColumn {
  const colorId = tier.colorId.toString();
  return { key: priceColumnKey(tier.year, colorId), year: tier.year, colorId, colorName: tier.color.name, colorCode: tier.color.code };
}

function tierPrices(tier: TierRow): PriceListPrices {
  return { priceUsd: tier.priceUsd, clearancePrice: tier.clearancePrice, instantPrice: tier.instantPrice };
}

/** Lowest price per field for each (year, colour) column among the given tiers. */
function lowestPricesByColumn(tiers: TierRow[]): PriceListPricesByColumn {
  const groups = new Map<string, PriceListPrices[]>();
  for (const tier of tiers) {
    const key = tierColumn(tier).key;
    groups.set(key, [...(groups.get(key) ?? []), tierPrices(tier)]);
  }
  return Object.fromEntries(Array.from(groups, ([key, rows]) => [key, lowestPrices(rows)]));
}

/**
 * Every car the admin allowed in price tables, with the lowest raw, clearance
 * and instant price any active seller entered for it, per (year, colour).
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
      byColumn: lowestPricesByColumn(tiers),
      sellerCount: car.priceTableEntries.length,
      columns: mergePriceColumns(tiers.map(tierColumn)),
    };
  });
}

/** Lowest value of a field across all of a seller's tiers (`null` when none). */
function sellerLowest(offer: PriceListOffer, key: PriceTablePriceField): string | null {
  return lowestPrices(Object.values(offer.byColumn))[key];
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
 * seller holding all of their (year, colour) tiers. Returns null for unknown
 * ids or cars the admin has not allowed in price tables.
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
      byColumn: Object.fromEntries(entry.prices.map((tier) => [tierColumn(tier).key, tierPrices(tier)] as const)),
      updatedAt: entry.updatedAt.toISOString(),
    }))
    .sort(compareOffers);

  const tiers = car.priceTableEntries.flatMap((entry) => entry.prices);
  return {
    car: toCarInfo(car),
    offers,
    lowest: lowestPrices(tiers.map(tierPrices)),
    lowestByColumn: lowestPricesByColumn(tiers),
    columns: mergePriceColumns(tiers.map(tierColumn)),
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
