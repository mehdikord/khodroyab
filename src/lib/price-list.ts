import "server-only";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { getActiveUserCodes } from "@/lib/user-codes";
import {
  ALL_PRICE_FIELD_KEYS,
  PRICE_TABLE_ALL_PRICE_KEYS,
  hasAnyPrice,
  mergePriceColumns,
  priceColumnKey,
  priceKeysFor,
  withEnabledPrices,
  withVisiblePrices,
  type PriceColumn,
  type PriceTableAnyPriceField,
  type PriceTablePriceField,
} from "@/lib/price-table-shared";
import { PRICE_CURRENCIES, type PriceCurrency } from "@/lib/currency";

/**
 * The three USD prices of a row, public and collaborator; `null` when nobody /
 * the seller left it blank, or (collaborator prices) the viewer may not see it.
 */
export type PriceListPrices = Record<PriceTableAnyPriceField, string | null>;

/** Catalogue side of a price-list car (shared by the list and the detail page). */
export interface PriceListCarInfo {
  id: string;
  name: string;
  model: string;
  brandName: string;
  brandImage: string | null;
}

/** The car's catalogue photos (uploaded by the admin), oldest first; detail page only. */
export interface PriceListCarDetailInfo extends PriceListCarInfo {
  images: string[];
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
  /**
   * Public code of the seller behind each lowest price of `byColumn` (per
   * column, per field); the first seller when several share the lowest price.
   */
  sellersByColumn: Record<string, Partial<Record<PriceTableAnyPriceField, string>>>;
}

/** One seller's prices for a car (all of their tiers), as shown on the car's price page. */
export interface PriceListOffer {
  /** Currency of every price of this seller's row. */
  currency: PriceCurrency;
  /**
   * The seller's current public code (rotates automatically). The seller's
   * name, photo and account id never reach other customers.
   */
  sellerCode: string;
  /** The offer belongs to the viewer. */
  isMine: boolean;
  /** The seller's prices per (year, colour) column (only the ones they priced). */
  byColumn: PriceListPricesByColumn;
  /** When the seller last changed their prices for this car (ISO). */
  updatedAt: string;
  /** `updatedAt` as a Persian (Jalali) date, e.g. "۱۴۰۵/۰۸/۲۴". */
  updatedAtLabel: string;
}

export interface PriceListCarDetail {
  car: PriceListCarDetailInfo;
  /** One entry per seller. */
  offers: PriceListOffer[];
  /** Lowest price per field across all sellers and tiers, per currency (only currencies that appear). */
  lowest: Partial<Record<PriceCurrency, PriceListPrices>>;
  /** Lowest price per field for each column, across sellers. */
  lowestByColumn: PriceListPricesByColumn;
  /** Every (year, colour) column among the offers, in column order. */
  columns: PriceColumn[];
}

/** Only active, verified collaborators with at least one priced year tier count towards the list. */
const pricedEntryWhere = {
  user: { isActive: true, collabrate: true, authenticaed: true },
  prices: { some: {} },
} satisfies Prisma.UserPriceTableEntryWhereInput;

const tierSelect = {
  year: true,
  colorId: true,
  color: { select: { name: true, code: true } },
  priceUsd: true,
  clearancePrice: true,
  instantPrice: true,
  partnerPriceUsd: true,
  partnerClearancePrice: true,
  partnerInstantPrice: true,
} satisfies Prisma.UserPriceTablePriceSelect;

const carInfoSelect = {
  id: true,
  name: true,
  model: true,
  brand: { select: { name: true, image: true } },
} satisfies Prisma.CarSelect;

type CarInfoRow = Prisma.CarGetPayload<{ select: typeof carInfoSelect }>;

function toCarInfo(car: CarInfoRow): PriceListCarInfo {
  return {
    id: car.id.toString(),
    name: car.name,
    model: car.model,
    brandName: car.brand.name,
    brandImage: car.brand.image,
  };
}

/** Numeric order of two digit-only price strings (no leading zeros). */
export function compareDigitPrices(a: string, b: string): number {
  if (a.length !== b.length) return a.length - b.length;
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Lowest non-blank value of each price field across the given rows. */
function lowestPrices(rows: PriceListPrices[]): PriceListPrices {
  const lowest = Object.fromEntries(PRICE_TABLE_ALL_PRICE_KEYS.map((key) => [key, null])) as PriceListPrices;
  for (const row of rows) {
    for (const key of PRICE_TABLE_ALL_PRICE_KEYS) {
      const value = row[key];
      if (value && (lowest[key] === null || compareDigitPrices(value, lowest[key]!) < 0)) lowest[key] = value;
    }
  }
  return lowest;
}

/** A stored tier together with the currency of its row and its seller (user id). */
type TierRow = Prisma.UserPriceTablePriceGetPayload<{ select: typeof tierSelect }> & { currency: PriceCurrency; sellerId: string };

/** Persian (Jalali) calendar date in Tehran time, e.g. "۱۴۰۵/۰۸/۲۴". */
const jalaliDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Tehran",
});

