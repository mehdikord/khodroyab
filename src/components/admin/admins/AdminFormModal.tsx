"use client";

import React, { useId, useState, useTransition } from "react";
import Link from "next/link";
import { AlertCircle, Crown, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import { Toggle } from "@/components/admin/ui/Toggle";
import { PermissionChips } from "@/components/admin/roles/PermissionChips";
import { createAdminAction, updateAdminAction } from "@/app/admin/(panel)/admins/actions";
import type { AdminRecord, AdminRoleRecord } from "@/lib/admins";
import { cn } from "@/lib/utils";

interface AdminFormModalProps {
  admin: AdminRecord | null;
  roles: AdminRoleRecord[];
  /** Editing your own account: root status and active flag are locked. */
  isSelf: boolean;
  onClose: () => void;
  onSuccess: (record: AdminRecord) => void;
}

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20"
  );

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs text-red-400">{message}</p> : null;
}

/** Create/Edit an administrator: identity, password and access level (root or a role). */
export function AdminFormModal({ admin, roles, isSelf, onClose, onSuccess }: AdminFormModalProps) {
  const isEdit = admin !== null;
  const ids = { name: useId(), phone: useId(), email: useId(), password: useId(), role: useId() };

  const [name, setName] = useState(admin?.name ?? "");
  const [phone, setPhone] = useState(admin?.phone ?? "");
  const [email, setEmail] = useState(admin?.email ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRoot, setIsRoot] = useState(admin?.isRoot ?? false);
  const [roleId, setRoleId] = useState(admin?.roleId ?? "");
  const [isActive, setIsActive] = useState(admin?.isActive ?? true);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedRole = roles.find((role) => role.id === roleId) ?? null;

  function clearError(key: string) {
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("phone", phone);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("isRoot", String(isRoot));
    formData.set("roleId", isRoot ? "" : roleId);
    formData.set("isActive", String(isActive));

    startTransition(async () => {
      const result = isEdit ? await updateAdminAction(admin.id, formData) : await createAdminAction(formData);
      if (result.ok) {
        onSuccess(result.record);
      } else {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setFormError(result.message);
      }
    });
  }

  const accessOptions = [
    {
      key: "role" as const,
      selected: !isRoot,
      icon: KeyRound,
      title: "دسترسی بر اساس نقش",
      hint: "فقط بخش‌های تعریف‌شده در نقش",
      disabled: isSelf,
    },
    {
      key: "root" as const,
      selected: isRoot,
      icon: Crown,
      title: "مدیر کل",
      hint: "دسترسی کامل + مدیریت مدیران",
      disabled: false,
    },
  ];

  return (
    <Modal
      open
      onClose={isPending ? () => undefined : onClose}
      title={isEdit ? "ویرایش مدیر" : "افزودن مدیر جدید"}
      description={isEdit ? `به‌روزرسانی اطلاعات و سطح دسترسی «${admin.name}»` : "مدیر جدید با شماره موبایل و رمز عبور وارد پنل مدیریت می‌شود"}
      size="lg"
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
            form="admin-form"
            disabled={isPending}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isPending ? (
              <>
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
                در حال ذخیره…
              </>
            ) : isEdit ? (
              "ذخیره تغییرات"
            ) : (
              "افزودن مدیر"
            )}
          </button>
        </>
      }
    >
      <form id="admin-form" onSubmit={handleSubmit} noValidate aria-busy={isPending} className="space-y-5">
        {formError && (
          <div role="alert" className="admin-animate-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-red-400" />
            <span className="leading-6">{formError}</span>
          </div>
        )}

        {/* Identity */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor={ids.name} className="block text-sm font-semibold text-[#F5F5F5]">
              نام و نام خانوادگی <span className="text-[#FF6A00]">*</span>
            </label>
            <input
              id={ids.name}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              data-autofocus
              maxLength={120}
              autoComplete="off"
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.name)}
              className={inputClassName(Boolean(fieldErrors.name))}
            />
            <FieldError message={fieldErrors.name} />
          </div>
          <div className="space-y-2">
            <label htmlFor={ids.phone} className="block text-sm font-semibold text-[#F5F5F5]">
              شماره موبایل <span className="text-[#FF6A00]">*</span>
            </label>
            <input
              id={ids.phone}
              type="tel"
              dir="ltr"
              inputMode="numeric"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                clearError("phone");
              }}
              maxLength={20}
              placeholder="09xxxxxxxxx"
              autoComplete="off"
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.phone)}
              className={cn(inputClassName(Boolean(fieldErrors.phone)), "text-left font-mono")}
            />
            <FieldError message={fieldErrors.phone} />
          </div>
          <div className="space-y-2">
            <label htmlFor={ids.email} className="block text-sm font-semibold text-[#F5F5F5]">
              ایمیل
            </label>
            <input
              id={ids.email}
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
              }}
              maxLength={255}
              placeholder="اختیاری"
              autoComplete="off"
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.email)}
              className={cn(inputClassName(Boolean(fieldErrors.email)), "text-left placeholder:text-right")}
            />
            <FieldError message={fieldErrors.email} />
          </div>
          <div className="space-y-2">
            <label htmlFor={ids.password} className="block text-sm font-semibold text-[#F5F5F5]">
              {isEdit ? "رمز عبور جدید" : "رمز عبور"} {!isEdit && <span className="text-[#FF6A00]">*</span>}
            </label>
            <div className="relative">
              <input
                id={ids.password}
                type={showPassword ? "text" : "password"}
                dir="ltr"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                }}
                maxLength={72}
                placeholder={isEdit ? "خالی = بدون تغییر" : "حداقل ۶ کاراکتر"}
                autoComplete="new-password"
                disabled={isPending}
                aria-invalid={Boolean(fieldErrors.password)}
                className={cn(inputClassName(Boolean(fieldErrors.password)), "pr-11 text-left font-mono placeholder:text-right placeholder:font-sans")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#5E6672] transition-colors hover:text-[#F5F5F5]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <FieldError message={fieldErrors.password} />
          </div>
        </div>

        {/* Access level */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-[#F5F5F5]">سطح دسترسی</legend>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" role="radiogroup">
            {accessOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.key}
                  type="button"
                  role="radio"
                  aria-checked={option.selected}
                  disabled={isPending || option.disabled}
                  onClick={() => setIsRoot(option.key === "root")}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-3.5 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-50",
                    option.selected ? "border-[#FF6A00]/50 bg-[#FF6A00]/[0.08]" : "border-white/[0.08] bg-[#0A0D12] hover:border-white/[0.18]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                      option.selected ? "border-[#FF6A00]/40 bg-[#FF6A00]/15 text-[#FF8A2A]" : "border-white/[0.08] bg-white/[0.03] text-[#5E6672]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-[#F5F5F5]">{option.title}</span>
                    <span className="mt-0.5 block text-[11px] text-[#8B93A1]">{option.hint}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                      option.selected ? "border-[#FF6A00]" : "border-white/25"
                    )}
                  >
                    {option.selected && <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00]" />}
                  </span>
                </button>
              );
            })}
          </div>
          {isSelf && (
            <p className="text-[11px] leading-5 text-[#8B93A1]">برای جلوگیری از قفل شدن سامانه، نمی‌توانید دسترسی مدیر کل را از حساب خودتان بردارید.</p>
          )}

          {!isRoot && (
            <div className="admin-animate-in space-y-3 rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-4">
              {roles.length === 0 ? (
                <p className="text-xs leading-6 text-[#9BA3AE]">
                  هنوز نقشی تعریف نشده است. ابتدا از{" "}
                  <Link href="/admin/roles" className="font-bold text-[#FF8A2A] hover:underline">
                    نقش‌ها و دسترسی‌ها
                  </Link>{" "}
                  یک نقش بسازید؛ مدیر بدون نقش فقط داشبورد را می‌بیند.
                </p>
              ) : (
                <>
                  <label htmlFor={ids.role} className="block text-sm font-semibold text-[#F5F5F5]">
                    نقش
                  </label>
                  <select
                    id={ids.role}
                    value={roleId}
                    onChange={(e) => {
                      setRoleId(e.target.value);
                      clearError("roleId");
                    }}
                    disabled={isPending}
                    aria-invalid={Boolean(fieldErrors.roleId)}
                    className={cn(inputClassName(Boolean(fieldErrors.roleId)), "cursor-pointer")}
                  >
                    <option value="">بدون نقش (بدون دسترسی به بخش‌ها)</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <FieldError message={fieldErrors.roleId} />
                  {selectedRole ? (
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold text-[#5E6672]">بخش‌های قابل دسترسی این نقش:</p>
                      <PermissionChips permissions={selectedRole.permissions} showAll size="sm" />
                    </div>
                  ) : (
                    <p className="text-[11px] leading-5 text-amber-300/90">مدیر بدون نقش پس از ورود فقط داشبورد خالی را می‌بیند.</p>
                  )}
                </>
              )}
            </div>
          )}
        </fieldset>

        {/* Active */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0A0D12] px-4 py-3.5">
          <div>
            <p className="text-sm font-bold text-[#F5F5F5]">حساب فعال</p>
            <p className="mt-0.5 text-[11px] text-[#5E6672]">
              {isSelf ? "حساب خودتان را نمی‌توانید غیرفعال کنید." : "مدیر غیرفعال نمی‌تواند وارد پنل شود و نشست فعلی‌اش نیز بلافاصله بسته می‌شود."}
            </p>
          </div>
          <Toggle checked={isActive} onCheckedChange={setIsActive} label="وضعیت فعال مدیر" disabled={isPending || isSelf} />
        </div>
      </form>
    </Modal>
  );
}
