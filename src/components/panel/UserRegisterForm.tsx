"use client";

import React, { useId, useState, useTransition } from "react";
import { AlertCircle, ArrowLeft, Building2, CheckCircle2, Clock3, Eye, EyeOff, Loader2, Lock, Smartphone, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import { registerUserAction } from "@/app/panel/auth-actions";

const fieldClass = (hasError: boolean) =>
  cn(
    "h-[52px] w-full rounded-2xl border bg-panel-bg py-3.5 pr-12 text-[15px] text-panel-text outline-none transition-all placeholder:text-panel-faint disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-panel-line/[0.12] hover:border-panel-line/20"
  );

interface UserRegisterFormProps {
  /** Switch back to the login form (after success or via the footer link). */
  onSwitchToLogin: () => void;
}

/**
 * Self-registration form: name, optional business name, mobile (09…),
 * password + confirmation.
 * The created account waits for admin approval before it can sign in.
 */
export const UserRegisterForm: React.FC<UserRegisterFormProps> = ({ onSwitchToLogin }) => {
  const nameId = useId();
  const companyId = useId();
  const phoneId = useId();
  const passwordId = useId();
  const confirmId = useId();

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFormError(null);
    setFieldErrors({});

    startTransition(async () => {
      const result = await registerUserAction(formData);
      if (result.ok) {
        setDone(true);
        return;
      }
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      setFormError(result.message);
    });
  }

  if (done) {
    return (
      <div className="admin-animate-in space-y-5 text-center" role="status" aria-live="polite">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <div>
          <h2 className="text-lg font-black text-panel-text">ثبت‌نام شما انجام شد</h2>
          <p className="mt-2 text-sm leading-7 text-panel-muted">
            حساب شما ساخته شد و در انتظار تایید مدیر است. پس از فعال‌سازی توسط مدیر می‌توانید با شماره موبایل و رمز عبور خود وارد شوید.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-xs font-semibold text-amber-300">
          <Clock3 className="h-4 w-4 shrink-0" />
          وضعیت حساب: در انتظار تایید مدیر
        </div>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-panel-line/[0.12] bg-panel-bg text-[15px] font-extrabold text-panel-text transition-colors hover:border-[#FF6A00]/50"
        >
          بازگشت به صفحه ورود
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const PasswordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((value) => !value)}
      aria-label={showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
      aria-pressed={showPassword}
      tabIndex={-1}
      className="absolute inset-y-0 left-0 flex w-12 items-center justify-center rounded-l-2xl text-panel-faint transition-colors hover:text-panel-text focus-visible:text-panel-accent focus-visible:outline-none"
    >
      {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-busy={isPending}>
      <div aria-live="polite" aria-atomic="true">
        {formError && (
          <div
            role="alert"
            className="admin-animate-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-panel-danger"
          >
            <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-panel-danger-2" />
            <span className="leading-6">{formError}</span>
          </div>
        )}
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label htmlFor={nameId} className="block text-sm font-semibold text-panel-text">
          نام و نام خانوادگی
        </label>
        <div className="group relative">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-panel-faint transition-colors group-focus-within:text-panel-accent">
            <UserRound className="h-[18px] w-[18px]" />
          </span>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="مثلاً علی رضایی"
            maxLength={100}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? `${nameId}-error` : undefined}
            disabled={isPending}
            className={cn(fieldClass(Boolean(fieldErrors.name)), "pl-4")}
          />
        </div>
        {fieldErrors.name && (
          <p id={`${nameId}-error`} className="text-xs text-panel-danger-2">
            {fieldErrors.name}
          </p>
        )}
      </div>

      {/* Company (optional) */}
      <div className="space-y-2">
        <label htmlFor={companyId} className="flex items-center justify-between text-sm font-semibold text-panel-text">
          نام مجموعه
          <span className="rounded-md bg-panel-line/[0.06] px-1.5 py-0.5 text-[10px] font-bold text-panel-muted">اختیاری</span>
        </label>
        <div className="group relative">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-panel-faint transition-colors group-focus-within:text-panel-accent">
            <Building2 className="h-[18px] w-[18px]" />
          </span>
          <input
            id={companyId}
            name="companyName"
            type="text"
            autoComplete="organization"
            placeholder="مثلاً نمایشگاه خودرو آریا"
            maxLength={120}
            aria-invalid={Boolean(fieldErrors.companyName)}
            aria-describedby={fieldErrors.companyName ? `${companyId}-error` : `${companyId}-hint`}
            disabled={isPending}
            className={cn(fieldClass(Boolean(fieldErrors.companyName)), "pl-4")}
          />
        </div>
        {fieldErrors.companyName ? (
          <p id={`${companyId}-error`} className="text-xs text-panel-danger-2">
            {fieldErrors.companyName}
          </p>
        ) : (
          <p id={`${companyId}-hint`} className="text-[11px] text-panel-faint">
            اگر وارد کنید، در آگهی‌ها و پروفایل شما به جای نامتان نمایش داده می‌شود.
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label htmlFor={phoneId} className="block text-sm font-semibold text-panel-text">
          شماره موبایل
        </label>
        <div className="group relative">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-panel-faint transition-colors group-focus-within:text-panel-accent">
            <Smartphone className="h-[18px] w-[18px]" />
          </span>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            dir="ltr"
            placeholder="09xxxxxxxxx"
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? `${phoneId}-error` : `${phoneId}-hint`}
            disabled={isPending}
            className={cn(fieldClass(Boolean(fieldErrors.phone)), "pl-4 text-left font-mono tracking-wide")}
          />
        </div>
        {fieldErrors.phone ? (
          <p id={`${phoneId}-error`} className="text-xs text-panel-danger-2">
            {fieldErrors.phone}
          </p>
        ) : (
          <p id={`${phoneId}-hint`} className="text-[11px] text-panel-faint">
            ۱۱ رقم و با ۰۹ شروع شود؛ اعداد فارسی هم پذیرفته می‌شود.
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor={passwordId} className="block text-sm font-semibold text-panel-text">
          رمز عبور
        </label>
        <div className="group relative">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-panel-faint transition-colors group-focus-within:text-panel-accent">
            <Lock className="h-[18px] w-[18px]" />
          </span>
          <input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            dir="ltr"
            placeholder="حداقل ۶ کاراکتر"
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? `${passwordId}-error` : undefined}
            disabled={isPending}
            className={cn(fieldClass(Boolean(fieldErrors.password)), "pl-12 text-left font-mono tracking-wide placeholder:text-right placeholder:font-sans")}
          />
          {PasswordToggle}
        </div>
        {fieldErrors.password && (
          <p id={`${passwordId}-error`} className="text-xs text-panel-danger-2">
            {fieldErrors.password}
          </p>
        )}
      </div>

      {/* Confirm */}
      <div className="space-y-2">
        <label htmlFor={confirmId} className="block text-sm font-semibold text-panel-text">
          تکرار رمز عبور
        </label>
        <div className="group relative">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-panel-faint transition-colors group-focus-within:text-panel-accent">
            <Lock className="h-[18px] w-[18px]" />
          </span>
          <input
            id={confirmId}
            name="passwordConfirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            dir="ltr"
            placeholder="••••••••"
            aria-invalid={Boolean(fieldErrors.passwordConfirm)}
            aria-describedby={fieldErrors.passwordConfirm ? `${confirmId}-error` : undefined}
            disabled={isPending}
            className={cn(fieldClass(Boolean(fieldErrors.passwordConfirm)), "pl-4 text-left font-mono tracking-wide")}
          />
        </div>
        {fieldErrors.passwordConfirm && (
          <p id={`${confirmId}-error`} className="text-xs text-panel-danger-2">
            {fieldErrors.passwordConfirm}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "group relative flex h-[52px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] py-3.5 text-[15px] font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all",
          "hover:brightness-110 hover:shadow-[0_0_36px_rgba(255,106,0,0.5)] active:scale-[0.99]",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6A00]/35",
          "disabled:cursor-not-allowed disabled:opacity-80"
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
            <span>در حال ثبت‌نام…</span>
          </>
        ) : (
          <>
            <span>ثبت‌نام</span>
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </>
        )}
      </button>

      <p className="flex items-start gap-2 rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 px-3.5 py-3 text-[11px] leading-5 text-panel-muted">
        <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-panel-accent" />
        حساب شما پس از ثبت‌نام غیرفعال است و بعد از تایید مدیر فعال می‌شود.
      </p>
    </form>
  );
};

export default UserRegisterForm;
