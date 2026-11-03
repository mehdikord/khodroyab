"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { VERIFICATION_REJECT_REASON_MAX, verificationInclude, verificationToRecord, type VerificationRecord } from "@/lib/verification";
import { toPersianDigits } from "@/lib/utils";

const UNAUTHENTICATED_MESSAGE = "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
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
  if (!(await getCurrentAdmin())) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
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
