"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { saleTermToRecord, type SaleTermRecord } from "@/lib/sale-terms";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/lib/validation/brands";
import { removeUpload, saveUpload } from "@/lib/uploads";

const UNAUTHENTICATED_MESSAGE = "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type SaleTermActionResult =
  | { ok: true; record: SaleTermRecord }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export type SaleTermSimpleActionResult =
  | { ok: true }
  | { ok: false; message: string };

async function guardRequest(): Promise<{ ok: false; message: string } | null> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  if (!(await getCurrentAdmin())) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  return null;
}

function parseId(id: string): bigint | null {
  try {
    return BigInt(id);
  } catch {
    return null;
  }
}

export async function createSaleTermAction(
  formData: FormData
): Promise<SaleTermActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const imageFile = formData.get("imageFile");

  if (!title) {
    return {
      ok: false,
      message: "عنوان شرایط فروش الزامی است",
      fieldErrors: { title: "عنوان الزامی است" },
    };
  }

  let image: string | null = null;
  if (imageFile instanceof File && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(imageFile.type as any)) {
      return { ok: false, message: "فرمت فایل تصویر پشتیبانی نمی‌شود" };
    }
    if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      return { ok: false, message: "حجم تصویر نباید بیشتر از ۲ مگابایت باشد" };
    }
    image = await saveUpload("sale-terms", imageFile, "sale-term");
  }

  try {
    const created = await prisma.saleTerm.create({
      data: { title, description: description || null, image, isActive: true },
    });
    revalidatePath("/admin/sale-terms");
    return { ok: true, record: saleTermToRecord(created) };
  } catch (error) {
    console.error("[saleTerms:create] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function updateSaleTermAction(
  id: string,
  formData: FormData
): Promise<SaleTermActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const saleTermId = parseId(id);
  if (saleTermId === null) {
    return { ok: false, message: "شناسه شرایط فروش نامعتبر است" };
  }

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const isActive = formData.get("isActive") === "true";
  const imageFile = formData.get("imageFile");

  if (!title) {
    return {
      ok: false,
      message: "عنوان شرایط فروش الزامی است",
      fieldErrors: { title: "عنوان الزامی است" },
    };
  }

  const current = await prisma.saleTerm.findUnique({
    where: { id: saleTermId },
    select: { image: true },
  });
  if (!current) return { ok: false, message: "شرایط فروش یافت نشد" };

  let image = current.image;
  if (imageFile instanceof File && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(imageFile.type as any)) {
      return { ok: false, message: "فرمت فایل تصویر پشتیبانی نمی‌شود" };
    }
    if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      return { ok: false, message: "حجم تصویر نباید بیشتر از ۲ مگابایت باشد" };
    }
    await removeUpload(image, "sale-terms");
    image = await saveUpload("sale-terms", imageFile, "sale-term");
  }

  try {
    const updated = await prisma.saleTerm.update({
      where: { id: saleTermId },
      data: { title, description: description || null, image, isActive },
    });
    revalidatePath("/admin/sale-terms");
    return { ok: true, record: saleTermToRecord(updated) };
  } catch (error) {
    console.error("[saleTerms:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function toggleSaleTermActiveAction(
  id: string
): Promise<SaleTermActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const saleTermId = parseId(id);
  if (saleTermId === null) {
    return { ok: false, message: "شناسه شرایط فروش نامعتبر است" };
  }

  const current = await prisma.saleTerm.findUnique({
    where: { id: saleTermId },
    select: { isActive: true },
  });
  if (!current) return { ok: false, message: "شرایط فروش یافت نشد" };

  try {
    const updated = await prisma.saleTerm.update({
      where: { id: saleTermId },
      data: { isActive: !current.isActive },
    });
    revalidatePath("/admin/sale-terms");
    return { ok: true, record: saleTermToRecord(updated) };
  } catch (error) {
    console.error("[saleTerms:toggle] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function deleteSaleTermAction(
  id: string
): Promise<SaleTermSimpleActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const saleTermId = parseId(id);
  if (saleTermId === null) {
    return { ok: false, message: "شناسه شرایط فروش نامعتبر است" };
  }

  const current = await prisma.saleTerm.findUnique({
    where: { id: saleTermId },
    select: { image: true },
  });
  if (!current) return { ok: false, message: "شرایط فروش یافت نشد" };

  try {
    await prisma.saleTerm.delete({ where: { id: saleTermId } });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2003"
    ) {
      return {
        ok: false,
        message:
          "این شرایط فروش در معاملات کاربران استفاده شده و امکان حذف آن وجود ندارد.",
      };
    }
    console.error("[saleTerms:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  await removeUpload(current.image, "sale-terms");
  revalidatePath("/admin/sale-terms");
  return { ok: true };
}
