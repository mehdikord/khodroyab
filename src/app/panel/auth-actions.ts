"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { authenticateUser } from "@/lib/auth/user-auth";
import { hashPassword } from "@/lib/auth/password";
import { checkRateLimit, recordFailedAttempt, resetAttempts } from "@/lib/auth/rate-limit";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import {
  clearUserSessionCookie,
  issueUserSessionToken,
  setUserSessionCookie,
} from "@/lib/auth/user-session";
import type { FieldErrors } from "@/lib/validation/admin";
import { parseUserLoginForm, parseUserRegisterForm } from "@/lib/validation/user";

export type UserLoginActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

/** Best-effort client IP for throttling. */
function getClientIp(): string {
  const headerList = headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return headerList.get("x-real-ip") || "unknown";
}

/**
 * Authenticate a customer and establish a user-panel session cookie.
 * Returns a discriminated result; the client navigates on success.
 */
export async function loginUserAction(formData: FormData): Promise<UserLoginActionResult> {
  if (!isTrustedOrigin()) {
    return { ok: false, message: "درخواست نامعتبر است. لطفاً دوباره تلاش کنید." };
  }

  const parsed = parseUserLoginForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "اطلاعات وارد شده معتبر نیست.", fieldErrors: parsed.fieldErrors };
  }

  const { phone, password } = parsed.data;
  const throttleKey = `user::${getClientIp()}::${phone}`;

  const limit = checkRateLimit(throttleKey);
  if (!limit.allowed) {
    return {
      ok: false,
      message: `تلاش‌های ناموفق بیش از حد مجاز. لطفاً پس از ${Math.ceil(limit.retryAfterSeconds / 60)} دقیقه دوباره تلاش کنید.`,
    };
  }

  const result = await authenticateUser(phone, password);

  if (!result.ok) {
    if (result.reason === "pending") {
      return {
        ok: false,
        message: "حساب شما ثبت شده اما هنوز توسط مدیر تایید نشده است. پس از تایید می‌توانید وارد شوید.",
      };
    }
    if (result.reason === "inactive") {
      // Correct credentials, disabled account: say so without counting a failure.
      return { ok: false, message: "حساب کاربری شما غیرفعال شده است. برای پیگیری با پشتیبانی تماس بگیرید." };
    }
    recordFailedAttempt(throttleKey);
    return { ok: false, message: "شماره موبایل یا رمز عبور نادرست است." };
  }

  resetAttempts(throttleKey);
  const token = await issueUserSessionToken(result.user);
  setUserSessionCookie(token);

  return { ok: true };
}

export type UserRegisterActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

/**
 * Self-registration for customers. The account is created *inactive* and
 * unapproved; an administrator activates it from "کاربران در انتظار".
 */
export async function registerUserAction(formData: FormData): Promise<UserRegisterActionResult> {
  if (!isTrustedOrigin()) {
    return { ok: false, message: "درخواست نامعتبر است. لطفاً دوباره تلاش کنید." };
  }

  // Throttle sign-ups per IP so the queue cannot be flooded.
  const throttleKey = `register::${getClientIp()}`;
  const limit = checkRateLimit(throttleKey);
  if (!limit.allowed) {
    return {
      ok: false,
      message: `تعداد ثبت‌نام‌ها بیش از حد مجاز است. لطفاً پس از ${Math.ceil(limit.retryAfterSeconds / 60)} دقیقه دوباره تلاش کنید.`,
    };
  }

  const parsed = parseUserRegisterForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "اطلاعات وارد شده معتبر نیست.", fieldErrors: parsed.fieldErrors };
  }

  const { name, phone, password } = parsed.data;

  try {
    const duplicate = await prisma.user.findFirst({ where: { phone }, select: { id: true } });
    if (duplicate) {
      recordFailedAttempt(throttleKey);
      return {
        ok: false,
        message: "این شماره موبایل قبلاً ثبت شده است.",
        fieldErrors: { phone: "کاربری با این شماره موبایل وجود دارد؛ وارد شوید." },
      };
    }

    await prisma.user.create({
      data: {
        name,
        phone,
        password: await hashPassword(password),
        isActive: false,
        approvedAt: null,
      },
    });
  } catch (error) {
    console.error("[users:register] failed", error);
    return { ok: false, message: "خطایی رخ داد؛ لطفاً دوباره تلاش کنید." };
  }

  recordFailedAttempt(throttleKey); // counts every sign-up towards the per-IP cap
  revalidatePath("/admin/users");
  revalidatePath("/admin/users/pending");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

/** Destroy the current user session. */
export async function logoutUserAction(): Promise<void> {
  clearUserSessionCookie();
  redirect("/panel");
}
