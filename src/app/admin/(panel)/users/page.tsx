import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { userToRecord } from "@/lib/users";
import { getActiveSubscriptionsByUser, subscriptionPlanToRecord } from "@/lib/subscriptions";
import { UsersManager } from "@/components/admin/users/UsersManager";

export const metadata: Metadata = {
  title: "مدیریت کاربران | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdmin();

  const [users, plans] = await Promise.all([
    prisma.user.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
    prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: [{ durationMonths: "asc" }, { id: "asc" }],
    }),
  ]);
  const subscriptions = await getActiveSubscriptionsByUser(users.map((user) => user.id));

  return (
    <UsersManager
      initialUsers={users.map(userToRecord)}
      initialSubscriptions={subscriptions}
      plans={plans.map(subscriptionPlanToRecord)}
    />
  );
}
