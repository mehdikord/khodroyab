import React from "react";
import type { Metadata } from "next";

import { requireCollaborator } from "@/lib/auth/user-auth";
import { listColors } from "@/lib/colors";
import { listPriceTableCars, listUserPriceTableEntries } from "@/lib/price-table";
import { getEnabledPriceFields } from "@/lib/system-settings";
import { PriceTableMarketEditor } from "@/components/panel/price-table/PriceTableMarketEditor";
import { parsePriceMarket } from "@/lib/price-market";
import { VerificationRequired } from "@/components/panel/verification/VerificationRequired";

export const metadata: Metadata = {
  title: "لیست قیمت من | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

/**
 * The collaborator's personal price table, as two separate lists (free zone /
 * national plate tabs): colour + raw/clearance/instant prices (public and
 * collaborator) per eligible car. Locked until verified.
 */
export default async function PanelPriceTablePage({ searchParams }: PageProps) {
  const user = await requireCollaborator();
  if (!user.isPartner) return <VerificationRequired feature="ثبت جدول قیمت" />;
  const userId = BigInt(user.id);

  const priceFields = await getEnabledPriceFields();
  const [cars, freeZone, national, colors] = await Promise.all([
    listPriceTableCars(),
    listUserPriceTableEntries(userId, "free_zone", true, priceFields),
    listUserPriceTableEntries(userId, "national", true, priceFields),
    listColors(),
  ]);

  return (
    <PriceTableMarketEditor
      cars={cars}
      colors={colors}
      entriesByMarket={{ free_zone: freeZone, national }}
      priceFields={priceFields}
      initialMarket={parsePriceMarket(searchParams.market)}
      title="لیست قیمت من"
    />
  );
}
