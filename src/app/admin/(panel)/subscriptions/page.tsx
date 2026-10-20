import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { subscriptionPlanToRecord } from "@/lib/subscriptions";
import { SubscriptionPlansManager } from "@/components/admin/subscriptions/SubscriptionPlansManager";

export const metadata: Metadata = {
  title: "لیست اشتراک‌ها | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  await requireAdmin();

  const [plans, usage] = await Promise.all([
    prisma.subscriptionPlan.findMany({ orderBy: [{ createdAt: "desc" }, { id: "desc" }] }),
    prisma.userSubscription.groupBy({ by: ["planId"], _count: { _all: true } }),
  ]);

  const usageByPlan: Record<string, number> = {};
  for (const row of usage) usageByPlan[row.planId.toString()] = row._count._all;

  return <SubscriptionPlansManager initialPlans={plans.map(subscriptionPlanToRecord)} usageByPlan={usageByPlan} />;
}
