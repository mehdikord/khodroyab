"use client";

import React, { useEffect, useId, useRef, useState, useTransition } from "react";
import { AlertCircle, ImagePlus, ListOrdered, Loader2, Trash2 } from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import { Toggle } from "@/components/admin/ui/Toggle";
import { createSponsorAction, updateSponsorAction } from "@/app/admin/(panel)/sponsors/actions";
import type { SponsorRecord } from "@/lib/sponsors";
import { cn, toPersianDigits } from "@/lib/utils";

interface SponsorFormModalProps {
  mode: "create" | "edit";
  sponsor: SponsorRecord | null;
  /** Position a new sponsor gets when the order field is left blank. */
  nextOrder: number;
  onClose: () => void;
  onSuccess: (record: SponsorRecord) => void;
  onError: (message: string) => void;
}

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20"
  );

/** Create/Edit modal for a sponsor: name, logo (upload or URL), display order and active flag. */
export function SponsorFormModal({ mode, sponsor, nextOrder, onClose, onSuccess, onError }: SponsorFormModalProps) {
  const isEdit = mode === "edit";
  const nameId = useId();
  const orderId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(sponsor?.name ?? "");
  const [logo, setLogo] = useState(sponsor?.logo ?? "");
  const [sortOrder, setSortOrder] = useState(sponsor ? String(sponsor.sortOrder) : "");
  const [isActive, setIsActive] = useState(sponsor?.isActive ?? true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!selectedFile) {
      setFilePreview(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const preview = filePreview || logo || null;

  function clearError(key: string) {
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    clearError("logoFile");
    if (file && file.size > 2 * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, logoFile: "حجم لوگو نباید بیشتر از ۲ مگابایت باشد" }));
      event.target.value = "";
      return;
    }
    setSelectedFile(file);
    if (file) setLogo("");
  }

  function clearLogo() {
    setSelectedFile(null);
    setLogo("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("logo", selectedFile ? "" : logo);
    formData.set("sortOrder", sortOrder);
    formData.set("isActive", String(isActive));
    if (selectedFile) formData.set("logoFile", selectedFile);

    startTransition(async () => {
      const result = isEdit ? await updateSponsorAction(sponsor!.id, formData) : await createSponsorAction(formData);
      if (result.ok) {
        onSuccess(result.record);
      } else {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setFormError(result.message);
        onError(result.message);
      }
    });
  }

  const logoError = fieldErrors.logoFile || fieldErrors.logo;

  return (
    <Modal
      open
      onClose={isPending ? () => undefined : onClose}
      title={isEdit ? "ویرایش حامی" : "افزودن حامی جدید"}
      description={isEdit ? `به‌روزرسانی اطلاعات «${sponsor?.name ?? ""}»` : "حامی جدید در نوار حامیان صفحه ورود کاربران نمایش داده می‌شود"}
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
            form="sponsor-form"
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
              "افزودن حامی"
            )}
          </button>
        </>
      }
    >
      <form id="sponsor-form" onSubmit={handleSubmit} noValidate aria-busy={isPending} className="space-y-5">
        {formError && (
          <div
            role="alert"
            className="admin-animate-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-200"
          >
            <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-red-400" />
            <span className="leading-6">{formError}</span>
          </div>
        )}

        {/* Logo */}
        <div className="space-y-2">
          <span className="block text-sm font-semibold text-[#F5F5F5]">
            لوگو <span className="text-[#FF6A00]">*</span>
          </span>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              aria-label="انتخاب فایل لوگو"
              className={cn(
                "group relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border transition-colors",
                preview ? "border-white/[0.1] bg-white p-2.5" : "border-dashed border-white/[0.18] bg-[#07090C] hover:border-[#FF6A00]/50",
                logoError && "border-red-500/50"
              )}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="پیش‌نمایش لوگو" className="h-full w-full object-contain" />
              ) : (
                <span className="flex flex-col items-center gap-1.5 text-[#5E6672] transition-colors group-hover:text-[#FF8A2A]">
                  <ImagePlus className="h-7 w-7" />
                  <span className="text-[10px] font-semibold">انتخاب لوگو</span>
                </span>
              )}
            </button>

            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-4 text-xs font-bold text-[#FF8A2A] transition-colors hover:bg-[#FF6A00]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ImagePlus className="h-4 w-4" />
                  {preview ? "جایگزینی لوگو" : "بارگذاری لوگو"}
                  <span className="rounded-md bg-black/25 px-1.5 py-0.5 font-mono text-[10px] text-[#FFB37A]">تا ۲MB</span>
                </button>
                {preview && (
                  <button
                    type="button"
                    onClick={clearLogo}
                    disabled={isPending}
                    className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 text-xs font-bold text-red-300 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    حذف
                  </button>
                )}
              </div>
              {selectedFile && <p className="truncate font-mono text-[11px] text-[#8B93A1]">{selectedFile.name}</p>}
              <div className="relative">
                <input
                  type="url"
                  dir="ltr"
                  value={selectedFile ? "" : logo}
                  onChange={(e) => {
                    setSelectedFile(null);
                    setLogo(e.target.value);
                    clearError("logo");
                    clearError("logoFile");
                  }}
                  placeholder="https://… یا /uploads/…"
                  autoComplete="off"
                  disabled={isPending}
                  aria-label="آدرس لوگو"
                  className={cn(inputClassName(Boolean(fieldErrors.logo)), "h-10 pr-10 font-mono text-xs")}
                />
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[10px] font-semibold text-[#5E6672]">URL</span>
              </div>
            </div>
          </div>
          {logoError ? (
            <p className="text-xs text-red-400">{logoError}</p>
          ) : (
            <p className="text-[11px] text-[#5E6672]">PNG، JPG، WebP یا AVIF — لوگو روی زمینه سفید نمایش داده می‌شود؛ تصویر مربعی یا افقی با پس‌زمینه شفاف بهترین نتیجه را دارد.</p>
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

        {/* Name */}
        <div className="space-y-2">
          <label htmlFor={nameId} className="block text-sm font-semibold text-[#F5F5F5]">
            نام حامی <span className="text-[#FF6A00]">*</span>
          </label>
          <input
            id={nameId}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError("name");
            }}
            data-autofocus
            maxLength={120}
            placeholder="مثلاً: بیمه پارسیان"
            autoComplete="off"
            disabled={isPending}
            aria-invalid={Boolean(fieldErrors.name)}
            className={inputClassName(Boolean(fieldErrors.name))}
          />
          {fieldErrors.name && <p className="text-xs text-red-400">{fieldErrors.name}</p>}
        </div>

        {/* Order */}
        <div className="space-y-2">
          <label htmlFor={orderId} className="flex items-center gap-1.5 text-sm font-semibold text-[#F5F5F5]">
            <ListOrdered className="h-4 w-4 text-[#FF8A2A]" />
            ترتیب نمایش
          </label>
          <input
            id={orderId}
            type="text"
            inputMode="numeric"
            dir="ltr"
            value={toPersianDigits(sortOrder)}
            onChange={(e) => {
              setSortOrder(
                e.target.value
                  .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
                  .replace(/[^\d]/g, "")
                  .slice(0, 4)
              );
              clearError("sortOrder");
            }}
            placeholder={isEdit ? "" : `خودکار (${toPersianDigits(nextOrder)})`}
            disabled={isPending}
            aria-invalid={Boolean(fieldErrors.sortOrder)}
            className={cn(inputClassName(Boolean(fieldErrors.sortOrder)), "text-left font-mono placeholder:text-right placeholder:font-sans")}
          />
          {fieldErrors.sortOrder ? (
            <p className="text-xs text-red-400">{fieldErrors.sortOrder}</p>
          ) : (
            <p className="text-[11px] text-[#5E6672]">عدد کوچک‌تر زودتر نمایش داده می‌شود. ترتیب را از جدول هم می‌توانید با فلش‌ها تغییر دهید.</p>
          )}
        </div>

        {/* Active */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0A0D12] px-4 py-3.5">
          <div>
            <p className="text-sm font-bold text-[#F5F5F5]">نمایش در صفحه ورود</p>
            <p className="mt-0.5 text-[11px] text-[#5E6672]">حامی غیرفعال در نوار حامیان نمایش داده نمی‌شود اما اطلاعاتش حفظ می‌شود.</p>
          </div>
          <Toggle checked={isActive} onCheckedChange={setIsActive} label="وضعیت فعال حامی" disabled={isPending} />
        </div>
      </form>
    </Modal>
  );
}
