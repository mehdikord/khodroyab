"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { userToRecord, type UserRecord } from "@/lib/users";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { isManagedUpload, removeUpload } from "@/lib/uploads";

const UNAUTHENTICATED_MESSAGE = "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type PendingUserActionResult = { ok: true; record: UserRecord } | { ok: false; message: string };
export type PendingUserSimpleResult = { ok: true } | { ok: false; message: string };

function parseBigInt(value: string): bigint | null {
  if (!/^\d+$/.test(value)) return null;
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

async function guardRequest(): Promise<{ ok: false; message: string } | null> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  if (!(await getCurrentAdmin())) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  return null;
}

function revalidateUserPages() {
  revalidatePath("/admin/users/pending");
  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
}

/** Approve a self-registered account: mark it approved and activate it. */
export async function approvePendingUserAction(id: string): Promise<PendingUserActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const userId = parseBigInt(id);
  if (userId === null) return { ok: false, message: "شناسه کاربر نامعتبر است" };

  try {
    const current = await prisma.user.findUnique({ where: { id: userId }, select: { approvedAt: true } });
    if (!current) return { ok: false, message: "کاربر یافت نشد" };
    if (current.approvedAt !== null) return { ok: false, message: "این کاربر قبلاً تایید شده است" };

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isActive: true, approvedAt: new Date() },
    });

    revalidateUserPages();
    return { ok: true, record: userToRecord(updated) };
  } catch (error) {
    console.error("[users:approve] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Reject a self-registered account: it is deleted (nothing else references it yet). */
export async function rejectPendingUserAction(id: string): Promise<PendingUserSimpleResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const userId = parseBigInt(id);
  if (userId === null) return { ok: false, message: "شناسه کاربر نامعتبر است" };

  try {
    const current = await prisma.user.findUnique({ where: { id: userId }, select: { approvedAt: true, image: true } });
    if (!current) return { ok: false, message: "کاربر یافت نشد" };
    if (current.approvedAt !== null) return { ok: false, message: "فقط کاربران در انتظار تایید قابل رد شدن هستند" };

    await prisma.user.delete({ where: { id: userId } });
    if (isManagedUpload(current.image)) await removeUpload(current.image, "users");

    revalidateUserPages();
    return { ok: true };
  } catch (error) {
    console.error("[users:reject] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
