"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { colorToRecord, type ColorRecord } from "@/lib/colors";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { parseColorForm } from "@/lib/validation/colors";

const UNAUTHENTICATED_MESSAGE =
  "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

const DUPLICATE_NAME_RESULT = {
  ok: false as const,
  message: "رنگی با این نام از قبل وجود دارد",
  fieldErrors: { name: "این نام قبلاً ثبت شده است" },
};

/** Success result carrying the affected record. */
export type ColorActionResult =
  | { ok: true; record: ColorRecord }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/** Bare result for operations that do not return a record. */
export type ColorSimpleActionResult =
  | { ok: true }
  | { ok: false; message: string };

function isPrismaCode(error: unknown, code: string): boolean {
  if (typeof error === "object" && error !== null && "code" in error) {
    return (error as { code?: unknown }).code === code;
  }
  return false;
}

/** Enforce an authenticated, same-origin request for every mutation. */
async function guardRequest(): Promise<
  { ok: false; message: string } | null
> {
  if (!isTrustedOrigin()) {
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
  if (!(await getCurrentAdmin())) {
    return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  }
  return null;
}

/** Colours appear on the cars page and in every customer's price table. */
function revalidateColorPages() {
  revalidatePath("/admin/colors");
  revalidatePath("/admin/cars");
  revalidatePath("/panel/price-table");
  revalidatePath("/panel/sellers/[id]", "page");
}

export async function createColorAction(
  formData: FormData
): Promise<ColorActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const parsed = parseColorForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };
  }

  const existing = await prisma.color.findFirst({
    where: { name: parsed.data.name },
    select: { id: true },
  });
  if (existing) return DUPLICATE_NAME_RESULT;

  try {
    const color = await prisma.color.create({
      data: { name: parsed.data.name, code: parsed.data.code },
    });
    revalidateColorPages();
    return { ok: true, record: colorToRecord(color) };
  } catch (error) {
    if (isPrismaCode(error, "P2002")) return DUPLICATE_NAME_RESULT;
    console.error("[colors:create] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function updateColorAction(
  id: string,
  formData: FormData
): Promise<ColorActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  let colorId: bigint;
  try {
    colorId = BigInt(id);
  } catch {
    return { ok: false, message: "شناسه رنگ نامعتبر است" };
  }

  const parsed = parseColorForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };
  }

  const existing = await prisma.color.findFirst({
    where: { name: parsed.data.name, NOT: { id: colorId } },
    select: { id: true },
  });
  if (existing) return DUPLICATE_NAME_RESULT;

  try {
    const color = await prisma.color.update({
      where: { id: colorId },
      data: { name: parsed.data.name, code: parsed.data.code },
    });
    revalidateColorPages();
    return { ok: true, record: colorToRecord(color) };
  } catch (error) {
    if (isPrismaCode(error, "P2002")) return DUPLICATE_NAME_RESULT;
    console.error("[colors:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function deleteColorAction(
  id: string
): Promise<ColorSimpleActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  let colorId: bigint;
  try {
    colorId = BigInt(id);
  } catch {
    return { ok: false, message: "شناسه رنگ نامعتبر است" };
  }

  try {
    await prisma.color.delete({ where: { id: colorId } });
  } catch (error) {
    if (isPrismaCode(error, "P2003")) {
      return {
        ok: false,
        message:
          "این رنگ برای خودروها یا جدول قیمت کاربران استفاده شده است و امکان حذف آن وجود ندارد. ابتدا رنگ آن موارد را تغییر دهید.",
      };
    }
    console.error("[colors:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  revalidateColorPages();
  return { ok: true };
}
