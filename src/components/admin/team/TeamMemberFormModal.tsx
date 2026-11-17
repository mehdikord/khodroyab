"use client";

import React, { useEffect, useId, useRef, useState, useTransition } from "react";
import { AlertCircle, ImagePlus, ListOrdered, Loader2, Trash2, UserRound } from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import { Toggle } from "@/components/admin/ui/Toggle";
import { createTeamMemberAction, updateTeamMemberAction } from "@/app/admin/(panel)/team/actions";
import type { TeamMemberRecord } from "@/lib/team";
import { TEAM_BIO_MAX_LENGTH, TEAM_NAME_MAX_LENGTH, TEAM_POSITION_MAX_LENGTH } from "@/lib/validation/team";
import { cn, toPersianDigits } from "@/lib/utils";

interface TeamMemberFormModalProps {
  mode: "create" | "edit";
  member: TeamMemberRecord | null;
  /** Position a new member gets when the order field is left blank. */
  nextOrder: number;
  onClose: () => void;
  onSuccess: (record: TeamMemberRecord) => void;
  onError: (message: string) => void;
}

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20"
  );

/** Create/Edit modal for a team member: photo (upload or URL), name, role, bio, display order and visibility. */
export function TeamMemberFormModal({ mode, member, nextOrder, onClose, onSuccess, onError }: TeamMemberFormModalProps) {
  const isEdit = mode === "edit";
  const nameId = useId();
  const positionId = useId();
  const bioId = useId();
  const orderId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(member?.name ?? "");
  const [position, setPosition] = useState(member?.position ?? "");
  const [bio, setBio] = useState(member?.bio ?? "");
  const [photo, setPhoto] = useState(member?.photo ?? "");
  const [sortOrder, setSortOrder] = useState(member ? String(member.sortOrder) : "");
  const [isActive, setIsActive] = useState(member?.isActive ?? true);
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

  const preview = filePreview || photo || null;

  function clearError(key: string) {
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    clearError("photoFile");
    if (file && file.size > MAX_PHOTO_BYTES) {
      setFieldErrors((prev) => ({ ...prev, photoFile: "حجم عکس نباید بیشتر از ۲ مگابایت باشد" }));
      event.target.value = "";
      return;
    }
    setSelectedFile(file);
    if (file) setPhoto("");
  }

  function clearPhoto() {
    setSelectedFile(null);
    setPhoto("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("position", position);
    formData.set("bio", bio);
    formData.set("photo", selectedFile ? "" : photo);
    formData.set("sortOrder", sortOrder);
    formData.set("isActive", String(isActive));
    if (selectedFile) formData.set("photoFile", selectedFile);

    startTransition(async () => {
      const result = isEdit ? await updateTeamMemberAction(member!.id, formData) : await createTeamMemberAction(formData);
      if (result.ok) {
        onSuccess(result.record);
      } else {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setFormError(result.message);
        onError(result.message);
      }
    });
  }

  const photoError = fieldErrors.photoFile || fieldErrors.photo;

  return (
    <Modal
      open
      onClose={isPending ? () => undefined : onClose}
      title={isEdit ? "ویرایش عضو تیم" : "افزودن عضو جدید"}
      description={isEdit ? `به‌روزرسانی اطلاعات «${member?.name ?? ""}»` : "عضو جدید در بخش تیم صفحه «درباره خودرویاب» نمایش داده می‌شود"}
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
            form="team-member-form"
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
              "افزودن عضو"
            )}
          </button>
        </>
      }
    >
      <form id="team-member-form" onSubmit={handleSubmit} noValidate aria-busy={isPending} className="space-y-5">
        {formError && (
          <div
            role="alert"
            className="admin-animate-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-200"
          >
            <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-red-400" />
            <span className="leading-6">{formError}</span>
          </div>
        )}

        {/* Photo */}
        <div className="space-y-2">
          <span className="block text-sm font-semibold text-[#F5F5F5]">
            عکس <span className="text-[#FF6A00]">*</span>
          </span>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              aria-label="انتخاب فایل عکس"
              className={cn(
                "group relative flex aspect-[4/5] w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border transition-colors",
                preview ? "border-white/[0.1] bg-[#0A0D12]" : "border-dashed border-white/[0.18] bg-[#07090C] hover:border-[#FF6A00]/50",
                photoError && "border-red-500/50"
              )}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="پیش‌نمایش عکس" className="h-full w-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-1.5 text-[#5E6672] transition-colors group-hover:text-[#FF8A2A]">
                  <UserRound className="h-7 w-7" />
                  <span className="text-[10px] font-semibold">انتخاب عکس</span>
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
                  {preview ? "جایگزینی عکس" : "بارگذاری عکس"}
                  <span className="rounded-md bg-black/25 px-1.5 py-0.5 font-mono text-[10px] text-[#FFB37A]">تا ۲MB</span>
                </button>
                {preview && (
                  <button
                    type="button"
                    onClick={clearPhoto}
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
                  value={selectedFile ? "" : photo}
                  onChange={(e) => {
                    setSelectedFile(null);
                    setPhoto(e.target.value);
                    clearError("photo");
                    clearError("photoFile");
                  }}
                  placeholder="https://… یا /uploads/…"
                  autoComplete="off"
                  disabled={isPending}
                  aria-label="آدرس عکس"
                  className={cn(inputClassName(Boolean(fieldErrors.photo)), "h-10 pr-10 font-mono text-xs")}
                />
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[10px] font-semibold text-[#5E6672]">URL</span>
              </div>
            </div>
          </div>
          {photoError ? (
            <p className="text-xs text-red-400">{photoError}</p>
          ) : (
            <p className="text-[11px] text-[#5E6672]">PNG، JPG، WebP یا AVIF — عکس عمودی (نسبت ۴ به ۵) با چهره در مرکز بهترین نتیجه را دارد.</p>
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

        {/* Name + position */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor={nameId} className="block text-sm font-semibold text-[#F5F5F5]">
              نام <span className="text-[#FF6A00]">*</span>
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
              maxLength={TEAM_NAME_MAX_LENGTH}
              placeholder="مثلاً: علی رضایی"
              autoComplete="off"
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.name)}
              className={inputClassName(Boolean(fieldErrors.name))}
            />
            {fieldErrors.name && <p className="text-xs text-red-400">{fieldErrors.name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor={positionId} className="block text-sm font-semibold text-[#F5F5F5]">
              سمت در مجموعه <span className="text-[#FF6A00]">*</span>
            </label>
            <input
              id={positionId}
              type="text"
              value={position}
              onChange={(e) => {
                setPosition(e.target.value);
                clearError("position");
              }}
              maxLength={TEAM_POSITION_MAX_LENGTH}
              placeholder="مثلاً: مدیر فروش"
              autoComplete="off"
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.position)}
              className={inputClassName(Boolean(fieldErrors.position))}
            />
            {fieldErrors.position && <p className="text-xs text-red-400">{fieldErrors.position}</p>}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor={bioId} className="block text-sm font-semibold text-[#F5F5F5]">
              توضیحات <span className="text-xs font-normal text-[#5E6672]">(اختیاری)</span>
            </label>
            <span className={cn("font-mono text-[11px]", bio.length > TEAM_BIO_MAX_LENGTH ? "text-red-400" : "text-[#5E6672]")}>
              {toPersianDigits(bio.length)} / {toPersianDigits(TEAM_BIO_MAX_LENGTH)}
            </span>
          </div>
          <textarea
            id={bioId}
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
              clearError("bio");
            }}
            rows={4}
            maxLength={TEAM_BIO_MAX_LENGTH}
            placeholder="یک یا دو جمله درباره سابقه و نقش این فرد در خودرو یاب"
            disabled={isPending}
            aria-invalid={Boolean(fieldErrors.bio)}
            className={cn(inputClassName(Boolean(fieldErrors.bio)), "h-auto resize-y py-3 leading-7")}
          />
          {fieldErrors.bio && <p className="text-xs text-red-400">{fieldErrors.bio}</p>}
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
            <p className="text-sm font-bold text-[#F5F5F5]">نمایش در صفحه درباره ما</p>
            <p className="mt-0.5 text-[11px] text-[#5E6672]">عضو غیرفعال نمایش داده نمی‌شود اما اطلاعاتش حفظ می‌شود.</p>
          </div>
          <Toggle checked={isActive} onCheckedChange={setIsActive} label="وضعیت نمایش عضو تیم" disabled={isPending} />
        </div>
      </form>
    </Modal>
  );
}
