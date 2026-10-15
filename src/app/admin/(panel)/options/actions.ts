"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { optionToRecord, type OptionRecord } from "@/lib/options";
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
        placeholder: parsed.data.placeholder,
        description: parsed.data.description,
        optionItems:
          parsed.data.type === "select" && parsed.data.items.length > 0
            ? {
                create: parsed.data.items.map((item) => ({
                  title: item.title,
                  item: item.item,
                })),
              }
            : undefined,
      },
      include: {
        optionItems: true,
      },
    });

    revalidatePath("/admin/options");
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

  try {
    const updated = await prisma.$transaction(async (tx) => {
      // First update option items if needed
      await tx.optionItem.deleteMany({
        where: { optionId },
      });

      return tx.option.update({
        where: { id: optionId },
        data: {
          name: parsed.data.name,
          type: parsed.data.type,
          placeholder: parsed.data.placeholder,
          description: parsed.data.description,
          optionItems:
            parsed.data.type === "select" && parsed.data.items.length > 0
              ? {
                  create: parsed.data.items.map((item) => ({
                    title: item.title,
                    item: item.item,
                  })),
                }
              : undefined,
        },
        include: {
          optionItems: true,
        },
      });
    });

    revalidatePath("/admin/options");
    return { ok: true, record: optionToRecord(updated) };
  } catch (error) {
    console.error("[options:update] failed", error);
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
          "این ویژگی در اطلاعات مشخصات خودروها استفاده شده است و امکان حذف آن وجود ندارد.",
      };
    }
    console.error("[options:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  revalidatePath("/admin/options");
  return { ok: true };
}
