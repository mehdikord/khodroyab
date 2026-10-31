import "server-only";

import crypto from "node:crypto";
import type { Prisma } from "@prisma/client";

import type { AdStatus } from "@/lib/ad-status";

/** Relations required to build a `UserCarRecord`. */
export const userCarOptionsInclude = {
  include: { option: { select: { name: true, type: true } }, optionItem: { select: { title: true } } },
  orderBy: [{ optionId: "asc" }, { id: "asc" }],
} satisfies Prisma.UserCar$optionsArgs;

/** Primary photo first, then upload order. */
export const userCarImagesOrder = [{ isPrimary: "desc" }, { id: "asc" }] satisfies Prisma.UserCarImageOrderByWithRelationInput[];

export const userCarInclude = {
  user: { select: { id: true, name: true, phone: true, image: true } },
  car: {
    include: {
      brand: true,
      carType: true,
      carImages: { select: { imageUrl: true }, orderBy: { id: "asc" }, take: 1 },
    },
  },
  color: true,
  images: { orderBy: userCarImagesOrder },
  options: userCarOptionsInclude,
  saleTerms: { include: { saleTerm: true }, orderBy: { id: "asc" } },
} satisfies Prisma.UserCarInclude;

export type UserCarWithRelations = Prisma.UserCarGetPayload<{
  include: typeof userCarInclude;
}>;

export interface UserCarSaleTermRecord {
  id: string;
  saleTermId: string;
  saleTermTitle: string;
  price: string;
  sale: string | null;
  perecentage: string | null;
  description: string | null;
  isActive: boolean;
}

export interface UserCarImageRecord {
  id: string;
  url: string;
  isPrimary: boolean;
}

/** Form value of one option: text/number string, chosen item ids, or a checked box. */
export type AdOptionValue = string | string[] | boolean;

/** Read-only line of an ad's feature list. */
export interface AdOptionDisplay {
  optionId: string;
  name: string;
  value: string;
}

type UserCarOptionRow = Prisma.UserCarOptionGetPayload<typeof userCarOptionsInclude>;

/** Group an ad's stored values into one display line per option. */
export function adOptionsToDisplay(rows: UserCarOptionRow[]): AdOptionDisplay[] {
  const lines = new Map<string, AdOptionDisplay>();
  for (const row of rows) {
    const optionId = row.optionId.toString();
    const value = row.option.type === "checkbox" ? "دارد" : row.optionItem?.title ?? row.val ?? "";
    const line = lines.get(optionId);
    if (line) line.value = `${line.value}، ${value}`;
    else lines.set(optionId, { optionId, name: row.option.name, value });
  }
  return Array.from(lines.values());
}

/** Rebuild the form state of an ad's stored values. */
function adOptionsToFormValues(rows: UserCarOptionRow[]): Record<string, AdOptionValue> {
  const values: Record<string, AdOptionValue> = {};
  for (const row of rows) {
    const optionId = row.optionId.toString();
    if (row.option.type === "checkbox") values[optionId] = true;
    else if (row.option.type === "select") {
      const chosen = (values[optionId] as string[] | undefined) ?? [];
      if (row.optionItemId !== null) chosen.push(row.optionItemId.toString());
      values[optionId] = chosen;
    } else values[optionId] = row.val ?? "";
  }
  return values;
}

export interface UserCarRecord {
  id: string;
  /** Public, unique 6-digit ad code. */
  code: string;
  status: AdStatus;
  userId: string;
  userName: string;
  userPhone: string;
  userImage: string | null;
  carId: string;
  brandId: string;
  carName: string;
  carModel: string;
  /** Production year entered on this ad. */
  carYear: string;
  colorId: string | null;
  colorName: string | null;
  colorCode: string | null;
  /** The ad's own photos, primary first. */
  images: UserCarImageRecord[];
  /** Cover: the ad's primary photo, else the car's catalogue photo. */
  imageUrl: string | null;
  optionValues: Record<string, AdOptionValue>;
  optionLines: AdOptionDisplay[];
  brandName: string;
  carTypeName: string;
  qautity: string;
  description: string;
  isActive: boolean;
  saleTerms: UserCarSaleTermRecord[];
  createdAt: string;
  updatedAt: string;
  /** Pre-formatted Persian date, computed on the server to avoid hydration drift. */
  createdAtLabel: string;
}

const faDate = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function userCarToRecord(userCar: UserCarWithRelations): UserCarRecord {
  return {
    id: userCar.id.toString(),
    code: userCar.code,
    status: userCar.status,
    userId: userCar.userId.toString(),
    userName: userCar.user.name,
    userPhone: userCar.user.phone,
    userImage: userCar.user.image,
    carId: userCar.carId.toString(),
    brandId: userCar.car.brandId.toString(),
    carName: userCar.car.name,
    carModel: userCar.car.model,
    carYear: userCar.year,
    colorId: userCar.colorId?.toString() ?? null,
    colorName: userCar.color?.name ?? null,
    colorCode: userCar.color?.code ?? null,
    images: userCar.images.map((image) => ({ id: image.id.toString(), url: image.imageUrl, isPrimary: image.isPrimary })),
    imageUrl: userCar.images[0]?.imageUrl ?? userCar.car.carImages[0]?.imageUrl ?? null,
    optionValues: adOptionsToFormValues(userCar.options),
    optionLines: adOptionsToDisplay(userCar.options),
    brandName: userCar.car.brand.name,
    carTypeName: userCar.car.carType.name,
    qautity: userCar.qautity,
    description: userCar.description,
    isActive: userCar.isActive,
    saleTerms: userCar.saleTerms.map((term) => ({
      id: term.id.toString(),
      saleTermId: term.saleTermId.toString(),
      saleTermTitle: term.saleTerm.title,
      price: term.price,
      sale: term.sale,
      perecentage: term.perecentage,
      description: term.description,
      isActive: term.isActive,
    })),
    createdAt: userCar.createdAt.toISOString(),
    updatedAt: userCar.updatedAt.toISOString(),
    createdAtLabel: faDate.format(userCar.createdAt),
  };
}

/** Number of attempts before giving up on finding a free 6-digit code. */
export const AD_CODE_MAX_ATTEMPTS = 8;

/**
 * Generate a random, zero-padded 6-digit ad code (000000–999999).
 * Uniqueness is enforced by the database; callers retry on a unique violation.
 */
export function generateAdCode(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

/** True when a Prisma error is a unique-constraint violation on `user_cars.code`. */
export function isAdCodeCollision(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as { code?: unknown; meta?: { target?: unknown } };
  if (e.code !== "P2002") return false;
  const target = e.meta?.target;
  if (typeof target === "string") return target.includes("code");
  if (Array.isArray(target)) return target.some((t) => String(t).includes("code"));
  return true; // unique violation with unknown target: safest to retry
}
