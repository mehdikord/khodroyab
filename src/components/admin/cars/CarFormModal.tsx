"use client";

import React, { useId, useState, useTransition } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import { createCarAction, updateCarAction } from "@/app/admin/(panel)/cars/actions";
import type { CarRecord } from "@/lib/cars";
import type { BrandRecord } from "@/lib/brands";
import type { CarTypeRecord } from "@/lib/car-types";
import { cn } from "@/lib/utils";

interface CarFormModalProps {
  mode: "create" | "edit";
  car: CarRecord | null;
  brands: BrandRecord[];
  carTypes: CarTypeRecord[];
  onClose: () => void;
  onSuccess: (record: CarRecord) => void;
  onError: (message: string) => void;
}

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20"
  );

export function CarFormModal({
  mode,
  car,
  brands,
  carTypes,
  onClose,
  onSuccess,
  onError,
}: CarFormModalProps) {
  const isEdit = mode === "edit";
  const nameId = useId();
  const slugId = useId();
  const brandIdId = useId();
  const carTypeIdId = useId();
  const modelId = useId();

  const [name, setName] = useState(car?.name ?? "");
  const [slug, setSlug] = useState(car?.slug ?? "");
  const [brandId, setBrandId] = useState(car?.brandId ?? (brands[0]?.id || ""));
  const [carTypeId, setCarTypeId] = useState(car?.carTypeId ?? (carTypes[0]?.id || ""));
  const [model, setModel] = useState(car?.model ?? "");

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
    formData.set("brandId", brandId);
    formData.set("carTypeId", carTypeId);
    formData.set("model", model);

    startTransition(async () => {
      const result = isEdit
        ? await updateCarAction(car!.id, formData)
        : await createCarAction(formData);

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
      title={isEdit ? "ویرایش خودرو" : "ایجاد خودرو جدید"}
      description={
        isEdit
          ? `به‌روزرسانی مشخصات خودرو «${name}»`
          : "مشخصات خودرو جدید را جهت افزودن به سیستم وارد کنید"
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
            form="car-form"
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
              "ایجاد خودرو"
            )}
          </button>
        </>
      }
    >
      <form id="car-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-semibold text-red-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor={nameId} className="block text-xs font-bold text-[#D2D7DF]">
            نام خودرو <span className="text-[#FF6A00]">*</span>
          </label>
          <input
            id={nameId}
            type="text"
            required
            disabled={isPending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: پورشه باکستر"
            className={inputClassName(Boolean(fieldErrors.name))}
          />
          {fieldErrors.name && (
            <p className="text-xs font-semibold text-red-400">{fieldErrors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor={brandIdId} className="block text-xs font-bold text-[#D2D7DF]">
              برند <span className="text-[#FF6A00]">*</span>
            </label>
            <select
              id={brandIdId}
              disabled={isPending}
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className={inputClassName(Boolean(fieldErrors.brandId))}
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor={carTypeIdId} className="block text-xs font-bold text-[#D2D7DF]">
              نوع خودرو <span className="text-[#FF6A00]">*</span>
            </label>
            <select
              id={carTypeIdId}
              disabled={isPending}
              value={carTypeId}
              onChange={(e) => setCarTypeId(e.target.value)}
              className={inputClassName(Boolean(fieldErrors.carTypeId))}
            >
              {carTypes.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor={modelId} className="block text-xs font-bold text-[#D2D7DF]">
            مدل <span className="text-[#FF6A00]">*</span>
          </label>
          <input
            id={modelId}
            type="text"
            required
            disabled={isPending}
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="مثال: 718"
            className={inputClassName(Boolean(fieldErrors.model))}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={slugId} className="block text-xs font-bold text-[#D2D7DF]">
            اسلاگ (اختیاری)
          </label>
          <input
            id={slugId}
            type="text"
            disabled={isPending}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="در صورت خالی بودن خودکار تولید می‌شود"
            className={inputClassName(Boolean(fieldErrors.slug))}
          />
        </div>
      </form>
    </Modal>
  );
}
