"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { optionRecordInclude, optionToRecord, type OptionRecord } from "@/lib/options";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { parseOptionForm } from "@/lib/validation/options";

const UNAUTHENTICATED_MESSAGE =
  "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type OptionActionResult =
  | { ok: true; record: OptionRecord }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export type OptionSimpleActionResult =
  | { ok: true }
  | { ok: false; message: string };

function isPrismaCode(error: unknown, code: string): boolean {
  if (typeof error === "object" && error !== null && "code" in error) {
    return (error as { code?: unknown }).code === code;
  }
  return false;
}

/** The options drive the ad form, so its pages must see every change. */
function revalidateOptionPages() {
  revalidatePath("/admin/car-form");
  revalidatePath("/admin/ads");
  revalidatePath("/panel/ads");
}

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

export async function createOptionAction(
  formData: FormData
): Promise<OptionActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const parsed = parseOptionForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.message,
      fieldErrors: parsed.fieldErrors,
    };
  }

  // Check unique option name
  const existing = await prisma.option.findFirst({
    where: { name: parsed.data.name },
    select: { id: true },
  });
  if (existing) {
    return {
      ok: false,
      message: "ویژگی دیگری با این نام از قبل وجود دارد",
      fieldErrors: { name: "این نام قبلاً ثبت شده است" },
    };
  }

  try {
    const created = await prisma.option.create({
      data: {
        name: parsed.data.name,
        type: parsed.data.type,
        multiple: parsed.data.multiple,
        isRequired: parsed.data.isRequired,
        description: parsed.data.description,
        optionItems:
          parsed.data.items.length > 0
            ? { create: parsed.data.items.map((item) => ({ title: item.title })) }
            : undefined,
      },
      include: optionRecordInclude,
    });

    revalidateOptionPages();
    return { ok: true, record: optionToRecord(created) };
  } catch (error) {
    console.error("[options:create] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function updateOptionAction(
  id: string,
  formData: FormData
): Promise<OptionActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  let optionId: bigint;
  try {
    optionId = BigInt(id);
  } catch {
    return { ok: false, message: "شناسه ویژگی نامعتبر است" };
  }

  const parsed = parseOptionForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.message,
      fieldErrors: parsed.fieldErrors,
    };
  }

  const existing = await prisma.option.findFirst({
    where: { name: parsed.data.name, NOT: { id: optionId } },
    select: { id: true },
  });
  if (existing) {
    return {
      ok: false,
      message: "ویژگی دیگری با این نام از قبل وجود دارد",
      fieldErrors: { name: "این نام قبلاً ثبت شده است" },
    };
  }

  const current = await prisma.option.findUnique({
    where: { id: optionId },
    include: { optionItems: { select: { id: true } }, _count: { select: { userCars: true } } },
  });
  if (!current) return { ok: false, message: "ویژگی یافت نشد" };

  // Stored ad values depend on the type and on single/multiple selection.
  if (current._count.userCars > 0) {
    if (current.type !== parsed.data.type) {
      return {
        ok: false,
        message: "این ویژگی در آگهی‌ها مقدار دارد و نوع آن قابل تغییر نیست.",
        fieldErrors: { type: "نوع ویژگی استفاده‌شده قابل تغییر نیست" },
      };
    }
    if (current.multiple && !parsed.data.multiple) {
      return {
        ok: false,
        message: "این ویژگی در آگهی‌ها مقدار دارد و نمی‌توان آن را به انتخاب تکی برگرداند.",
        fieldErrors: { multiple: "حالت چند انتخابی این ویژگی قابل تغییر نیست" },
      };
    }
  }

  // Items keep their ids across edits so renaming one updates every ad showing it.
  const currentItemIds = new Set(current.optionItems.map((item) => item.id.toString()));
  const keptItems = parsed.data.items.filter((item) => item.id && currentItemIds.has(item.id));
  const keptItemIds = new Set(keptItems.map((item) => item.id));
  const newItems = parsed.data.items.filter((item) => !keptItems.includes(item));
  const removedItemIds = current.optionItems.map((item) => item.id).filter((itemId) => !keptItemIds.has(itemId.toString()));

  try {
    const updated = await prisma.$transaction(async (tx) => {
      if (removedItemIds.length > 0) {
        await tx.optionItem.deleteMany({ where: { id: { in: removedItemIds } } });
      }
      for (const item of keptItems) {
        await tx.optionItem.update({ where: { id: BigInt(item.id!) }, data: { title: item.title } });
      }

      return tx.option.update({
        where: { id: optionId },
        data: {
          name: parsed.data.name,
          type: parsed.data.type,
          multiple: parsed.data.multiple,
          isRequired: parsed.data.isRequired,
          description: parsed.data.description,
          optionItems: newItems.length > 0 ? { create: newItems.map((item) => ({ title: item.title })) } : undefined,
        },
        include: optionRecordInclude,
      });
    });

    revalidateOptionPages();
    return { ok: true, record: optionToRecord(updated) };
  } catch (error) {
    if (isPrismaCode(error, "P2003")) {
      return {
        ok: false,
        message: "گزینه‌ای که حذف کرده‌اید در آگهی‌ها انتخاب شده است و امکان حذف آن وجود ندارد.",
        fieldErrors: { items: "گزینه استفاده‌شده در آگهی‌ها قابل حذف نیست؛ می‌توانید عنوان آن را تغییر دهید." },
      };
    }
    console.error("[options:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Hide an option from the ad form (or bring it back); stored ad values are untouched. */
export async function toggleOptionActiveAction(
  id: string,
  isActive: boolean
): Promise<OptionActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  let optionId: bigint;
  try {
    optionId = BigInt(id);
  } catch {
    return { ok: false, message: "شناسه ویژگی نامعتبر است" };
  }

  try {
    const updated = await prisma.option.update({
      where: { id: optionId },
      data: { isActive },
      include: optionRecordInclude,
    });
    revalidateOptionPages();
    return { ok: true, record: optionToRecord(updated) };
  } catch (error) {
    if (isPrismaCode(error, "P2025")) return { ok: false, message: "ویژگی یافت نشد" };
    console.error("[options:toggle] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function deleteOptionAction(
  id: string
): Promise<OptionSimpleActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  let optionId: bigint;
  try {
    optionId = BigInt(id);
  } catch {
    return { ok: false, message: "شناسه ویژگی نامعتبر است" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Delete option items first because of RESTRICT foreign key
      await tx.optionItem.deleteMany({
        where: { optionId },
      });

      await tx.option.delete({
        where: { id: optionId },
      });
    });
  } catch (error) {
    if (isPrismaCode(error, "P2003")) {
      return {
        ok: false,
        message:
          "این ویژگی در آگهی‌ها مقدار دارد و امکان حذف آن وجود ندارد؛ می‌توانید آن را غیرفعال کنید تا در آگهی‌های جدید نمایش داده نشود.",
      };
    }
    console.error("[options:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  revalidateOptionPages();
  return { ok: true };
}
