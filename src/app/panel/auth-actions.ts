"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { OTP_IS_PLACEHOLDER, requestOtp, verifyOtp } from "@/lib/auth/otp";
import { checkRateLimit, recordFailedAttempt, resetAttempts } from "@/lib/auth/rate-limit";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import {
  clearUserSessionCookie,
  issueUserSessionToken,
  setUserSessionCookie,
} from "@/lib/auth/user-session";
import type { FieldErrors } from "@/lib/validation/admin";
import { parseOtpRequestForm, parseOtpVerifyForm } from "@/lib/validation/user";
import { toPersianDigits } from "@/lib/utils";

/** Best-effort client IP for throttling. */
function getClientIp(): string {
  const headerList = headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return headerList.get("x-real-ip") || "unknown";
}

const INVALID_REQUEST = "درخواست نامعتبر است. لطفاً دوباره تلاش کنید.";
const GENERIC_FAILURE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

function minutes(seconds: number): string {
  return toPersianDigits(Math.max(1, Math.ceil(seconds / 60)));
}

export type RequestOtpActionResult =
  | {
      ok: true;
      phone: string;
      /** No account exists for this number yet: the next step also asks for the name. */
      isNewUser: boolean;
      resendInSeconds: number;
      expiresInSeconds: number;
      /** No SMS gateway yet: the code is the fixed placeholder, shown as a hint. */
      placeholderCode: boolean;
    }
  | { ok: false; message: string; fieldErrors?: FieldErrors; retryAfterSeconds?: number };

/**
 * Step 1 of the customer sign-in / sign-up: send a one-time code to the mobile
 * number. Tells the client whether the number already has an account so the
 * next step can also ask a new customer for their name.
 */
export async function requestOtpAction(formData: FormData): Promise<RequestOtpActionResult> {
  if (!isTrustedOrigin()) return { ok: false, message: INVALID_REQUEST };

  const parsed = parseOtpRequestForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "شماره موبایل معتبر نیست.", fieldErrors: parsed.fieldErrors };
  }
  const { phone } = parsed.data;

  // Per-IP cap on code requests, so one client cannot spam many numbers.
  const ipKey = `otp-send::${getClientIp()}`;
  const ipLimit = checkRateLimit(ipKey);
  if (!ipLimit.allowed) {
    return {
      ok: false,
      message: `درخواست‌های ارسال کد بیش از حد مجاز است. لطفاً پس از ${minutes(ipLimit.retryAfterSeconds)} دقیقه دوباره تلاش کنید.`,
    };
  }

  try {
    const user = await prisma.user.findFirst({
      where: { phone },
      orderBy: { id: "asc" },
      select: { isActive: true },
    });
    if (user && !user.isActive) {
      return { ok: false, message: "حساب کاربری شما غیرفعال شده است. برای پیگیری با پشتیبانی تماس بگیرید." };
    }

    const sent = await requestOtp(phone);
    if (!sent.ok) {
      return {
        ok: false,
        retryAfterSeconds: sent.retryAfterSeconds,
        message:
          sent.reason === "cooldown"
            ? `کد قبلی هنوز معتبر است. برای ارسال دوباره ${toPersianDigits(sent.retryAfterSeconds)} ثانیه صبر کنید.`
            : `تعداد درخواست کد برای این شماره بیش از حد مجاز است. لطفاً پس از ${minutes(sent.retryAfterSeconds)} دقیقه دوباره تلاش کنید.`,
      };
    }

    recordFailedAttempt(ipKey); // every send counts towards the per-IP cap
    return {
      ok: true,
      phone,
      isNewUser: !user,
      resendInSeconds: sent.resendInSeconds,
      expiresInSeconds: sent.expiresInSeconds,
      placeholderCode: OTP_IS_PLACEHOLDER,
    };
  } catch (error) {
    console.error("[users:otp-request] failed", error);
    return { ok: false, message: GENERIC_FAILURE };
  }
}

export type VerifyOtpActionResult = { ok: true } | { ok: false; message: string; fieldErrors?: FieldErrors };

/**
 * Step 2: check the code and sign the customer in. When the number has no
 * account yet, one is created with the given name (active and approved right
 * away, never a collaborator; only an administrator can turn that on).
 */
export async function verifyOtpAction(formData: FormData): Promise<VerifyOtpActionResult> {
  if (!isTrustedOrigin()) return { ok: false, message: INVALID_REQUEST };

  const phoneOnly = parseOtpRequestForm(formData);
  if (!phoneOnly.success) {
    return { ok: false, message: "شماره موبایل معتبر نیست.", fieldErrors: phoneOnly.fieldErrors };
  }
  const phone = phoneOnly.data.phone;

  const throttleKey = `otp-verify::${getClientIp()}::${phone}`;
  const limit = checkRateLimit(throttleKey);
  if (!limit.allowed) {
    return {
      ok: false,
      message: `تلاش‌های ناموفق بیش از حد مجاز. لطفاً پس از ${minutes(limit.retryAfterSeconds)} دقیقه دوباره تلاش کنید.`,
    };
  }

  try {
    const existing = await prisma.user.findFirst({
      where: { phone },
      orderBy: { id: "asc" },
      select: { id: true, name: true, phone: true, isActive: true },
    });

    const parsed = parseOtpVerifyForm(formData, { requireName: !existing });
    if (!parsed.success) {
      return { ok: false, message: "اطلاعات وارد شده معتبر نیست.", fieldErrors: parsed.fieldErrors };
    }

    if (existing && !existing.isActive) {
      return { ok: false, message: "حساب کاربری شما غیرفعال شده است. برای پیگیری با پشتیبانی تماس بگیرید." };
    }

    const check = await verifyOtp(phone, parsed.data.code);
    if (!check.ok) {
      recordFailedAttempt(throttleKey);
      const message =
        check.reason === "invalid"
          ? "کد تایید نادرست است."
          : check.reason === "locked"
            ? "تعداد تلاش‌های نادرست زیاد بود؛ کد جدید دریافت کنید."
            : "کد تایید منقضی شده است؛ کد جدید دریافت کنید.";
      return { ok: false, message, fieldErrors: { code: message } };
    }
    resetAttempts(throttleKey);

    let sessionUser = existing ? { id: existing.id.toString(), name: existing.name, phone: existing.phone } : null;
    if (!sessionUser) {
      const created = await prisma.user.create({
        data: {
          name: parsed.data.name,
          phone,
          password: null,
          isActive: true,
          approvedAt: new Date(),
          collabrate: false,
          authenticaed: false,
        },
        select: { id: true, name: true, phone: true },
      });
      sessionUser = { id: created.id.toString(), name: created.name, phone: created.phone };
      revalidatePath("/admin/users");
      revalidatePath("/admin/dashboard");
    }

    const token = await issueUserSessionToken(sessionUser);
    setUserSessionCookie(token);
    return { ok: true };
  } catch (error) {
    console.error("[users:otp-verify] failed", error);
    return { ok: false, message: GENERIC_FAILURE };
  }
}

/** Destroy the current user session. */
export async function logoutUserAction(): Promise<void> {
  clearUserSessionCookie();
  redirect("/panel");
}
