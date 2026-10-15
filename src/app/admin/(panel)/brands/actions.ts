"use server";

import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { brandToRecord, type BrandRecord } from "@/lib/brands";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  parseBrandForm,
  slugify,
} from "@/lib/validation/brands";

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

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "brands");

function isPrismaCode(error: unknown, code: string): boolean {
  if (typeof error === "object" && error !== null && "code" in error) {
    return (error as { code?: unknown }).code === code;
  }
  return false;
}

/**
 * Persist an uploaded brand image to the local filesystem and return its
 * public URL path. Filenames are randomized to prevent collisions.
 */
async function saveBrandImage(file: File, baseName: string): Promise<string> {
  const extension =
    MIME_TO_EXTENSION[file.type] ?? ALLOWED_IMAGE_MIME_TYPES[0].split("/")[1];
  const safeBase =
    slugify(baseName) || "brand";
  const fileName = `${safeBase}-${Date.now()}-${crypto
    .randomBytes(4)
    .toString("hex")}.${extension}`;

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, fileName), bytes);

  return `/uploads/brands/${fileName}`;
}

/** Best-effort removal of a previously uploaded file. */
async function removeUploadedFile(publicPath: string | null): Promise<void> {
  if (!publicPath || !publicPath.startsWith("/uploads/")) {
    return;
  }
  await fs
    .unlink(path.join(process.cwd(), "public", publicPath))
    .catch(() => undefined);
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
    image = await saveBrandImage(parsed.file, parsed.data.name);
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
    image = await saveBrandImage(parsed.file, parsed.data.name);
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
      await removeUploadedFile(current.image);
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

  await removeUploadedFile(current.image);
  revalidatePath("/admin/brands");
  return { ok: true };
}