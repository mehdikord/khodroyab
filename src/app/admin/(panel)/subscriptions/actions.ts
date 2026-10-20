"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import {
  subscriptionPlanToRecord,
  toActiveSummary,
  userSubscriptionToRecord,
  type SubscriptionPlanRecord,
  type UserSubscriptionRecord,
} from "@/lib/subscriptions";
import { DAYS_PER_MONTH, addDays, remainingDays, type ActiveSubscriptionSummary } from "@/lib/subscriptions-shared";
import { parseGrantSubscriptionForm, parseSubscriptionPlanForm } from "@/lib/validation/subscriptions";

const UNAUTHENTICATED_MESSAGE = "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type SubscriptionPlanActionResult =
  | { ok: true; record: SubscriptionPlanRecord }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export type SubscriptionSimpleActionResult = { ok: true } | { ok: false; message: string };

export type UserSubscriptionActionResult =
  | {
      ok: true;
      /** The row that was created or changed. */
      record: UserSubscriptionRecord;
      /** Previous row that was superseded by this grant, if any. */
      renewedId: string | null;
      active: ActiveSubscriptionSummary | null;
    }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

async function guardRequest(): Promise<{ ok: false; message: string } | null> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  if (!(await getCurrentAdmin())) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  return null;
}

function parseId(id: string): bigint | null {
  try {
    return BigInt(id);
  } catch {
    return null;
  }
}

function revalidateSubscriptionViews(userId?: bigint) {
  revalidatePath("/admin/subscriptions");
  revalidatePath("/admin/users");
  if (userId !== undefined) revalidatePath(`/admin/users/${userId}`);
}

/* ───────────────────────── plans ───────────────────────── */

