"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { userToRecord, type UserRecord } from "@/lib/users";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/lib/validation/brands";
import { isManagedUpload, removeUpload, saveUpload } from "@/lib/uploads";

const UNAUTHENTICATED_MESSAGE = "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

async function guardRequest() {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  if (!(await getCurrentAdmin())) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  return null;
}

export async function createUserAction(formData: FormData): Promise<{ ok: true; record: UserRecord } | { ok: false; message: string; fieldErrors?: Record<string, string> }> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult as any;

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nationalCode = formData.get("nationalCode") as string;
  const postalCode = formData.get("postalCode") as string;
  const address = formData.get("address") as string;
  const imageFile = formData.get("imageFile") as File;

  // Basic validation
  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "نام الزامی است";
  if (!phone) fieldErrors.phone = "تلفن الزامی است";
  if (!password) fieldErrors.password = "رمز عبور الزامی است";

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "اطلاعات فرم ناقص است", fieldErrors };
  }

  let image: string | null = null;
  if (imageFile && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(imageFile.type as any)) {
      return { ok: false, message: "فرمت تصویر معتبر نیست" };
    }
    if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      return { ok: false, message: "حجم تصویر نباید بیشتر از ۲ مگابایت باشد" };
    }
    image = await saveUpload("users", imageFile, "user");
  }

  try {
    const created = await prisma.user.create({
      data: {
        name,
        phone,
        email: email || null,
        password, // Real app: hash password
        nationalCode: nationalCode || "1",
        postalCode: postalCode || null,
        address: address || null,
        image,
        isActive: true,
      },
    });
    revalidatePath("/admin/users");
    return { ok: true, record: userToRecord(created) };
  } catch (error) {
    console.error("[users:create] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function updateUserAction(id: string, formData: FormData): Promise<{ ok: true; record: UserRecord } | { ok: false; message: string; fieldErrors?: Record<string, string> }> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult as any;

  let userId: bigint;
  try {
    userId = BigInt(id);
  } catch {
    return { ok: false, message: "شناسه کاربر نامعتبر است" };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const nationalCode = formData.get("nationalCode") as string;
  const postalCode = formData.get("postalCode") as string;
  const address = formData.get("address") as string;
  const isActive = formData.get("isActive") === "true";
  const imageFile = formData.get("imageFile") as File;

  const current = await prisma.user.findUnique({ where: { id: userId }, select: { image: true } });
  if (!current) return { ok: false, message: "کاربر یافت نشد" };

  let image = current.image;
  if (imageFile && imageFile.size > 0) {
    await removeUpload(image, "users");
    image = await saveUpload("users", imageFile, "user");
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        email: email || null,
        nationalCode: nationalCode || "1",
        postalCode: postalCode || null,
        address: address || null,
        image,
        isActive,
      },
    });
    revalidatePath("/admin/users");
    return { ok: true, record: userToRecord(updated) };
  } catch (error) {
    console.error("[users:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function deleteUserAction(id: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult as any;

  let userId: bigint;
  try {
    userId = BigInt(id);
  } catch {
    return { ok: false, message: "شناسه کاربر نامعتبر است" };
  }

  const current = await prisma.user.findUnique({ where: { id: userId }, select: { image: true } });
  if (!current) return { ok: false, message: "کاربر یافت نشد" };

  try {
    await prisma.user.delete({ where: { id: userId } });
    if (isManagedUpload(current.image)) await removeUpload(current.image, "users");
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    console.error("[users:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
