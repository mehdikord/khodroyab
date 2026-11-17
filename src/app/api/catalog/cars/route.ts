import { NextResponse, type NextRequest } from "next/server";

import { getCurrentAdmin } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/user-auth";
import { listBrandCarChoices, searchCarChoices } from "@/lib/catalog";

export const dynamic = "force-dynamic";

function idOrNull(value: string | null): bigint | null {
  if (!value || !/^\d{1,20}$/.test(value)) return null;
  return BigInt(value);
}

/**
 * Catalogue cars for pickers, so pages never ship the whole car table:
 * - `?brand=ID&all=1`: every car of one brand (dependent "car" select);
 * - otherwise one page of a search: `q`, optional `brand`, `page`, `size`.
 * Signed-in admins and customers only.
 */
export async function GET(request: NextRequest) {
  const [admin, user] = await Promise.all([getCurrentAdmin(), getCurrentUser()]);
  if (!admin && !user) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const params = request.nextUrl.searchParams;
  const brandId = idOrNull(params.get("brand"));
  const headers = { "Cache-Control": "private, max-age=30" };

  try {
    if (params.get("all") === "1") {
      if (brandId === null) return NextResponse.json({ message: "brand required" }, { status: 400 });
      return NextResponse.json({ items: await listBrandCarChoices(brandId) }, { headers });
    }

    const page = Number.parseInt(params.get("page") ?? "1", 10);
    const size = Number.parseInt(params.get("size") ?? "", 10);
    const result = await searchCarChoices({
      query: (params.get("q") ?? "").slice(0, 100),
      brandId,
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: Number.isFinite(size) ? size : undefined,
    });
    return NextResponse.json(result, { headers });
  } catch (error) {
    console.error("[api:catalog-cars] failed", error);
    return NextResponse.json({ message: "failed" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
