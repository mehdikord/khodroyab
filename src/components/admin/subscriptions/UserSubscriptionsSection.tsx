"use client";

import React, { useState } from "react";
import { AlertTriangle, Ban, CalendarClock, Crown, History, Plus } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { GrantSubscriptionModal } from "@/components/admin/subscriptions/GrantSubscriptionModal";
import { cancelUserSubscriptionAction } from "@/app/admin/(panel)/subscriptions/actions";
import type { SubscriptionPlanRecord, UserSubscriptionRecord } from "@/lib/subscriptions";
import { isExpiringSoon, type ActiveSubscriptionSummary } from "@/lib/subscriptions-shared";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface UserSubscriptionsSectionProps {
  user: { id: string; name: string };
  plans: SubscriptionPlanRecord[];
  initialHistory: UserSubscriptionRecord[];
  initialActive: ActiveSubscriptionSummary | null;
}

const faDate = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" });
const faDateTime = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function StatusPill({ record }: { record: UserSubscriptionRecord }) {
  const map = record.isCurrent
    ? { label: "فعال", className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300" }
    : record.status === "renewed"
      ? { label: "تمدید شده", className: "border-sky-500/25 bg-sky-500/10 text-sky-300" }
      : record.status === "cancelled"
        ? { label: "لغو شده", className: "border-red-500/25 bg-red-500/10 text-red-300" }
        : { label: "منقضی شده", className: "border-white/[0.1] bg-white/[0.05] text-[#9AA2AF]" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold leading-none", map.className)}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {map.label}
    </span>
  );
}

/** Admin-side subscription management on the user profile page. */
export function UserSubscriptionsSection({ user, plans, initialHistory, initialActive }: UserSubscriptionsSectionProps) {
  const [history, setHistory] = useState<UserSubscriptionRecord[]>(initialHistory);
  const [active, setActive] = useState<ActiveSubscriptionSummary | null>(initialActive);
  const [grantOpen, setGrantOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const expiring = isExpiringSoon(active);

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleCancel() {
    if (!active) return;
    setCancelling(true);
    const result = await cancelUserSubscriptionAction(active.id);
    setCancelling(false);
    if (result.ok) {
      setHistory((prev) => prev.map((row) => (row.id === result.record.id ? result.record : row)));
      setActive(null);
      setCancelOpen(false);
      showToast("success", "اشتراک فعال کاربر لغو شد");
    } else {
      showToast("error", result.message);
    }
  }

  return (
    <section className="admin-animate-in rounded-3xl border border-white/[0.07] bg-[#0D1117] p-5 sm:p-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {grantOpen && (
        <GrantSubscriptionModal
          user={user}
          plans={plans}
          current={active}
          onClose={() => setGrantOpen(false)}
          onSuccess={(result) => {
            setHistory((prev) => [
              result.record,
              ...prev.map((row) =>
                row.id === result.renewedId ? { ...row, status: "renewed" as const, isCurrent: false, remainingDays: 0 } : row
              ),
            ]);
            setActive(result.active);
            setGrantOpen(false);
            showToast("success", `اشتراک «${result.record.planName}» برای کاربر ثبت شد`);
          }}
          onError={(msg) => showToast("error", msg)}
        />
      )}

      {cancelOpen && active && (
        <ConfirmDialog
          open
          title="لغو اشتراک فعال"
          message={
            <>
              اشتراک «{active.planName}» با {toPersianDigits(active.remainingDays)} روز باقی‌مانده لغو می‌شود و کاربر بلافاصله دسترسی به
              پنل را از دست می‌دهد. ادامه می‌دهید؟
            </>
          }
          confirmLabel="لغو اشتراک"
          pending={cancelling}
          onConfirm={handleCancel}
          onClose={() => setCancelOpen(false)}
          danger
        />
      )}

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
            <Crown className="h-5 w-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-extrabold text-[#F5F5F5]">اشتراک‌ها</h3>
              <span className="inline-flex items-center rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-bold text-[#9BA3AE]">
                {toPersianDigits(history.length)} مورد در تاریخچه
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#8B93A1]">مدیریت اشتراک فعال و تاریخچه کامل اشتراک‌های کاربر</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setGrantOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-4 text-sm font-extrabold text-[#07090C] shadow-[0_0_24px_rgba(255,106,0,0.3)] transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          افزودن اشتراک
        </button>
      </div>

      {/* Current subscription */}
      <div
        className={cn(
          "flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between",
          !active
            ? "border-white/[0.08] bg-[#07090C]/60"
            : expiring
              ? "border-red-500/30 bg-red-500/[0.06]"
              : "border-emerald-500/25 bg-emerald-500/[0.05]"
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
              !active
                ? "border-white/[0.08] bg-[#0D1117] text-[#5E6672]"
                : expiring
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            )}
          >
            {expiring ? <AlertTriangle className="admin-blink h-5 w-5" /> : <CalendarClock className="h-5 w-5" />}
          </span>
          {active ? (
            <div>
              <p className="text-sm font-extrabold text-[#F5F5F5]">
                {active.planName}
                <span className={cn("ms-2 text-base", expiring ? "text-red-400" : "text-emerald-300")}>
                  {toPersianDigits(active.remainingDays)} روز باقی‌مانده
                </span>
              </p>
              <p className="mt-0.5 text-xs text-[#8B93A1]">پایان اشتراک: {faDateTime.format(new Date(active.endsAt))}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-extrabold text-[#D2D7DF]">بدون اشتراک فعال</p>
              <p className="mt-0.5 text-xs text-[#8B93A1]">این کاربر تا زمان ثبت اشتراک جدید نمی‌تواند وارد پنل شود.</p>
            </div>
          )}
        </div>
        {active && (
          <button
            type="button"
            onClick={() => setCancelOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 text-sm font-bold text-red-300 transition-colors hover:border-red-500/60 hover:bg-red-500/20"
          >
            <Ban className="h-4 w-4" />
            لغو اشتراک فعال
          </button>
        )}
      </div>

      {/* History */}
      <div className="mt-5">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold text-[#8B93A1]">
          <History className="h-4 w-4" />
          تاریخچه اشتراک‌ها
        </p>
        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#07090C]/60 px-6 py-8 text-center text-xs text-[#5E6672]">
            هنوز اشتراکی برای این کاربر ثبت نشده است.
          </div>
        ) : (
          <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.06]">
            <table className="w-full text-sm text-right">
              <thead className="bg-white/[0.03] text-xs font-bold text-[#8B93A1]">
                <tr>
                  <th className="px-4 py-3">اشتراک</th>
                  <th className="px-4 py-3">قیمت</th>
                  <th className="px-4 py-3">روزهای دسترسی</th>
                  <th className="px-4 py-3">تاریخ ثبت</th>
                  <th className="px-4 py-3">پایان</th>
                  <th className="px-4 py-3 text-center">وضعیت</th>
                  <th className="px-4 py-3">توضیحات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {history.map((row) => (
                  <tr key={row.id} className={row.isCurrent ? "bg-emerald-500/[0.03]" : undefined}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#F5F5F5]">{row.planName}</p>
                      <p className="text-[11px] text-[#5E6672]">{toPersianDigits(row.durationMonths)} ماه</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[#D2D7DF]">
                      {row.price === "0" ? "رایگان" : `${formatPersianNumber(row.price)} تومان`}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[#D2D7DF]">
                      {row.carriedDays > 0 ? (
                        <span>
                          {toPersianDigits(row.addedDays)} + {toPersianDigits(row.carriedDays)} انتقالی ={" "}
                          <b className="text-[#F5F5F5]">{toPersianDigits(row.addedDays + row.carriedDays)}</b> روز
                        </span>
                      ) : (
                        <span>{toPersianDigits(row.addedDays)} روز</span>
                      )}
                      {row.isCurrent && (
                        <p className="text-[11px] text-emerald-300">{toPersianDigits(row.remainingDays)} روز باقی‌مانده</p>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-[#8B93A1]">{faDateTime.format(new Date(row.createdAt))}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-[#8B93A1]">
                      {faDate.format(new Date(row.endsAt))}
                      {row.cancelledAt && (
                        <p className="text-[11px] text-red-300">لغو: {faDate.format(new Date(row.cancelledAt))}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusPill record={row} />
                    </td>
                    <td className="px-4 py-3 max-w-[240px] truncate text-xs text-[#D2D7DF]" title={row.description ?? ""}>
                      {row.description || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
