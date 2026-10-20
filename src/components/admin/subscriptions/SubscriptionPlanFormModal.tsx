"use client";

import React, { useState, useTransition } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import { Toggle } from "@/components/admin/ui/Toggle";
import {
  createSubscriptionPlanAction,
  updateSubscriptionPlanAction,
} from "@/app/admin/(panel)/subscriptions/actions";
import type { SubscriptionPlanRecord } from "@/lib/subscriptions";
import { DAYS_PER_MONTH } from "@/lib/subscriptions-shared";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface SubscriptionPlanFormModalProps {
  mode: "create" | "edit";
  plan: SubscriptionPlanRecord | null;
  onClose: () => void;
  onSuccess: (record: SubscriptionPlanRecord) => void;
  onError: (message: string) => void;
}

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672]",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
  );

function asciiDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

export function SubscriptionPlanFormModal({ mode, plan, onClose, onSuccess, onError }: SubscriptionPlanFormModalProps) {
  const isEdit = mode === "edit";
  const [isActive, setIsActive] = useState<boolean>(plan?.isActive ?? true);
  const [months, setMonths] = useState<string>(plan ? String(plan.durationMonths) : "");
  const [price, setPrice] = useState<string>(plan ? formatPersianNumber(plan.price) : "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const monthsNumber = Number(asciiDigits(months));

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    const formData = new FormData(event.currentTarget);
    formData.set("isActive", String(isActive));

    startTransition(async () => {
      const result = isEdit
        ? await updateSubscriptionPlanAction(plan!.id, formData)
        : await createSubscriptionPlanAction(formData);

      if (result.ok) {
        onSuccess(result.record);
      } else {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setFormError(result.message);
        onError(result.message);
      }
    });
  }

  return (
    <Modal open onClose={onClose} title={isEdit ? "ویرایش اشتراک" : "ایجاد اشتراک جدید"} size="md">
      <form id="subscription-plan-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <span>{formError}</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#F5F5F5]">
            نام <span className="text-[#FF6A00]">*</span>
          </label>
          <input
            name="name"
            type="text"
            defaultValue={plan?.name}
            required
            placeholder="مثلاً: اشتراک یک ماهه"
            className={inputClassName(Boolean(fieldErrors.name))}
          />
          {fieldErrors.name && <p className="text-xs text-red-400">{fieldErrors.name}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#F5F5F5]">
              مدت دسترسی (ماه) <span className="text-[#FF6A00]">*</span>
            </label>
            <input
              name="durationMonths"
              type="text"
              inputMode="numeric"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              required
              placeholder="مثلاً: ۱"
              className={inputClassName(Boolean(fieldErrors.durationMonths))}
            />
            {fieldErrors.durationMonths ? (
              <p className="text-xs text-red-400">{fieldErrors.durationMonths}</p>
            ) : (
              Number.isInteger(monthsNumber) &&
              monthsNumber > 0 && (
                <p className="text-[11px] text-[#5E6672]">معادل {toPersianDigits(monthsNumber * DAYS_PER_MONTH)} روز دسترسی</p>
              )
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#F5F5F5]">
              قیمت (تومان) <span className="text-[#FF6A00]">*</span>
            </label>
            <input
              name="price"
              type="text"
              inputMode="numeric"
              dir="ltr"
              value={price}
              onChange={(e) => setPrice(formatPersianNumber(e.target.value))}
              required
              placeholder="۰"
              className={cn(inputClassName(Boolean(fieldErrors.price)), "text-left font-mono")}
            />
            {fieldErrors.price && <p className="text-xs text-red-400">{fieldErrors.price}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#F5F5F5]">توضیحات</label>
          <textarea
            name="description"
            defaultValue={plan?.description || ""}
            placeholder="توضیحات مختصر درباره این اشتراک..."
            className={cn(inputClassName(Boolean(fieldErrors.description)), "h-24 py-3 resize-none")}
          />
          {fieldErrors.description && <p className="text-xs text-red-400">{fieldErrors.description}</p>}
        </div>

        {isEdit && (
          <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#0A0D12] p-4">
            <div>
              <p className="text-sm font-bold text-[#F5F5F5]">وضعیت فعال‌سازی</p>
              <p className="text-xs text-[#5E6672]">فقط اشتراک‌های فعال برای کاربران قابل انتخاب هستند.</p>
            </div>
            <Toggle checked={isActive} onCheckedChange={setIsActive} label="فعال" />
          </div>
        )}
      </form>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm text-[#D2D7DF] hover:bg-white/5">
          انصراف
        </button>
        <button
          form="subscription-plan-form"
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 py-2.5 text-sm font-bold text-[#07090C] hover:brightness-110 disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "ذخیره تغییرات" : "ایجاد اشتراک"}
        </button>
      </div>
    </Modal>
  );
}
