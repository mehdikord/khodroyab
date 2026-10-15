import "server-only";

import type { CarImage } from "@prisma/client";

export interface CarImageRecord {
  id: string;
  carId: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export function carImageToRecord(image: CarImage): CarImageRecord {
  return {
    id: image.id.toString(),
    carId: image.carId.toString(),
    imageUrl: image.imageUrl,
    createdAt: image.createdAt.toISOString(),
    updatedAt: image.updatedAt.toISOString(),
  };
}
