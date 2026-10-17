"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import {
  AD_CODE_MAX_ATTEMPTS,
  generateAdCode,
  isAdCodeCollision,
  userCarInclude,
  userCarToRecord,
  type UserCarRecord,
} from "@/lib/user-cars";
import { isAdStatus, type AdStatus } from "@/lib/ad-status";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { parseUserCarForm, type UserCarSaleTermInput } from "@/lib/validation/user-cars";

const UNAUTHENTICATED_MESSAGE = "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";
const INVALID_ID_MESSAGE = "شناسه آگهی نامعتبر است";

export type UserCarActionResult =
  | { ok: true; record: UserCarRecord }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export type UserCarSimpleActionResult = { ok: true } | { ok: false; message: string };

function isPrismaCode(error: unknown, code: string): boolean {
  if (typeof error === "object" && error !== null && "code" in error) {
    return (error as { code?: unknown }).code === code;
  }
  return false;
}

function parseBigInt(value: string): bigint | null {
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

async function guardRequest(): Promise<{ ok: false; message: string } | null> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  if (!(await getCurrentAdmin())) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  return null;
}

function revalidateUserPages(userId: bigint) {
  revalidatePath(`/admin/users/${userId.toString()}`);
  revalidatePath(`/admin/users/${userId.toString()}/sale-ads`);
  revalidatePath("/admin/ads");
  revalidatePath("/admin/ads/pending");
}

function toSaleTermData(entry: UserCarSaleTermInput) {
  return {
    saleTermId: BigInt(entry.saleTermId),
    price: entry.price,
    sale: entry.sale || null,
    perecentage: entry.perecentage || null,
    description: entry.description || null,
    isActive: entry.isActive,
  };
}

const PRICE_CHANGE_SOURCE = "admin" as const;

/** Nested-create payload that logs the listing price as the first history row. */
function withInitialPriceHistory<T extends object>(data: T, entry: UserCarSaleTermInput) {
  return { ...data, priceHistory: { create: { price: entry.price, source: PRICE_CHANGE_SOURCE } } };
}

/** Update payload that appends a history row only when the price actually changed. */
function withPriceChangeHistory<T extends object>(data: T, entry: UserCarSaleTermInput, previousPrice: string | undefined) {
  if (previousPrice === undefined || previousPrice === entry.price) return data;
  return { ...data, priceHistory: { create: { price: entry.price, source: PRICE_CHANGE_SOURCE } } };
}

/** Validate that every referenced sale-term id exists (clear error instead of FK failure). */
async function validateSaleTermIds(entries: UserCarSaleTermInput[]): Promise<Record<string, string> | null> {
  const ids = Array.from(new Set(entries.map((e) => e.saleTermId)));
  if (ids.length === 0) return null;

  const parsed: bigint[] = [];
  const errors: Record<string, string> = {};
  entries.forEach((entry, index) => {
    const id = parseBigInt(entry.saleTermId);
    if (id === null) errors[`saleTerms.${index}.saleTermId`] = "شرایط فروش نامعتبر است";
    else parsed.push(id);
  });
  if (Object.keys(errors).length > 0) return errors;

  const found = await prisma.saleTerm.findMany({ where: { id: { in: parsed } }, select: { id: true } });
  const foundSet = new Set(found.map((f) => f.id.toString()));
  entries.forEach((entry, index) => {
    if (!foundSet.has(entry.saleTermId)) {
      errors[`saleTerms.${index}.saleTermId`] = "شرایط فروش انتخاب‌شده وجود ندارد";
    }
  });
  return Object.keys(errors).length > 0 ? errors : null;
}

/* ───────────────────────── create ───────────────────────── */

export async function createUserCarAction(userIdRaw: string, formData: FormData): Promise<UserCarActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const userId = parseBigInt(userIdRaw);
  if (userId === null) return { ok: false, message: "شناسه کاربر نامعتبر است" };

  const parsed = parseUserCarForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };
  }

  const carId = parseBigInt(parsed.data.carId);
  if (carId === null) {
    return { ok: false, message: "خودرو انتخاب‌شده نامعتبر است", fieldErrors: { carId: "خودرو نامعتبر است" } };
  }

  const [user, car] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
    prisma.car.findUnique({ where: { id: carId }, select: { id: true } }),
  ]);
  if (!user) return { ok: false, message: "کاربر یافت نشد" };
  if (!car) return { ok: false, message: "خودرو انتخاب‌شده وجود ندارد", fieldErrors: { carId: "خودرو انتخاب‌شده وجود ندارد" } };

  const termErrors = await validateSaleTermIds(parsed.data.saleTerms);
  if (termErrors) return { ok: false, message: "شرایط فروش انتخاب‌شده نامعتبر است", fieldErrors: termErrors };

  // Ads created by an administrator are trusted and approved automatically.
  // The 6-digit code is random; on the (rare) unique collision we simply retry.
  for (let attempt = 1; attempt <= AD_CODE_MAX_ATTEMPTS; attempt += 1) {
    try {
      const created = await prisma.userCar.create({
        data: {
          userId,
          carId,
          code: generateAdCode(),
          status: "approved",
          qautity: parsed.data.qautity,
          description: parsed.data.description,
          isActive: parsed.data.isActive,
          saleTerms: { create: parsed.data.saleTerms.map((entry) => withInitialPriceHistory(toSaleTermData(entry), entry)) },
        },
        include: userCarInclude,
      });

      revalidateUserPages(userId);
      return { ok: true, record: userCarToRecord(created) };
    } catch (error) {
      if (isAdCodeCollision(error) && attempt < AD_CODE_MAX_ATTEMPTS) continue;
      console.error("[user-cars:create] failed", error);
      return {
        ok: false,
        message: isAdCodeCollision(error)
          ? "تولید کد یکتای آگهی ناموفق بود؛ لطفاً دوباره تلاش کنید."
          : GENERIC_FAILURE_MESSAGE,
      };
    }
  }
  return { ok: false, message: GENERIC_FAILURE_MESSAGE };
}

