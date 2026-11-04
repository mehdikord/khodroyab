"use client";

import React, { useMemo, useState, useTransition } from "react";
import { Crown, Edit2, KeyRound, Plus, ShieldCheck, Trash2, UserCheck, UserX } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { PermissionChips } from "@/components/admin/roles/PermissionChips";
import { AdminFormModal } from "@/components/admin/admins/AdminFormModal";
import { deleteAdminAction, toggleAdminActiveAction } from "@/app/admin/(panel)/admins/actions";
import type { AdminRecord, AdminRoleRecord } from "@/lib/admins";
import { cn, toPersianDigits } from "@/lib/utils";

interface AdminsManagerProps {
  initialAdmins: AdminRecord[];
  roles: AdminRoleRecord[];
  currentAdminId: string;
}

const faDate = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" });

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[0][0] + parts[1][0];
}

function Stat({ icon: Icon, label, value }: { icon: typeof Crown; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-[#0D1117] px-4 py-3">
      <Icon className="h-4 w-4 shrink-0 text-[#FF8A2A]" />
      <span className="text-xs text-[#8B93A1]">{label}</span>
      <span className="ms-auto font-mono text-base font-black text-[#F5F5F5]">{toPersianDigits(value)}</span>
    </div>
  );
}

export function AdminsManager({ initialAdmins, roles, currentAdminId }: AdminsManagerProps) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [modalAdmin, setModalAdmin] = useState<AdminRecord | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<AdminRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [, startTransition] = useTransition();

  const rolesById = useMemo(() => new Map(roles.map((role) => [role.id, role])), [roles]);
  const stats = useMemo(
    () => ({
      total: admins.length,
      roots: admins.filter((a) => a.isRoot).length,
      inactive: admins.filter((a) => !a.isActive).length,
    }),
    [admins]
  );

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 4000);
  }

  function handleToggleActive(admin: AdminRecord) {
    if (pendingToggleId) return;
    setPendingToggleId(admin.id);
    setAdmins((prev) => prev.map((a) => (a.id === admin.id ? { ...a, isActive: !a.isActive } : a)));
    startTransition(async () => {
      const result = await toggleAdminActiveAction(admin.id);
      setPendingToggleId(null);
      if (result.ok) {
        setAdmins((prev) => prev.map((a) => (a.id === result.record.id ? result.record : a)));
        showToast("success", result.record.isActive ? `حساب «${result.record.name}» فعال شد` : `حساب «${result.record.name}» غیرفعال شد`);
      } else {
        setAdmins((prev) => prev.map((a) => (a.id === admin.id ? admin : a)));
        showToast("error", result.message);
      }
    });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteAdminAction(deleteTarget.id);
    setDeleting(false);
    if (result.ok) {
      setAdmins((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      showToast("success", `مدیر «${deleteTarget.name}» حذف شد`);
    } else {
      showToast("error", result.message);
    }
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {modalAdmin !== undefined && (
        <AdminFormModal
          admin={modalAdmin}
          roles={roles}
          isSelf={modalAdmin?.id === currentAdminId}
          onClose={() => setModalAdmin(undefined)}
          onSuccess={(record) => {
            setAdmins((prev) => (modalAdmin ? prev.map((a) => (a.id === record.id ? record : a)) : [record, ...prev]));
            showToast("success", modalAdmin ? "اطلاعات مدیر به‌روزرسانی شد" : "مدیر جدید ایجاد شد");
            setModalAdmin(undefined);
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          open
          title="حذف مدیر"
          message={`آیا از حذف حساب مدیریتی «${deleteTarget.name}» مطمئن هستید؟ این مدیر دیگر نمی‌تواند وارد پنل شود.`}
          pending={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">مدیران سامانه</h1>
            <p className="mt-0.5 text-xs text-[#8B93A1]">ایجاد حساب مدیریتی و تعیین سطح دسترسی هر مدیر</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setModalAdmin(null)}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> افزودن مدیر
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat icon={UserCheck} label="کل مدیران" value={stats.total} />
        <Stat icon={Crown} label="مدیر کل" value={stats.roots} />
        <Stat icon={UserX} label="غیرفعال" value={stats.inactive} />
      </div>

      <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07]">
        <table className="w-full min-w-[860px] text-right text-sm">
          <thead className="bg-white/[0.03] text-xs font-bold text-[#8B93A1]">
            <tr>
              <th className="px-5 py-4">مدیر</th>
              <th className="px-5 py-4">موبایل</th>
              <th className="px-5 py-4">سطح دسترسی</th>
              <th className="px-5 py-4 text-center">وضعیت</th>
              <th className="px-5 py-4">تاریخ ایجاد</th>
              <th className="px-5 py-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {admins.map((admin) => {
              const isSelf = admin.id === currentAdminId;
              const role = admin.roleId ? rolesById.get(admin.roleId) : undefined;
              return (
                <tr key={admin.id} className="align-top hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold",
                          admin.isRoot ? "border-[#FF6A00]/40 bg-[#FF6A00]/[0.12] text-[#FF8A2A]" : "border-white/[0.1] bg-[#07090C] text-[#9BA3AE]"
                        )}
                      >
                        {initials(admin.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="truncate font-semibold text-[#F5F5F5]">{admin.name}</span>
                          {isSelf && (
                            <span className="rounded-full border border-white/[0.12] bg-white/[0.05] px-2 py-0.5 text-[10px] font-bold text-[#C9CFD8]">شما</span>
                          )}
                        </span>
                        <span dir="ltr" className="block truncate text-start text-[11px] text-[#8B93A1]">
                          {admin.email || "—"}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[#D2D7DF]" dir="ltr">
                    <span className="block text-right">{admin.phone}</span>
                  </td>
                  <td className="max-w-[340px] px-5 py-4">
                    {admin.isRoot ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6A00]/40 bg-[#FF6A00]/[0.12] px-2.5 py-1 text-[11px] font-extrabold text-[#FF8A2A]">
                        <Crown className="h-3.5 w-3.5" />
                        مدیر کل — دسترسی کامل
                      </span>
                    ) : role ? (
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F5F5F5]">
                          <KeyRound className="h-3.5 w-3.5 text-[#FF8A2A]" />
                          {role.name}
                        </span>
                        <PermissionChips permissions={role.permissions} size="sm" />
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-300">
                        بدون نقش
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(admin)}
                      disabled={isSelf || pendingToggleId === admin.id}
                      title={isSelf ? "حساب خودتان را نمی‌توانید غیرفعال کنید" : admin.isActive ? "برای غیرفعال کردن کلیک کنید" : "برای فعال کردن کلیک کنید"}
                      aria-pressed={admin.isActive}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors disabled:cursor-not-allowed",
                        pendingToggleId === admin.id && "cursor-wait opacity-60",
                        admin.isActive
                          ? "border-green-500/30 bg-green-500/10 text-green-400 enabled:hover:border-green-500/60 enabled:hover:bg-green-500/20"
                          : "border-red-500/30 bg-red-500/10 text-red-400 enabled:hover:border-red-500/60 enabled:hover:bg-red-500/20"
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", admin.isActive ? "bg-green-400" : "bg-red-400")} />
                      {admin.isActive ? "فعال" : "غیرفعال"}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-[#9BA3AE]">{faDate.format(new Date(admin.createdAt))}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setModalAdmin(admin)}
                        title="ویرایش"
                        aria-label={`ویرایش ${admin.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-[#FF6A00]/40 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A]"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(admin)}
                        disabled={isSelf}
                        title={isSelf ? "حساب خودتان را نمی‌توانید حذف کنید" : "حذف"}
                        aria-label={`حذف ${admin.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors enabled:hover:border-red-500/40 enabled:hover:bg-red-500/10 enabled:hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
