"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { brandToRecord, type BrandRecord } from "@/lib/brands";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { parseBrandForm, slugify } from "@/lib/validation/brands";
import { isManagedUpload, removeUpload, saveUpload } from "@/lib/uploads";

const UNAUTHENTICATED_MESSAGE =
  "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

/** Success result carrying the affected brand. */
export type BrandActionResult =
  | { ok: true; record: BrandRecord }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/** Bare result for operations that do not return a record. */
export type BrandSimpleActionResult =
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

/**
 * Create a new brand.
 * @param formData fields: name, slug (optional), image (optional), isActive, imageFile (optional)
 */
export async function createBrandAction(
  formData: FormData
): Promise<BrandActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const parsed = parseBrandForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };
  }

  // Enforce application-level uniqueness (schema intentionally has no unique key).
  const existing = await prisma.brand.findFirst({
    where: { name: parsed.data.name },
    select: { id: true },
  });
  if (existing) {
    return {
      ok: false,
      message: "برندی با این نام از قبل وجود دارد",
      fieldErrors: { name: "این نام قبلاً ثبت شده است" },
    };
  }

  let image: string | null = null;
  if (parsed.file) {
    image = await saveUpload("brands", parsed.file, slugify(parsed.data.name) || "brand");
  } else if (parsed.data.image) {
    image = parsed.data.image;
  }

  try {
    const brand = await prisma.brand.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        image,
        isActive: parsed.data.isActive,
      },
    });
    revalidatePath("/admin/brands");
    return { ok: true, record: brandToRecord(brand) };
  } catch (error) {
    console.error("[brands:create] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/**
 * Update an existing brand.
 * @param id  brand id (BigInt serialized as string)
 * @param formData same fields as create
 */
export async function updateBrandAction(
  id: string,
  formData: FormData
): Promise<BrandActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  let brandId: bigint;
  try {
    brandId = BigInt(id);
  } catch {
    return { ok: false, message: "شناسه برند نامعتبر است" };
  }

  const parsed = parseBrandForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };
  }

  // Load the current record so we can diff image ownership on replace/clear.
  const current = await prisma.brand.findUnique({
    where: { id: brandId },
    select: { id: true, image: true },
  });
  if (!current) {
    return { ok: false, message: "برند مورد نظر یافت نشد" };
  }

  const existing = await prisma.brand.findFirst({
    where: { name: parsed.data.name, NOT: { id: brandId } },
    select: { id: true },
  });
  if (existing) {
    return {
      ok: false,
      message: "برندی با این نام از قبل وجود دارد",
      fieldErrors: { name: "این نام قبلاً ثبت شده است" },
    };
  }

  let image: string | null;
  if (parsed.file) {
    image = await saveUpload("brands", parsed.file, slugify(parsed.data.name) || "brand");
  } else if (parsed.data.image) {
    image = parsed.data.image;
  } else {
    image = null;
  }

  try {
    const brand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        image,
        isActive: parsed.data.isActive,
      },
    });
    if (
      image !== current.image &&
      current.image &&
      current.image.startsWith("/uploads/")
    ) {
      await removeUpload(current.image, "brands");
    }
    revalidatePath("/admin/brands");
    return { ok: true, record: brandToRecord(brand) };
  } catch (error) {
    console.error("[brands:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/**
 * Toggle a brand's active state without opening the edit form.
 * @param id brand id (BigInt serialized as string)
 */
export async function toggleBrandActiveAction(
  id: string
): Promise<BrandActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  let brandId: bigint;
  try {
    brandId = BigInt(id);
  } catch {
    return { ok: false, message: "شناسه برند نامعتبر است" };
  }

  const current = await prisma.brand.findUnique({
    where: { id: brandId },
    select: { id: true, isActive: true },
  });
  if (!current) {
    return { ok: false, message: "برند مورد نظر یافت نشد" };
  }

  try {
    const brand = await prisma.brand.update({
      where: { id: brandId },
      data: { isActive: !current.isActive },
    });
    revalidatePath("/admin/brands");
    return { ok: true, record: brandToRecord(brand) };
  } catch (error) {
    console.error("[brands:toggle] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/**
 * Delete a brand. Fails gracefully when the brand is referenced by cars
 * (the schema uses ON DELETE RESTRICT).
 * @param id brand id (BigInt serialized as string)
 */
export async function deleteBrandAction(
  id: string
): Promise<BrandSimpleActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  let brandId: bigint;
  try {
    brandId = BigInt(id);
  } catch {
    return { ok: false, message: "شناسه برند نامعتبر است" };
  }

  const current = await prisma.brand.findUnique({
    where: { id: brandId },
    select: { id: true, image: true },
  });
  if (!current) {
    return { ok: false, message: "برند مورد نظر یافت نشد" };
  }

  try {
    await prisma.brand.delete({ where: { id: brandId } });
  } catch (error) {
    if (isPrismaCode(error, "P2003")) {
      return {
        ok: false,
        message:
          "این برند به خودروهایی متصل است و امکان حذف آن وجود ندارد. ابتدا خودروهای مرتبط را حذف کنید.",
      };
    }
    console.error("[brands:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  await removeUpload(current.image, "brands");
  revalidatePath("/admin/brands");
  return { ok: true };
}