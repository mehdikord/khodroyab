"use client";

import React, { useEffect, useId, useState, useTransition } from "react";
import { Check, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";

import { changePasswordAction } from "@/app/panel/(app)/profile/actions";
import { PASSWORD_MIN_LENGTH, passwordStrength } from "@/lib/profile";
import { cn, toPersianDigits } from "@/lib/utils";
import { FieldError, FormAlert, SubmitBar, inputClassName, labelClassName } from "@/components/panel/profile/profile-form-ui";

interface PasswordChangeFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  onPendingChange: (pending: boolean) => void;
}

const STRENGTH_META: { label: string; className: string }[] = [
  { label: "", className: "bg-panel-line/10" },
  { label: "ضعیف", className: "bg-red-500" },
  { label: "متوسط", className: "bg-amber-400" },
  { label: "خوب", className: "bg-lime-400" },
  { label: "عالی", className: "bg-emerald-400" },
];

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: string;
  disabled: boolean;
  trailing?: React.ReactNode;
}

function PasswordField({ id, label, value, onChange, error, autoComplete, disabled, trailing }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelClassName}>
        {label} <span className="text-[#FF6A00]">*</span>
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete={autoComplete}
          dir="ltr"
          className={cn(inputClassName(Boolean(error)), "pe-20 text-start font-mono tracking-wide")}
        />
        <div className="absolute inset-y-0 end-2 flex items-center gap-1">
          {trailing}
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            aria-label={visible ? "پنهان کردن رمز" : "نمایش رمز"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-panel-muted-2 transition-colors hover:bg-panel-line/[0.06] hover:text-panel-text"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <FieldError message={error} />
    </div>
  );
}

/** Standalone password form: current + new + confirm. Never touches other profile fields. */
export function PasswordChangeForm({ onCancel, onSuccess, onPendingChange }: PasswordChangeFormProps) {
  const currentId = useId();
  const newId = useId();
  const confirmId = useId();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => onPendingChange(isPending), [isPending, onPendingChange]);

  const strength = passwordStrength(newPassword);
  const matches = confirmPassword.length > 0 && confirmPassword === newPassword;
  const mismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.set("currentPassword", currentPassword);
    formData.set("newPassword", newPassword);
    formData.set("confirmPassword", confirmPassword);

    startTransition(async () => {
      const result = await changePasswordAction(formData);
      if (result.ok) {
        onSuccess();
      } else {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setFormError(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormAlert message={formError} />

      <div className="flex items-start gap-3 rounded-2xl border border-[#FF6A00]/20 bg-[#FF6A00]/[0.06] px-4 py-3.5">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-panel-accent" />
        <p className="text-xs leading-6 text-panel-text-2">
          برای امنیت حساب، ابتدا رمز فعلی را وارد کنید. رمز جدید باید حداقل{" "}
          <span className="font-bold text-panel-text">{toPersianDigits(PASSWORD_MIN_LENGTH)} کاراکتر</span> باشد.
        </p>
      </div>

      <PasswordField
        id={currentId}
        label="رمز عبور فعلی"
        value={currentPassword}
        onChange={setCurrentPassword}
        error={fieldErrors.currentPassword}
        autoComplete="current-password"
        disabled={isPending}
      />

      <div className="h-px bg-gradient-to-l from-transparent via-panel-line/[0.1] to-transparent" />

      <div className="space-y-2">
        <PasswordField
          id={newId}
          label="رمز عبور جدید"
          value={newPassword}
          onChange={setNewPassword}
          error={fieldErrors.newPassword}
          autoComplete="new-password"
          disabled={isPending}
        />
        {/* Strength meter */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex flex-1 gap-1" aria-hidden="true">
            {[1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors duration-300",
                  step <= strength ? STRENGTH_META[strength].className : "bg-panel-line/[0.08]"
                )}
              />
            ))}
          </div>
          <span className="min-w-[2.5rem] text-end text-[11px] font-bold text-panel-muted">
            {STRENGTH_META[strength].label}
          </span>
        </div>
      </div>

      <PasswordField
        id={confirmId}
        label="تکرار رمز عبور جدید"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={fieldErrors.confirmPassword ?? (mismatch ? "با رمز جدید یکسان نیست" : undefined)}
        autoComplete="new-password"
        disabled={isPending}
        trailing={
          matches ? (
            <span className="flex h-8 w-8 items-center justify-center text-panel-success-2" aria-label="رمزها یکسان هستند">
              <Check className="h-4 w-4" />
            </span>
          ) : null
        }
      />

      <SubmitBar
        pending={isPending}
        label="تغییر رمز عبور"
        pendingLabel="در حال تغییر…"
        icon={<KeyRound className="h-4 w-4" />}
        onCancel={onCancel}
      />
    </form>
  );
}
