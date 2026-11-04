import { z } from "zod";

import { normalizePermissions, type AdminPermission } from "@/lib/auth/permissions";
import type { FieldErrors } from "@/lib/validation/admin";
import { userPasswordSchema, userPhoneSchema, zodFieldErrors } from "@/lib/validation/user";

/** Validation for the admin-management forms (admins + RBAC roles). */

const nameSchema = z
  .string()
  .trim()
  .min(2, { error: "نام باید حداقل ۲ کاراکتر باشد" })
  .max(120, { error: "نام نباید بیشتر از ۱۲۰ کاراکتر باشد" });

const emailSchema = z
  .string()
  .trim()
  .max(255, { error: "ایمیل بیش از حد طولانی است" })
  .refine((value) => value === "" || z.email().safeParse(value).success, { error: "ایمیل معتبر نیست" });

const idSchema = z.string().regex(/^\d{1,20}$/);

export interface AdminFormInput {
  name: string;
  phone: string;
  email: string | null;
  /** Null on edit when the field was left blank (keep the current password). */
  password: string | null;
  isRoot: boolean;
  isActive: boolean;
  /** Ignored (stored as null) for root admins. */
  roleId: bigint | null;
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function parseAdminForm(
  formData: FormData,
  mode: "create" | "edit"
): { success: true; data: AdminFormInput } | { success: false; fieldErrors: FieldErrors } {
  const fieldErrors: FieldErrors = {};

  const name = nameSchema.safeParse(text(formData, "name"));
  if (!name.success) Object.assign(fieldErrors, { name: name.error.issues[0]?.message });

  const phone = userPhoneSchema.safeParse(text(formData, "phone"));
  if (!phone.success) Object.assign(fieldErrors, { phone: phone.error.issues[0]?.message });

  const email = emailSchema.safeParse(text(formData, "email"));
  if (!email.success) Object.assign(fieldErrors, { email: email.error.issues[0]?.message });

  const passwordRaw = text(formData, "password");
  let password: string | null = null;
  if (mode === "create" || passwordRaw !== "") {
    const parsed = userPasswordSchema.safeParse(passwordRaw);
    if (parsed.success) password = parsed.data;
    else fieldErrors.password = parsed.error.issues[0]?.message ?? "رمز عبور معتبر نیست";
  }

  const isRoot = text(formData, "isRoot") === "true";
  const isActive = text(formData, "isActive") !== "false";

  let roleId: bigint | null = null;
  const roleRaw = text(formData, "roleId");
  if (!isRoot && roleRaw !== "") {
    if (idSchema.safeParse(roleRaw).success) roleId = BigInt(roleRaw);
    else fieldErrors.roleId = "نقش انتخاب‌شده معتبر نیست";
  }

  if (Object.keys(fieldErrors).length > 0 || !name.success || !phone.success || !email.success) {
    return { success: false, fieldErrors };
  }

  return {
    success: true,
    data: {
      name: name.data,
      phone: phone.data,
      email: email.data || null,
      password,
      isRoot,
      isActive,
      roleId,
    },
  };
}

export interface RoleFormInput {
  name: string;
  description: string | null;
  permissions: AdminPermission[];
}

const roleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "نام نقش باید حداقل ۲ کاراکتر باشد" })
    .max(100, { error: "نام نقش نباید بیشتر از ۱۰۰ کاراکتر باشد" }),
  description: z.string().trim().max(255, { error: "توضیحات نباید بیشتر از ۲۵۵ کاراکتر باشد" }),
});

export function parseRoleForm(
  formData: FormData
): { success: true; data: RoleFormInput } | { success: false; fieldErrors: FieldErrors } {
  const result = roleSchema.safeParse({ name: text(formData, "name"), description: text(formData, "description") });
  const fieldErrors: FieldErrors = result.success ? {} : zodFieldErrors(result.error);

  const permissions = normalizePermissions(formData.getAll("permissions"));
  if (permissions.length === 0) fieldErrors.permissions = "حداقل یک بخش را برای این نقش انتخاب کنید";

  if (!result.success || Object.keys(fieldErrors).length > 0) return { success: false, fieldErrors };

  return {
    success: true,
    data: { name: result.data.name, description: result.data.description || null, permissions },
  };
}
