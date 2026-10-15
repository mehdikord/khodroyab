"use client";

import React, { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { loginAdminAction } from "@/app/admin/auth-actions";

export const LoginForm: React.FC = () => {
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
      const result = await loginAdminAction(formData);
      if (result.ok) {
        router.replace("/admin/dashboard");
        router.refresh();
        return;
      }
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }
      setFormError(result.message);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
      aria-busy={isPending}
    >
      {/* Inline authentication error */}
      <div aria-live="polite" aria-atomic="true">
        {formError && (
          <div
            role="alert"
            className="admin-animate-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-200"
          >
            <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-red-400" />
            <span className="leading-6">{formError}</span>
          </div>
        )}
      </div>

      {/* Phone field */}
      <div className="space-y-2">
        <label
          htmlFor={phoneId}
          className="block text-sm font-semibold text-[#F5F5F5]"
        >
          شماره موبایل
        </label>
        <div className="group relative">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#5E6672] transition-colors group-focus-within:text-[#FF8A2A]">
            <Smartphone className="h-[18px] w-[18px]" />
          </span>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="username"
            dir="ltr"
            placeholder="09117926950"
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? `${phoneId}-error` : undefined}
            disabled={isPending}
            className={cn(
              "h-12 w-full rounded-xl border bg-[#07090C] pr-12 pl-4 text-left font-mono text-sm tracking-wide text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60",
              "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
              fieldErrors.phone
                ? "border-red-500/50"
                : "border-white/[0.12] hover:border-white/20"
            )}
          />
        </div>
        {fieldErrors.phone && (
          <p id={`${phoneId}-error`} className="text-xs text-red-400">
            {fieldErrors.phone}
          </p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor={passwordId}
            className="block text-sm font-semibold text-[#F5F5F5]"
          >
            رمز عبور
          </label>
        </div>
        <div className="group relative">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#5E6672] transition-colors group-focus-within:text-[#FF8A2A]">
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
            aria-describedby={
              fieldErrors.password ? `${passwordId}-error` : undefined
            }
            disabled={isPending}
            className={cn(
              "h-12 w-full rounded-xl border bg-[#07090C] pr-12 pl-12 text-left font-mono text-sm tracking-wide text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60",
              "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
              fieldErrors.password
                ? "border-red-500/50"
                : "border-white/[0.12] hover:border-white/20"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
            aria-pressed={showPassword}
            tabIndex={-1}
            className="absolute inset-y-0 left-0 flex w-12 items-center justify-center rounded-l-xl text-[#5E6672] transition-colors hover:text-[#F5F5F5] focus-visible:text-[#FF8A2A] focus-visible:outline-none"
          >
            {showPassword ? (
              <EyeOff className="h-[18px] w-[18px]" />
            ) : (
              <Eye className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p id={`${passwordId}-error`} className="text-xs text-red-400">
            {fieldErrors.password}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "group relative flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all",
          "hover:brightness-110 hover:shadow-[0_0_36px_rgba(255,106,0,0.5)] active:scale-[0.99]",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6A00]/35",
          "disabled:cursor-not-allowed disabled:opacity-80"
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
            <span>در حال بررسی…</span>
          </>
        ) : (
          <>
            <span>ورود به پنل مدیریت</span>
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </>
        )}
        {isPending && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden">
            <span className="admin-bar-slide block h-full w-1/2 bg-[#07090C]/60" />
          </span>
        )}
      </button>

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-[#5E6672]">
        <ShieldCheck className="h-3.5 w-3.5 text-[#FF8A2A]" />
        <span>نشست امن رمزنگاری‌شده — دسترسی فقط برای مدیران مجاز</span>
      </div>
    </form>
  );
};

export default LoginForm;
