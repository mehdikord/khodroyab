"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { adminActionDenied } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { replaceUserPriceTable, type SavePriceTableResult } from "@/lib/price-table";
import { parsePriceTableForm } from "@/lib/validation/price-table";

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

function parseBigInt(value: string): bigint | null {
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

/**
 * Replace a collaborator's price table on their behalf (see
 * `replaceUserPriceTable`). Unlike the customer's own editor, the admin may
 * edit it whether or not the user's identity is verified yet.
 */
export async function saveUserPriceTableAction(userIdRaw: string, formData: FormData): Promise<SavePriceTableResult> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const denied = await adminActionDenied("price_table");
  if (denied) return { ok: false, message: denied };

  const userId = parseBigInt(userIdRaw);
  if (userId === null) return { ok: false, message: "شناسه کاربر نامعتبر است" };

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { collabrate: true } });
  if (!user) return { ok: false, message: "کاربر یافت نشد" };
  if (!user.collabrate) return { ok: false, message: "جدول قیمت فقط برای کاربران همکار قابل ثبت است." };

  const parsed = parsePriceTableForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };

  const result = await replaceUserPriceTable(userId, parsed.entries);
  if (result.ok) {
    revalidatePath(`/admin/users/${userId.toString()}`);
    revalidatePath(`/admin/users/${userId.toString()}/price-table`);
    revalidatePath("/panel/price-table");
    revalidatePath("/panel/price-list", "layout");
    revalidatePath(`/panel/sellers/${userId.toString()}`);
  }
  return result;
}
