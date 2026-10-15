import "server-only";

import type { CarType } from "@prisma/client";

export interface CarTypeRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export function carTypeToRecord(carType: CarType): CarTypeRecord {
  return {
    id: carType.id.toString(),
    name: carType.name,
    slug: carType.slug,
    description: carType.description,
    createdAt: carType.createdAt.toISOString(),
    updatedAt: carType.updatedAt.toISOString(),
  };
}

export function serializeCarType(carType: CarType): string {
  return JSON.stringify(carTypeToRecord(carType));
}
