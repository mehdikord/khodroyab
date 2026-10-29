"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/user-auth";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { listUserPriceTableEntries, type PriceTableEntryRecord } from "@/lib/price-table";
import { parsePriceTableForm, type PriceTableEntryInput } from "@/lib/validation/price-table";

const UNAUTHENTICATED_MESSAGE = "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type SavePriceTableResult =
  | { ok: true; entries: PriceTableEntryRecord[] }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

function parseBigInt(value: string): bigint | null {
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

async function guardRequest(): Promise<{ ok: false; message: string } | { ok: true; userId: bigint }> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  const userId = parseBigInt(user.id);
  if (userId === null) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  return { ok: true, userId };
}

type TierSignatureInput = Pick<PriceTableEntryInput["tiers"][number], "year" | "priceUsd" | "clearancePrice" | "instantPrice"> & {
  colorId: string | bigint;
};

/** Stable comparison key of a row's tiers, to skip rows that did not change. */
function entrySignature(tiers: TierSignatureInput[]): string {
  return JSON.stringify(
    tiers.map((tier) => [tier.year, tier.colorId.toString(), tier.priceUsd, tier.clearancePrice, tier.instantPrice])
  );
}

/**
 * Replace the customer's price table with the submitted rows.
 *
 * - Only cars the admin has flagged (`cars.price_table`) are accepted.
 * - Eligible cars missing from the submission are removed from the table.
 * - Entries for cars that are currently *not* eligible are left untouched, so
 *   they reappear if the admin re-enables the car later.
 * - Each submitted row's (year, colour) tiers replace the stored ones; rows
 *   whose tiers are unchanged are not rewritten.
 */
export async function saveMyPriceTableAction(formData: FormData): Promise<SavePriceTableResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;
  const { userId } = guard;

  const parsed = parsePriceTableForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };

  try {
    const eligible = await prisma.car.findMany({ where: { priceTable: true }, select: { id: true } });
    const eligibleIds = eligible.map((car) => car.id);
    const eligibleSet = new Set(eligibleIds.map((id) => id.toString()));

    const fieldErrors: Record<string, string> = {};
    for (const entry of parsed.entries) {
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
      new Set(parsed.entries.flatMap((entry) => entry.tiers.map((tier) => tier.colorId))),
      (id) => BigInt(id)
    );
    const existingColors = await prisma.color.findMany({ where: { id: { in: colorIds } }, select: { id: true } });
    const colorSet = new Set(existingColors.map((color) => color.id.toString()));
    for (const entry of parsed.entries) {
      entry.tiers.forEach((tier, index) => {
        if (!colorSet.has(tier.colorId)) {
          fieldErrors[`${entry.carId}.${index}.colorId`] = "این رنگ دیگر وجود ندارد؛ رنگ دیگری انتخاب کنید";
        }
      });
    }
    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, message: "برخی از رنگ‌های انتخاب‌شده حذف شده‌اند؛ صفحه را به‌روزرسانی کنید", fieldErrors };
    }

    const submittedIds = parsed.entries.map((entry) => BigInt(entry.carId));

    const existing = await prisma.userPriceTableEntry.findMany({
      where: { userId, carId: { in: submittedIds } },
      select: {
        carId: true,
        prices: {
          select: { year: true, colorId: true, priceUsd: true, clearancePrice: true, instantPrice: true },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
      },
    });
    const existingSignature = new Map(
      existing.map((entry) => [entry.carId.toString(), entrySignature(entry.prices)])
    );
    const changed = parsed.entries.filter(
      (entry) => existingSignature.get(entry.carId) !== entrySignature(entry.tiers)
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
            create: { userId, carId },
            // Touch `updatedAt`: the row itself has no other column that changes.
            update: { updatedAt: new Date() },
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

    revalidatePath("/panel/price-table");
    revalidatePath("/panel/price-list", "layout");
    revalidatePath(`/panel/sellers/${userId.toString()}`);

    return { ok: true, entries: await listUserPriceTableEntries(userId) };
  } catch (error) {
    console.error("[price-table:save] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
