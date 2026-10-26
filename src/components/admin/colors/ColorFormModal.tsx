"use client";

import React, { useId, useState, useTransition } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import {
  createColorAction,
  updateColorAction,
} from "@/app/admin/(panel)/colors/actions";
import type { ColorRecord } from "@/lib/colors";
import { COLOR_CODE_PATTERN } from "@/lib/colors-shared";
import { cn } from "@/lib/utils";

interface ColorFormModalProps {
  mode: "create" | "edit";
  color: ColorRecord | null;
  onClose: () => void;
  onSuccess: (record: ColorRecord) => void;
  onError: (message: string) => void;
}

const DEFAULT_CODE = "#ffffff";

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20"
  );

export function ColorFormModal({
  mode,
  color,
  onClose,
  onSuccess,
  onError,
}: ColorFormModalProps) {
  const isEdit = mode === "edit";
  const nameId = useId();
  const codeId = useId();

  const [name, setName] = useState(color?.name ?? "");
  const [code, setCode] = useState(color?.code ?? DEFAULT_CODE);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // The native picker only accepts a complete #rrggbb value.
  const pickerValue = COLOR_CODE_PATTERN.test(code) ? code.toLowerCase() : DEFAULT_CODE;

  function handleCodeInput(value: string) {
    const trimmed = value.trim();
    setCode(trimmed && !trimmed.startsWith("#") ? `#${trimmed}` : trimmed);
    setFieldErrors((prev) => ({ ...prev, code: "" }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("code", code);

    startTransition(async () => {
      const result = isEdit
        ? await updateColorAction(color!.id, formData)
        : await createColorAction(formData);

      if (result.ok) {
        onSuccess(result.record);
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        setFormError(result.message);
        onError(result.message);
      }
    });
  }

  return (
    <Modal
      open
      onClose={isPending ? () => undefined : onClose}
      title={isEdit ? "ویرایش رنگ" : "ایجاد رنگ جدید"}
      description={
        isEdit
          ? `به‌روزرسانی اطلاعات رنگ «${name}»`
          : "رنگ جدیدی به فهرست رنگ‌ها اضافه کنید"
      }
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
            form="color-form"
            disabled={isPending}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 hover:shadow-[0_0_36px_rgba(255,106,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isPending ? (
              <>
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
                {isEdit ? "در حال ذخیره…" : "در حال ایجاد…"}
              </>
            ) : isEdit ? (
              "ذخیره تغییرات"
            ) : (
              "ایجاد رنگ"
            )}
          </button>
        </>
      }
    >
      <form
        id="color-form"
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isPending}
        className="space-y-5"
      >
        {formError && (
          <div
            role="alert"
            className="admin-animate-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-200"
          >
            <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-red-400" />
            <span className="leading-6">{formError}</span>
          </div>
        )}

        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor={nameId}
            className="block text-sm font-semibold text-[#F5F5F5]"
          >
            نام رنگ <span className="text-[#FF6A00]">*</span>
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, name: "" }));
            }}
            data-autofocus
            placeholder="مثلاً: سفید، مشکی، نقره‌ای"
            autoComplete="off"
            disabled={isPending}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? `${nameId}-error` : undefined}
            className={inputClassName(Boolean(fieldErrors.name))}
          />
          {fieldErrors.name && (
            <p id={`${nameId}-error`} className="text-xs text-red-400">
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* Code */}
        <div className="space-y-2">
          <label
            htmlFor={codeId}
            className="block text-sm font-semibold text-[#F5F5F5]"
          >
            کد رنگ <span className="text-[#FF6A00]">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={pickerValue}
              onChange={(e) => handleCodeInput(e.target.value)}
              disabled={isPending}
              aria-label="انتخاب رنگ از پالت"
              className="h-12 w-14 shrink-0 cursor-pointer rounded-xl border border-white/[0.12] bg-[#07090C] p-1.5 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <input
              id={codeId}
              name="code"
              type="text"
              value={code}
              onChange={(e) => handleCodeInput(e.target.value)}
              dir="ltr"
              maxLength={7}
              placeholder="#FFFFFF"
              autoComplete="off"
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.code)}
              aria-describedby={fieldErrors.code ? `${codeId}-error` : undefined}
              className={cn(inputClassName(Boolean(fieldErrors.code)), "font-mono uppercase")}
            />
          </div>
          <p className="text-[11px] text-[#5E6672]">
            از پالت انتخاب کنید یا کد هگز رنگ را به شکل #RRGGBB وارد کنید.
          </p>
          {fieldErrors.code && (
            <p id={`${codeId}-error`} className="text-xs text-red-400">
              {fieldErrors.code}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
