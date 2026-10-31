"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/user-auth";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import {
  AD_CODE_MAX_ATTEMPTS,
  generateAdCode,
  isAdCodeCollision,
  userCarInclude,
  userCarToRecord,
  type UserCarRecord,
} from "@/lib/user-cars";
import { parseUserCarForm, type UserCarSaleTermInput } from "@/lib/validation/user-cars";
import {
  discardAdImageFiles,
  prepareAdExtras,
  storeNewAdImages,
  syncAdImages,
  syncAdOptions,
  type StoredAdImages,
} from "@/lib/user-car-extras";

const UNAUTHENTICATED_MESSAGE = "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type MyAdActionResult =
  | { ok: true; record: UserCarRecord }
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

function revalidateAdPages(userId: bigint) {
  revalidatePath("/panel/ads");
  revalidatePath("/panel/search");
  revalidatePath("/admin/ads");
  revalidatePath("/admin/ads/pending");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/admin/users/${userId.toString()}`);
  revalidatePath(`/admin/users/${userId.toString()}/sale-ads`);
}

function toSaleTermData(entry: UserCarSaleTermInput) {
  return {
    saleTermId: BigInt(entry.saleTermId),
    price: entry.price,
    sale: entry.sale || null,
    perecentage: entry.perecentage || null,
    description: entry.description || null,
    // Customers cannot toggle individual terms; every submitted term is live.
    isActive: true,
  };
}

const PRICE_CHANGE_SOURCE = "user" as const;

/** Nested-create payload that logs the listing price as the first history row. */
function withInitialPriceHistory<T extends object>(data: T, entry: UserCarSaleTermInput) {
  return { ...data, priceHistory: { create: { price: entry.price, source: PRICE_CHANGE_SOURCE } } };
}

/** Update payload that appends a history row only when the price actually changed. */
function withPriceChangeHistory<T extends object>(data: T, entry: UserCarSaleTermInput, previousPrice: string | undefined) {
  if (previousPrice === undefined || previousPrice === entry.price) return data;
  return { ...data, priceHistory: { create: { price: entry.price, source: PRICE_CHANGE_SOURCE } } };
}

/** Every referenced sale term must exist *and* be active (customers only see active ones). */
async function validateSaleTermIds(entries: UserCarSaleTermInput[]): Promise<Record<string, string> | null> {
  const errors: Record<string, string> = {};
  const parsed: bigint[] = [];
  entries.forEach((entry, index) => {
    const id = parseBigInt(entry.saleTermId);
    if (id === null) errors[`saleTerms.${index}.saleTermId`] = "شرایط فروش نامعتبر است";
    else parsed.push(id);
  });
  if (Object.keys(errors).length > 0) return errors;
  if (parsed.length === 0) return null;

  const found = await prisma.saleTerm.findMany({ where: { id: { in: parsed }, isActive: true }, select: { id: true } });
  const foundSet = new Set(found.map((f) => f.id.toString()));
  entries.forEach((entry, index) => {
    if (!foundSet.has(entry.saleTermId)) {
      errors[`saleTerms.${index}.saleTermId`] = "شرایط فروش انتخاب‌شده در دسترس نیست";
    }
  });
  return Object.keys(errors).length > 0 ? errors : null;
}

/* ───────────────────────── create ───────────────────────── */

/**
 * Create a sale ad for the signed-in customer. Ads submitted from the panel
 * always start as `pending` and must be approved by an administrator.
 */
export async function createMyAdAction(formData: FormData): Promise<MyAdActionResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;
  const { userId } = guard;

  const parsed = parseUserCarForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };

  const carId = parseBigInt(parsed.data.carId);
  if (carId === null) return { ok: false, message: "خودرو انتخاب‌شده نامعتبر است", fieldErrors: { carId: "خودرو نامعتبر است" } };

  const car = await prisma.car.findUnique({ where: { id: carId }, select: { id: true } });
  if (!car) return { ok: false, message: "خودرو انتخاب‌شده وجود ندارد", fieldErrors: { carId: "خودرو انتخاب‌شده وجود ندارد" } };

  const termErrors = await validateSaleTermIds(parsed.data.saleTerms);
  if (termErrors) return { ok: false, message: "شرایط فروش انتخاب‌شده نامعتبر است", fieldErrors: termErrors };

  const extras = await prepareAdExtras(formData, []);
  if (!extras.ok) return extras;

  let storedImages: StoredAdImages;
  try {
    storedImages = await storeNewAdImages(extras.images);
  } catch (error) {
    console.error("[panel:my-ads:create] image upload failed", error);
    return { ok: false, message: "خطا در ذخیره تصاویر آگهی" };
  }

  for (let attempt = 1; attempt <= AD_CODE_MAX_ATTEMPTS; attempt += 1) {
    try {
      const created = await prisma.userCar.create({
        data: {
          userId,
          carId,
          code: generateAdCode(),
          status: "pending",
          qautity: parsed.data.qautity,
          description: parsed.data.description,
          year: parsed.data.year,
          colorId: BigInt(parsed.data.colorId),
          isActive: true,
          images: { create: storedImages.newRows },
          options: { create: extras.optionRows },
          saleTerms: { create: parsed.data.saleTerms.map((entry) => withInitialPriceHistory(toSaleTermData(entry), entry)) },
        },
        include: userCarInclude,
      });
      revalidateAdPages(userId);
      return { ok: true, record: userCarToRecord(created) };
    } catch (error) {
      if (isAdCodeCollision(error) && attempt < AD_CODE_MAX_ATTEMPTS) continue;
      console.error("[panel:my-ads:create] failed", error);
      await discardAdImageFiles(storedImages.newRows.map((row) => row.imageUrl));
      return { ok: false, message: GENERIC_FAILURE_MESSAGE };
    }
  }
  return { ok: false, message: GENERIC_FAILURE_MESSAGE };
}

/* ───────────────────────── update ───────────────────────── */

/**
 * Update one of the signed-in customer's own ads. Any edit sends the ad back
 * to `pending` so an administrator reviews the new content before it is
 * shown again – even if it had already been approved.
 */
export async function updateMyAdAction(idRaw: string, formData: FormData): Promise<MyAdActionResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;
  const { userId } = guard;

  const userCarId = parseBigInt(idRaw);
  if (userCarId === null) return { ok: false, message: "شناسه آگهی نامعتبر است" };

  const parsed = parseUserCarForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };

  const carId = parseBigInt(parsed.data.carId);
  if (carId === null) return { ok: false, message: "خودرو انتخاب‌شده نامعتبر است", fieldErrors: { carId: "خودرو نامعتبر است" } };

  // Ownership is part of the lookup, so another customer's id simply "does not exist".
  const [existing, car] = await Promise.all([
    prisma.userCar.findFirst({
      where: { id: userCarId, userId },
      select: {
        id: true,
        saleTerms: { select: { id: true, price: true } },
        images: { select: { id: true, imageUrl: true } },
      },
    }),
    prisma.car.findUnique({ where: { id: carId }, select: { id: true } }),
  ]);
  if (!existing) return { ok: false, message: "آگهی یافت نشد" };
  if (!car) return { ok: false, message: "خودرو انتخاب‌شده وجود ندارد", fieldErrors: { carId: "خودرو انتخاب‌شده وجود ندارد" } };

  const termErrors = await validateSaleTermIds(parsed.data.saleTerms);
  if (termErrors) return { ok: false, message: "شرایط فروش انتخاب‌شده نامعتبر است", fieldErrors: termErrors };

  const extras = await prepareAdExtras(formData, existing.images);
  if (!extras.ok) return extras;

  let storedImages: StoredAdImages;
  try {
    storedImages = await storeNewAdImages(extras.images);
  } catch (error) {
    console.error("[panel:my-ads:update] image upload failed", error);
    return { ok: false, message: "خطا در ذخیره تصاویر آگهی" };
  }

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
          year: parsed.data.year,
          colorId: BigInt(parsed.data.colorId),
          // Every customer edit re-enters moderation.
          status: "pending",
        },
      });

      await syncAdImages(tx, userCarId, extras.images, storedImages);
      await syncAdOptions(tx, userCarId, extras.optionRows);

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

    await discardAdImageFiles(extras.images.removedUrls);
    revalidateAdPages(userId);
    return { ok: true, record: userCarToRecord(updated) };
  } catch (error) {
    await discardAdImageFiles(storedImages.newRows.map((row) => row.imageUrl));
    console.error("[panel:my-ads:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
