"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { adminActionDenied } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import {
  loadDivarBrands,
  matchBrand,
  normalizeName,
  resolveCarTypeId,
} from "@/lib/divar-import";

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

/** Most brands a single import request may carry. */
const MAX_BATCH_BRANDS = 50;

async function guardRequest(): Promise<{ ok: false; message: string } | null> {
  if (!(await isTrustedOrigin())) {
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
  const denied = await adminActionDenied("cars");
  if (denied) return { ok: false, message: denied };
  return null;
}

export interface DivarScanBrand {
  key: string;
  name: string;
  carCount: number;
}

export type DivarScanResult =
  | {
      ok: true;
      totalBrands: number;
      totalCars: number;
      newBrands: number;
      newCars: number;
      brands: DivarScanBrand[];
    }
  | { ok: false; message: string };

/** Read the Divar file and report what it holds and what is new to the catalogue. */
export async function scanDivarDataAction(): Promise<DivarScanResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  try {
    const divarBrands = await loadDivarBrands();
    const [existingBrands, existingCars] = await Promise.all([
      prisma.brand.findMany({ select: { id: true, name: true, slug: true } }),
      prisma.car.findMany({ select: { brandId: true, name: true } }),
    ]);

    const carNamesByBrand = new Map<string, Set<string>>();
    for (const car of existingCars) {
      const key = car.brandId.toString();
      if (!carNamesByBrand.has(key)) carNamesByBrand.set(key, new Set());
      carNamesByBrand.get(key)!.add(normalizeName(car.name));
    }

    let newBrands = 0;
    let newCars = 0;
    let totalCars = 0;
    for (const brand of divarBrands) {
      totalCars += brand.cars.length;
      const match = matchBrand(brand, existingBrands);
      if (!match) {
        newBrands += 1;
        newCars += brand.cars.length;
        continue;
      }
      const names = carNamesByBrand.get(match.id.toString());
      newCars += names
        ? brand.cars.filter((car) => !names.has(normalizeName(car.name))).length
        : brand.cars.length;
    }

    return {
      ok: true,
      totalBrands: divarBrands.length,
      totalCars,
      newBrands,
      newCars,
      brands: divarBrands.map((brand) => ({
        key: brand.key,
        name: brand.name,
        carCount: brand.cars.length,
      })),
    };
  } catch (error) {
    if (typeof error === "object" && error && (error as { code?: unknown }).code === "ENOENT") {
      return { ok: false, message: "فایل data/cars.json یافت نشد." };
    }
    if (error instanceof SyntaxError) {
      return { ok: false, message: "فایل اطلاعات دیوار JSON معتبر نیست." };
    }
    console.error("[divar-import:scan] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export type DivarImportBatchResult =
  | {
      ok: true;
      createdBrands: number;
      existingBrands: number;
      createdCars: number;
      existingCars: number;
    }
  | { ok: false; message: string };

/**
 * Import a batch of Divar brands (by key) with all of their cars. Safe to
 * repeat: brands and cars already in the catalogue are skipped.
 */
export async function importDivarBatchAction(
  brandKeys: string[],
  defaultCarTypeId: string
): Promise<DivarImportBatchResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  if (
    !Array.isArray(brandKeys) ||
    brandKeys.length === 0 ||
    brandKeys.length > MAX_BATCH_BRANDS ||
    !brandKeys.every((key) => typeof key === "string")
  ) {
    return { ok: false, message: "درخواست نامعتبر است." };
  }
  if (typeof defaultCarTypeId !== "string" || !/^\d{1,20}$/.test(defaultCarTypeId)) {
    return { ok: false, message: "نوع پیش‌فرض خودرو را انتخاب کنید." };
  }

  try {
    const carTypes = await prisma.carType.findMany({ select: { id: true, name: true } });
    const defaultTypeId = BigInt(defaultCarTypeId);
    if (!carTypes.some((type) => type.id === defaultTypeId)) {
      return { ok: false, message: "نوع پیش‌فرض انتخاب‌شده دیگر وجود ندارد؛ صفحه را به‌روزرسانی کنید." };
    }

    const wanted = new Set(brandKeys);
    const divarBrands = (await loadDivarBrands()).filter((brand) => wanted.has(brand.key));
    const catalogueBrands = await prisma.brand.findMany({
      select: { id: true, name: true, slug: true },
    });

    let createdBrands = 0;
    let existingBrands = 0;
    let createdCars = 0;
    let existingCars = 0;

    for (const brand of divarBrands) {
      const match = matchBrand(brand, catalogueBrands);

      const outcome = await prisma.$transaction(
        async (tx) => {
          const brandId = match
            ? match.id
            : (
                await tx.brand.create({
                  data: { name: brand.name, slug: brand.slug, image: brand.image, isActive: true },
                  select: { id: true },
                })
              ).id;

          const present = await tx.car.findMany({ where: { brandId }, select: { name: true } });
          const names = new Set(present.map((car) => normalizeName(car.name)));
          const fresh = brand.cars.filter((car) => !names.has(normalizeName(car.name)));

          if (fresh.length > 0) {
            await tx.car.createMany({
              data: fresh.map((car) => ({
                brandId,
                carTypeId: resolveCarTypeId(car.name, carTypes, defaultTypeId),
                name: car.name,
                slug: car.slug,
                model: car.model,
              })),
            });
          }
          return { brandId, created: fresh.length };
        },
        { timeout: 60_000 }
      );

      if (match) {
        existingBrands += 1;
      } else {
        createdBrands += 1;
        catalogueBrands.push({ id: outcome.brandId, name: brand.name, slug: brand.slug });
      }
      createdCars += outcome.created;
      existingCars += brand.cars.length - outcome.created;
    }

    if (createdBrands > 0 || createdCars > 0) {
      revalidatePath("/admin/brands");
      revalidatePath("/admin/cars");
    }

    return { ok: true, createdBrands, existingBrands, createdCars, existingCars };
  } catch (error) {
    console.error("[divar-import:batch] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
