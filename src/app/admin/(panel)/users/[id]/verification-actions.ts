"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { adminActionDenied } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { VERIFICATION_REJECT_REASON_MAX, verificationInclude, verificationToRecord, type VerificationRecord } from "@/lib/verification";
import { parseVerificationForm, storeVerificationSubmission } from "@/lib/verification-submission";
import { toPersianDigits } from "@/lib/utils";

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type ReviewVerificationResult =
  | { ok: true; verification: VerificationRecord; authenticaed: boolean }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/**
 * Approve or reject a collaborator's identity documents. The decision is kept
 * on the submission and mirrored on `users.authenticaed`. A rejection may carry
 * a reason, which the user sees on their verification page. A decision can be
 * changed later (e.g. revoking an approval).
 */
export async function reviewVerificationAction(
  userIdRaw: string,
  decision: "approve" | "reject",
  reasonRaw = ""
): Promise<ReviewVerificationResult> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const denied = await adminActionDenied("users");
  if (denied) return { ok: false, message: denied };
  if (decision !== "approve" && decision !== "reject") return { ok: false, message: "تصمیم نامعتبر است" };

  let userId: bigint;
  try {
    userId = BigInt(userIdRaw);
  } catch {
    return { ok: false, message: "شناسه کاربر نامعتبر است" };
  }

  const reason = decision === "reject" ? reasonRaw.trim() : "";
  if (reason.length > VERIFICATION_REJECT_REASON_MAX) {
    return {
      ok: false,
      message: "دلیل رد بیش از حد طولانی است",
      fieldErrors: { reason: `دلیل رد حداکثر ${toPersianDigits(VERIFICATION_REJECT_REASON_MAX)} کاراکتر است` },
    };
  }

  const existing = await prisma.userVerification.findUnique({ where: { userId }, select: { id: true } });
  if (!existing) return { ok: false, message: "این کاربر هنوز مدرکی برای احراز هویت ارسال نکرده است" };

  const approved = decision === "approve";
  try {
    const updated = await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { authenticaed: approved } });
      return tx.userVerification.update({
        where: { id: existing.id },
        data: { status: approved ? "approved" : "rejected", rejectReason: reason || null, reviewedAt: new Date() },
        include: verificationInclude,
      });
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId.toString()}`);
    revalidatePath("/admin/dashboard");
    // The user's panel (warning, publishing pages) and the public listings change with the result.
    revalidatePath("/panel", "layout");
    return { ok: true, verification: verificationToRecord(updated), authenticaed: approved };
  } catch (error) {
    console.error("[verification:review] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export type AdminSubmitVerificationResult =
  | { ok: true; verification: VerificationRecord; authenticaed: boolean }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/**
 * An administrator fills in a collaborator's identity form and documents on
 * their behalf (same fields as the panel form, see `parseVerificationForm`).
 * The new submission replaces any existing one and its files. With `approve`
 * set to "1" it is stored as approved right away; otherwise it waits for review.
 */
export async function adminSubmitVerificationAction(userIdRaw: string, formData: FormData): Promise<AdminSubmitVerificationResult> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const denied = await adminActionDenied("users");
  if (denied) return { ok: false, message: denied };

  let userId: bigint;
  try {
    userId = BigInt(userIdRaw);
  } catch {
    return { ok: false, message: "شناسه کاربر نامعتبر است" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { collabrate: true } });
  if (!user) return { ok: false, message: "کاربر یافت نشد" };
  if (!user.collabrate) return { ok: false, message: "احراز هویت فقط برای کاربران همکار فعال است." };

  const parsed = parseVerificationForm(formData);
  if (!parsed.ok) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };

  const approve = formData.get("approve") === "1";
  const stored = await storeVerificationSubmission(userId, parsed.submission, { approve });
  if (!stored.ok) {
    return {
      ok: false,
      message: stored.reason === "upload" ? "خطا در ذخیره تصاویر مدارک؛ لطفاً دوباره تلاش کنید." : GENERIC_FAILURE_MESSAGE,
    };
  }

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId.toString()}`);
  revalidatePath("/admin/dashboard");
  revalidatePath("/panel", "layout");
  return { ok: true, verification: stored.record, authenticaed: approve };
}
