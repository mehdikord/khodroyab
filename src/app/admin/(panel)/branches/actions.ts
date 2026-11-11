"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { adminActionDenied } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { BRANCH_INCLUDE, BRANCH_ORDER_BY, branchToRecord, type BranchRecord } from "@/lib/branches";
import { parseBranchForm, type BranchFormValues } from "@/lib/validation/branches";

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";
const NOT_FOUND_MESSAGE = "شعبه مورد نظر یافت نشد";

export type BranchActionResult =
  | { ok: true; record: BranchRecord }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export type BranchSimpleActionResult = { ok: true } | { ok: false; message: string };

export type BranchReorderResult = { ok: true; records: BranchRecord[] } | { ok: false; message: string };

async function guardRequest(): Promise<{ ok: false; message: string } | null> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const denied = await adminActionDenied("branches");
  if (denied) return { ok: false, message: denied };
  return null;
}

function parseId(id: string): bigint | null {
  if (!/^\d{1,20}$/.test(id)) return null;
  return BigInt(id);
}

/** The admin list and the customer Contact page. */
function revalidateBranchPages() {
  revalidatePath("/admin/branches");
  revalidatePath("/panel/contact");
}

/** The city must exist and belong to the chosen province. */
async function placeError(data: BranchFormValues): Promise<BranchActionResult | null> {
  const city = await prisma.city.findUnique({ where: { id: data.cityId }, select: { provinceId: true } });
  if (!city || city.provinceId !== data.provinceId) {
    return { ok: false, message: "لطفاً خطاهای فرم را برطرف کنید", fieldErrors: { cityId: "شهر انتخاب‌شده متعلق به این استان نیست" } };
  }
  return null;
}

function toData(data: BranchFormValues) {
  return {
    provinceId: data.provinceId,
    cityId: data.cityId,
    title: data.title,
    managerName: data.managerName,
    phone: data.phone,
    address: data.address,
    latitude: data.latitude,
    longitude: data.longitude,
    isActive: data.isActive,
  };
}

/** Create a branch. */
export async function createBranchAction(formData: FormData): Promise<BranchActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const parsed = parseBranchForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };
  const invalidPlace = await placeError(parsed.data);
  if (invalidPlace) return invalidPlace;

  try {
    let sortOrder = parsed.data.sortOrder;
    if (sortOrder === null) {
      const last = await prisma.branch.aggregate({ _max: { sortOrder: true } });
      sortOrder = (last._max.sortOrder ?? 0) + 1;
    }
    const branch = await prisma.branch.create({ data: { ...toData(parsed.data), sortOrder }, include: BRANCH_INCLUDE });
    revalidateBranchPages();
    return { ok: true, record: branchToRecord(branch) };
  } catch (error) {
    console.error("[branches:create] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Update a branch. */
export async function updateBranchAction(id: string, formData: FormData): Promise<BranchActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const branchId = parseId(id);
  if (branchId === null) return { ok: false, message: NOT_FOUND_MESSAGE };

  const parsed = parseBranchForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };
  const invalidPlace = await placeError(parsed.data);
  if (invalidPlace) return invalidPlace;

  const current = await prisma.branch.findUnique({ where: { id: branchId }, select: { sortOrder: true } });
  if (!current) return { ok: false, message: NOT_FOUND_MESSAGE };

  try {
    const branch = await prisma.branch.update({
      where: { id: branchId },
      data: { ...toData(parsed.data), sortOrder: parsed.data.sortOrder ?? current.sortOrder },
      include: BRANCH_INCLUDE,
    });
    revalidateBranchPages();
    return { ok: true, record: branchToRecord(branch) };
  } catch (error) {
    console.error("[branches:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Flip a branch's active state. */
export async function toggleBranchActiveAction(id: string): Promise<BranchActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const branchId = parseId(id);
  if (branchId === null) return { ok: false, message: NOT_FOUND_MESSAGE };

  const current = await prisma.branch.findUnique({ where: { id: branchId }, select: { isActive: true } });
  if (!current) return { ok: false, message: NOT_FOUND_MESSAGE };

  try {
    const branch = await prisma.branch.update({
      where: { id: branchId },
      data: { isActive: !current.isActive },
      include: BRANCH_INCLUDE,
    });
    revalidateBranchPages();
    return { ok: true, record: branchToRecord(branch) };
  } catch (error) {
    console.error("[branches:toggle] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Delete a branch. */
export async function deleteBranchAction(id: string): Promise<BranchSimpleActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const branchId = parseId(id);
  if (branchId === null) return { ok: false, message: NOT_FOUND_MESSAGE };

  try {
    const { count } = await prisma.branch.deleteMany({ where: { id: branchId } });
    if (count === 0) return { ok: false, message: NOT_FOUND_MESSAGE };
  } catch (error) {
    console.error("[branches:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  revalidateBranchPages();
  return { ok: true };
}

/** Persist a new display order: `ids` is the full list in the desired order. */
export async function reorderBranchesAction(ids: string[]): Promise<BranchReorderResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  if (!Array.isArray(ids) || ids.length > 1000) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const parsedIds = ids.map(parseId);
  if (parsedIds.some((id) => id === null) || new Set(ids).size !== ids.length) {
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  try {
    await prisma.$transaction(
      parsedIds.map((id, index) => prisma.branch.updateMany({ where: { id: id! }, data: { sortOrder: index + 1 } }))
    );
    const branches = await prisma.branch.findMany({ include: BRANCH_INCLUDE, orderBy: BRANCH_ORDER_BY });
    revalidateBranchPages();
    return { ok: true, records: branches.map(branchToRecord) };
  } catch (error) {
    console.error("[branches:reorder] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
