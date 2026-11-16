import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/user-auth";
import { emptyAdStats, profileSelect, toProfileRecord } from "@/lib/profile-server";
import { ProfileManager } from "@/components/panel/profile/ProfileManager";
import { getSystemSettings } from "@/lib/system-settings";
import { getActiveUserCode } from "@/lib/user-codes";
import type { PriceMarket } from "@/lib/price-market";

const faTime = new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" });

export const metadata: Metadata = {
  title: "پروفایل | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** The customer's own profile: overview, edit sheet and a separate password sheet. */
export default async function PanelProfilePage() {
  const user = await requireUser();
  const userId = BigInt(user.id);

  const [row, grouped, code, settings, priceGroups] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: profileSelect }),
    prisma.userCar.groupBy({ by: ["status"], where: { userId }, _count: { _all: true } }),
    getActiveUserCode(userId),
    getSystemSettings(),
    // Cars priced in each of the two price lists (collaborators only).
    user.collabrate
      ? prisma.userPriceTableEntry.groupBy({
          by: ["market"],
          where: { userId, car: { priceTable: true }, prices: { some: {} } },
          _count: { _all: true },
        })
      : Promise.resolve([]),
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

  const priceListCounts: Record<PriceMarket, number> = { free_zone: 0, national: 0 };
  for (const group of priceGroups) priceListCounts[group.market] = group._count._all;

  return (
    <ProfileManager
      priceListCounts={priceListCounts}
      verified={user.authenticaed}
      initialProfile={toProfileRecord(row)}
      stats={stats}
      collabrate={user.collabrate}
      userCode={{
        code: code.code,
        validUntilLabel: faTime.format(code.expiresAt),
        rotationMinutes: settings.userCodeRotationMinutes,
      }}
    />
  );
}