/* ───────────────────────── update ───────────────────────── */

export async function updateUserCarAction(idRaw: string, formData: FormData): Promise<UserCarActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const userCarId = parseBigInt(idRaw);
  if (userCarId === null) return { ok: false, message: INVALID_ID_MESSAGE };

  const parsed = parseUserCarForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };
  }

  const carId = parseBigInt(parsed.data.carId);
  if (carId === null) return { ok: false, message: "خودرو انتخاب‌شده نامعتبر است", fieldErrors: { carId: "خودرو نامعتبر است" } };

  const [existing, car] = await Promise.all([
    prisma.userCar.findUnique({
      where: { id: userCarId },
      select: { id: true, userId: true, saleTerms: { select: { id: true, price: true } } },
    }),
    prisma.car.findUnique({ where: { id: carId }, select: { id: true } }),
  ]);
  if (!existing) return { ok: false, message: "آگهی یافت نشد" };
  if (!car) return { ok: false, message: "خودرو انتخاب‌شده وجود ندارد", fieldErrors: { carId: "خودرو انتخاب‌شده وجود ندارد" } };

  const termErrors = await validateSaleTermIds(parsed.data.saleTerms);
  if (termErrors) return { ok: false, message: "شرایط فروش انتخاب‌شده نامعتبر است", fieldErrors: termErrors };

  const existingTermIds = new Set(existing.saleTerms.map((t) => t.id.toString()));
  const existingPriceById = new Map(existing.saleTerms.map((t) => [t.id.toString(), t.price]));
  const submittedExistingIds = new Set(
    parsed.data.saleTerms.map((t) => t.id).filter((id): id is string => Boolean(id && existingTermIds.has(id)))
  );
  const idsToDelete = existing.saleTerms.map((t) => t.id).filter((id) => !submittedExistingIds.has(id.toString()));

  try {
    const updated = await prisma.$transaction(async (tx) => {
      await tx.userCar.update({
        where: { id: userCarId },
        data: {
          carId,
          qautity: parsed.data.qautity,
          description: parsed.data.description,
          isActive: parsed.data.isActive,
          ...(parsed.data.status ? { status: parsed.data.status } : {}),
        },
      });

      if (idsToDelete.length > 0) {
        await tx.userCarSaleTerm.deleteMany({ where: { id: { in: idsToDelete }, userCarId } });
      }

      for (const entry of parsed.data.saleTerms) {
        const data = toSaleTermData(entry);
        if (entry.id && existingTermIds.has(entry.id)) {
          const previousPrice = existingPriceById.get(entry.id);
          await tx.userCarSaleTerm.update({
            where: { id: BigInt(entry.id) },
            data: withPriceChangeHistory(data, entry, previousPrice),
          });
        } else {
          await tx.userCarSaleTerm.create({ data: { ...withInitialPriceHistory(data, entry), userCarId } });
        }
      }

      return tx.userCar.findUniqueOrThrow({ where: { id: userCarId }, include: userCarInclude });
    });

    revalidateUserPages(existing.userId);
    return { ok: true, record: userCarToRecord(updated) };
  } catch (error) {
    console.error("[user-cars:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/* ───────────────────────── toggle active ───────────────────────── */

export async function toggleUserCarActiveAction(idRaw: string, isActive: boolean): Promise<UserCarActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const userCarId = parseBigInt(idRaw);
  if (userCarId === null) return { ok: false, message: INVALID_ID_MESSAGE };

  try {
    const updated = await prisma.userCar.update({
      where: { id: userCarId },
      data: { isActive },
      include: userCarInclude,
    });
    revalidateUserPages(updated.userId);
    return { ok: true, record: userCarToRecord(updated) };
  } catch (error) {
    if (isPrismaCode(error, "P2025")) return { ok: false, message: "آگهی یافت نشد" };
    console.error("[user-cars:toggle] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/* ───────────────────────── moderation status ───────────────────────── */

export async function updateUserCarStatusAction(idRaw: string, status: AdStatus): Promise<UserCarActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const userCarId = parseBigInt(idRaw);
  if (userCarId === null) return { ok: false, message: INVALID_ID_MESSAGE };
  if (!isAdStatus(status)) return { ok: false, message: "وضعیت تایید نامعتبر است" };

  try {
    const updated = await prisma.userCar.update({
      where: { id: userCarId },
      data: { status },
      include: userCarInclude,
    });
    revalidateUserPages(updated.userId);
    return { ok: true, record: userCarToRecord(updated) };
  } catch (error) {
    if (isPrismaCode(error, "P2025")) return { ok: false, message: "آگهی یافت نشد" };
    console.error("[user-cars:status] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/* ───────────────────────── delete ───────────────────────── */

export async function deleteUserCarAction(idRaw: string): Promise<UserCarSimpleActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const userCarId = parseBigInt(idRaw);
  if (userCarId === null) return { ok: false, message: INVALID_ID_MESSAGE };

  const existing = await prisma.userCar.findUnique({ where: { id: userCarId }, select: { userId: true } });
  if (!existing) return { ok: false, message: "آگهی یافت نشد" };

  try {
    // Sale-term rows reference the ad with onDelete: Restrict, so remove them first.
    await prisma.$transaction([
      prisma.userCarSaleTerm.deleteMany({ where: { userCarId } }),
      prisma.userCar.delete({ where: { id: userCarId } }),
    ]);
  } catch (error) {
    console.error("[user-cars:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  revalidateUserPages(existing.userId);
  return { ok: true };
}
