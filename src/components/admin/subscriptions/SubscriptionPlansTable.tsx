"use client";

import React from "react";
import { Crown, Edit2, Trash2 } from "lucide-react";

import type { SubscriptionPlanRecord } from "@/lib/subscriptions";
import { DAYS_PER_MONTH } from "@/lib/subscriptions-shared";
import { formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface SubscriptionPlansTableProps {
  plans: SubscriptionPlanRecord[];
  usageByPlan: Record<string, number>;
  pendingToggleId: string | null;
  onToggle: (plan: SubscriptionPlanRecord) => void;
  onEdit: (plan: SubscriptionPlanRecord) => void;
  onDelete: (plan: SubscriptionPlanRecord) => void;
}

export function SubscriptionPlansTable({
  plans,
  usageByPlan,
  pendingToggleId,
  onToggle,
  onEdit,
  onDelete,
}: SubscriptionPlansTableProps) {
  return (
    <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07]">
      <table className="w-full text-sm text-right">
        <thead className="bg-white/[0.03] text-xs font-bold uppercase text-[#8B93A1]">
          <tr>
            <th className="px-6 py-4">نام اشتراک</th>
            <th className="px-6 py-4">مدت دسترسی</th>
            <th className="px-6 py-4">قیمت</th>
            <th className="px-6 py-4">توضیحات</th>
            <th className="px-6 py-4 text-center">دفعات ثبت</th>
            <th className="px-6 py-4 text-center">وضعیت</th>
            <th className="px-6 py-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">
          {plans.map((plan) => {
            const usage = usageByPlan[plan.id] ?? 0;
            return (
              <tr key={plan.id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
                      <Crown className="h-5 w-5" />
                    </span>
                    <span className="font-semibold text-[#F5F5F5]">{plan.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#D2D7DF]">
                  {toPersianDigits(plan.durationMonths)} ماه
                  <span className="ms-1.5 text-[11px] text-[#5E6672]">({toPersianDigits(plan.durationMonths * DAYS_PER_MONTH)} روز)</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-bold text-[#F5F5F5]">
                  {plan.price === "0" ? "رایگان" : `${formatPersianNumber(plan.price)} تومان`}
                </td>
                <td className="px-6 py-4 max-w-[280px] truncate text-[#D2D7DF]" title={plan.description ?? ""}>
                  {plan.description || "-"}
                </td>
                <td className="px-6 py-4 text-center text-[#D2D7DF]">{toPersianDigits(usage)}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    type="button"
                    onClick={() => onToggle(plan)}
                    disabled={pendingToggleId === plan.id}
                    title={plan.isActive ? "برای غیرفعال کردن کلیک کنید" : "برای فعال کردن کلیک کنید"}
                    aria-pressed={plan.isActive}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors disabled:cursor-wait disabled:opacity-60 ${
                      plan.isActive
                        ? "border-green-500/30 bg-green-500/10 text-green-400 hover:border-green-500/60 hover:bg-green-500/20"
                        : "border-red-500/30 bg-red-500/10 text-red-400 hover:border-red-500/60 hover:bg-red-500/20"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${plan.isActive ? "bg-green-400" : "bg-red-400"}`} />
                    {plan.isActive ? "فعال" : "غیرفعال"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(plan)}
                      title="ویرایش"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-[#FF6A00]/40 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A]"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(plan)}
                      disabled={usage > 0}
                      title={usage > 0 ? "این اشتراک برای کاربران ثبت شده و قابل حذف نیست" : "حذف"}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/[0.08] disabled:hover:bg-transparent disabled:hover:text-[#9BA3AE]"
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
  );
}
