"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentUser, isBcryptHash } from "@/lib/auth/user-auth";
import { consumeTiming, hashPassword, verifyPassword } from "@/lib/auth/password";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/lib/validation/brands";
import { parsePasswordChangeForm, parseProfileUpdateForm } from "@/lib/validation/profile";
import { isManagedUpload, removeUpload, saveUpload } from "@/lib/uploads";
import type { ProfileRecord } from "@/lib/profile";
import { profileSelect, toProfileRecord } from "@/lib/profile-server";

const UNAUTHENTICATED_MESSAGE = "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type ProfileActionResult =
  | { ok: true; profile: ProfileRecord }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export type PasswordActionResult = { ok: true } | { ok: false; message: string; fieldErrors?: Record<string, string> };

async function guardRequest(): Promise<{ ok: false; message: string } | { ok: true; userId: bigint }> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  try {
    return { ok: true, userId: BigInt(user.id) };
  } catch {
    return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  }
}

function revalidateProfilePages(userId: bigint) {
  revalidatePath("/panel/profile");
  revalidatePath("/panel/dashboard");
  revalidatePath("/panel", "layout");
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId.toString()}`);
}

/* ───────────────────────── profile ───────────────────────── */

/**
 * Update the signed-in customer's own profile. The phone number is the login
 * identity and cannot be changed from the panel; the password has its own
 * action below.
 */
export async function updateProfileAction(formData: FormData): Promise<ProfileActionResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;
  const { userId } = guard;

  const parsed = parseProfileUpdateForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "برخی از فیلدها معتبر نیستند", fieldErrors: parsed.fieldErrors };
  }

  const imageFile = formData.get("imageFile");
  const removeImage = formData.get("removeImage") === "1";
  const hasNewImage = imageFile instanceof File && imageFile.size > 0;

  if (hasNewImage) {
    if (!(ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(imageFile.type)) {
      return { ok: false, message: "فرمت تصویر معتبر نیست", fieldErrors: { imageFile: "فقط PNG، JPG، WebP یا AVIF" } };
    }
    if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      return { ok: false, message: "حجم تصویر زیاد است", fieldErrors: { imageFile: "حداکثر ۲ مگابایت" } };
    }
  }

  const current = await prisma.user.findUnique({ where: { id: userId }, select: { image: true, isActive: true } });
  if (!current || !current.isActive) return { ok: false, message: UNAUTHENTICATED_MESSAGE };

  let image = current.image;
  try {
    if (hasNewImage) {
      const saved = await saveUpload("users", imageFile, "user");
      if (isManagedUpload(current.image)) await removeUpload(current.image, "users");
      image = saved;
    } else if (removeImage && current.image) {
      if (isManagedUpload(current.image)) await removeUpload(current.image, "users");
      image = null;
    }
  } catch (error) {
    console.error("Profile image update failed:", error);
    return { ok: false, message: "ذخیره تصویر پروفایل ناموفق بود" };
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: parsed.data.name,
        companyName: parsed.data.companyName || null,
        email: parsed.data.email || null,
        nationalCode: parsed.data.nationalCode || null,
        tel: parsed.data.tel || null,
        postalCode: parsed.data.postalCode || null,
        address: parsed.data.address || null,
        bio: parsed.data.bio || null,
        image,
      },
      select: profileSelect,
    });
    revalidateProfilePages(userId);
    return { ok: true, profile: toProfileRecord(updated) };
  } catch (error) {
    console.error("Profile update failed:", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/* ───────────────────────── password ───────────────────────── */

/**
 * Change the signed-in customer's password. Requires the current password so
 * a stolen session cannot be used to lock the owner out.
 */
export async function changePasswordAction(formData: FormData): Promise<PasswordActionResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;
  const { userId } = guard;

  const parsed = parsePasswordChangeForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "برخی از فیلدها معتبر نیستند", fieldErrors: parsed.fieldErrors };
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { password: true, isActive: true } });
  if (!user || !user.isActive) return { ok: false, message: UNAUTHENTICATED_MESSAGE };

  let valid: boolean;
  if (isBcryptHash(user.password)) {
    valid = await verifyPassword(parsed.data.currentPassword, user.password);
  } else {
    // Legacy plaintext row (pre-hashing); compare then upgrade below.
    await consumeTiming(parsed.data.currentPassword);
    valid = user.password === parsed.data.currentPassword;
  }

  if (!valid) {
    return { ok: false, message: "رمز عبور فعلی اشتباه است", fieldErrors: { currentPassword: "رمز عبور فعلی اشتباه است" } };
  }

  try {
    const hashed = await hashPassword(parsed.data.newPassword);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return { ok: true };
  } catch (error) {
    console.error("Password change failed:", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
