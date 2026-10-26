import React from "react";
import type { Metadata } from "next";

import { requireUser } from "@/lib/auth/user-auth";
import { listColors } from "@/lib/colors";
import { listPriceTableCars, listUserPriceTableEntries } from "@/lib/price-table";
import { MyPriceTableManager } from "@/components/panel/price-table/MyPriceTableManager";

export const metadata: Metadata = {
  title: "جدول من | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** The customer's personal price table: colour + raw/clearance/instant USD prices per eligible car. */
export default async function PanelPriceTablePage() {
  const user = await requireUser();
  const userId = BigInt(user.id);

  const [cars, entries, colors] = await Promise.all([
    listPriceTableCars(),
    listUserPriceTableEntries(userId),
    listColors(),
  ]);

  return <MyPriceTableManager cars={cars} colors={colors} initialEntries={entries} />;
}
