import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import { requireAdminAccess } from "@/lib/auth/guards";
import { USER_DIRECTORY_ACCESS, hasPermission } from "@/lib/auth/permissions";
import { userRecordInclude, userToRecord } from "@/lib/users";
import { userCarInclude, userCarToRecord } from "@/lib/user-cars";
import { getUserVerification } from "@/lib/verification";
import { listRecentUserPriceTableEntries } from "@/lib/price-table";
import { UserProfile } from "@/components/admin/users/UserProfile";

export const metadata: Metadata = {
  title: "پروفایل کاربر | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function AdminUserProfilePage({ params }: PageProps) {
  const admin = await requireAdminAccess(USER_DIRECTORY_ACCESS);
  const access = {
    manageUser: hasPermission(admin, "users"),
    ads: hasPermission(admin, "ads"),
    priceTable: hasPermission(admin, "price_table"),
  };

  let userId: bigint;
  try {
    userId = BigInt(params.id);
  } catch {
    return notFound();
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, include: userRecordInclude });
  if (!user) {
    return notFound();
  }

  // Only load what this admin's sections may see (identity documents stay with "users").
  const [saleAdsCount, recentAds, verification, priceTable] = await Promise.all([
    prisma.userCar.count({ where: { userId } }),
    access.ads
      ? prisma.userCar.findMany({
          where: { userId },
          include: userCarInclude,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: 3,
        })
      : Promise.resolve([]),
    access.manageUser ? getUserVerification(userId) : Promise.resolve(null),
    access.priceTable ? listRecentUserPriceTableEntries(userId, 3) : Promise.resolve({ total: 0, entries: [] }),
  ]);

  return (
    <UserProfile
      user={userToRecord(user)}
      saleAdsCount={saleAdsCount}
      recentAds={recentAds.map(userCarToRecord)}
      priceTable={priceTable}
      verification={verification}
      access={access}
    />
  );
}
