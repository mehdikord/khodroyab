"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { carRecordInclude, carToRecord, type CarRecord } from "@/lib/cars";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { parseCarForm } from "@/lib/validation/cars";

const UNAUTHENTICATED_MESSAGE =
  "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type CarActionResult =
  | { ok: true; record: CarRecord }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export type CarSimpleActionResult =
  | { ok: true }
  | { ok: false; message: string };

function isPrismaCode(error: unknown, code: string): boolean {
  if (typeof error === "object" && error !== null && "code" in error) {
    return (error as { code?: unknown }).code === code;
  }
  return false;
}

/** A brand, car type or colour picked in the form no longer exists. */
const STALE_RELATION_RESULT = {
  ok: false as const,
  message: "برند، نوع یا رنگ انتخاب‌شده دیگر وجود ندارد؛ صفحه را به‌روزرسانی کنید.",
};

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

export async function createCarAction(
  formData: FormData
): Promise<CarActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const parsed = parseCarForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.message,
      fieldErrors: parsed.fieldErrors,
    };
  }

  try {
    const created = await prisma.car.create({
      data: {
        brandId: BigInt(parsed.data.brandId),
        carTypeId: BigInt(parsed.data.carTypeId),
        colorId: parsed.data.colorId ? BigInt(parsed.data.colorId) : null,
        name: parsed.data.name,
        slug: parsed.data.slug,
        model: parsed.data.model,
        year: parsed.data.year,
      },
      include: carRecordInclude,
    });

    revalidatePath("/admin/cars");
    return { ok: true, record: carToRecord(created) };
  } catch (error) {
    if (isPrismaCode(error, "P2003")) return STALE_RELATION_RESULT;
    console.error("[cars:create] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function updateCarAction(
  id: string,
  formData: FormData
): Promise<CarActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  let carId: bigint;
  try {
    carId = BigInt(id);
  } catch {
    return { ok: false, message: "شناسه خودرو نامعتبر است" };
  }

  const parsed = parseCarForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.message,
      fieldErrors: parsed.fieldErrors,
    };
  }

  try {
    const updated = await prisma.car.update({
      where: { id: carId },
      data: {
        brandId: BigInt(parsed.data.brandId),
        carTypeId: BigInt(parsed.data.carTypeId),
        colorId: parsed.data.colorId ? BigInt(parsed.data.colorId) : null,
        name: parsed.data.name,
        slug: parsed.data.slug,
        model: parsed.data.model,
        year: parsed.data.year,
      },
      include: carRecordInclude,
    });

    revalidatePath("/admin/cars");
    return { ok: true, record: carToRecord(updated) };
  } catch (error) {
    if (isPrismaCode(error, "P2003")) return STALE_RELATION_RESULT;
    console.error("[cars:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function deleteCarAction(
  id: string
): Promise<CarSimpleActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  let carId: bigint;
  try {
    carId = BigInt(id);
  } catch {
    return { ok: false, message: "شناسه خودرو نامعتبر است" };
  }

  try {
    await prisma.car.delete({ where: { id: carId } });
  } catch (error) {
    if (isPrismaCode(error, "P2003")) {
      return {
        ok: false,
        message:
          "این خودرو دارای سوابق در سیستم است و امکان حذف آن وجود ندارد.",
      };
    }
    console.error("[cars:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  revalidatePath("/admin/cars");
  return { ok: true };
}
