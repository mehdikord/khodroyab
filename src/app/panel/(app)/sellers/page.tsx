import React from "react";
import type { Metadata } from "next";

import { listPublicSellers } from "@/lib/sellers";
import { SellersDirectory } from "@/components/panel/sellers/SellersDirectory";

export const metadata: Metadata = {
  title: "فروشندگان | خودرو یاب",
};

export const dynamic = "force-dynamic";

/** Public sellers directory (open to guests): name and code of every verified collaborator. */
export default async function PanelSellersPage() {
  const sellers = await listPublicSellers();
  return <SellersDirectory sellers={sellers} />;
}
