"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { adminActionDenied } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { adminRoleInclude, adminRoleToRecord, type AdminRoleRecord } from "@/lib/admins";
import { parseRoleForm } from "@/lib/validation/admins";
import type { FieldErrors } from "@/lib/validation/admin";
import { toPersianDigits } from "@/lib/utils";

/** RBAC role management. Root admins only. */

export type RoleActionResult =
  | { ok: true; record: AdminRoleRecord }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

export type RoleSimpleActionResult = { ok: true } | { ok: false; message: string };

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

const DUPLICATE_NAME: RoleActionResult = {
  ok: false,
  message: "نقشی با این نام وجود دارد",
  fieldErrors: { name: "نام نقش تکراری است" },
};

async function guardRequest(): Promise<{ ok: false; message: string } | null> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const denied = await adminActionDenied("root");
  if (denied) return { ok: false, message: denied };
  return null;
}

function parseId(raw: string): bigint | null {
  return /^\d{1,20}$/.test(raw) ? BigInt(raw) : null;
}

function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function revalidate() {
  revalidatePath("/admin/roles");
  revalidatePath("/admin/admins");
}

export async function createRoleAction(formData: FormData): Promise<RoleActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const parsed = parseRoleForm(formData);
  if (!parsed.success) return { ok: false, message: "اطلاعات فرم را بررسی کنید", fieldErrors: parsed.fieldErrors };
  const { name, description, permissions } = parsed.data;

  if (await prisma.adminRole.findUnique({ where: { name }, select: { id: true } })) return DUPLICATE_NAME;

  try {
    const created = await prisma.adminRole.create({
      data: { name, description, permissions: { create: permissions.map((permission) => ({ permission })) } },
      include: adminRoleInclude,
    });
    revalidate();
    return { ok: true, record: adminRoleToRecord(created) };
  } catch (error) {
    if (isUniqueViolation(error)) return DUPLICATE_NAME;
    console.error("[roles:create] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function updateRoleAction(idRaw: string, formData: FormData): Promise<RoleActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const id = parseId(idRaw);
  if (id === null) return { ok: false, message: "شناسه نقش نامعتبر است" };

  const parsed = parseRoleForm(formData);
  if (!parsed.success) return { ok: false, message: "اطلاعات فرم را بررسی کنید", fieldErrors: parsed.fieldErrors };
  const { name, description, permissions } = parsed.data;

  const duplicate = await prisma.adminRole.findFirst({ where: { name, id: { not: id } }, select: { id: true } });
  if (duplicate) return DUPLICATE_NAME;

  try {
    // Replace the permission set atomically; assigned admins see the change on their next request.
    const updated = await prisma.$transaction(async (tx) => {
      await tx.adminRolePermission.deleteMany({ where: { roleId: id } });
      return tx.adminRole.update({
        where: { id },
        data: { name, description, permissions: { create: permissions.map((permission) => ({ permission })) } },
        include: adminRoleInclude,
      });
    });
    revalidate();
    return { ok: true, record: adminRoleToRecord(updated) };
  } catch (error) {
    if (isUniqueViolation(error)) return DUPLICATE_NAME;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return { ok: false, message: "نقش یافت نشد" };
    }
    console.error("[roles:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function deleteRoleAction(idRaw: string): Promise<RoleSimpleActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const id = parseId(idRaw);
  if (id === null) return { ok: false, message: "شناسه نقش نامعتبر است" };

  try {
    const assigned = await prisma.admin.count({ where: { roleId: id } });
    if (assigned > 0) {
      return {
        ok: false,
        message: `این نقش به ${toPersianDigits(assigned)} مدیر اختصاص داده شده است؛ ابتدا نقش آن‌ها را تغییر دهید.`,
      };
    }
    await prisma.adminRole.delete({ where: { id } });
    revalidate();
    return { ok: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return { ok: false, message: "نقش یافت نشد" };
    }
    // FK RESTRICT: an admin was assigned between the count and the delete.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return { ok: false, message: "این نقش به مدیرانی اختصاص داده شده است؛ ابتدا نقش آن‌ها را تغییر دهید." };
    }
    console.error("[roles:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
