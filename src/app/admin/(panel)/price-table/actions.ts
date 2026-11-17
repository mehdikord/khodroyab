"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { carRecordInclude, carToRecord, type CarRecord } from "@/lib/cars";
import { adminActionDenied } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { priceTableCarWhere, type PriceTableFilters } from "@/lib/catalog";

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type PriceTableToggleResult = { ok: true; record: CarRecord } | { ok: false; message: string };
export type PriceTableBulkResult = { ok: true; records: CarRecord[] } | { ok: false; message: string };

function parseBigInt(value: string): bigint | null {
  if (!/^\d+$/.test(value)) return null;
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

async function guardRequest(): Promise<{ ok: false; message: string } | null> {
  if (!(await isTrustedOrigin())) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const denied = await adminActionDenied("price_table");
  if (denied) return { ok: false, message: denied };
  return null;
}

/** Pages whose content depends on which cars are allowed in price tables. */
function revalidatePriceTablePages() {
  revalidatePath("/admin/price-table");
  revalidatePath("/admin/cars");
  revalidatePath("/panel/price-table");
}

/** Flip a single car's eligibility for customer price tables. */
export async function toggleCarPriceTableAction(id: string): Promise<PriceTableToggleResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const carId = parseBigInt(id);
  if (carId === null) return { ok: false, message: "شناسه خودرو نامعتبر است" };

  try {
    const current = await prisma.car.findUnique({ where: { id: carId }, select: { priceTable: true } });
    if (!current) return { ok: false, message: "خودرو یافت نشد" };

    const updated = await prisma.car.update({
      where: { id: carId },
      data: { priceTable: !current.priceTable },
      include: carRecordInclude,
    });

    revalidatePriceTablePages();
    return { ok: true, record: carToRecord(updated) };
  } catch (error) {
    console.error("[price-table:toggle] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Enable or disable price-table eligibility for a set of cars at once. */
export async function setCarsPriceTableAction(ids: string[], enabled: boolean): Promise<PriceTableBulkResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  if (!Array.isArray(ids) || ids.length === 0) return { ok: false, message: "هیچ خودرویی انتخاب نشده است" };
  if (ids.length > 5000) return { ok: false, message: "تعداد خودروهای انتخاب‌شده بیش از حد مجاز است" };

  const carIds: bigint[] = [];
  for (const id of ids) {
    const parsed = parseBigInt(String(id));
    if (parsed === null) return { ok: false, message: "شناسه خودرو نامعتبر است" };
    carIds.push(parsed);
  }

  try {
    await prisma.car.updateMany({ where: { id: { in: carIds } }, data: { priceTable: Boolean(enabled) } });
    const records = await prisma.car.findMany({
      where: { id: { in: carIds } },
      include: carRecordInclude,
    });

    revalidatePriceTablePages();
    return { ok: true, records: records.map(carToRecord) };
  } catch (error) {
    console.error("[price-table:bulk] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export type PriceTableFilteredBulkResult = { ok: true; count: number } | { ok: false; message: string };

/**
 * Enable or disable every car matching the screen's filters (all pages), in
 * one UPDATE on the server, so the browser never has to hold the full list.
 */
export async function setFilteredCarsPriceTableAction(
  filters: PriceTableFilters,
  enabled: boolean
): Promise<PriceTableFilteredBulkResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  const safe: PriceTableFilters = {
    q: typeof filters?.q === "string" ? filters.q.slice(0, 100) : "",
    brandId: typeof filters?.brandId === "string" ? filters.brandId : "",
    status: filters?.status === "enabled" || filters?.status === "disabled" ? filters.status : "",
  };

  try {
    const where = priceTableCarWhere(safe);
    const result = await prisma.car.updateMany({
      where: { AND: [where, { priceTable: !enabled }] },
      data: { priceTable: Boolean(enabled) },
    });
    revalidatePriceTablePages();
    return { ok: true, count: result.count };
  } catch (error) {
    console.error("[price-table:bulk-filter] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
