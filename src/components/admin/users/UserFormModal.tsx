"use client";

import React, { useId, useRef, useState, useTransition } from "react";
import { AlertCircle, BadgeCheck, Handshake, ImagePlus, Loader2, UserPlus, Trash2 } from "lucide-react";
import { Modal } from "@/components/admin/ui/Modal";
import { Toggle } from "@/components/admin/ui/Toggle";
import { createUserAction, updateUserAction } from "@/app/admin/(panel)/users/actions";
import { type UserRecord } from "@/lib/users";
import { cn } from "@/lib/utils";

interface UserFormModalProps {
  user?: UserRecord | null;
  onClose: () => void;
  onSuccess: (record: UserRecord) => void;
  onError: (message: string) => void;
}

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672]",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20"
  );

export function UserFormModal({ user, onClose, onSuccess, onError }: UserFormModalProps) {
  const isEdit = !!user;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.image ?? null);
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  // New accounts only: the users table and profile page manage these afterwards.
  const [collabrate, setCollabrate] = useState(false);
  const [authenticaed, setAuthenticaed] = useState(false);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    const formData = new FormData(event.currentTarget);
    if (selectedFile) formData.set("imageFile", selectedFile);
    if (!isEdit) {
      formData.set("collabrate", collabrate ? "true" : "false");
      formData.set("authenticaed", collabrate && authenticaed ? "true" : "false");
    }

    startTransition(async () => {
      const result = isEdit ? await updateUserAction(user.id, formData) : await createUserAction(formData);
      if (result.ok) {
        onSuccess(result.record);
      } else {
        setFormError(result.message);
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        onError(result.message);
      }
    });
  }

  return (
    <Modal open onClose={onClose} title={isEdit ? "ویرایش کاربر" : "ایجاد کاربر جدید"} size="lg">
      <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <span>{formError}</span>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#F5F5F5]">نام <span className="text-[#FF6A00]">*</span></label>
            <input name="name" type="text" defaultValue={user?.name} required className={inputClassName(!!fieldErrors.name)} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#F5F5F5]">تلفن <span className="text-[#FF6A00]">*</span></label>
            <input name="phone" type="text" defaultValue={user?.phone} required className={inputClassName(!!fieldErrors.phone)} />
          </div>
          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-semibold text-[#F5F5F5]">
              نام مجموعه <span className="text-[11px] font-normal text-[#5E6672]">(اختیاری)</span>
            </label>
            <input
              name="companyName"
              type="text"
              maxLength={120}
              defaultValue={user?.companyName || ""}
              placeholder="مثلاً نمایشگاه خودرو آریا"
              className={inputClassName(!!fieldErrors.companyName)}
            />
            {fieldErrors.companyName ? (
              <p className="text-xs text-red-400">{fieldErrors.companyName}</p>
            ) : (
              <p className="text-[11px] text-[#5E6672]">در صورت ثبت، در آگهی‌ها و پروفایل عمومی به جای نام کاربر نمایش داده می‌شود.</p>
            )}
          </div>
          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-semibold text-[#F5F5F5]">ایمیل</label>
            <input name="email" type="email" defaultValue={user?.email || ""} className={inputClassName(false)} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#F5F5F5]">کد ملی</label>
            <input name="nationalCode" type="text" defaultValue={user?.nationalCode || ""} className={inputClassName(false)} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#F5F5F5]">کد پستی</label>
            <input name="postalCode" type="text" defaultValue={user?.postalCode || ""} className={inputClassName(false)} />
          </div>
          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-semibold text-[#F5F5F5]">آدرس</label>
            <textarea name="address" defaultValue={user?.address || ""} className={cn(inputClassName(false), "h-24 py-2")} />
          </div>
        </div>

        {!isEdit && (
          <div className="space-y-3 rounded-2xl border border-white/[0.08] bg-[#07090C] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2.5">
                <Handshake className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <div>
                  <p className="text-sm font-semibold text-[#F5F5F5]">کاربر همکار</p>
                  <p className="mt-0.5 text-[11px] leading-5 text-[#5E6672]">همکار می‌تواند آگهی و جدول قیمت ثبت کند.</p>
                </div>
              </div>
              <Toggle
                checked={collabrate}
                onCheckedChange={(value) => {
                  setCollabrate(value);
                  if (!value) setAuthenticaed(false);
                }}
                label="کاربر همکار"
                disabled={isPending}
              />
            </div>
            <div className={cn("flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3", !collabrate && "opacity-50")}>
              <div className="flex min-w-0 items-start gap-2.5">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-[#F5F5F5]">احراز هویت شده</p>
                  <p className="mt-0.5 text-[11px] leading-5 text-[#5E6672]">
                    {collabrate
                      ? "اگر روشن باشد، نیازی به ارسال مدارک نیست و قیمت‌های همکار در لیست قیمت نمایش داده می‌شود."
                      : "فقط برای کاربران همکار."}
                  </p>
                </div>
              </div>
              <Toggle checked={authenticaed} onCheckedChange={setAuthenticaed} label="احراز هویت شده" disabled={isPending || !collabrate} />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#F5F5F5]">تصویر</label>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-xl overflow-hidden border border-white/[0.1] bg-[#07090C]">
                {previewUrl ? <img src={previewUrl} className="h-full w-full object-cover" alt="Preview" /> : <div className="flex items-center justify-center h-full"><ImagePlus className="text-gray-500" /></div>}
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm">انتخاب فایل</button>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
          </div>
        </div>
      </form>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-sm text-[#D2D7DF]">انصراف</button>
        <button form="user-form" type="submit" disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[#FF6A00] px-4 py-2 text-sm font-bold text-white">
            {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            ذخیره کاربر
        </button>
      </div>
    </Modal>
  );
}
