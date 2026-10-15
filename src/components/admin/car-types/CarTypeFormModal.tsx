"use client";

import React, { useId, useState, useTransition } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import {
  createCarTypeAction,
  updateCarTypeAction,
} from "@/app/admin/(panel)/car-types/actions";
import type { CarTypeRecord } from "@/lib/car-types";
import { cn } from "@/lib/utils";

interface CarTypeFormModalProps {
  mode: "create" | "edit";
  carType: CarTypeRecord | null;
  onClose: () => void;
  onSuccess: (record: CarTypeRecord) => void;
  onError: (message: string) => void;
}

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20"
  );

export function CarTypeFormModal({
  mode,
  carType,
  onClose,
  onSuccess,
  onError,
}: CarTypeFormModalProps) {
  const isEdit = mode === "edit";
  const nameId = useId();
  const slugId = useId();
  const descriptionId = useId();

  const [name, setName] = useState(carType?.name ?? "");
  const [slug, setSlug] = useState(carType?.slug ?? "");
  const [description, setDescription] = useState(carType?.description ?? "");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("description", description);

    startTransition(async () => {
      const result = isEdit
        ? await updateCarTypeAction(carType!.id, formData)
        : await createCarTypeAction(formData);

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
      title={isEdit ? "ویرایش نوع خودرو" : "ایجاد نوع خودرو جدید"}
      description={
        isEdit
          ? `به‌روزرسانی اطلاعات نوع خودرو «${name}»`
          : "نوع خودروی جدیدی به فهرست اضافه کنید"
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
            form="car-type-form"
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
              "ایجاد نوع خودرو"
            )}
          </button>
        </>
      }
    >
      <form
        id="car-type-form"
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
            نام نوع خودرو <span className="text-[#FF6A00]">*</span>
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
            placeholder="مثلاً: سدان، شاسی‌بلند (SUV)، هاچ‌بک، کوپه"
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

        {/* Slug */}
        <div className="space-y-2">
          <label
            htmlFor={slugId}
            className="block text-sm font-semibold text-[#F5F5F5]"
          >
            اسلاگ
          </label>
          <input
            id={slugId}
            name="slug"
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setFieldErrors((prev) => ({ ...prev, slug: "" }));
            }}
            dir="ltr"
            placeholder="خودکار از نام نوع خودرو ساخته می‌شود"
            autoComplete="off"
            disabled={isPending}
            aria-invalid={Boolean(fieldErrors.slug)}
            aria-describedby={fieldErrors.slug ? `${slugId}-error` : undefined}
            className={cn(inputClassName(Boolean(fieldErrors.slug)), "font-mono")}
          />
          <p className="text-[11px] text-[#5E6672]">
            در صورت خالی بودن، اسلاگ به‌صورت خودکار از نام نوع خودرو ساخته می‌شود.
          </p>
          {fieldErrors.slug && (
            <p id={`${slugId}-error`} className="text-xs text-red-400">
              {fieldErrors.slug}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor={descriptionId}
            className="block text-sm font-semibold text-[#F5F5F5]"
          >
            توضیحات
          </label>
          <textarea
            id={descriptionId}
            name="description"
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setFieldErrors((prev) => ({ ...prev, description: "" }));
            }}
            placeholder="توضیحات مختصر در مورد این دسته‌بندی بدنه یا نوع خودرو…"
            disabled={isPending}
            aria-invalid={Boolean(fieldErrors.description)}
            aria-describedby={fieldErrors.description ? `${descriptionId}-error` : undefined}
            className={cn(
              "w-full rounded-xl border bg-[#07090C] p-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60 resize-none",
              "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
              fieldErrors.description
                ? "border-red-500/50"
                : "border-white/[0.12] hover:border-white/20"
            )}
          />
          {fieldErrors.description && (
            <p id={`${descriptionId}-error`} className="text-xs text-red-400">
              {fieldErrors.description}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
