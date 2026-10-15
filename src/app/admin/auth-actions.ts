"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authenticateAdmin } from "@/lib/auth/authenticate";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetAttempts,
} from "@/lib/auth/rate-limit";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import {
  clearSessionCookie,
  issueSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";
import {
  parseAdminLoginForm,
  type FieldErrors,
} from "@/lib/validation/admin";

export type LoginActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

/** Best-effort client IP for throttling. */
function getClientIp(): string {
  const headerList = headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return headerList.get("x-real-ip") || "unknown";
}

/**
 * Authenticate an administrator and establish a session cookie.
 * Returns a discriminated result; the client navigates on success.
 */
export async function loginAdminAction(
  formData: FormData
): Promise<LoginActionResult> {
  if (!isTrustedOrigin()) {
    return {
      ok: false,
      message: "درخواست نامعتبر است. لطفاً دوباره تلاش کنید.",
    };
  }

  const parsed = parseAdminLoginForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "اطلاعات وارد شده معتبر نیست.",
      fieldErrors: parsed.fieldErrors,
    };
  }

  const { phone, password } = parsed.data;
  const throttleKey = `${getClientIp()}::${phone}`;

  const limit = checkRateLimit(throttleKey);
  if (!limit.allowed) {
    return {
      ok: false,
      message: `تلاش‌های ناموفق بیش از حد مجاز. لطفاً پس از ${Math.ceil(
        limit.retryAfterSeconds / 60
      )} دقیقه دوباره تلاش کنید.`,
    };
  }

  const admin = await authenticateAdmin(phone, password);

  if (!admin) {
    recordFailedAttempt(throttleKey);
    // Generic message: never reveal whether the phone exists.
    return {
      ok: false,
      message: "شماره موبایل یا رمز عبور نادرست است.",
    };
  }

  resetAttempts(throttleKey);
  const token = await issueSessionToken(admin);
  setSessionCookie(token);

  return { ok: true };
}

/** Destroy the current administrator session. */
export async function logoutAdminAction(): Promise<void> {
  clearSessionCookie();
  redirect("/admin");
}
