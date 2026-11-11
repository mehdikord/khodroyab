import "server-only";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import {
  PRICE_TABLE_ALL_PRICE_KEYS,
  hasAnyPrice,
  withVisiblePrices,
  type PriceTableAnyPriceField,
} from "@/lib/price-table-shared";
import type { PriceTableEntryInput } from "@/lib/validation/price-table";
import type { PriceCurrency } from "@/lib/currency";

/** A car the admin has allowed in price tables (the catalogue side of a row). */
export interface PriceTableCarRecord {
  id: string;
  name: string;
  brandName: string;
  carTypeName: string;
  model: string;
}

/**
 * One tier of a row: the three prices (in the row's currency) for a (production year, colour)
 * pair, each with a public and a collaborator value.
 */
export interface PriceTableTierRecord {
  /** Production year typed by the customer (independent of any sale ad's year). */
  year: string;
  colorId: string;
  colorName: string;
  /** Hex code of the colour, e.g. "#ffffff". */
  colorCode: string;
  /** Raw price: digit-only USD string, e.g. "12500"; `null` when left blank. */
  priceUsd: string | null;
  /** Clearance price, same format as `priceUsd`. */
  clearancePrice: string | null;
  /** Instant price, same format as `priceUsd`. */
  instantPrice: string | null;
  /** Collaborator raw / clearance / instant prices; `null` when blank or hidden from the viewer. */
  partnerPriceUsd: string | null;
  partnerClearancePrice: string | null;
  partnerInstantPrice: string | null;
}

/** What a customer has entered for one car: one or more (year, colour) price tiers. */
export interface PriceTableEntryRecord {
  carId: string;
  /** Currency of every price of the row. */
  currency: PriceCurrency;
  /** Tiers in the customer's order (never empty for a saved entry). */
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
  };
}

/** Every car the admin has flagged for price tables, sorted by brand then name. */
export async function listPriceTableCars(): Promise<PriceTableCarRecord[]> {
  const cars = await prisma.car.findMany({
    where: { priceTable: true },
    select: priceTableCarSelect,
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }, { id: "asc" }],
  });
  return cars.map(toCarRecord);
}

/**
 * The customer's saved entries, restricted to cars that are still eligible.
 * Pass `showPartner = false` for viewers who may not see collaborator prices:
 * those are blanked, and tiers left without any visible price are dropped.
 */
export async function listUserPriceTableEntries(userId: bigint, showPartner = true): Promise<PriceTableEntryRecord[]> {
  const entries = await prisma.userPriceTableEntry.findMany({
    where: { userId, car: { priceTable: true } },
    select: {
      carId: true,
      currency: true,
      prices: {
        select: {
          year: true,
          colorId: true,
          priceUsd: true,
          clearancePrice: true,
          instantPrice: true,
          partnerPriceUsd: true,
          partnerClearancePrice: true,
          partnerInstantPrice: true,
          color: { select: { name: true, code: true } },
        },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      },
    },
    orderBy: { id: "asc" },
  });
  return entries
    .map((entry) => ({
      carId: entry.carId.toString(),
      currency: entry.currency,
      tiers: entry.prices
        .map(({ color, colorId, ...tier }) => ({
          ...withVisiblePrices(tier, showPartner),
          colorId: colorId.toString(),
          colorName: color.name,
          colorCode: color.code,
        }))
        .filter(hasAnyPrice),
    }))
    .filter((entry) => entry.tiers.length > 0);
}

/** Merge eligible cars with a customer's entries into display rows (one per car). */
export function buildPriceTableRows(cars: PriceTableCarRecord[], entries: PriceTableEntryRecord[]): PriceTableRow[] {
  const byCar = new Map(entries.map((entry) => [entry.carId, entry]));
  return cars.map((car) => ({ car, entry: byCar.get(car.id) ?? null }));
}

/* ───────────────────────── Recent rows (admin preview) ───────────────────────── */

/** A saved row of a user's price table with its car, for short previews. */
export interface RecentPriceTableEntryRecord {
  car: PriceTableCarRecord;
  currency: PriceCurrency;
  tiers: PriceTableTierRecord[];
  updatedAtLabel: string;
}

const faDate = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" });

/**
 * The user's most recently saved rows (eligible cars only), newest first, plus
 * how many rows they have in total. Every price is included (admin view).
 */
