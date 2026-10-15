import "server-only";

import type { Brand } from "@prisma/client";

/**
 * Serialized shape of a brand that can safely cross the server/client
 * boundary (Prisma BigInt and Date are not serializable, so both are
 * normalized to strings).
 */
export interface BrandRecord {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Convert a persisted Prisma Brand into the serializable API shape. */
export function brandToRecord(brand: Brand): BrandRecord {
  return {
    id: brand.id.toString(),
    name: brand.name,
    slug: brand.slug,
    image: brand.image,
    isActive: brand.isActive,
    createdAt: brand.createdAt.toISOString(),
    updatedAt: brand.updatedAt.toISOString(),
  };
}

/**
 * Stable JSON serialization for the Brand model (used by network metadata
 * and any future export tooling).
 */
export function serializeBrand(brand: Brand): string {
  return JSON.stringify(brandToRecord(brand));
}