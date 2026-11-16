import "server-only";

import prisma from "@/lib/prisma";
import { PUBLIC_AD_WHERE, PUBLIC_SELLER_WHERE } from "@/lib/panel-search";
import { findUserIdsByAnyCode, getActiveUserCode, getActiveUserCodes } from "@/lib/user-codes";

/**
 * Public sellers directory: active, verified collaborators (the users whose
 * ads and prices are public). Only the display name and the current public
 * code are exposed; the profile URL uses the code, and an expired code of
 * the same seller still resolves (codes rotate).
 */

export interface PublicSeller {
  /** Business name when set, otherwise the person's name. */
  name: string;
  /** Current public code (8 digits). */
  code: string;
}

export interface PublicSellerProfile extends PublicSeller {
  userId: bigint;
  /** Number of the seller's public sale ads. */
  adCount: number;
  /** Cars the seller priced (both price lists together). */
  priceListCount: number;
}

const SELLER_WHERE = { ...PUBLIC_SELLER_WHERE, isActive: true };

const displayName = (user: { name: string; companyName: string | null }) => user.companyName?.trim() || user.name;

/** Every public seller, alphabetically (Persian collation). */
export async function listPublicSellers(): Promise<PublicSeller[]> {
  const users = await prisma.user.findMany({
    where: SELLER_WHERE,
    select: { id: true, name: true, companyName: true },
  });
  const codes = await getActiveUserCodes(users.map((user) => user.id));
  const collator = new Intl.Collator("fa");
  return users
    .map((user) => ({ name: displayName(user), code: codes.get(user.id.toString())?.code ?? "" }))
    .filter((seller) => seller.code)
    .sort((a, b) => collator.compare(a.name, b.name));
}

/** The public seller behind `code` (current or expired), or null. */
export async function getPublicSellerByCode(code: string): Promise<PublicSellerProfile | null> {
  const ids = await findUserIdsByAnyCode(code);
  if (ids.length === 0) return null;
  const user = await prisma.user.findFirst({
    where: { ...SELLER_WHERE, id: { in: ids.map((id) => BigInt(id)) } },
    select: { id: true, name: true, companyName: true },
  });
  if (!user) return null;
  const [active, adCount, priceListCount] = await Promise.all([
    getActiveUserCode(user.id),
    prisma.userCar.count({ where: { ...PUBLIC_AD_WHERE, userId: user.id } }),
    prisma.userPriceTableEntry.count({ where: { userId: user.id, car: { priceTable: true }, prices: { some: {} } } }),
  ]);
  return { userId: user.id, name: displayName(user), code: active.code, adCount, priceListCount };
}
