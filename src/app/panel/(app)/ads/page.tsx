import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth/user-auth";
import { userCarInclude, userCarToRecord } from "@/lib/user-cars";
import { MyAdsManager } from "@/components/panel/ads/MyAdsManager";

export const metadata: Metadata = {
  title: "آگهی‌های من | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** The customer's own sale ads and their moderation status. */
export default async function PanelAdsPage() {
  const user = await requireUser();
  const userId = BigInt(user.id);

  const ads = await prisma.userCar.findMany({
    where: { userId },
    include: userCarInclude,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return <MyAdsManager ads={ads.map(userCarToRecord)} />;
}
