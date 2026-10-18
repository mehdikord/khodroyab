"use client";

import React, { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Users, Edit2, Trash2, UserCircle2 } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { UserFormModal } from "@/components/admin/users/UserFormModal";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { deleteUserAction, toggleUserActiveAction } from "@/app/admin/(panel)/users/actions";
import type { UserRecord } from "@/lib/users";
import { toPersianDigits } from "@/lib/utils";

interface UsersManagerProps {
  initialUsers: UserRecord[];
}

export function UsersManager({ initialUsers }: UsersManagerProps) {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [query, setQuery] = useState("");
  const [modalUser, setModalUser] = useState<UserRecord | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  const [, startToggleTransition] = useTransition();

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(normalized) ||
        user.phone.includes(normalized) ||
        (user.email && user.email.toLowerCase().includes(normalized))
    );
  }, [users, query]);

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteUserAction(deleteTarget.id);
    if (result.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      showToast("success", "کاربر با موفقیت حذف شد");
      setDeleteTarget(null);
    } else {
      showToast("error", result.message);
    }
  }

  function handleToggleActive(user: UserRecord) {
    if (pendingToggleId) return;
    setPendingToggleId(user.id);

    // Optimistic update for instant feedback.
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u)));

    startToggleTransition(async () => {
      const result = await toggleUserActiveAction(user.id);
      setPendingToggleId(null);
      if (result.ok) {
        setUsers((prev) => prev.map((u) => (u.id === result.record.id ? result.record : u)));
        showToast(
          "success",
          result.record.isActive
            ? `حساب کاربر «${result.record.name}» فعال شد`
            : `حساب کاربر «${result.record.name}» غیرفعال شد`
        );
      } else {
        // Roll back the optimistic update on failure.
        setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
        showToast("error", result.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {modalUser !== undefined && (
        <UserFormModal
          user={modalUser}
          onClose={() => setModalUser(undefined)}
          onSuccess={(record) => {
            if (modalUser) {
              setUsers((prev) => prev.map((u) => (u.id === record.id ? record : u)));
              showToast("success", "کاربر با موفقیت ویرایش شد");
            } else {
              setUsers((prev) => [record, ...prev]);
              showToast("success", "کاربر با موفقیت ایجاد شد");
            }
            setModalUser(undefined);
          }}
          onError={(msg) => showToast("error", msg)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          open={true}
          title="حذف کاربر"
          message={`آیا مطمئن هستید که می‌خواهید کاربر «${deleteTarget.name}» را حذف کنید؟`}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          danger
        />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">مدیریت کاربران</h1>
            <p className="mt-0.5 text-xs text-[#8B93A1]">{toPersianDigits(users.length)} کاربر ثبت شده</p>
          </div>
        </div>
        <button onClick={() => setModalUser(null)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] transition-all hover:brightness-110">
            <Plus className="h-4 w-4" /> افزودن کاربر جدید
        </button>
      </div>

      <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجو..." className="h-11 w-full max-w-md rounded-xl border border-white/[0.12] bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none" />

      <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07]">
        <table className="w-full text-sm text-right">
          <thead className="bg-white/[0.03] text-xs font-bold uppercase text-[#8B93A1]">
            <tr>
              <th className="px-6 py-4">کاربر</th>
              <th className="px-6 py-4">تلفن</th>
              <th className="px-6 py-4">ایمیل</th>
              <th className="px-6 py-4">کد ملی</th>
              <th className="px-6 py-4">کد پستی</th>
              <th className="px-6 py-4">آدرس</th>
              <th className="px-6 py-4 text-center">وضعیت</th>
              <th className="px-6 py-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/[0.1] bg-[#07090C]">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.image} alt={user.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#5E6672]">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-[#F5F5F5]">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-[#D2D7DF]">{user.phone}</td>
                <td className="px-6 py-4 text-[#D2D7DF]">{user.email || "-"}</td>
                <td className="px-6 py-4 text-[#D2D7DF]">{user.nationalCode || "-"}</td>
                <td className="px-6 py-4 text-[#D2D7DF]">{user.postalCode || "-"}</td>
                <td className="px-6 py-4 max-w-[220px] truncate text-[#D2D7DF]" title={user.address ?? ""}>{user.address || "-"}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(user)}
                    disabled={pendingToggleId === user.id}
                    title={user.isActive ? "برای غیرفعال کردن حساب کلیک کنید" : user.isPending ? "برای تایید و فعال کردن حساب کلیک کنید" : "برای فعال کردن حساب کلیک کنید"}
                    aria-pressed={user.isActive}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors disabled:cursor-wait disabled:opacity-60 ${
                      user.isActive
                        ? "border-green-500/30 bg-green-500/10 text-green-400 hover:border-green-500/60 hover:bg-green-500/20"
                        : user.isPending
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:border-amber-500/60 hover:bg-amber-500/20"
                          : "border-red-500/30 bg-red-500/10 text-red-400 hover:border-red-500/60 hover:bg-red-500/20"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${user.isActive ? "bg-green-400" : user.isPending ? "bg-amber-400" : "bg-red-400"}`} />
                    {user.isActive ? "فعال" : user.isPending ? "در انتظار تایید" : "غیرفعال"}
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Link
                      href={`/admin/users/${user.id}`}
                      title="پروفایل کاربر"
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-2.5 text-xs font-bold text-[#FF8A2A] transition-colors hover:border-[#FF6A00]/60 hover:bg-[#FF6A00]/20"
                    >
                      <UserCircle2 className="h-4 w-4" />
                      <span className="hidden xl:inline">پروفایل</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setModalUser(user)}
                      title="ویرایش"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-[#FF6A00]/40 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A]"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(user)}
                      title="حذف"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
