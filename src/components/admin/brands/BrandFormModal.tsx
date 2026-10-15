"use client";

import React, { useEffect, useId, useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  ImagePlus,
  Loader2,
  Trash2,
} from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import { Toggle } from "@/components/admin/ui/Toggle";
import {
  createBrandAction,
  updateBrandAction,
} from "@/app/admin/(panel)/brands/actions";
import type { BrandRecord } from "@/lib/brands";
import { cn } from "@/lib/utils";

interface BrandFormModalProps {
  mode: "create" | "edit";
  brand: BrandRecord | null;
  onClose: () => void;
  onSuccess: (record: BrandRecord) => void;
  onError: (message: string) => void;
}

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20"
  );

/**
 * Create/Edit modal for brands. Managed entirely via local state (no
 * uncontrolled inputs) so validation feedback and the image preview can be
 * rendered immediately.
 */
export function BrandFormModal({
  mode,
  brand,
  onClose,
  onSuccess,
  onError,
}: BrandFormModalProps) {
  const isEdit = mode === "edit";
  const nameId = useId();
  const slugId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(brand?.name ?? "");
  const [slug, setSlug] = useState(brand?.slug ?? "");
  const [image, setImage] = useState(brand?.image ?? "");
  const [isActive, setIsActive] = useState(brand?.isActive ?? true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(brand?.image ?? null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Revoke object URLs when the selected file changes.
  useEffect(() => {
    if (!selectedFile) return;
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setFieldErrors((prev) => ({ ...prev, imageFile: "" }));
    if (!file) {
      setPreviewUrl(brand?.image ?? null);
    }
  }

  function clearImage() {
    setSelectedFile(null);
    setImage("");
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("image", image);
    formData.set("isActive", String(isActive));
    if (selectedFile) {
      formData.set("imageFile", selectedFile);
    }

    startTransition(async () => {
      const result = isEdit
        ? await updateBrandAction(brand!.id, formData)
        : await createBrandAction(formData);

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

  const preview = previewUrl || image || null;

  return (
    <Modal
      open
      onClose={isPending ? () => undefined : onClose}
      title={isEdit ? "ویرایش برند" : "ایجاد برند جدید"}
      description={
        isEdit
          ? `به‌روزرسانی اطلاعات برند «${name}»`
          : "برند جدیدی به فهرست کاتالوگ اضافه کنید"
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
            form="brand-form"
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
              "ایجاد برند"
            )}
          </button>
        </>
      }
    >
      <form
        id="brand-form"
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
            نام برند <span className="text-[#FF6A00]">*</span>
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
            placeholder="مثلاً: مرسدس‌بنز، تویوتا، پورشه"
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
            placeholder="خودکار از نام برند ساخته می‌شود"
            autoComplete="off"
            disabled={isPending}
            aria-invalid={Boolean(fieldErrors.slug)}
            aria-describedby={fieldErrors.slug ? `${slugId}-error` : undefined}
            className={cn(inputClassName(Boolean(fieldErrors.slug)), "font-mono")}
          />
          <p className="text-[11px] text-[#5E6672]">
            در صورت خالی بودن، اسلاگ به‌صورت خودکار از نام برند ساخته می‌شود.
          </p>
          {fieldErrors.slug && (
            <p id={`${slugId}-error`} className="text-xs text-red-400">
              {fieldErrors.slug}
            </p>
          )}
        </div>

        {/* Image */}
        <div className="space-y-2">
          <span className="block text-sm font-semibold text-[#F5F5F5]">
            تصویر برند
          </span>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Thumbnail / preview */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.1] bg-[#07090C]">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="پیش‌نمایش لوگوی برند"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-[#42505F]">
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-[10px] font-semibold">بدون تصویر</span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              {/* Upload button */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-4 text-xs font-bold text-[#FF8A2A] transition-colors hover:bg-[#FF6A00]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ImagePlus className="h-4 w-4" />
                  {isEdit && brand?.image ? "جایگزینی تصویر" : "بارگذاری تصویر"}
                  <span className="rounded-md bg-black/25 px-1.5 py-0.5 font-mono text-[10px] text-[#FFB37A]">
                    تا ۲MB
                  </span>
                </button>
                {selectedFile && (
                  <span className="truncate font-mono text-[11px] text-[#8B93A1]">
                    {selectedFile.name}
                  </span>
                )}
                {preview && (
                  <button
                    type="button"
                    onClick={clearImage}
                    disabled={isPending}
                    className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 text-xs font-bold text-red-300 transition-colors hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    حذف
                  </button>
                )}
              </div>

              {/* URL alternative */}
              <div className="relative">
                <input
                  type="url"
                  dir="ltr"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, image: "" }));
                  }}
                  placeholder="https://… یا /uploads/…"
                  autoComplete="off"
                  disabled={isPending}
                  aria-invalid={Boolean(fieldErrors.image)}
                  aria-describedby={fieldErrors.image ? "image-error" : undefined}
                  className={cn(
                    inputClassName(Boolean(fieldErrors.image)),
                    "pr-10 font-mono text-xs"
                  )}
                />
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[10px] font-semibold text-[#5E6672]">
                  URL
                </span>
              </div>
            </div>
          </div>

          {fieldErrors.imageFile || fieldErrors.image ? (
            <p className="text-xs text-red-400">
              {fieldErrors.imageFile || fieldErrors.image}
            </p>
          ) : (
            <p className="text-[11px] text-[#5E6672]">
              می‌توانید فایل تصویر بارگذاری کنید یا آدرس اینترنتی (یا مسیر
              محلی) تصویر را وارد کنید.
            </p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={handleFileChange}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>

        {/* Active */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0A0D12] px-4 py-3.5">
          <div>
            <p className="text-sm font-bold text-[#F5F5F5]">برند فعال</p>
            <p className="mt-0.5 text-[11px] text-[#5E6672]">
              برند غیرفعال در فهرست نمایش داده نمی‌شود اما اطلاعات آن حفظ می‌شود.
            </p>
          </div>
          <Toggle
            checked={isActive}
            onCheckedChange={setIsActive}
            label="وضعیت فعال برند"
            disabled={isPending}
          />
        </div>
      </form>
    </Modal>
  );
}