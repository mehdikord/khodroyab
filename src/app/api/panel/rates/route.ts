import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/user-auth";
import { getMarketRates } from "@/lib/market-rates";

export const dynamic = "force-dynamic";

/** Live USD/EUR rates (rial) for the customer dashboard; signed-in users only. */
export async function GET() {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const rates = await getMarketRates();
  if (!rates) {
    return NextResponse.json({ message: "rates unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json(rates, { headers: { "Cache-Control": "no-store" } });
}
