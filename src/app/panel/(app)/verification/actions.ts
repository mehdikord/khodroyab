"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/user-auth";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { getUserVerification, type VerificationRecord } from "@/lib/verification";
import { parseVerificationForm, storeVerificationSubmission } from "@/lib/verification-submission";

const UNAUTHENTICATED_MESSAGE = "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type SubmitVerificationResult =
  | { ok: true; record: VerificationRecord }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/**
 * Submit the signed-in collaborator's identity documents for review (form
 * fields: see `parseVerificationForm`). Allowed only for collaborators with no
 * submission yet or whose last one was rejected; a resubmission replaces the
 * rejected one (and its files) and resets `authenticaed`.
 */
export async function submitVerificationAction(formData: FormData): Promise<SubmitVerificationResult> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  if (!user.collabrate) return { ok: false, message: "احراز هویت فقط برای کاربران همکار فعال است." };
  const userId = BigInt(user.id);

  const existing = await prisma.userVerification.findUnique({ where: { userId }, select: { status: true } });
  if (existing?.status === "pending") return { ok: false, message: "مدارک شما در حال بررسی است؛ تا اعلام نتیجه امکان ارسال مجدد وجود ندارد." };
  if (existing?.status === "approved") return { ok: false, message: "احراز هویت شما قبلاً تایید شده است." };

  const parsed = parseVerificationForm(formData);
  if (!parsed.ok) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };

  const stored = await storeVerificationSubmission(userId, parsed.submission);
  if (!stored.ok) {
    if (stored.reason === "upload") return { ok: false, message: "خطا در ذخیره تصاویر مدارک؛ لطفاً دوباره تلاش کنید." };
    // Another tab may have submitted concurrently (unique user_id); show the stored state.
    const current = await getUserVerification(userId).catch(() => null);
    if (current?.status === "pending") return { ok: true, record: current };
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  revalidatePath("/panel/verification");
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${user.id}`);
  revalidatePath("/admin/dashboard");
  return { ok: true, record: stored.record };
}
