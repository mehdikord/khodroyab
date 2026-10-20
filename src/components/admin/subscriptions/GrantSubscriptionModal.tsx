"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { AlertCircle, CalendarPlus, Loader2 } from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import { grantUserSubscriptionAction, type UserSubscriptionActionResult } from "@/app/admin/(panel)/subscriptions/actions";
import type { SubscriptionPlanRecord } from "@/lib/subscriptions";
import { DAYS_PER_MONTH, type ActiveSubscriptionSummary } from "@/lib/subscriptions-shared";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

type GrantSuccess = Extract<UserSubscriptionActionResult, { ok: true }>;

interface GrantSubscriptionModalProps {
  user: { id: string; name: string };
  /** Plans that can be granted (inactive plans are filtered out here too). */
  plans: SubscriptionPlanRecord[];
  current: ActiveSubscriptionSummary | null;
  onClose: () => void;
  onSuccess: (result: GrantSuccess) => void;
  onError: (message: string) => void;
}

const inputClassName = (hasError: boolean) =>
  cn(
    "w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672]",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
  );

/** "افزودن اشتراک به کاربر" — used on the users table and the user profile. */
export function GrantSubscriptionModal({ user, plans, current, onClose, onSuccess, onError }: GrantSubscriptionModalProps) {
  const activePlans = plans.filter((plan) => plan.isActive);
  const [planId, setPlanId] = useState<string>(activePlans[0]?.id ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selected = activePlans.find((plan) => plan.id === planId) ?? null;
  const carried = current?.remainingDays ?? 0;
  const added = selected ? selected.durationMonths * DAYS_PER_MONTH : 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await grantUserSubscriptionAction(user.id, formData);
      if (result.ok) {
        onSuccess(result);
      } else {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setFormError(result.message);
        onError(result.message);
      }
    });
  }

  return (
    <Modal open onClose={onClose} title="افزودن اشتراک به کاربر" description={`کاربر: ${user.name}`} size="md">
      {activePlans.length === 0 ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-[#D2D7DF]">هیچ اشتراک فعالی برای انتخاب وجود ندارد.</p>
          <Link
            href="/admin/subscriptions"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-4 text-sm font-extrabold text-[#07090C] hover:brightness-110"
          >
            رفتن به لیست اشتراک‌ها
          </Link>
        </div>
      ) : (
        <>
          <form id="grant-subscription-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
            {formError && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-200">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="grant-plan" className="block text-sm font-semibold text-[#F5F5F5]">
                انتخاب اشتراک <span className="text-[#FF6A00]">*</span>
              </label>
              <select
                id="grant-plan"
                name="planId"
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className={cn(inputClassName(Boolean(fieldErrors.planId)), "h-12")}
              >
                {activePlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} — {toPersianDigits(plan.durationMonths)} ماه —{" "}
                    {plan.price === "0" ? "رایگان" : `${formatPersianNumber(plan.price)} تومان`}
                  </option>
                ))}
              </select>
              {fieldErrors.planId && <p className="text-xs text-red-400">{fieldErrors.planId}</p>}
              {selected?.description && <p className="text-[11px] leading-5 text-[#8B93A1]">{selected.description}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="grant-description" className="block text-sm font-semibold text-[#F5F5F5]">
                توضیحات
              </label>
              <textarea
                id="grant-description"
                name="description"
                placeholder="مثلاً: پرداخت کارت به کارت — شماره پیگیری ..."
                className={cn(inputClassName(Boolean(fieldErrors.description)), "h-24 resize-none py-3")}
              />
              {fieldErrors.description && <p className="text-xs text-red-400">{fieldErrors.description}</p>}
            </div>

            {/* Resulting access preview */}
            <div className="flex items-start gap-3 rounded-2xl border border-[#FF6A00]/25 bg-[#FF6A00]/[0.06] p-4">
              <CalendarPlus className="mt-0.5 h-5 w-5 shrink-0 text-[#FF8A2A]" />
              <div className="text-xs leading-6 text-[#D2D7DF]">
                {carried > 0 ? (
                  <>
                    <p>
                      اشتراک فعلی: <b className="text-[#F5F5F5]">{current?.planName}</b> با{" "}
                      <b className="text-[#F5F5F5]">{toPersianDigits(carried)} روز</b> باقی‌مانده
                    </p>
                    <p>
                      {toPersianDigits(carried)} روز باقی‌مانده + {toPersianDigits(added)} روز اشتراک جدید ={" "}
                      <b className="text-sm text-[#FF8A2A]">{toPersianDigits(carried + added)} روز</b> دسترسی
                    </p>
                  </>
                ) : (
                  <p>
                    کاربر اشتراک فعال ندارد؛ پس از ثبت، <b className="text-sm text-[#FF8A2A]">{toPersianDigits(added)} روز</b> دسترسی خواهد داشت.
                  </p>
                )}
              </div>
            </div>
          </form>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm text-[#D2D7DF] hover:bg-white/5">
              انصراف
            </button>
            <button
              form="grant-subscription-form"
              type="submit"
              disabled={isPending || !selected}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 py-2.5 text-sm font-bold text-[#07090C] hover:brightness-110 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              ثبت اشتراک
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
