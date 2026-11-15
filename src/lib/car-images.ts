import "server-only";

import type { CarImage, CarVideo } from "@prisma/client";

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

export interface CarVideoRecord {
  id: string;
  carId: string;
  videoUrl: string;
  sizeBytes: number;
  createdAt: string;
}

export function carVideoToRecord(video: CarVideo): CarVideoRecord {
  return {
    id: video.id.toString(),
    carId: video.carId.toString(),
    videoUrl: video.videoUrl,
    sizeBytes: video.sizeBytes,
    createdAt: video.createdAt.toISOString(),
  };
}
