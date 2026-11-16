import "server-only";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import {
  ALL_PRICE_FIELD_KEYS,
  PRICE_TABLE_ALL_PRICE_KEYS,
  hasAnyPrice,
  priceKeysFor,
  withEnabledPrices,
  withVisiblePrices,
  type PriceTableAnyPriceField,
  type PriceTablePriceField,
} from "@/lib/price-table-shared";
import type { PriceTableEntryInput } from "@/lib/validation/price-table";
import type { PriceCurrency } from "@/lib/currency";
import type { PriceMarket } from "@/lib/price-market";

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
 * The customer's saved entries of one price list (`market`), restricted to
 * cars that are still eligible. Pass `showPartner = false` for viewers who may not see collaborator prices:
 * those are blanked, and tiers left without any visible price are dropped.
 * `enabled` (pricing settings) blanks the disabled price types the same way.
 */
export async function listUserPriceTableEntries(
  userId: bigint,
  market: PriceMarket,
  showPartner = true,
  enabled: readonly PriceTablePriceField[] = ALL_PRICE_FIELD_KEYS
): Promise<PriceTableEntryRecord[]> {
  const entries = await prisma.userPriceTableEntry.findMany({
    where: { userId, market, car: { priceTable: true } },
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
          ...withEnabledPrices(withVisiblePrices(tier, showPartner), enabled),
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
  /** Price list of the row (free zone / national plate). */
  market: PriceMarket;
  currency: PriceCurrency;
  tiers: PriceTableTierRecord[];
  updatedAtLabel: string;
}

const faDate = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" });

/**
 * The user's most recently saved rows of both price lists (eligible cars
 * only), newest first, plus how many rows they have in each list. Every price
 * of the `enabled` types is included (admin view).
 */
export async function listRecentUserPriceTableEntries(
  userId: bigint,
  take: number,
  enabled: readonly PriceTablePriceField[] = ALL_PRICE_FIELD_KEYS
): Promise<{ total: number; totals: Record<PriceMarket, number>; entries: RecentPriceTableEntryRecord[] }> {
  const where = { userId, car: { priceTable: true }, prices: { some: {} } } satisfies Prisma.UserPriceTableEntryWhereInput;
  const [groups, rows] = await Promise.all([
    prisma.userPriceTableEntry.groupBy({ by: ["market"], where, _count: { _all: true } }),
    prisma.userPriceTableEntry.findMany({
      where,
      select: {
        updatedAt: true,
        market: true,
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
  const totals: Record<PriceMarket, number> = { free_zone: 0, national: 0 };
  for (const group of groups) totals[group.market] = group._count._all;
  return {
    total: totals.free_zone + totals.national,
    totals,
    entries: rows.map((row) => ({
      car: toCarRecord(row.car),
      market: row.market,
      currency: row.currency,
      tiers: row.prices
        .map(({ color, colorId, ...tier }) => ({
          ...withEnabledPrices(tier, enabled),
          colorId: colorId.toString(),
          colorName: color.name,
          colorCode: color.code,
        }))
        .filter(hasAnyPrice),
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

type StoredTier = Pick<PriceTableEntryInput["tiers"][number], "year" | PriceTableAnyPriceField> & { colorId: bigint };

/**
 * Fold the stored prices of disabled price types back into the submission
 * (see `replaceUserPriceTable`). Stored rows that were not submitted but hold
 * tiers with only disabled prices are re-submitted with just those tiers.
 */
function mergeDisabledPrices(
  submitted: PriceTableEntryInput[],
  existing: { carId: bigint; currency: PriceCurrency; prices: StoredTier[] }[],
  enabled: readonly PriceTablePriceField[]
): PriceTableEntryInput[] {
  const enabledKeys = priceKeysFor(enabled);
  const disabledKeys = PRICE_TABLE_ALL_PRICE_KEYS.filter((key) => !enabledKeys.includes(key));
  if (disabledKeys.length === 0) return submitted;

  const comboOf = (tier: { year: string; colorId: string | bigint }) => `${tier.year}:${tier.colorId.toString()}`;
  const hiddenOnly = (tier: StoredTier) => enabledKeys.every((key) => !tier[key]) && disabledKeys.some((key) => tier[key]);
  const toInput = (tier: StoredTier): PriceTableEntryInput["tiers"][number] => ({
    ...(Object.fromEntries(PRICE_TABLE_ALL_PRICE_KEYS.map((key) => [key, tier[key]])) as Record<PriceTableAnyPriceField, string | null>),
    year: tier.year,
    colorId: tier.colorId.toString(),
  });

  const storedByCar = new Map(existing.map((entry) => [entry.carId.toString(), entry]));
  const submittedIds = new Set(submitted.map((entry) => entry.carId));
  const rows: PriceTableEntryInput[] = [
    ...submitted,
    ...existing
      .filter((entry) => !submittedIds.has(entry.carId.toString()) && entry.prices.some(hiddenOnly))
      .map((entry) => ({ carId: entry.carId.toString(), currency: entry.currency, tiers: [] })),
  ];

  return rows.map((entry) => {
    const stored = storedByCar.get(entry.carId);
    if (!stored) return entry;
    const storedByCombo = new Map(stored.prices.map((tier) => [comboOf(tier), tier]));
    const combos = new Set<string>();
    const tiers = entry.tiers.map((tier) => {
      combos.add(comboOf(tier));
      const old = storedByCombo.get(comboOf(tier));
      if (!old) return tier;
      const merged = { ...tier };
      for (const key of disabledKeys) merged[key] = old[key];
      return merged;
    });
    for (const old of stored.prices) {
      if (!combos.has(comboOf(old)) && hiddenOnly(old)) tiers.push(toInput(old));
    }
    return { ...entry, tiers };
  });
}

/**
 * Replace one price list (`market`) of a user's price table with the
 * validated rows; the other list is never touched. Shared by the customer's
 * own editor and the admin's editor; callers authorise and revalidate.
 *
 * - Only cars the admin has flagged (`cars.price_table`) are accepted.
 * - Eligible cars missing from the submission are removed from the table.
 * - Entries for cars that are currently *not* eligible are left untouched, so
 *   they reappear if the admin re-enables the car later.
 * - Each submitted row's (year, colour) tiers replace the stored ones; rows
 *   whose tiers are unchanged are not rewritten.
 * - Price types disabled in the pricing settings (not in `enabled`) are never
 *   taken from the submission: a submitted tier keeps the stored values of
 *   those types, and stored tiers holding only disabled prices (invisible in
 *   the editor) are kept as they are, so re-enabling a type brings them back.
 */
export async function replaceUserPriceTable(
  userId: bigint,
  market: PriceMarket,
  submitted: PriceTableEntryInput[],
  enabled: readonly PriceTablePriceField[] = ALL_PRICE_FIELD_KEYS
): Promise<SavePriceTableResult> {
  try {
    const eligible = await prisma.car.findMany({ where: { priceTable: true }, select: { id: true } });
    const eligibleIds = eligible.map((car) => car.id);
    const eligibleSet = new Set(eligibleIds.map((id) => id.toString()));

    const fieldErrors: Record<string, string> = {};
    for (const entry of submitted) {
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
      new Set(submitted.flatMap((entry) => entry.tiers.map((tier) => tier.colorId))),
      (id) => BigInt(id)
    );
    const existingColors = await prisma.color.findMany({ where: { id: { in: colorIds } }, select: { id: true } });
    const colorSet = new Set(existingColors.map((color) => color.id.toString()));
    for (const entry of submitted) {
      entry.tiers.forEach((tier, index) => {
        if (!colorSet.has(tier.colorId)) {
          fieldErrors[`${entry.carId}.${index}.colorId`] = "این رنگ دیگر وجود ندارد؛ رنگ دیگری انتخاب کنید";
        }
      });
    }
    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, message: "برخی از رنگ‌های انتخاب‌شده حذف شده‌اند؛ صفحه را به‌روزرسانی کنید", fieldErrors };
    }

    const existing = await prisma.userPriceTableEntry.findMany({
      where: { userId, market, carId: { in: eligibleIds } },
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
    const entries = mergeDisabledPrices(submitted, existing, enabled);
    const submittedIds = entries.map((entry) => BigInt(entry.carId));

    const existingSignature = new Map(
      existing.map((entry) => [entry.carId.toString(), `${entry.currency}|${entrySignature(entry.prices)}`])
    );
    const changed = entries.filter(
      (entry) => existingSignature.get(entry.carId) !== `${entry.currency}|${entrySignature(entry.tiers)}`
    );

    await prisma.$transaction(
      async (tx) => {
        await tx.userPriceTableEntry.deleteMany({
          where: { userId, market, carId: { in: eligibleIds, notIn: submittedIds } },
        });

        for (const entry of changed) {
          const carId = BigInt(entry.carId);
          const saved = await tx.userPriceTableEntry.upsert({
            where: { userId_carId_market: { userId, carId, market } },
            create: { userId, carId, market, currency: entry.currency },
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

    return { ok: true, entries: await listUserPriceTableEntries(userId, market, true, enabled) };
  } catch (error) {
    console.error("[price-table:save] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