function tierColumn(tier: TierRow): PriceColumn {
  const colorId = tier.colorId.toString();
  return {
    key: priceColumnKey(tier.year, colorId, tier.currency),
    year: tier.year,
    colorId,
    currency: tier.currency,
    colorName: tier.color.name,
    colorCode: tier.color.code,
  };
}

function tierPrices(tier: TierRow): PriceListPrices {
  return Object.fromEntries(PRICE_TABLE_ALL_PRICE_KEYS.map((key) => [key, tier[key]])) as PriceListPrices;
}

/** What a viewer may see of the price list. */
interface Visibility {
  /** Verified collaborator viewer: collaborator prices are included. */
  showPartner: boolean;
  /** Price types in use (pricing settings); the others are blanked. */
  enabled: readonly PriceTablePriceField[];
}

/**
 * The tiers a viewer may see: collaborator prices are blanked unless
 * `showPartner`, disabled price types are blanked, and tiers left without any
 * visible price are dropped.
 */
function visibleTiers(
  tiers: Prisma.UserPriceTablePriceGetPayload<{ select: typeof tierSelect }>[],
  currency: PriceCurrency,
  sellerId: bigint,
  { showPartner, enabled }: Visibility
): TierRow[] {
  return tiers
    .map((tier) => ({ ...withEnabledPrices(withVisiblePrices(tier, showPartner), enabled), currency, sellerId: sellerId.toString() }))
    .filter(hasAnyPrice);
}

function groupByColumn(tiers: TierRow[]): Map<string, TierRow[]> {
  const groups = new Map<string, TierRow[]>();
  for (const tier of tiers) {
    const key = tierColumn(tier).key;
    groups.set(key, [...(groups.get(key) ?? []), tier]);
  }
  return groups;
}

/** Lowest price per field for each (year, colour) column among the given tiers. */
function lowestPricesByColumn(tiers: TierRow[]): PriceListPricesByColumn {
  return Object.fromEntries(Array.from(groupByColumn(tiers), ([key, rows]) => [key, lowestPrices(rows.map(tierPrices))]));
}

/** The seller (user id) behind each lowest price of each column; the first one on ties. */
function lowestSellersByColumn(tiers: TierRow[]): Record<string, Partial<Record<PriceTableAnyPriceField, string>>> {
  const result: Record<string, Partial<Record<PriceTableAnyPriceField, string>>> = {};
  groupByColumn(tiers).forEach((rows, column) => {
    const lowest = lowestPrices(rows.map(tierPrices));
    const sellers: Partial<Record<PriceTableAnyPriceField, string>> = {};
    for (const key of PRICE_TABLE_ALL_PRICE_KEYS) {
      const value = lowest[key];
      const seller = value ? rows.find((row) => row[key] === value)?.sellerId : undefined;
      if (seller) sellers[key] = seller;
    }
    result[column] = sellers;
  });
  return result;
}

/**
 * Every car the admin allowed in price tables, with the lowest raw, clearance
 * and instant price any active seller entered for it, per (year, colour).
 * Collaborator prices are included only when `showPartner` (verified collaborator
 * viewer); only the `enabled` price types (pricing settings) are included.
 * Each lowest price carries the public code of the seller who entered it.
 */
export async function listPriceListRows(
  showPartner: boolean,
  enabled: readonly PriceTablePriceField[] = ALL_PRICE_FIELD_KEYS
): Promise<PriceListRow[]> {
  const cars = await prisma.car.findMany({
    where: { priceTable: true },
    select: {
      ...carInfoSelect,
      priceTableEntries: {
        where: pricedEntryWhere,
        select: { userId: true, currency: true, prices: { select: tierSelect } },
      },
    },
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }, { id: "asc" }],
  });

  const visibility: Visibility = { showPartner, enabled };
  const rows = cars.map((car) => {
    const entries = car.priceTableEntries
      .map((entry) => visibleTiers(entry.prices, entry.currency, entry.userId, visibility))
      .filter((tiers) => tiers.length > 0);
    const tiers = entries.flat();
    return {
      ...toCarInfo(car),
      byColumn: lowestPricesByColumn(tiers),
      sellerCount: entries.length,
      columns: mergePriceColumns(tiers.map(tierColumn)),
      sellersByColumn: lowestSellersByColumn(tiers),
    };
  });

  // Swap seller ids for their current public codes; ids never leave the server.
  const sellerIds = new Set(rows.flatMap((row) => Object.values(row.sellersByColumn).flatMap((sellers) => Object.values(sellers))));
  const codes = await getActiveUserCodes(Array.from(sellerIds, (id) => BigInt(id)));
  for (const row of rows) {
    for (const sellers of Object.values(row.sellersByColumn)) {
      for (const key of Object.keys(sellers) as PriceTableAnyPriceField[]) {
        const code = codes.get(sellers[key]!)?.code;
        if (code) sellers[key] = code;
        else delete sellers[key];
      }
    }
  }
  return rows;
}

