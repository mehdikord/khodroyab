"use client";

import React, { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2, Lock, ShieldCheck, Smartphone } from "lucide-react";

import { cn } from "@/lib/utils";
import { loginUserAction } from "@/app/panel/auth-actions";

const fieldClass = (hasError: boolean) =>
  cn(
    "h-[52px] w-full rounded-2xl border bg-panel-bg py-3.5 pr-12 text-left font-mono text-[15px] tracking-wide text-panel-text outline-none transition-all placeholder:text-panel-faint disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-panel-line/[0.12] hover:border-panel-line/20"
  );

/** Phone + password form for the customer panel. */
export const UserLoginForm: React.FC = () => {
  const router = useRouter();
  const phoneId = useId();
  const passwordId = useId();

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFormError(null);
    setFieldErrors({});

    startTransition(async () => {
      const result = await loginUserAction(formData);
      if (result.ok) {
        router.replace("/panel/dashboard");
        router.refresh();
        return;
      }
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      setFormError(result.message);
    });
  }

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
            autoComplete="username"
            dir="ltr"
            placeholder="09xxxxxxxxx"
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? `${phoneId}-error` : undefined}
            disabled={isPending}
            className={cn(fieldClass(Boolean(fieldErrors.phone)), "pl-4")}
          />
        </div>
        {fieldErrors.phone && (
          <p id={`${phoneId}-error`} className="text-xs text-panel-danger-2">
            {fieldErrors.phone}
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
            autoComplete="current-password"
            dir="ltr"
            placeholder="••••••••"
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? `${passwordId}-error` : undefined}
            disabled={isPending}
            className={cn(fieldClass(Boolean(fieldErrors.password)), "pl-12")}
          />
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
        </div>
        {fieldErrors.password && (
          <p id={`${passwordId}-error`} className="text-xs text-panel-danger-2">
            {fieldErrors.password}
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
            <span>در حال ورود…</span>
          </>
        ) : (
          <>
            <span>ورود به پنل کاربری</span>
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </>
        )}
        {isPending && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden">
            <span className="admin-bar-slide block h-full w-1/2 bg-panel-bg/60" />
          </span>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-panel-faint">
        <ShieldCheck className="h-3.5 w-3.5 text-panel-accent" />
        <span>ورود امن با نشست رمزنگاری‌شده</span>
      </div>
    </form>
  );
};

export default UserLoginForm;
