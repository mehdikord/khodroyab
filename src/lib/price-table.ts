import "server-only";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";

/** A car the admin has allowed in price tables (the catalogue side of a row). */
export interface PriceTableCarRecord {
  id: string;
  name: string;
  brandName: string;
  carTypeName: string;
  model: string;
  year: string;
}

/** One year tier of a row: the three USD prices for a production year. */
export interface PriceTableTierRecord {
  /** Production year typed by the customer (independent of the car's catalogue year). */
  year: string;
  /** Raw price: digit-only USD string, e.g. "12500"; `null` when left blank. */
  priceUsd: string | null;
  /** Clearance price, same format as `priceUsd`. */
  clearancePrice: string | null;
  /** Instant price, same format as `priceUsd`. */
  instantPrice: string | null;
}

/** What a customer has entered for one car: a colour and one or more year tiers. */
export interface PriceTableEntryRecord {
  carId: string;
  colorId: string | null;
  colorName: string | null;
  /** Hex code of the chosen colour, e.g. "#ffffff". */
  colorCode: string | null;
  /** Year tiers in the customer's order (never empty for a saved entry). */
  tiers: PriceTableTierRecord[];
}

/**
 * One line of a customer's price table as displayed: every eligible car is a
 * row, and `entry` is `null` when the customer has not filled it in yet.
 */
export interface PriceTableRow {
  car: PriceTableCarRecord;
  entry: PriceTableEntryRecord | null;
}

const priceTableCarSelect = {
  id: true,
  name: true,
  model: true,
  year: true,
  brand: { select: { name: true } },
  carType: { select: { name: true } },
} satisfies Prisma.CarSelect;

type PriceTableCarRow = Prisma.CarGetPayload<{ select: typeof priceTableCarSelect }>;

function toCarRecord(car: PriceTableCarRow): PriceTableCarRecord {
  return {
    id: car.id.toString(),
    name: car.name,
    brandName: car.brand.name,
    carTypeName: car.carType.name,
    model: car.model,
    year: car.year,
  };
}

/** Every car the admin has flagged for price tables, sorted by brand then name. */
export async function listPriceTableCars(): Promise<PriceTableCarRecord[]> {
  const cars = await prisma.car.findMany({
    where: { priceTable: true },
    select: priceTableCarSelect,
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }, { year: "desc" }, { id: "asc" }],
  });
  return cars.map(toCarRecord);
}

/** The customer's saved entries, restricted to cars that are still eligible. */
export async function listUserPriceTableEntries(userId: bigint): Promise<PriceTableEntryRecord[]> {
  const entries = await prisma.userPriceTableEntry.findMany({
    where: { userId, car: { priceTable: true } },
    select: {
      carId: true,
      colorId: true,
      color: { select: { name: true, code: true } },
      prices: {
        select: { year: true, priceUsd: true, clearancePrice: true, instantPrice: true },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      },
    },
    orderBy: { id: "asc" },
  });
  return entries.map((entry) => ({
    carId: entry.carId.toString(),
    colorId: entry.colorId?.toString() ?? null,
    colorName: entry.color?.name ?? null,
    colorCode: entry.color?.code ?? null,
    tiers: entry.prices,
  }));
}

/** Merge eligible cars with a customer's entries into display rows (one per car). */
export function buildPriceTableRows(cars: PriceTableCarRecord[], entries: PriceTableEntryRecord[]): PriceTableRow[] {
  const byCar = new Map(entries.map((entry) => [entry.carId, entry]));
  return cars.map((car) => ({ car, entry: byCar.get(car.id) ?? null }));
}

/** Full price table of one user: all eligible cars, with "---" gaps left as `null`. */
export async function getUserPriceTableRows(userId: bigint): Promise<PriceTableRow[]> {
  const [cars, entries] = await Promise.all([listPriceTableCars(), listUserPriceTableEntries(userId)]);
  return buildPriceTableRows(cars, entries);
}
