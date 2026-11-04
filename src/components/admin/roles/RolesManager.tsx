"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Crown, Edit2, KeyRound, Plus, Trash2, UsersRound } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { PermissionChips } from "@/components/admin/roles/PermissionChips";
import { RoleFormModal } from "@/components/admin/roles/RoleFormModal";
import { deleteRoleAction } from "@/app/admin/(panel)/roles/actions";
import type { AdminRoleRecord } from "@/lib/admins";
import { ADMIN_PERMISSIONS } from "@/lib/auth/permissions";
import { toPersianDigits } from "@/lib/utils";

interface RolesManagerProps {
  initialRoles: AdminRoleRecord[];
  /** Root admins: shown as the built-in, non-editable "full access" tier. */
  rootCount: number;
}

export function RolesManager({ initialRoles, rootCount }: RolesManagerProps) {
  const [roles, setRoles] = useState(initialRoles);
  const [modalRole, setModalRole] = useState<AdminRoleRecord | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<AdminRoleRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteRoleAction(deleteTarget.id);
    setDeleting(false);
    if (result.ok) {
      setRoles((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      showToast("success", `نقش «${deleteTarget.name}» حذف شد`);
      setDeleteTarget(null);
    } else {
      showToast("error", result.message);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {modalRole !== undefined && (
        <RoleFormModal
          role={modalRole}
          onClose={() => setModalRole(undefined)}
          onSuccess={(record) => {
            setRoles((prev) => (modalRole ? prev.map((r) => (r.id === record.id ? record : r)) : [...prev, record]));
            showToast("success", modalRole ? "نقش با موفقیت ویرایش شد" : "نقش جدید ایجاد شد");
            setModalRole(undefined);
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          open
          title="حذف نقش"
          message={`آیا از حذف نقش «${deleteTarget.name}» مطمئن هستید؟`}
          pending={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">نقش‌ها و دسترسی‌ها</h1>
            <p className="mt-0.5 text-xs text-[#8B93A1]">
              {toPersianDigits(roles.length)} نقش تعریف شده — هر نقش تعیین می‌کند مدیر به کدام بخش‌های پنل دسترسی دارد
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setModalRole(null)}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> تعریف نقش جدید
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {/* Built-in tier: root admins */}
        <article className="relative overflow-hidden rounded-2xl border border-[#FF6A00]/30 bg-gradient-to-br from-[#FF6A00]/[0.12] via-[#0D1117] to-[#0D1117] p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/15 text-[#FF8A2A]">
              <Crown className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-extrabold text-[#F5F5F5]">مدیر کل</h2>
              <p className="mt-1 text-[11px] leading-5 text-[#9BA3AE]">
                دسترسی کامل به همه بخش‌ها، به‌علاوه مدیریت مدیران، نقش‌ها و اشتراک‌ها. از صفحه مدیران تعیین می‌شود.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <PermissionChips permissions={ADMIN_PERMISSIONS} />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#9BA3AE]">
              <UsersRound className="h-3.5 w-3.5 text-[#FF8A2A]" />
              {toPersianDigits(rootCount)} مدیر
            </span>
            <Link href="/admin/admins" className="text-[11px] font-bold text-[#FF8A2A] hover:underline">
              مدیریت مدیران
            </Link>
          </div>
        </article>

        {roles.map((role) => (
          <article key={role.id} className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#0D1117] p-5 transition-colors hover:border-white/[0.16]">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.03] text-[#C9CFD8]">
                <KeyRound className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-extrabold text-[#F5F5F5]" title={role.name}>
                  {role.name}
                </h2>
                <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#8B93A1]">{role.description || "بدون توضیحات"}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setModalRole(role)}
                  title="ویرایش نقش"
                  aria-label={`ویرایش نقش ${role.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-[#FF6A00]/40 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A]"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(role)}
                  disabled={role.adminCount > 0}
                  title={role.adminCount > 0 ? "نقش‌های دارای مدیر قابل حذف نیستند" : "حذف نقش"}
                  aria-label={`حذف نقش ${role.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/[0.08] disabled:hover:bg-transparent disabled:hover:text-[#9BA3AE]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex-1">
              <PermissionChips permissions={role.permissions} showAll />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#9BA3AE]">
                <UsersRound className="h-3.5 w-3.5 text-[#5E6672]" />
                {role.adminCount > 0 ? `${toPersianDigits(role.adminCount)} مدیر` : "بدون مدیر"}
              </span>
              <span className="text-[11px] text-[#5E6672]">
                {toPersianDigits(role.permissions.length)} از {toPersianDigits(ADMIN_PERMISSIONS.length)} بخش
              </span>
            </div>
          </article>
        ))}

        {roles.length === 0 && (
          <button
            type="button"
            onClick={() => setModalRole(null)}
            className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/[0.14] bg-[#0D1117]/60 p-5 text-center transition-colors hover:border-[#FF6A00]/40"
          >
            <Plus className="h-6 w-6 text-[#FF8A2A]" />
            <span className="text-sm font-bold text-[#F5F5F5]">اولین نقش را تعریف کنید</span>
            <span className="text-[11px] leading-5 text-[#8B93A1]">مثلاً «کارشناس آگهی‌ها» با دسترسی به آگهی‌ها و جدول قیمت</span>
          </button>
        )}
      </div>
    </div>
  );
}
