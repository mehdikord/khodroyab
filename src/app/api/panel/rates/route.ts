import { NextResponse } from "next/server";

import { getMarketRates } from "@/lib/market-rates";

export const dynamic = "force-dynamic";

/**
 * Live USD/EUR rates (rial) for the dashboard. Public, like the dashboard
 * itself; `getMarketRates()` serves a short shared cache, so polling clients
 * never multiply upstream requests.
 */
export async function GET() {
  const rates = await getMarketRates();
  if (!rates) {
    return NextResponse.json({ message: "rates unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json(rates, { headers: { "Cache-Control": "no-store" } });
}
