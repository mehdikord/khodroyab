import "server-only";

import type { Car, Brand, CarType, Color, CarOption, Option, OptionItem } from "@prisma/client";

export interface CarRecord {
  id: string;
  brandId: string;
  carTypeId: string;
  colorId: string | null;
  name: string;
  slug: string;
  model: string;
  year: string;
  /** Whether customers may list this car in their personal price table. */
  priceTable: boolean;
  brandName: string;
  carTypeName: string;
  colorName: string | null;
  /** Hex code of the car's colour, e.g. "#ffffff". */
  colorCode: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Relations every `carToRecord` caller must include. */
export const carRecordInclude = { brand: true, carType: true, color: true } as const;

export function carToRecord(car: Car & { brand: Brand; carType: CarType; color: Color | null }): CarRecord {
  return {
    id: car.id.toString(),
    brandId: car.brandId.toString(),
    carTypeId: car.carTypeId.toString(),
    colorId: car.colorId?.toString() ?? null,
    name: car.name,
    slug: car.slug,
    model: car.model,
    year: car.year,
    priceTable: car.priceTable,
    brandName: car.brand.name,
    carTypeName: car.carType.name,
    colorName: car.color?.name ?? null,
    colorCode: car.color?.code ?? null,
    createdAt: car.createdAt.toISOString(),
    updatedAt: car.updatedAt.toISOString(),
  };
}
