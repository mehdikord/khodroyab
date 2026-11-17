import React from "react";
import type { Metadata } from "next";

import { requireCollaborator } from "@/lib/auth/user-auth";
import { listBrandChoices, searchCarChoices } from "@/lib/catalog";
import { AdCarPicker } from "@/components/panel/ads/AdCarPicker";
import { VerificationRequired } from "@/components/panel/verification/VerificationRequired";

export const metadata: Metadata = {
  title: "انتخاب خودرو | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** First step of a new ad: pick the car from the catalogue. */
export default async function NewAdCarPage() {
  const user = await requireCollaborator();
  if (!user.isPartner) return <VerificationRequired feature="ثبت آگهی" />;

  // First page only; the picker searches and pages through the rest on demand.
  const [brands, initialPage] = await Promise.all([listBrandChoices({ carWhere: {} }), searchCarChoices({ page: 1 })]);

  return <AdCarPicker brands={brands} initialPage={initialPage} />;
}