/** Lowest value of a field across all of a seller's tiers (`null` when none). */
function sellerLowest(offer: PriceListOffer, key: PriceTablePriceField): string | null {
  return lowestPrices(Object.values(offer.byColumn))[key];
}

/**
 * Sort sellers by currency (dollar rows first, prices of different currencies
 * are never compared), then by their lowest price of each enabled type, in
 * display order (blanks last).
 */
function compareOffers(a: PriceListOffer, b: PriceListOffer, enabled: readonly PriceTablePriceField[]): number {
  if (a.currency !== b.currency) return a.currency === "usd" ? -1 : 1;
  for (const key of enabled) {
    const x = sellerLowest(a, key);
    const y = sellerLowest(b, key);
    if (x === y) continue;
    if (x === null) return 1;
    if (y === null) return -1;
    return compareDigitPrices(x, y);
  }
  return a.sellerCode.localeCompare(b.sellerCode);
}

/**
 * One price-list car with every active seller's prices for it, one offer per
 * seller holding all of their (year, colour) tiers. Returns null for unknown
 * ids or cars the admin has not allowed in price tables. Collaborator prices
 * are included only when `showPartner`, and only the `enabled` price types.
 * `viewerId` marks the viewer's own offer (`null` for guests). Seller codes
 * are shown to everyone; pass `withSellerCodes: false` (page metadata) to skip
 * loading them.
 */
export async function getPriceListCarDetail(
  carIdRaw: string,
  showPartner: boolean,
  viewerId: string | null,
  {
    enabled = ALL_PRICE_FIELD_KEYS,
    withSellerCodes = true,
  }: { enabled?: readonly PriceTablePriceField[]; withSellerCodes?: boolean } = {}
): Promise<PriceListCarDetail | null> {
  if (!/^\d{1,20}$/.test(carIdRaw)) return null;

  const car = await prisma.car.findFirst({
    where: { id: BigInt(carIdRaw), priceTable: true },
    select: {
      ...carInfoSelect,
      carImages: { select: { imageUrl: true }, orderBy: [{ createdAt: "asc" }, { id: "asc" }] },
      priceTableEntries: {
        where: pricedEntryWhere,
        select: {
          updatedAt: true,
          userId: true,
          currency: true,
          prices: { select: tierSelect, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
        },
      },
    },
  });
  if (!car) return null;

  const visibility: Visibility = { showPartner, enabled };
  const entries = car.priceTableEntries
    .map((entry) => ({ ...entry, prices: visibleTiers(entry.prices, entry.currency, entry.userId, visibility) }))
    .filter((entry) => entry.prices.length > 0);

  const codes = withSellerCodes ? await getActiveUserCodes(entries.map((entry) => entry.userId)) : new Map();
  const offers: PriceListOffer[] = entries
    .map((entry) => ({
      currency: entry.currency,
      sellerCode: codes.get(entry.userId.toString())?.code ?? "",
      isMine: viewerId !== null && entry.userId.toString() === viewerId,
      byColumn: Object.fromEntries(entry.prices.map((tier) => [tierColumn(tier).key, tierPrices(tier)] as const)),
      updatedAt: entry.updatedAt.toISOString(),
      updatedAtLabel: jalaliDate.format(entry.updatedAt),
    }))
    .sort((a, b) => compareOffers(a, b, enabled));

  const tiers = entries.flatMap((entry) => entry.prices);
  return {
    car: {
      ...toCarInfo(car),
      images: car.carImages.map((image) => image.imageUrl).filter(Boolean),
    },
    offers,
    lowest: Object.fromEntries(
      PRICE_CURRENCIES.filter((currency) => tiers.some((tier) => tier.currency === currency)).map((currency) => [
        currency,
        lowestPrices(tiers.filter((tier) => tier.currency === currency).map(tierPrices)),
      ])
    ),
    lowestByColumn: lowestPricesByColumn(tiers),
    columns: mergePriceColumns(tiers.map(tierColumn)),
  };
}

/**
 * How many distinct active sellers have priced at least one price-list car
 * with a price of an enabled type (pricing settings).
 */
export async function countPriceListSellers(enabled: readonly PriceTablePriceField[] = ALL_PRICE_FIELD_KEYS): Promise<number> {
  const sellers = await prisma.userPriceTableEntry.groupBy({
    by: ["userId"],
    where: {
      ...pricedEntryWhere,
      car: { priceTable: true },
      prices: { some: { OR: priceKeysFor(enabled).map((key) => ({ [key]: { not: null } })) } },
    },
  });
  return sellers.length;
}
