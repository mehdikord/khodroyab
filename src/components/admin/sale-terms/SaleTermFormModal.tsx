"use client";

import React, { useRef, useState, useTransition } from "react";
import { AlertCircle, ImagePlus, Loader2 } from "lucide-react";
import { Modal } from "@/components/admin/ui/Modal";
import { Toggle } from "@/components/admin/ui/Toggle";
import { createSaleTermAction, updateSaleTermAction } from "@/app/admin/(panel)/sale-terms/actions";
import type { SaleTermRecord } from "@/lib/sale-terms";
import { cn } from "@/lib/utils";

interface SaleTermFormModalProps {
  mode: "create" | "edit";
  term: SaleTermRecord | null;
  onClose: () => void;
  onSuccess: (record: SaleTermRecord) => void;
  onError: (message: string) => void;
}

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672]",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
  );

export function SaleTermFormModal({
  mode,
  term,
  onClose,
  onSuccess,
  onError,
}: SaleTermFormModalProps) {
  const isEdit = mode === "edit";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(term?.image ?? null);
  const [isActive, setIsActive] = useState<boolean>(term?.isActive ?? true);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const formData = new FormData(event.currentTarget);
    formData.set("isActive", String(isActive));
    if (selectedFile) formData.set("imageFile", selectedFile);

    startTransition(async () => {
      const result = isEdit
        ? await updateSaleTermAction(term!.id, formData)
        : await createSaleTermAction(formData);

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
      onClose={onClose}
      title={isEdit ? "ویرایش شرایط فروش" : "ایجاد شرایط فروش جدید"}
      size="md"
    >
      <form id="sale-term-form" onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <span>{formError}</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#F5F5F5]">
            عنوان <span className="text-[#FF6A00]">*</span>
          </label>
          <input
            name="title"
            type="text"
            defaultValue={term?.title}
            required
            placeholder="مثلاً: نقدی، اقساطی ۲۴ ماهه"
            className={inputClassName(false)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#F5F5F5]">
            توضیحات
          </label>
          <textarea
            name="description"
            defaultValue={term?.description || ""}
            placeholder="توضیحات مختصر در مورد شرایط فروش..."
            className={cn(inputClassName(false), "h-24 py-3 resize-none")}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#F5F5F5]">
            تصویر یا آیکون
          </label>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.1] bg-[#07090C]">
              {previewUrl ? (
                <img src={previewUrl} className="h-full w-full object-cover" alt="Preview" />
              ) : (
                <ImagePlus className="text-gray-500" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-[#D2D7DF] hover:bg-white/10"
            >
              انتخاب تصویر
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#0A0D12] p-4">
          <div>
            <p className="text-sm font-bold text-[#F5F5F5]">وضعیت فعال‌سازی</p>
            <p className="text-xs text-[#5E6672]">آیا این شرط فروش فعال و قابل انتخاب باشد؟</p>
          </div>
          <Toggle checked={isActive} onCheckedChange={setIsActive} label="فعال" />
        </div>
      </form>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl px-4 py-2 text-sm text-[#D2D7DF] hover:bg-white/5"
        >
          انصراف
        </button>
        <button
          form="sale-term-form"
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 py-2.5 text-sm font-bold text-[#07090C] hover:brightness-110 disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "ذخیره تغییرات" : "ایجاد شرایط فروش"}
        </button>
      </div>
    </Modal>
  );
}
