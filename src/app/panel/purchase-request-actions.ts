"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { getCurrentUser } from "@/lib/auth/user-auth";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { checkRateLimit, recordFailedAttempt } from "@/lib/auth/rate-limit";
import { listProvinceOptions, type ProvinceOption } from "@/lib/branches";
import { createPurchaseRequest } from "@/lib/purchase-requests";
import { parsePurchaseRequestForm } from "@/lib/validation/purchase-requests";
import { toPersianDigits } from "@/lib/utils";

const GENERIC_FAILURE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

function clientIp(): string {
  const list = headers();
  return list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "unknown";
}

function tooMany(seconds: number) {
  return `تعداد درخواست‌های ثبت‌شده بیش از حد مجاز است. لطفاً پس از ${toPersianDigits(Math.max(1, Math.ceil(seconds / 60)))} دقیقه دوباره تلاش کنید.`;
}

export type SubmitPurchaseRequestResult =
  | { ok: true; id: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/**
 * Send a purchase request (درخواست خرید) from a sale ad or a price-list
 * seller row. Guests give name, mobile, province and city; signed-in customers
 * only a note. Throttled per IP and per mobile number (5 requests per 10
 * minutes; the in-memory limiter then blocks for 15 minutes).
 */
export async function submitPurchaseRequestAction(formData: FormData): Promise<SubmitPurchaseRequestResult> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE };

  const user = await getCurrentUser();
  const parsed = parsePurchaseRequestForm(formData, !user);
  if (!parsed.success) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };

  const keys = [`purchase-request::ip::${clientIp()}`, `purchase-request::phone::${user?.phone ?? parsed.data.guest!.phone}`];
  for (const key of keys) {
    const limit = checkRateLimit(key);
    if (!limit.allowed) return { ok: false, message: tooMany(limit.retryAfterSeconds) };
  }

  try {
    const result = await createPurchaseRequest(parsed.data, user);
    if (!result.ok) return result;
    keys.forEach(recordFailedAttempt); // every sent request counts towards the caps
    revalidatePath("/admin", "layout");
    if (user) revalidatePath("/panel/requests");
    return result;
  } catch (error) {
    console.error("[purchase-requests:create] failed", error);
    return { ok: false, message: GENERIC_FAILURE };
  }
}

/** Provinces with their cities for the guest form (loaded when the form opens). */
export async function loadPurchaseRequestLocationsAction(): Promise<ProvinceOption[]> {
  try {
    return await listProvinceOptions();
  } catch (error) {
    console.error("[purchase-requests:locations] failed", error);
    return [];
  }
}
