"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { authorizeAdminAction, type AuthorizedAdmin } from "@/lib/auth/guards";
import { hashPassword } from "@/lib/auth/password";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { adminRecordSelect, adminToRecord, type AdminRecord } from "@/lib/admins";
import { parseAdminForm } from "@/lib/validation/admins";
import type { FieldErrors } from "@/lib/validation/admin";

/**
 * Administrator management. Root admins only.
 *
 * Invariants enforced here (never trust the UI):
 *  - an admin cannot remove their own root status, deactivate or delete themselves;
 *  - the system always keeps at least one *active root* admin.
 */

export type AdminActionResult =
  | { ok: true; record: AdminRecord }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

export type AdminSimpleActionResult = { ok: true } | { ok: false; message: string };

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";
const LAST_ROOT_MESSAGE = "سامانه باید حداقل یک مدیر کل فعال داشته باشد.";

async function guardRequest(): Promise<{ ok: true; actor: AuthorizedAdmin } | { ok: false; message: string }> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const auth = await authorizeAdminAction("root");
  if (!auth.ok) return auth;
  return { ok: true, actor: auth.admin };
}

function parseId(raw: string): bigint | null {
  return /^\d{1,20}$/.test(raw) ? BigInt(raw) : null;
}

/** True when no *other* active root admin exists besides `excludeId`. */
async function isLastActiveRoot(tx: Prisma.TransactionClient, excludeId: bigint): Promise<boolean> {
  const others = await tx.admin.count({ where: { isRoot: true, isActive: true, id: { not: excludeId } } });
  return others === 0;
}

function revalidate() {
  revalidatePath("/admin/admins");
  revalidatePath("/admin/roles");
}

const DUPLICATE_PHONE: AdminActionResult = {
  ok: false,
  message: "این شماره موبایل قبلاً برای مدیر دیگری ثبت شده است",
  fieldErrors: { phone: "مدیری با این شماره موبایل وجود دارد" },
};

function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

class ActionError extends Error {}

export async function createAdminAction(formData: FormData): Promise<AdminActionResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;

  const parsed = parseAdminForm(formData, "create");
  if (!parsed.success) return { ok: false, message: "اطلاعات فرم را بررسی کنید", fieldErrors: parsed.fieldErrors };
  const input = parsed.data;

  if (await prisma.admin.findUnique({ where: { phone: input.phone }, select: { id: true } })) return DUPLICATE_PHONE;
  if (input.roleId !== null && !(await prisma.adminRole.findUnique({ where: { id: input.roleId }, select: { id: true } }))) {
    return { ok: false, message: "نقش انتخاب‌شده یافت نشد", fieldErrors: { roleId: "نقش انتخاب‌شده یافت نشد" } };
  }

  try {
    const created = await prisma.admin.create({
      data: {
        name: input.name,
        phone: input.phone,
        email: input.email,
        password: await hashPassword(input.password!),
        isRoot: input.isRoot,
        isActive: input.isActive,
        roleId: input.isRoot ? null : input.roleId,
      },
      select: adminRecordSelect,
    });
    revalidate();
    return { ok: true, record: adminToRecord(created) };
  } catch (error) {
    if (isUniqueViolation(error)) return DUPLICATE_PHONE;
    console.error("[admins:create] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function updateAdminAction(idRaw: string, formData: FormData): Promise<AdminActionResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;

  const id = parseId(idRaw);
  if (id === null) return { ok: false, message: "شناسه مدیر نامعتبر است" };

  const parsed = parseAdminForm(formData, "edit");
  if (!parsed.success) return { ok: false, message: "اطلاعات فرم را بررسی کنید", fieldErrors: parsed.fieldErrors };
  const input = parsed.data;

  const isSelf = guard.actor.id === id.toString();
  if (isSelf && !input.isRoot) return { ok: false, message: "نمی‌توانید دسترسی مدیر کل را از حساب خودتان بردارید." };
  if (isSelf && !input.isActive) return { ok: false, message: "نمی‌توانید حساب خودتان را غیرفعال کنید." };

  const duplicate = await prisma.admin.findFirst({ where: { phone: input.phone, id: { not: id } }, select: { id: true } });
  if (duplicate) return DUPLICATE_PHONE;
  if (input.roleId !== null && !(await prisma.adminRole.findUnique({ where: { id: input.roleId }, select: { id: true } }))) {
    return { ok: false, message: "نقش انتخاب‌شده یافت نشد", fieldErrors: { roleId: "نقش انتخاب‌شده یافت نشد" } };
  }

  const passwordHash = input.password ? await hashPassword(input.password) : null;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const current = await tx.admin.findUnique({ where: { id }, select: { isRoot: true, isActive: true } });
      if (!current) throw new ActionError("مدیر یافت نشد");

      const losesActiveRoot = current.isRoot && current.isActive && (!input.isRoot || !input.isActive);
      if (losesActiveRoot && (await isLastActiveRoot(tx, id))) throw new ActionError(LAST_ROOT_MESSAGE);

      return tx.admin.update({
        where: { id },
        data: {
          name: input.name,
          phone: input.phone,
          email: input.email,
          isRoot: input.isRoot,
          isActive: input.isActive,
          roleId: input.isRoot ? null : input.roleId,
          ...(passwordHash ? { password: passwordHash } : {}),
        },
        select: adminRecordSelect,
      });
    });
    revalidate();
    return { ok: true, record: adminToRecord(updated) };
  } catch (error) {
    if (error instanceof ActionError) return { ok: false, message: error.message };
    if (isUniqueViolation(error)) return DUPLICATE_PHONE;
    console.error("[admins:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function toggleAdminActiveAction(idRaw: string): Promise<AdminActionResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;

  const id = parseId(idRaw);
  if (id === null) return { ok: false, message: "شناسه مدیر نامعتبر است" };
  if (guard.actor.id === id.toString()) return { ok: false, message: "نمی‌توانید حساب خودتان را غیرفعال کنید." };

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const current = await tx.admin.findUnique({ where: { id }, select: { isRoot: true, isActive: true } });
      if (!current) throw new ActionError("مدیر یافت نشد");
      if (current.isRoot && current.isActive && (await isLastActiveRoot(tx, id))) throw new ActionError(LAST_ROOT_MESSAGE);
      return tx.admin.update({ where: { id }, data: { isActive: !current.isActive }, select: adminRecordSelect });
    });
    revalidate();
    return { ok: true, record: adminToRecord(updated) };
  } catch (error) {
    if (error instanceof ActionError) return { ok: false, message: error.message };
    console.error("[admins:toggle] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function deleteAdminAction(idRaw: string): Promise<AdminSimpleActionResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;

  const id = parseId(idRaw);
  if (id === null) return { ok: false, message: "شناسه مدیر نامعتبر است" };
  if (guard.actor.id === id.toString()) return { ok: false, message: "نمی‌توانید حساب خودتان را حذف کنید." };

  try {
    await prisma.$transaction(async (tx) => {
      const current = await tx.admin.findUnique({ where: { id }, select: { isRoot: true, isActive: true } });
      if (!current) throw new ActionError("مدیر یافت نشد");
      if (current.isRoot && current.isActive && (await isLastActiveRoot(tx, id))) throw new ActionError(LAST_ROOT_MESSAGE);
      await tx.admin.delete({ where: { id } });
    });
    revalidate();
    return { ok: true };
  } catch (error) {
    if (error instanceof ActionError) return { ok: false, message: error.message };
    console.error("[admins:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

