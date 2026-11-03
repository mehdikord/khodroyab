import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireCollaborator } from "@/lib/auth/user-auth";
import { userCarInclude, userCarToRecord } from "@/lib/user-cars";
import { MyAdsManager } from "@/components/panel/ads/MyAdsManager";
import { VerificationRequired } from "@/components/panel/verification/VerificationRequired";

export const metadata: Metadata = {
  title: "آگهی‌های من | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/**
 * The collaborator's own sale ads and their moderation status. Until the
 * identity is verified the list stays visible but creating and editing are off.
 */
export default async function PanelAdsPage() {
  const user = await requireCollaborator();
  const userId = BigInt(user.id);

  const ads = await prisma.userCar.findMany({
    where: { userId },
    include: userCarInclude,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return (
    <div className="space-y-5">
      {!user.isPartner && <VerificationRequired feature="ثبت آگهی" />}
      <MyAdsManager ads={ads.map(userCarToRecord)} canPublish={user.isPartner} />
    </div>
  );
}
