"use client";

import React, { useEffect, useId, useRef, useState, useTransition } from "react";
import { Camera, Save, Trash2 } from "lucide-react";

import { updateProfileAction } from "@/app/panel/(app)/profile/actions";
import { displayNationalCode, type ProfileRecord } from "@/lib/profile";
import { cn, toPersianDigits } from "@/lib/utils";
import { SafeImage } from "@/components/panel/SafeImage";
import { FieldError, FormAlert, SubmitBar, inputClassName, labelClassName } from "@/components/panel/profile/profile-form-ui";

interface ProfileEditFormProps {
  profile: ProfileRecord;
  onCancel: () => void;
  onSuccess: (profile: ProfileRecord) => void;
  onPendingChange: (pending: boolean) => void;
}

const ACCEPTED_IMAGE_TYPES = "image/png,image/jpeg,image/webp,image/avif";
const BIO_MAX = 600;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 1);
  return parts[0].slice(0, 1) + parts[1].slice(0, 1);
}

/** Everything except the phone (login identity) and the password (own sheet). */
export function ProfileEditForm({ profile, onCancel, onSuccess, onPendingChange }: ProfileEditFormProps) {
  const ids = {
    name: useId(),
    email: useId(),
    nationalCode: useId(),
    tel: useId(),
    postalCode: useId(),
    address: useId(),
    bio: useId(),
    image: useId(),
  };

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email ?? "");
  const [nationalCode, setNationalCode] = useState(displayNationalCode(profile.nationalCode) ?? "");
  const [tel, setTel] = useState(profile.tel ?? "");
  const [postalCode, setPostalCode] = useState(profile.postalCode ?? "");
  const [address, setAddress] = useState(profile.address ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => onPendingChange(isPending), [isPending, onPendingChange]);

  useEffect(() => {
    if (!imageFile) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const currentImage = removeImage ? null : preview ?? profile.image;

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setFieldErrors((prev) => ({ ...prev, imageFile: "" }));
    if (file && file.size > 2 * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, imageFile: "حجم تصویر نباید بیشتر از ۲ مگابایت باشد" }));
      event.target.value = "";
      return;
    }
    setImageFile(file);
    setRemoveImage(false);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("nationalCode", nationalCode);
    formData.set("tel", tel);
    formData.set("postalCode", postalCode);
    formData.set("address", address);
    formData.set("bio", bio);
    if (imageFile) formData.set("imageFile", imageFile);
    if (removeImage) formData.set("removeImage", "1");

    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result.ok) {
        onSuccess(result.profile);
      } else {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setFormError(result.message);
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div ref={topRef} />
      <FormAlert message={formError} />

      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <label
            htmlFor={ids.image}
            className="group relative block h-28 w-28 cursor-pointer overflow-hidden rounded-[32px] border-2 border-[#FF6A00]/40 bg-[#FF6A00]/[0.1] shadow-[0_18px_40px_-16px_rgba(255,106,0,0.6)]"
          >
            {currentImage ? (
              <SafeImage
                key={currentImage}
                src={currentImage}
                alt=""
                className="h-full w-full object-cover"
                fallback={
                  <span className="flex h-full w-full items-center justify-center text-3xl font-black text-panel-accent">
                    {getInitials(name || profile.name)}
                  </span>
                }
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-3xl font-black text-panel-accent">
                {getInitials(name || profile.name)}
              </span>
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-[#03050A]/55 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-6 w-6 text-white" />
            </span>
          </label>
          <label
            htmlFor={ids.image}
            className="absolute -bottom-1.5 -end-1.5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border-4 border-panel-surface bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] text-[#07090C] shadow-lg transition-transform hover:scale-105 active:scale-95"
            aria-label="انتخاب تصویر پروفایل"
          >
            <Camera className="h-4 w-4" />
          </label>
          <input
            ref={fileInputRef}
            id={ids.image}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES}
            onChange={handleFileChange}
            disabled={isPending}
            className="sr-only"
          />
        </div>
        <div className="flex items-center gap-3 text-[11px] text-panel-muted-2">
          <span>PNG / JPG / WebP · حداکثر ۲ مگابایت</span>
          {currentImage && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isPending}
              className="flex items-center gap-1 font-bold text-panel-danger transition-colors hover:text-panel-danger"
            >
              <Trash2 className="h-3.5 w-3.5" />
              حذف تصویر
            </button>
          )}
        </div>
        <FieldError message={fieldErrors.imageFile} />
      </div>

      {/* Identity */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-panel-accent">اطلاعات هویتی</h3>
        <div className="space-y-2">
          <label htmlFor={ids.name} className={labelClassName}>
            نام و نام خانوادگی <span className="text-[#FF6A00]">*</span>
          </label>
          <input
            id={ids.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            autoComplete="name"
            className={inputClassName(Boolean(fieldErrors.name))}
          />
          <FieldError message={fieldErrors.name} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor={ids.nationalCode} className={labelClassName}>
              کد ملی
            </label>
            <input
              id={ids.nationalCode}
              value={nationalCode}
              onChange={(e) => setNationalCode(e.target.value)}
              disabled={isPending}
              inputMode="numeric"
              dir="ltr"
              maxLength={10}
              placeholder="۰۰۰۰۰۰۰۰۰۰"
              className={cn(inputClassName(Boolean(fieldErrors.nationalCode)), "text-start font-mono tracking-[0.2em]")}
            />
            <FieldError message={fieldErrors.nationalCode} />
          </div>
          <div className="space-y-2">
            <label className={labelClassName}>شماره موبایل</label>
            <div
              dir="ltr"
              className="flex h-12 items-center rounded-xl border border-dashed border-panel-line/[0.12] bg-panel-bg/60 px-4 font-mono text-sm text-panel-muted"
            >
              {toPersianDigits(profile.phone)}
            </div>
            <p className="text-[11px] text-panel-faint">شماره موبایل، شناسه ورود شماست و قابل تغییر نیست.</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-panel-accent">اطلاعات تماس</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor={ids.email} className={labelClassName}>
              ایمیل
            </label>
            <input
              id={ids.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              dir="ltr"
              autoComplete="email"
              placeholder="you@example.com"
              className={cn(inputClassName(Boolean(fieldErrors.email)), "text-start")}
            />
            <FieldError message={fieldErrors.email} />
          </div>
          <div className="space-y-2">
            <label htmlFor={ids.tel} className={labelClassName}>
              تلفن ثابت
            </label>
            <input
              id={ids.tel}
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              disabled={isPending}
              inputMode="tel"
              dir="ltr"
              placeholder="۰۲۱۱۲۳۴۵۶۷۸"
              className={cn(inputClassName(Boolean(fieldErrors.tel)), "text-start font-mono")}
            />
            <FieldError message={fieldErrors.tel} />
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-panel-accent">نشانی</h3>
        <div className="space-y-2">
          <label htmlFor={ids.address} className={labelClassName}>
            آدرس
          </label>
          <textarea
            id={ids.address}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isPending}
            rows={2}
            maxLength={255}
            placeholder="استان، شهر، خیابان، پلاک…"
            className={cn(inputClassName(Boolean(fieldErrors.address)), "h-auto resize-none py-3 leading-6")}
          />
          <FieldError message={fieldErrors.address} />
        </div>
        <div className="space-y-2 sm:max-w-[50%]">
          <label htmlFor={ids.postalCode} className={labelClassName}>
            کد پستی
          </label>
          <input
            id={ids.postalCode}
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            disabled={isPending}
            inputMode="numeric"
            dir="ltr"
            maxLength={10}
            placeholder="۰۰۰۰۰۰۰۰۰۰"
            className={cn(inputClassName(Boolean(fieldErrors.postalCode)), "text-start font-mono tracking-[0.2em]")}
          />
          <FieldError message={fieldErrors.postalCode} />
        </div>
      </section>

      {/* Bio */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-panel-accent">درباره من</h3>
        <div className="space-y-2">
          <textarea
            id={ids.bio}
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
            disabled={isPending}
            rows={4}
            placeholder="چند خط درباره خودتان یا فعالیت‌تان بنویسید…"
            className={cn(inputClassName(Boolean(fieldErrors.bio)), "h-auto resize-none py-3 leading-6")}
          />
          <div className="flex items-center justify-between">
            <FieldError message={fieldErrors.bio} />
            <span className="ms-auto text-[11px] tabular-nums text-panel-faint">
              {toPersianDigits(bio.length)} / {toPersianDigits(BIO_MAX)}
            </span>
          </div>
        </div>
      </section>

      <SubmitBar
        pending={isPending}
        label="ذخیره تغییرات"
        pendingLabel="در حال ذخیره…"
        icon={<Save className="h-4 w-4" />}
        onCancel={onCancel}
      />
    </form>
  );
}
