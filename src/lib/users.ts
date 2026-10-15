import "server-only";

import type { User } from "@prisma/client";

export interface UserRecord {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  image: string | null;
  bio: string | null;
  nationalCode: string | null;
  address: string | null;
  postalCode: string | null;
  tel: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function userToRecord(user: User): UserRecord {
  return {
    id: user.id.toString(),
    name: user.name,
    phone: user.phone,
    email: user.email,
    image: user.image,
    bio: user.bio,
    nationalCode: user.nationalCode,
    address: user.address,
    postalCode: user.postalCode,
    tel: user.tel,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
