import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/user-auth";
import { emptyAdStats, profileSelect, toProfileRecord } from "@/lib/profile-server";
import { ProfileManager } from "@/components/panel/profile/ProfileManager";

export const metadata: Metadata = {
  title: "پروفایل | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** The customer's own profile: overview, edit sheet and a separate password sheet. */
export default async function PanelProfilePage() {
  const user = await requireUser();
  const userId = BigInt(user.id);

  const [row, grouped] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: profileSelect }),
    prisma.userCar.groupBy({ by: ["status"], where: { userId }, _count: { _all: true } }),
  ]);
  if (!row) {
    // Guarded by requireUser(); only reachable if the row vanished mid-request.
    return null;
  }

  const stats = emptyAdStats();
  for (const group of grouped) {
    const count = group._count._all;
    stats[group.status] = count;
    stats.total += count;
  }

  return <ProfileManager initialProfile={toProfileRecord(row)} stats={stats} />;
}