export async function createSubscriptionPlanAction(formData: FormData): Promise<SubscriptionPlanActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const parsed = parseSubscriptionPlanForm(formData);
  if (!parsed.success) return { ok: false, message: "اطلاعات فرم ناقص است", fieldErrors: parsed.fieldErrors };

  try {
    const created = await prisma.subscriptionPlan.create({ data: { ...parsed.data, isActive: true } });
    revalidateSubscriptionViews();
    return { ok: true, record: subscriptionPlanToRecord(created) };
  } catch (error) {
    console.error("[subscriptionPlans:create] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function updateSubscriptionPlanAction(id: string, formData: FormData): Promise<SubscriptionPlanActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const planId = parseId(id);
  if (planId === null) return { ok: false, message: "شناسه اشتراک نامعتبر است" };

  const parsed = parseSubscriptionPlanForm(formData);
  if (!parsed.success) return { ok: false, message: "اطلاعات فرم ناقص است", fieldErrors: parsed.fieldErrors };

  const isActive = formData.get("isActive") === "true";

  const current = await prisma.subscriptionPlan.findUnique({ where: { id: planId }, select: { id: true } });
  if (!current) return { ok: false, message: "اشتراک یافت نشد" };

  try {
    // Granted subscriptions keep their own snapshot, so editing a plan never
    // rewrites any user's history.
    const updated = await prisma.subscriptionPlan.update({ where: { id: planId }, data: { ...parsed.data, isActive } });
    revalidateSubscriptionViews();
    return { ok: true, record: subscriptionPlanToRecord(updated) };
  } catch (error) {
    console.error("[subscriptionPlans:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function toggleSubscriptionPlanActiveAction(id: string): Promise<SubscriptionPlanActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const planId = parseId(id);
  if (planId === null) return { ok: false, message: "شناسه اشتراک نامعتبر است" };

  const current = await prisma.subscriptionPlan.findUnique({ where: { id: planId }, select: { isActive: true } });
  if (!current) return { ok: false, message: "اشتراک یافت نشد" };

  try {
    const updated = await prisma.subscriptionPlan.update({ where: { id: planId }, data: { isActive: !current.isActive } });
    revalidateSubscriptionViews();
    return { ok: true, record: subscriptionPlanToRecord(updated) };
  } catch (error) {
    console.error("[subscriptionPlans:toggle] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function deleteSubscriptionPlanAction(id: string): Promise<SubscriptionSimpleActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const planId = parseId(id);
  if (planId === null) return { ok: false, message: "شناسه اشتراک نامعتبر است" };

  try {
    await prisma.subscriptionPlan.delete({ where: { id: planId } });
  } catch (error) {
    const code = typeof error === "object" && error !== null && "code" in error ? (error as { code?: string }).code : undefined;
    if (code === "P2003") {
      return {
        ok: false,
        message: "این اشتراک برای کاربران ثبت شده و قابل حذف نیست؛ به جای حذف می‌توانید آن را غیرفعال کنید.",
      };
    }
    if (code === "P2025") return { ok: false, message: "اشتراک یافت نشد" };
    console.error("[subscriptionPlans:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  revalidateSubscriptionViews();
  return { ok: true };
}

/* ───────────────────────── user subscriptions ───────────────────────── */

/**
 * Grant a plan to a user. When the user still has an active subscription, its
 * remaining time is carried into the new one (e.g. 10 days left + a 1-month
 * plan = 40 days) and the old row is marked `renewed` so history stays intact.
 */
export async function grantUserSubscriptionAction(userIdRaw: string, formData: FormData): Promise<UserSubscriptionActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const userId = parseId(userIdRaw);
  if (userId === null) return { ok: false, message: "شناسه کاربر نامعتبر است" };

  const parsed = parseGrantSubscriptionForm(formData);
  if (!parsed.success) return { ok: false, message: "اطلاعات فرم ناقص است", fieldErrors: parsed.fieldErrors };

  const planId = BigInt(parsed.data.planId);

  const [user, plan] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
    prisma.subscriptionPlan.findUnique({ where: { id: planId } }),
  ]);
  if (!user) return { ok: false, message: "کاربر یافت نشد" };
  if (!plan || !plan.isActive) {
    return { ok: false, message: "اشتراک انتخاب‌شده معتبر یا فعال نیست", fieldErrors: { planId: "اشتراک دیگری انتخاب کنید" } };
  }

  try {
    const { created, renewedId } = await prisma.$transaction(async (tx) => {
      const now = new Date();
      const previous = await tx.userSubscription.findMany({
        where: { userId, status: "active", endsAt: { gt: now } },
        orderBy: [{ endsAt: "desc" }, { id: "desc" }],
      });
      const current = previous[0] ?? null;

      const addedDays = plan.durationMonths * DAYS_PER_MONTH;
      const base = current ? current.endsAt : now;
      const carriedDays = current ? remainingDays(current.endsAt, now) : 0;

      if (previous.length > 0) {
        await tx.userSubscription.updateMany({
          where: { id: { in: previous.map((row) => row.id) } },
          data: { status: "renewed" },
        });
      }

      const created = await tx.userSubscription.create({
        data: {
          userId,
          planId: plan.id,
          planName: plan.name,
          durationMonths: plan.durationMonths,
          price: plan.price,
          addedDays,
          carriedDays,
          description: parsed.data.description,
          status: "active",
          startsAt: now,
          endsAt: addDays(base, addedDays),
        },
      });
      return { created, renewedId: current ? current.id.toString() : null };
    });

    revalidateSubscriptionViews(userId);
    return {
      ok: true,
      record: userSubscriptionToRecord(created),
      renewedId,
      active: toActiveSummary(created),
    };
  } catch (error) {
    console.error("[userSubscriptions:grant] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Revoke a user's current subscription immediately. */
export async function cancelUserSubscriptionAction(subscriptionId: string): Promise<UserSubscriptionActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const id = parseId(subscriptionId);
  if (id === null) return { ok: false, message: "شناسه اشتراک نامعتبر است" };

  const now = new Date();
  const current = await prisma.userSubscription.findUnique({ where: { id } });
  if (!current) return { ok: false, message: "اشتراک یافت نشد" };
  if (current.status !== "active" || current.endsAt <= now) {
    return { ok: false, message: "این اشتراک فعال نیست و قابل لغو نمی‌باشد" };
  }

  try {
    const updated = await prisma.userSubscription.update({
      where: { id },
      data: { status: "cancelled", cancelledAt: now },
    });
    revalidateSubscriptionViews(current.userId);
    return { ok: true, record: userSubscriptionToRecord(updated), renewedId: null, active: null };
  } catch (error) {
    console.error("[userSubscriptions:cancel] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
