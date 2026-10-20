import "server-only";

import type { SubscriptionPlan, UserSubscription, UserSubscriptionStatus } from "@prisma/client";

import prisma from "@/lib/prisma";
import { remainingDays, type ActiveSubscriptionSummary } from "@/lib/subscriptions-shared";

export interface SubscriptionPlanRecord {
  id: string;
  name: string;
  durationMonths: number;
  price: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function subscriptionPlanToRecord(plan: SubscriptionPlan): SubscriptionPlanRecord {
  return {
    id: plan.id.toString(),
    name: plan.name,
    durationMonths: plan.durationMonths,
    price: plan.price,
    description: plan.description,
    isActive: plan.isActive,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
  };
}

export interface UserSubscriptionRecord {
  id: string;
  planId: string;
  planName: string;
  durationMonths: number;
  price: string;
  addedDays: number;
  carriedDays: number;
  description: string | null;
  status: UserSubscriptionStatus;
  /** True while this row is the user's current, unexpired subscription. */
  isCurrent: boolean;
  remainingDays: number;
  startsAt: string;
  endsAt: string;
  cancelledAt: string | null;
  createdAt: string;
}

export function userSubscriptionToRecord(sub: UserSubscription, now: Date = new Date()): UserSubscriptionRecord {
  const isCurrent = sub.status === "active" && sub.endsAt > now;
  return {
    id: sub.id.toString(),
    planId: sub.planId.toString(),
    planName: sub.planName,
    durationMonths: sub.durationMonths,
    price: sub.price,
    addedDays: sub.addedDays,
    carriedDays: sub.carriedDays,
    description: sub.description,
    status: sub.status,
    isCurrent,
    remainingDays: isCurrent ? remainingDays(sub.endsAt, now) : 0,
    startsAt: sub.startsAt.toISOString(),
    endsAt: sub.endsAt.toISOString(),
    cancelledAt: sub.cancelledAt ? sub.cancelledAt.toISOString() : null,
    createdAt: sub.createdAt.toISOString(),
  };
}

export function toActiveSummary(sub: UserSubscription, now: Date = new Date()): ActiveSubscriptionSummary {
  return {
    id: sub.id.toString(),
    planName: sub.planName,
    endsAt: sub.endsAt.toISOString(),
    remainingDays: remainingDays(sub.endsAt, now),
  };
}

/** The user's current subscription (status `active`, not yet expired), if any. */
export async function findActiveSubscription(userId: bigint, now: Date = new Date()): Promise<UserSubscription | null> {
  return prisma.userSubscription.findFirst({
    where: { userId, status: "active", endsAt: { gt: now } },
    orderBy: [{ endsAt: "desc" }, { id: "desc" }],
  });
}

/** Current subscription summary for many users at once, keyed by user id. */
export async function getActiveSubscriptionsByUser(
  userIds: bigint[],
  now: Date = new Date()
): Promise<Record<string, ActiveSubscriptionSummary>> {
  if (userIds.length === 0) return {};
  const rows = await prisma.userSubscription.findMany({
    where: { userId: { in: userIds }, status: "active", endsAt: { gt: now } },
    orderBy: [{ endsAt: "desc" }, { id: "desc" }],
  });
  const result: Record<string, ActiveSubscriptionSummary> = {};
  for (const row of rows) {
    const key = row.userId.toString();
    if (!result[key]) result[key] = toActiveSummary(row, now);
  }
  return result;
}
