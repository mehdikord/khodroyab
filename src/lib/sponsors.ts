import "server-only";

import type { Sponsor } from "@prisma/client";

import prisma from "@/lib/prisma";

/** Serializable sponsor (BigInt/Date normalized to strings) for client components. */
export interface SponsorRecord {
  id: string;
  name: string;
  logo: string;
  isActive: boolean;
  /** Display priority: lower numbers are shown first. */
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** What the public sponsor strip needs. */
export interface PublicSponsor {
  id: string;
  name: string;
  logo: string;
}

export function sponsorToRecord(sponsor: Sponsor): SponsorRecord {
  return {
    id: sponsor.id.toString(),
    name: sponsor.name,
    logo: sponsor.logo,
    isActive: sponsor.isActive,
    sortOrder: sponsor.sortOrder,
    createdAt: sponsor.createdAt.toISOString(),
    updatedAt: sponsor.updatedAt.toISOString(),
  };
}

/** Admin list order: by display priority, then oldest first. */
export const SPONSOR_ORDER_BY = [{ sortOrder: "asc" as const }, { id: "asc" as const }];

export async function listSponsors(): Promise<SponsorRecord[]> {
  const sponsors = await prisma.sponsor.findMany({ orderBy: SPONSOR_ORDER_BY });
  return sponsors.map(sponsorToRecord);
}

/** Active sponsors in display order, for the customer login page. Never throws. */
export async function listActiveSponsors(): Promise<PublicSponsor[]> {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { isActive: true },
      select: { id: true, name: true, logo: true },
      orderBy: SPONSOR_ORDER_BY,
    });
    return sponsors.map((sponsor) => ({ id: sponsor.id.toString(), name: sponsor.name, logo: sponsor.logo }));
  } catch (error) {
    console.error("[sponsors:list-active] failed", error);
    return [];
  }
}
