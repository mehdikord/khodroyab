"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/user-auth";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { listUserPriceTableEntries, type PriceTableEntryRecord } from "@/lib/price-table";
import { parsePriceTableForm } from "@/lib/validation/price-table";

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

/**
 * Replace the customer's price table with the submitted rows.
 *
 * - Only cars the admin has flagged (`cars.price_table`) are accepted.
 * - Eligible cars missing from the submission are removed from the table.
 * - Entries for cars that are currently *not* eligible are left untouched, so
 *   they reappear if the admin re-enables the car later.
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
        fieldErrors[`${entry.carId}.priceUsd`] = "این خودرو دیگر برای جدول قیمت مجاز نیست";
      }
    }
    if (Object.keys(fieldErrors).length > 0) {
      return {
        ok: false,
        message: "برخی از خودروهای انتخاب‌شده دیگر برای جدول قیمت مجاز نیستند؛ صفحه را به‌روزرسانی کنید",
        fieldErrors,
      };
    }

    const submittedIds = parsed.entries.map((entry) => BigInt(entry.carId));

    await prisma.$transaction([
      prisma.userPriceTableEntry.deleteMany({
        where: { userId, carId: { in: eligibleIds, notIn: submittedIds } },
      }),
      ...parsed.entries.map((entry) =>
        prisma.userPriceTableEntry.upsert({
          where: { userId_carId: { userId, carId: BigInt(entry.carId) } },
          create: { userId, carId: BigInt(entry.carId), color: entry.color, priceUsd: entry.priceUsd },
          update: { color: entry.color, priceUsd: entry.priceUsd },
        })
      ),
    ]);

    revalidatePath("/panel/price-table");
    revalidatePath(`/panel/sellers/${userId.toString()}`);

    return { ok: true, entries: await listUserPriceTableEntries(userId) };
  } catch (error) {
    console.error("[price-table:save] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
