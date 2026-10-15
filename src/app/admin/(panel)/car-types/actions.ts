"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { carTypeToRecord, type CarTypeRecord } from "@/lib/car-types";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { parseCarTypeForm } from "@/lib/validation/car-types";

const UNAUTHENTICATED_MESSAGE =
  "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

/** Success result carrying the affected record. */
export type CarTypeActionResult =
  | { ok: true; record: CarTypeRecord }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/** Bare result for operations that do not return a record. */
export type CarTypeSimpleActionResult =
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

export async function createCarTypeAction(
  formData: FormData
): Promise<CarTypeActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const parsed = parseCarTypeForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };
  }

  // Enforce application-level uniqueness
  const existing = await prisma.carType.findFirst({
    where: { name: parsed.data.name },
    select: { id: true },
  });
  if (existing) {
    return {
      ok: false,
      message: "نوع خودرویی با این نام از قبل وجود دارد",
      fieldErrors: { name: "این نام قبلاً ثبت شده است" },
    };
  }

  try {
    const carType = await prisma.carType.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
      },
    });
    revalidatePath("/admin/car-types");
    return { ok: true, record: carTypeToRecord(carType) };
  } catch (error) {
    console.error("[carTypes:create] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function updateCarTypeAction(
  id: string,
  formData: FormData
): Promise<CarTypeActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  let carTypeId: bigint;
  try {
    carTypeId = BigInt(id);
  } catch {
    return { ok: false, message: "شناسه نوع خودرو نامعتبر است" };
  }

  const parsed = parseCarTypeForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };
  }

  const existing = await prisma.carType.findFirst({
    where: { name: parsed.data.name, NOT: { id: carTypeId } },
    select: { id: true },
  });
  if (existing) {
    return {
      ok: false,
      message: "نوع خودرویی با این نام از قبل وجود دارد",
      fieldErrors: { name: "این نام قبلاً ثبت شده است" },
    };
  }

  try {
    const carType = await prisma.carType.update({
      where: { id: carTypeId },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
      },
    });
    revalidatePath("/admin/car-types");
    return { ok: true, record: carTypeToRecord(carType) };
  } catch (error) {
    console.error("[carTypes:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function deleteCarTypeAction(
  id: string
): Promise<CarTypeSimpleActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  let carTypeId: bigint;
  try {
    carTypeId = BigInt(id);
  } catch {
    return { ok: false, message: "شناسه نوع خودرو نامعتبر است" };
  }

  try {
    await prisma.carType.delete({ where: { id: carTypeId } });
  } catch (error) {
    if (isPrismaCode(error, "P2003")) {
      return {
        ok: false,
        message:
          "این نوع خودرو به خودروهایی متصل است و امکان حذف آن وجود ندارد. ابتدا خودروهای مرتبط را حذف کنید.",
      };
    }
    console.error("[carTypes:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  revalidatePath("/admin/car-types");
  return { ok: true };
}
