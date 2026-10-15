"use client";

import React, { useId, useState, useTransition } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import { addCarOptionAction } from "@/app/admin/(panel)/cars/[id]/options/actions";
import type { OptionRecord } from "@/lib/options";
import type { CarOptionRecord } from "@/lib/car-options";
import { cn } from "@/lib/utils";

interface AddCarOptionModalProps {
  carId: string;
  availableOptions: OptionRecord[];
  onClose: () => void;
  onSuccess: (record: CarOptionRecord) => void;
  onError: (message: string) => void;
}

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20"
  );

export function AddCarOptionModal({
  carId,
  availableOptions,
  onClose,
  onSuccess,
  onError,
}: AddCarOptionModalProps) {
  const optionSelectId = useId();
  const valueId = useId();

  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    availableOptions[0]?.id || ""
  );

  const selectedOption = availableOptions.find(
    (o) => o.id === selectedOptionId
  );

  const [val, setVal] = useState<string>(() => {
    const initial = availableOptions[0];
    if (!initial) return "";
    if (initial.type === "checkbox") return "1";
    if (initial.type === "select") return initial.optionItems?.[0]?.id || "";
    return "";
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOptionChange(id: string) {
    setSelectedOptionId(id);
    const opt = availableOptions.find((o) => o.id === id);
    if (!opt) {
      setVal("");
      return;
    }
    if (opt.type === "checkbox") {
      setVal("1");
    } else if (opt.type === "select") {
      setVal(opt.optionItems?.[0]?.id || "");
    } else {
      setVal("");
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!selectedOptionId) {
      setFormError("لطفاً یک ویژگی انتخاب کنید");
      return;
    }

    const isCheckbox = selectedOption?.type === "checkbox";
    if (!val && !isCheckbox) {
      setFormError("لطفاً مقدار ویژگی را وارد کنید");
      return;
    }

    startTransition(async () => {
      const result = await addCarOptionAction(carId, selectedOptionId, val || "1");
      if (result.ok) {
        onSuccess(result.record);
      } else {
        setFormError(result.message);
        onError(result.message);
      }
    });
  }

  return (
    <Modal
      open
      onClose={isPending ? () => undefined : onClose}
      title="افزودن ویژگی به خودرو"
      description="ویژگی مورد نظر را انتخاب و مقداردهی کنید. ویژگی‌هایی که قبلاً برای این خودرو ثبت شده‌اند، در لیست نمایش داده نمی‌شوند."
      size="md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-12 rounded-xl border border-white/[0.12] px-5 text-sm font-bold text-[#D2D7DF] transition-colors hover:border-white/25 hover:text-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            انصراف
          </button>
          <button
            type="submit"
            form="car-option-form"
            disabled={isPending || availableOptions.length === 0}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 hover:shadow-[0_0_36px_rgba(255,106,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isPending ? (
              <>
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
                در حال افزودن…
              </>
            ) : (
              "ثبت ویژگی"
            )}
          </button>
        </>
      }
    >
      <form
        id="car-option-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        {formError && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-semibold text-red-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {availableOptions.length === 0 ? (
          <p className="text-sm text-[#8B93A1]">
            تمام ویژگی‌های سیستم به این خودرو اختصاص یافته‌اند.
          </p>
        ) : (
          <>
            <div className="space-y-2">
              <label htmlFor={optionSelectId} className="block text-xs font-bold text-[#D2D7DF]">
                انتخاب ویژگی <span className="text-[#FF6A00]">*</span>
              </label>
              <select
                id={optionSelectId}
                disabled={isPending}
                value={selectedOptionId}
                onChange={(e) => handleOptionChange(e.target.value)}
                className={inputClassName(false)}
              >
                {availableOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name} ({opt.type})
                  </option>
                ))}
              </select>
              {selectedOption?.description && (
                <p className="text-xs text-[#8B93A1]">{selectedOption.description}</p>
              )}
            </div>

            {selectedOption && (
              <div className="space-y-2">
                <label htmlFor={valueId} className="block text-xs font-bold text-[#D2D7DF]">
                  مقدار ویژگی <span className="text-[#FF6A00]">*</span>
                </label>

                {selectedOption.type === "text" && (
                  <input
                    id={valueId}
                    type="text"
                    disabled={isPending}
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    placeholder={selectedOption.placeholder || "مقدار را بنویسید..."}
                    className={inputClassName(false)}
                  />
                )}

                {selectedOption.type === "select" && (
                  <select
                    id={valueId}
                    disabled={isPending}
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    className={inputClassName(false)}
                  >
                    <option value="">انتخاب کنید...</option>
                    {selectedOption.optionItems?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                )}

                {selectedOption.type === "checkbox" && (
                  <div className="flex items-center gap-4 py-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="checkbox_val"
                        value="1"
                        checked={val === "1" || val === ""}
                        onChange={() => setVal("1")}
                        className="accent-[#FF6A00]"
                        disabled={isPending}
                      />
                      <span className="text-sm text-[#F5F5F5]">بله</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="checkbox_val"
                        value="0"
                        checked={val === "0"}
                        onChange={() => setVal("0")}
                        className="accent-[#FF6A00]"
                        disabled={isPending}
                      />
                      <span className="text-sm text-[#F5F5F5]">خیر</span>
                    </label>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </form>
    </Modal>
  );
}
