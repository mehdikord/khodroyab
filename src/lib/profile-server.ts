import "server-only";

import type { ProfileAdStats, ProfileRecord } from "@/lib/profile";

/** Prisma `select` for the profile fields exposed to the customer panel. */
export const profileSelect = {
  id: true,
  name: true,
  phone: true,
  email: true,
  image: true,
  bio: true,
  nationalCode: true,
  address: true,
  postalCode: true,
  tel: true,
  createdAt: true,
  updatedAt: true,
} as const;

export interface ProfileRow {
  id: bigint;
  name: string;
  phone: string;
  email: string | null;
  image: string | null;
  bio: string | null;
  nationalCode: string | null;
  address: string | null;
  postalCode: string | null;
  tel: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toProfileRecord(row: ProfileRow): ProfileRecord {
  return {
    id: row.id.toString(),
    name: row.name,
    phone: row.phone,
    email: row.email,
    image: row.image,
    bio: row.bio,
    nationalCode: row.nationalCode,
    address: row.address,
    postalCode: row.postalCode,
    tel: row.tel,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function emptyAdStats(): ProfileAdStats {
  return { total: 0, pending: 0, approved: 0, rejected: 0 };
}
