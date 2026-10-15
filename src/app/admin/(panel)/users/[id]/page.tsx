import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { userToRecord } from "@/lib/users";
import { userCarInclude, userCarToRecord } from "@/lib/user-cars";
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
  await requireAdmin();

  let userId: bigint;
  try {
    userId = BigInt(params.id);
  } catch {
    return notFound();
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return notFound();
  }

  const [saleAdsCount, recentAds] = await Promise.all([
    prisma.userCar.count({ where: { userId } }),
    prisma.userCar.findMany({
      where: { userId },
      include: userCarInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 5,
    }),
  ]);

  return (
    <UserProfile
      user={userToRecord(user)}
      saleAdsCount={saleAdsCount}
      recentAds={recentAds.map(userCarToRecord)}
    />
  );
}