export async function listRecentUserPriceTableEntries(
  userId: bigint,
  take: number
): Promise<{ total: number; entries: RecentPriceTableEntryRecord[] }> {
  const where = { userId, car: { priceTable: true }, prices: { some: {} } } satisfies Prisma.UserPriceTableEntryWhereInput;
  const [total, rows] = await Promise.all([
    prisma.userPriceTableEntry.count({ where }),
    prisma.userPriceTableEntry.findMany({
      where,
      select: {
        updatedAt: true,
        currency: true,
        car: { select: priceTableCarSelect },
        prices: {
          select: {
            year: true,
            colorId: true,
            priceUsd: true,
            clearancePrice: true,
            instantPrice: true,
            partnerPriceUsd: true,
            partnerClearancePrice: true,
            partnerInstantPrice: true,
            color: { select: { name: true, code: true } },
          },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
      },
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      take,
    }),
  ]);
  return {
    total,
    entries: rows.map((row) => ({
      car: toCarRecord(row.car),
      currency: row.currency,
      tiers: row.prices.map(({ color, colorId, ...tier }) => ({
        ...tier,
        colorId: colorId.toString(),
        colorName: color.name,
        colorCode: color.code,
      })),
      updatedAtLabel: faDate.format(row.updatedAt),
    })),
  };
}

/* ───────────────────────── Saving ───────────────────────── */

export type SavePriceTableResult =
  | { ok: true; entries: PriceTableEntryRecord[] }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

type TierSignatureInput = Pick<PriceTableEntryInput["tiers"][number], "year" | PriceTableAnyPriceField> & {
  colorId: string | bigint;
};

/** Stable comparison key of a row's tiers, to skip rows that did not change. */
function entrySignature(tiers: TierSignatureInput[]): string {
  return JSON.stringify(
    tiers.map((tier) => [tier.year, tier.colorId.toString(), ...PRICE_TABLE_ALL_PRICE_KEYS.map((key) => tier[key])])
  );
}

/**
 * Replace a user's price table with the validated rows. Shared by the
 * customer's own editor and the admin's editor; callers authorise and
 * revalidate.
 *
 * - Only cars the admin has flagged (`cars.price_table`) are accepted.
 * - Eligible cars missing from the submission are removed from the table.
 * - Entries for cars that are currently *not* eligible are left untouched, so
 *   they reappear if the admin re-enables the car later.
 * - Each submitted row's (year, colour) tiers replace the stored ones; rows
 *   whose tiers are unchanged are not rewritten.
 */
export async function replaceUserPriceTable(userId: bigint, entries: PriceTableEntryInput[]): Promise<SavePriceTableResult> {
  try {
    const eligible = await prisma.car.findMany({ where: { priceTable: true }, select: { id: true } });
    const eligibleIds = eligible.map((car) => car.id);
    const eligibleSet = new Set(eligibleIds.map((id) => id.toString()));

    const fieldErrors: Record<string, string> = {};
    for (const entry of entries) {
      if (!eligibleSet.has(entry.carId)) {
        fieldErrors[`${entry.carId}.tiers`] = "این خودرو دیگر برای جدول قیمت مجاز نیست";
      }
    }
    if (Object.keys(fieldErrors).length > 0) {
      return {
        ok: false,
        message: "برخی از خودروهای انتخاب‌شده دیگر برای جدول قیمت مجاز نیستند؛ صفحه را به‌روزرسانی کنید",
        fieldErrors,
      };
    }

    const colorIds = Array.from(
      new Set(entries.flatMap((entry) => entry.tiers.map((tier) => tier.colorId))),
      (id) => BigInt(id)
    );
    const existingColors = await prisma.color.findMany({ where: { id: { in: colorIds } }, select: { id: true } });
    const colorSet = new Set(existingColors.map((color) => color.id.toString()));
    for (const entry of entries) {
      entry.tiers.forEach((tier, index) => {
        if (!colorSet.has(tier.colorId)) {
          fieldErrors[`${entry.carId}.${index}.colorId`] = "این رنگ دیگر وجود ندارد؛ رنگ دیگری انتخاب کنید";
        }
      });
    }
    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, message: "برخی از رنگ‌های انتخاب‌شده حذف شده‌اند؛ صفحه را به‌روزرسانی کنید", fieldErrors };
    }

    const submittedIds = entries.map((entry) => BigInt(entry.carId));

    const existing = await prisma.userPriceTableEntry.findMany({
      where: { userId, carId: { in: submittedIds } },
      select: {
        carId: true,
        currency: true,
        prices: {
          select: {
            year: true,
            colorId: true,
            priceUsd: true,
            clearancePrice: true,
            instantPrice: true,
            partnerPriceUsd: true,
            partnerClearancePrice: true,
            partnerInstantPrice: true,
          },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
      },
    });
    const existingSignature = new Map(
      existing.map((entry) => [entry.carId.toString(), `${entry.currency}|${entrySignature(entry.prices)}`])
    );
    const changed = entries.filter(
      (entry) => existingSignature.get(entry.carId) !== `${entry.currency}|${entrySignature(entry.tiers)}`
    );

    await prisma.$transaction(
      async (tx) => {
        await tx.userPriceTableEntry.deleteMany({
          where: { userId, carId: { in: eligibleIds, notIn: submittedIds } },
        });

        for (const entry of changed) {
          const carId = BigInt(entry.carId);
          const saved = await tx.userPriceTableEntry.upsert({
            where: { userId_carId: { userId, carId } },
            create: { userId, carId, currency: entry.currency },
            // Always touch `updatedAt`, even when only the tiers changed.
            update: { currency: entry.currency, updatedAt: new Date() },
            select: { id: true },
          });
          await tx.userPriceTablePrice.deleteMany({ where: { entryId: saved.id } });
          await tx.userPriceTablePrice.createMany({
            data: entry.tiers.map((tier, index) => ({
              ...tier,
              entryId: saved.id,
              colorId: BigInt(tier.colorId),
              sortOrder: index,
            })),
          });
        }
      },
      { timeout: 30_000 }
    );

    return { ok: true, entries: await listUserPriceTableEntries(userId) };
  } catch (error) {
    console.error("[price-table:save] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
