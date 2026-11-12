import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/user-auth";
import { getBuyAdOffersState } from "@/lib/buy-ads";

export const dynamic = "force-dynamic";

/** The live offers panel of a buy ad, polled by the ad page every 20 seconds. */
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  const state = await getBuyAdOffersState(params.id, { id: user.id, isPartner: user.isPartner });
  if (!state) return NextResponse.json({ message: "not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  return NextResponse.json(state, { headers: { "Cache-Control": "no-store" } });
}
