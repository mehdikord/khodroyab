import "server-only";

import type { Branch, City, Province } from "@prisma/client";

import prisma from "@/lib/prisma";

/** Serializable branch (BigInt/Decimal/Date normalized) for client components. */
export interface BranchRecord {
  id: string;
  provinceId: number;
  provinceName: string;
  cityId: number;
  cityName: string;
  title: string;
  managerName: string;
  phone: string;
  /** Empty string when not set. */
  address: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  /** Display priority: lower numbers are shown first. */
  sortOrder: number;
}

/** What the customer panel's Contact page needs. */
export type PublicBranch = Omit<BranchRecord, "isActive" | "sortOrder">;

export interface ProvinceOption {
  id: number;
  name: string;
  cities: { id: number; name: string }[];
}

type BranchWithPlace = Branch & { province: Pick<Province, "name">; city: Pick<City, "name"> };

export const BRANCH_INCLUDE = { province: { select: { name: true } }, city: { select: { name: true } } } as const;

/** Lists order: by display priority, then oldest first. */
export const BRANCH_ORDER_BY = [{ sortOrder: "asc" as const }, { id: "asc" as const }];

export function branchToRecord(branch: BranchWithPlace): BranchRecord {
  return {
    id: branch.id.toString(),
    provinceId: branch.provinceId,
    provinceName: branch.province.name,
    cityId: branch.cityId,
    cityName: branch.city.name,
    title: branch.title,
    managerName: branch.managerName,
    phone: branch.phone,
    address: branch.address ?? "",
    latitude: Number(branch.latitude),
    longitude: Number(branch.longitude),
    isActive: branch.isActive,
    sortOrder: branch.sortOrder,
  };
}

export async function listBranches(): Promise<BranchRecord[]> {
  const branches = await prisma.branch.findMany({ include: BRANCH_INCLUDE, orderBy: BRANCH_ORDER_BY });
  return branches.map(branchToRecord);
}

/** Active branches in display order, for the customer panel. Never throws. */
export async function listActiveBranches(): Promise<PublicBranch[]> {
  try {
    const branches = await prisma.branch.findMany({ where: { isActive: true }, include: BRANCH_INCLUDE, orderBy: BRANCH_ORDER_BY });
    return branches.map((branch) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isActive, sortOrder, ...rest } = branchToRecord(branch);
      return rest;
    });
  } catch (error) {
    console.error("[branches:list-active] failed", error);
    return [];
  }
}

/** Every province with its cities, alphabetically (Persian collation), for the province → city selects. */
export async function listProvinceOptions(): Promise<ProvinceOption[]> {
  const provinces = await prisma.province.findMany({
    select: { id: true, name: true, cities: { select: { id: true, name: true } } },
  });
  const collator = new Intl.Collator("fa");
  return provinces
    .map((p) => ({ ...p, cities: [...p.cities].sort((a, b) => collator.compare(a.name, b.name)) }))
    .sort((a, b) => collator.compare(a.name, b.name));
}
