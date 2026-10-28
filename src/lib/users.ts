import "server-only";

import type { User } from "@prisma/client";

export interface UserRecord {
  id: string;
  name: string;
  companyName: string | null;
  phone: string;
  email: string | null;
  image: string | null;
  bio: string | null;
  nationalCode: string | null;
  address: string | null;
  postalCode: string | null;
  tel: string | null;
  isActive: boolean;
  /** ISO timestamp of admin approval; null while a self-registered account waits. */
  approvedAt: string | null;
  /** True for self-registered accounts the admin has not approved yet. */
  isPending: boolean;
  createdAt: string;
  updatedAt: string;
}

export function userToRecord(user: User): UserRecord {
  return {
    id: user.id.toString(),
    name: user.name,
    companyName: user.companyName,
    phone: user.phone,
    email: user.email,
    image: user.image,
    bio: user.bio,
    nationalCode: user.nationalCode,
    address: user.address,
    postalCode: user.postalCode,
    tel: user.tel,
    isActive: user.isActive,
    approvedAt: user.approvedAt ? user.approvedAt.toISOString() : null,
    isPending: user.approvedAt === null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
