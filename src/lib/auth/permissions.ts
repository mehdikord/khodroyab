/**
 * Admin RBAC: the panel sections a role can be granted, and pure helpers to
 * evaluate access. Client-safe (no `server-only`), so the shell can hide nav
 * items and buttons with exactly the same rules the server enforces.
 *
 * Model:
 *  - A root admin (`admins.is_root`) passes every check, including the
 *    root-only areas (managing admins/roles, subscriptions).
 *  - Every other admin gets the permissions of their single role
 *    (`admins.role_id` → `admin_role_permissions`). No role = no sections.
 *  - Each permission is one switch that grants full management of a section.
 */

export const ADMIN_PERMISSIONS = ["users", "sponsors", "cars", "ads", "price_table"] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

export interface AdminPermissionMeta {
  label: string;
  /** What the section covers, shown next to the checkbox in the role form. */
  description: string;
}

export const ADMIN_PERMISSION_META: Record<AdminPermission, AdminPermissionMeta> = {
  users: {
    label: "کاربران",
    description: "مشاهده و ویرایش اطلاعات کاربران، فعال/غیرفعال‌سازی، تغییر به همکار و تایید احراز هویت",
  },
  sponsors: {
    label: "حامیان",
    description: "مدیریت کامل حامیان: افزودن، ویرایش، ترتیب نمایش و حذف",
  },
  cars: {
    label: "مدیریت خودروها",
    description: "خودروها و تصاویر، برندها، انواع خودرو، رنگ‌ها و فرم ثبت آگهی",
  },
  ads: {
    label: "مدیریت آگهی‌ها",
    description: "تایید و رد آگهی‌ها، ثبت و ویرایش آگهی برای کاربران و مدیریت کامل شرایط فروش",
  },
  price_table: {
    label: "جدول لیست قیمت",
    description: "ویرایش جدول قیمت کاربران و انتخاب خودروهای قابل درج در جدول قیمت",
  },
};

export function isAdminPermission(value: unknown): value is AdminPermission {
  return typeof value === "string" && (ADMIN_PERMISSIONS as readonly string[]).includes(value);
}

/**
 * What a page/action needs:
 *  - a permission,
 *  - a list of permissions (any one is enough),
 *  - "root" for root-only areas,
 *  - "any" for any signed-in admin (e.g. the dashboard).
 */
export type AccessRequirement = AdminPermission | readonly AdminPermission[] | "root" | "any";

/** The access facts the checks need; a subset of the current admin. */
export interface AdminAccess {
  isRoot: boolean;
  permissions: readonly AdminPermission[];
}

export function hasPermission(access: AdminAccess, permission: AdminPermission): boolean {
  return access.isRoot || access.permissions.includes(permission);
}

export function canAccess(access: AdminAccess, requirement: AccessRequirement): boolean {
  if (access.isRoot) return true;
  if (requirement === "any") return true;
  if (requirement === "root") return false;
  if (typeof requirement === "string") return access.permissions.includes(requirement);
  return requirement.some((permission) => access.permissions.includes(permission));
}

/**
 * The user list/profile is *viewable* by sections that work on behalf of a
 * user (posting ads, editing a price table); only "users" may change it.
 */
export const USER_DIRECTORY_ACCESS: readonly AdminPermission[] = ["users", "ads", "price_table"];

/** Keep only known permissions, de-duplicated, in canonical order. */
export function normalizePermissions(values: Iterable<unknown>): AdminPermission[] {
  const set = new Set<string>();
  for (const value of Array.from(values)) {
    if (isAdminPermission(value)) set.add(value);
  }
  return ADMIN_PERMISSIONS.filter((permission) => set.has(permission));
}
