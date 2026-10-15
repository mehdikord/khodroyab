"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { carImageToRecord, type CarImageRecord } from "@/lib/car-images";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/lib/validation/brands";
import { removeUpload, saveUpload } from "@/lib/uploads";

const UNAUTHENTICATED_MESSAGE =
  "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type CarImageActionResult =
  | { ok: true; record: CarImageRecord }
  | { ok: false; message: string };

export type CarImageSimpleActionResult =
  | { ok: true }
  | { ok: false; message: string };

async function guardRequest(): Promise<{ ok: false; message: string } | null> {
  if (!isTrustedOrigin()) {
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
  if (!(await getCurrentAdmin())) {
    return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  }
  return null;
}

export async function addCarImageAction(
  carId: string,
  formData: FormData
): Promise<CarImageActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  let parsedCarId: bigint;
  try {
    parsedCarId = BigInt(carId);
  } catch {
    return { ok: false, message: "شناسه خودرو نامعتبر است" };
  }

  const file = formData.get("imageFile");
  const url = formData.get("imageUrl");

  let imageUrl: string | null = null;

  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as any)) {
      return { ok: false, message: "فرمت فایل تصویر معتبر نیست" };
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return { ok: false, message: "حجم تصویر نباید بیشتر از ۲ مگابایت باشد" };
    }
    try {
      imageUrl = await saveUpload("cars", file, "car");
    } catch (e) {
      console.error(e);
      return { ok: false, message: "خطا در ذخیره فایل تصویر" };
    }
  } else if (typeof url === "string" && url.trim().length > 0) {
    imageUrl = url.trim();
  }

  if (!imageUrl) {
    return { ok: false, message: "لطفاً یک فایل انتخاب کرده یا آدرس تصویر را وارد کنید" };
  }

  try {
    const record = await prisma.carImage.create({
      data: {
        carId: parsedCarId,
        imageUrl,
      },
    });

    revalidatePath(`/admin/cars/${carId}/images`);
    return { ok: true, record: carImageToRecord(record) };
  } catch (error) {
    console.error("[carImages:add] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function deleteCarImageAction(
  id: string,
  carId: string
): Promise<CarImageSimpleActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  let imageId: bigint;
  try {
    imageId = BigInt(id);
  } catch {
    return { ok: false, message: "شناسه تصویر نامعتبر است" };
  }

  try {
    const current = await prisma.carImage.findUnique({
      where: { id: imageId },
      select: { imageUrl: true },
    });

    if (!current) {
      return { ok: false, message: "تصویر یافت نشد" };
    }

    await prisma.carImage.delete({ where: { id: imageId } });
    await removeUpload(current.imageUrl, "cars");

    revalidatePath(`/admin/cars/${carId}/images`);
    return { ok: true };
  } catch (error) {
    console.error("[carImages:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
