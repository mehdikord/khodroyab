import React from "react";
import type { Metadata } from "next";

import { requireCollaborator } from "@/lib/auth/user-auth";
import { listMyBuyAds } from "@/lib/buy-ads";
import { MyBuyAdsManager } from "@/components/panel/buy-ads/MyBuyAdsManager";
import { VerificationRequired } from "@/components/panel/verification/VerificationRequired";

export const metadata: Metadata = {
  title: "آگهی‌های خرید من | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** The collaborator's own buy ads. Until the identity is verified the list is read-only. */
export default async function MyBuyAdsPage() {
  const user = await requireCollaborator();
  const ads = await listMyBuyAds(BigInt(user.id));

  return (
    <div className="space-y-5">
      {!user.isPartner && <VerificationRequired feature="ثبت آگهی خرید" />}
      <MyBuyAdsManager ads={ads} canPublish={user.isPartner} />
    </div>
  );
}
