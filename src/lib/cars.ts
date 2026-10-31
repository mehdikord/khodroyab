import "server-only";

import type { Car, Brand, CarType } from "@prisma/client";

export interface CarRecord {
  id: string;
  brandId: string;
  carTypeId: string;
  name: string;
  slug: string;
  model: string;
  /** Whether customers may list this car in their personal price table. */
  priceTable: boolean;
  brandName: string;
  carTypeName: string;
  createdAt: string;
  updatedAt: string;
}

/** Relations every `carToRecord` caller must include. */
export const carRecordInclude = { brand: true, carType: true } as const;

export function carToRecord(car: Car & { brand: Brand; carType: CarType }): CarRecord {
  return {
    id: car.id.toString(),
    brandId: car.brandId.toString(),
    carTypeId: car.carTypeId.toString(),
    name: car.name,
    slug: car.slug,
    model: car.model,
    priceTable: car.priceTable,
    brandName: car.brand.name,
    carTypeName: car.carType.name,
    createdAt: car.createdAt.toISOString(),
    updatedAt: car.updatedAt.toISOString(),
  };
}
