import "server-only";

import type { User, UserVerificationStatus } from "@prisma/client";

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
  /** ISO timestamp of the account's approval (set on creation). */
  approvedAt: string | null;
  /** Collaborator mode (کاربر همکار), switched on by the admin only. */
  collabrate: boolean;
  /** Identity verification approved by the admin. */
  authenticaed: boolean;
  /** State of the latest identity-verification submission; `null` when none was sent. */
  verificationStatus: UserVerificationStatus | null;
  createdAt: string;
  updatedAt: string;
}

/** A user row, optionally with the status of its verification submission. */
export type UserRecordSource = User & { verification?: { status: UserVerificationStatus } | null };

/** Include for queries whose rows feed `userToRecord`, so the verification state is known. */
export const userRecordInclude = { verification: { select: { status: true } } } as const;

export function userToRecord(user: UserRecordSource): UserRecord {
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
    collabrate: user.collabrate,
    authenticaed: user.authenticaed,
    verificationStatus: user.verification?.status ?? null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
