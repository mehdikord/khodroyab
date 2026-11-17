"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/user-auth";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { replaceUserPriceTable, type SavePriceTableResult } from "@/lib/price-table";
import { parsePriceTableForm } from "@/lib/validation/price-table";
import { getEnabledPriceFields } from "@/lib/system-settings";
import { isPriceMarket } from "@/lib/price-market";

const UNAUTHENTICATED_MESSAGE = "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type { SavePriceTableResult };

function parseBigInt(value: string): bigint | null {
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

/** Only collaborators whose identity is verified may save a price table. */
async function guardRequest(): Promise<{ ok: false; message: string } | { ok: true; userId: bigint }> {
  if (!(await isTrustedOrigin())) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  if (!user.collabrate) return { ok: false, message: "ثبت جدول قیمت فقط برای کاربران همکار امکان‌پذیر است." };
  if (!user.authenticaed) {
    return { ok: false, message: "حساب کاربری شما احراز هویت نشده است؛ برای ثبت جدول قیمت ابتدا احراز هویت خود را انجام دهید." };
  }
  const userId = parseBigInt(user.id);
  if (userId === null) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  return { ok: true, userId };
}

/**
 * Replace one price list (free zone / national plate) of the customer's own
 * price table with the submitted rows (see `replaceUserPriceTable`).
 */
export async function saveMyPriceTableAction(market: string, formData: FormData): Promise<SavePriceTableResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;
  const { userId } = guard;
  if (!isPriceMarket(market)) return { ok: false, message: GENERIC_FAILURE_MESSAGE };

  const enabled = await getEnabledPriceFields();
  const parsed = parsePriceTableForm(formData, enabled);
  if (!parsed.success) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };

  const result = await replaceUserPriceTable(userId, market, parsed.entries, enabled);
  if (result.ok) {
    revalidatePath("/panel/price-table");
    revalidatePath("/panel/price-list", "layout");
    revalidatePath(`/admin/users/${userId.toString()}`);
  }
  return result;
}
