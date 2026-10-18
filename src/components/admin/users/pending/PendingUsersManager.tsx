"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Check, Search, UserRoundPlus, UserRoundX, Users } from "lucide-react";

import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { approvePendingUserAction, rejectPendingUserAction } from "@/app/admin/(panel)/users/pending/actions";
import type { UserRecord } from "@/lib/users";
import { cn, toPersianDigits } from "@/lib/utils";

interface PendingUsersManagerProps {
  initialUsers: UserRecord[];
}

const faDateTime = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

/** Approval queue for self-registered customers. */
export function PendingUsersManager({ initialUsers }: PendingUsersManagerProps) {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<UserRecord | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isRejecting, startRejectTransition] = useTransition();
  const [, startApproveTransition] = useTransition();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visibleUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return users;
    return users.filter((user) => user.name.toLowerCase().includes(normalized) || user.phone.includes(normalized));
  }, [users, query]);

  function showToast(kind: ToastState["kind"], message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }

  function handleApprove(user: UserRecord) {
    if (pendingId) return;
    setPendingId(user.id);
    startApproveTransition(async () => {
      const result = await approvePendingUserAction(user.id);
      setPendingId(null);
      if (result.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        showToast("success", `حساب «${user.name}» تایید و فعال شد؛ کاربر اکنون می‌تواند وارد پنل شود.`);
      } else {
        showToast("error", result.message);
      }
    });
  }

  function handleConfirmReject() {
    if (!rejectTarget) return;
    const target = rejectTarget;
    startRejectTransition(async () => {
      const result = await rejectPendingUserAction(target.id);
      setRejectTarget(null);
      if (result.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== target.id));
        showToast("success", `درخواست «${target.name}» رد و حذف شد.`);
      } else {
        showToast("error", result.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {rejectTarget && (
        <ConfirmDialog
          open
          title="رد درخواست ثبت‌نام"
          message={`آیا مطمئن هستید که می‌خواهید درخواست «${rejectTarget.name}» (${toPersianDigits(rejectTarget.phone)}) را رد کنید؟ حساب این کاربر حذف می‌شود.`}
          confirmLabel={isRejecting ? "در حال حذف..." : "رد و حذف"}
          onConfirm={handleConfirmReject}
          onClose={() => setRejectTarget(null)}
          pending={isRejecting}
          danger
        />
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
            <UserRoundPlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">کاربران در انتظار تایید</h1>
            <p className="mt-0.5 text-xs text-[#8B93A1]">
              {users.length === 0 ? "درخواست ثبت‌نام جدیدی وجود ندارد" : `${toPersianDigits(users.length)} کاربر منتظر تایید شما هستند`}
            </p>
          </div>
        </div>

        <Link
          href="/admin/users"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.03] px-4 text-xs font-bold text-[#D2D7DF] transition-colors hover:border-white/25 hover:text-[#F5F5F5]"
        >
          <Users className="h-4 w-4" />
          همه کاربران
        </Link>
      </div>

      <p className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 text-xs leading-6 text-[#D2D7DF]">
        کاربرانی که خودشان از صفحه ورود پنل ثبت‌نام می‌کنند تا زمان تایید شما غیرفعال هستند و نمی‌توانند وارد شوند. با «تایید و فعال‌سازی»،
        حساب فعال می‌شود و کاربر می‌تواند از پنل خود استفاده کند.
      </p>

      {users.length > 0 && (
        <div className="group relative w-full max-w-md">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#5E6672] transition-colors group-focus-within:text-[#FF8A2A]">
            <Search className="h-[18px] w-[18px]" />
          </span>
          <input
            type="search"
            placeholder="جستجو در نام یا شماره موبایل..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/[0.12] bg-[#07090C] px-12 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
        </div>
      )}

      {visibleUsers.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/[0.12] bg-[#0D1117]/60 px-6 py-16 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0D1117] text-[#5E6672]">
              <UserRoundPlus className="h-7 w-7" />
            </span>
            <p className="mt-5 text-base font-extrabold text-[#F5F5F5]">
              {users.length === 0 ? "صف تایید خالی است" : "کاربری با این مشخصات در صف نیست"}
            </p>
            <p className="mt-2 text-xs leading-6 text-[#8B93A1]">
              {users.length === 0 ? "به محض ثبت‌نام کاربر جدید، درخواست او اینجا نمایش داده می‌شود." : "عبارت جستجو را تغییر دهید."}
            </p>
          </div>
        </div>
      ) : (
        <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] bg-[#0A0D12]">
                <th scope="col" className="py-4 pr-5 text-right font-bold uppercase tracking-wider text-[#8B93A1]">
                  نام
                </th>
                <th scope="col" className="px-4 py-4 text-right font-bold uppercase tracking-wider text-[#8B93A1]">
                  شماره موبایل
                </th>
                <th scope="col" className="hidden px-4 py-4 text-right font-bold uppercase tracking-wider text-[#8B93A1] md:table-cell">
                  زمان ثبت‌نام
                </th>
                <th scope="col" className="py-4 pl-5 text-left font-bold uppercase tracking-wider text-[#8B93A1]">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {visibleUsers.map((user) => {
                const busy = pendingId === user.id;
                return (
                  <tr key={user.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="py-4 pr-5">
                      <p className="font-semibold text-[#F5F5F5]">{user.name}</p>
                      <p className="mt-0.5 text-[11px] text-[#5E6672] md:hidden">{faDateTime.format(new Date(user.createdAt))}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span dir="ltr" className="font-mono text-[13px] text-[#D2D7DF]">
                        {user.phone}
                      </span>
                    </td>
                    <td className="hidden px-4 py-4 text-xs text-[#8B93A1] md:table-cell">{faDateTime.format(new Date(user.createdAt))}</td>
                    <td className="py-4 pl-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(user)}
                          disabled={busy || isRejecting}
                          className={cn(
                            "inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-l from-emerald-500 to-emerald-400 px-3 text-xs font-extrabold text-[#07090C] transition-all hover:brightness-110",
                            "disabled:cursor-wait disabled:opacity-50"
                          )}
                        >
                          <Check className="h-4 w-4" />
                          {busy ? "در حال تایید..." : "تایید و فعال‌سازی"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectTarget(user)}
                          disabled={busy || isRejecting}
                          title="رد درخواست"
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 text-xs font-bold text-[#9BA3AE] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                        >
                          <UserRoundX className="h-4 w-4" />
                          <span className="hidden sm:inline">رد</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
