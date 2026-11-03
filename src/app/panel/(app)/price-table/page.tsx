import React from "react";
import type { Metadata } from "next";

import { requireCollaborator } from "@/lib/auth/user-auth";
import { listColors } from "@/lib/colors";
import { listPriceTableCars, listUserPriceTableEntries } from "@/lib/price-table";
import { MyPriceTableManager } from "@/components/panel/price-table/MyPriceTableManager";
import { VerificationRequired } from "@/components/panel/verification/VerificationRequired";

export const metadata: Metadata = {
  title: "جدول من | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/**
 * The collaborator's personal price table: colour + raw/clearance/instant USD
 * prices (public and collaborator) per eligible car. Locked until verified.
 */
export default async function PanelPriceTablePage() {
  const user = await requireCollaborator();
  if (!user.isPartner) return <VerificationRequired feature="ثبت جدول قیمت" />;
  const userId = BigInt(user.id);

  const [cars, entries, colors] = await Promise.all([
    listPriceTableCars(),
    listUserPriceTableEntries(userId),
    listColors(),
  ]);

  return <MyPriceTableManager cars={cars} colors={colors} initialEntries={entries} />;
}
