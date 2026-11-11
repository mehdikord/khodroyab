"use client";

import React, { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Info, KeyRound, Loader2, Pencil, RotateCw, ShieldCheck, Smartphone, UserRound } from "lucide-react";

import { cn, toPersianDigits } from "@/lib/utils";
import { requestOtpAction, verifyOtpAction } from "@/app/panel/auth-actions";

const fieldClass = (hasError: boolean) =>
  cn(
    "h-[52px] w-full rounded-2xl border bg-panel-bg py-3.5 pr-12 pl-4 text-[15px] text-panel-text outline-none transition-all placeholder:text-panel-faint disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-panel-line/[0.12] hover:border-panel-line/20"
  );

const submitClass = cn(
  "group relative flex h-[52px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] py-3.5 text-[15px] font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all",
  "hover:brightness-110 hover:shadow-[0_0_36px_rgba(255,106,0,0.5)] active:scale-[0.99]",
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6A00]/35",
  "disabled:cursor-not-allowed disabled:opacity-80"
);

type Step = { kind: "phone" } | { kind: "code"; phone: string; isNewUser: boolean; placeholderCode: boolean };

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return toPersianDigits(`${m}:${s.toString().padStart(2, "0")}`);
}

function FieldIcon({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-panel-faint transition-colors group-focus-within:text-panel-accent">
      <Icon className="h-[18px] w-[18px]" />
    </span>
  );
}

function FormAlert({ message }: { message: string | null }) {
  return (
    <div aria-live="polite" aria-atomic="true">
      {message && (
        <div
          role="alert"
          className="admin-animate-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-panel-danger"
        >
          <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-panel-danger-2" />
          <span className="leading-6">{message}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Customer sign-in / sign-up with a one-time SMS code. One flow for everyone:
 * the mobile number gets a code; a number without an account is also asked for
 * the customer's name, and the account is created when the code is confirmed.
 */
export const UserAuthCard: React.FC = () => {
  const router = useRouter();
  const phoneId = useId();
  const nameId = useId();
  const codeId = useId();
  const codeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>({ kind: "phone" });
  const [phoneValue, setPhoneValue] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  useEffect(() => {
    if (step.kind !== "code") return;
    (step.isNewUser ? nameRef.current : codeRef.current)?.focus();
  }, [step]);

  function sendCode(phone: string) {
    setFormError(null);
    setFieldErrors({});
    const formData = new FormData();
    formData.set("phone", phone);
    startTransition(async () => {
      const result = await requestOtpAction(formData);
      if (!result.ok) {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setFormError(result.message);
        if (result.retryAfterSeconds && step.kind === "code") setResendIn(result.retryAfterSeconds);
        return;
      }
      setPhoneValue(result.phone);
      setResendIn(result.resendInSeconds);
      setStep({ kind: "code", phone: result.phone, isNewUser: result.isNewUser, placeholderCode: result.placeholderCode });
    });
  }

  function handlePhoneSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendCode(phoneValue);
  }

  function handleCodeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step.kind !== "code") return;
    const formData = new FormData(event.currentTarget);
    formData.set("phone", step.phone);
    setFormError(null);
    setFieldErrors({});
    startTransition(async () => {
      const result = await verifyOtpAction(formData);
      if (result.ok) {
        router.replace("/panel/dashboard");
        router.refresh();
        return;
      }
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      setFormError(result.message);
    });
  }

  function editPhone() {
    setStep({ kind: "phone" });
    setFormError(null);
    setFieldErrors({});
  }

  const pendingBar = isPending && (
    <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden">
      <span className="admin-bar-slide block h-full w-1/2 bg-panel-bg/60" />
    </span>
  );

  if (step.kind === "phone") {
    return (
      <form onSubmit={handlePhoneSubmit} noValidate className="admin-animate-in space-y-5" aria-busy={isPending}>
        <FormAlert message={formError} />

        <div className="space-y-2">
          <label htmlFor={phoneId} className="block text-sm font-semibold text-panel-text">
            شماره موبایل
          </label>
          <div className="group relative">
            <FieldIcon icon={Smartphone} />
            <input
              id={phoneId}
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              dir="ltr"
              placeholder="09xxxxxxxxx"
              value={phoneValue}
              onChange={(event) => setPhoneValue(event.target.value)}
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? `${phoneId}-error` : `${phoneId}-hint`}
              disabled={isPending}
              autoFocus
              className={cn(fieldClass(Boolean(fieldErrors.phone)), "text-left font-mono tracking-wide")}
            />
          </div>
          {fieldErrors.phone ? (
            <p id={`${phoneId}-error`} className="text-xs text-panel-danger-2">
              {fieldErrors.phone}
            </p>
          ) : (
            <p id={`${phoneId}-hint`} className="text-[11px] leading-5 text-panel-faint">
              کد تایید به این شماره پیامک می‌شود. اگر حساب ندارید، با همین شماره ثبت‌نام می‌شوید.
            </p>
          )}
        </div>

        <button type="submit" disabled={isPending} className={submitClass}>
          {isPending ? (
            <>
              <Loader2 className="h-[18px] w-[18px] animate-spin" />
              <span>در حال ارسال کد…</span>
            </>
          ) : (
            <>
              <span>دریافت کد تایید</span>
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </>
          )}
          {pendingBar}
        </button>

        <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-panel-faint">
          <ShieldCheck className="h-3.5 w-3.5 text-panel-accent" />
          <span>ورود و ثبت‌نام با رمز یکبارمصرف پیامکی</span>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleCodeSubmit} noValidate className="admin-animate-in space-y-5" aria-busy={isPending}>
      <FormAlert message={formError} />

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-panel-line/[0.1] bg-panel-bg px-4 py-3">
        <div className="min-w-0 text-sm leading-6 text-panel-muted">
          کد تایید به{" "}
          <span dir="ltr" className="font-mono font-bold text-panel-text">
            {toPersianDigits(step.phone)}
          </span>{" "}
          ارسال شد.
        </div>
        <button
          type="button"
          onClick={editPhone}
          disabled={isPending}
          className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-extrabold text-panel-accent hover:bg-[#FF6A00]/10 disabled:opacity-60"
        >
          <Pencil className="h-3.5 w-3.5" />
          ویرایش
        </button>
      </div>

      {step.placeholderCode && (
        <div className="flex items-start gap-2 rounded-2xl border border-sky-500/25 bg-sky-500/[0.08] px-4 py-3 text-xs leading-6 text-panel-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
          <span>
            ارسال پیامک هنوز فعال نشده است؛ کد تایید موقت{" "}
            <span dir="ltr" className="font-mono font-bold text-panel-text">
              {toPersianDigits("123456")}
            </span>{" "}
            است.
          </span>
        </div>
      )}

      {step.isNewUser && (
        <div className="space-y-2">
          <label htmlFor={nameId} className="block text-sm font-semibold text-panel-text">
            نام و نام خانوادگی
          </label>
          <div className="group relative">
            <FieldIcon icon={UserRound} />
            <input
              ref={nameRef}
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="مثلاً علی رضایی"
              maxLength={100}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? `${nameId}-error` : `${nameId}-hint`}
              disabled={isPending}
              className={fieldClass(Boolean(fieldErrors.name))}
            />
          </div>
          {fieldErrors.name ? (
            <p id={`${nameId}-error`} className="text-xs text-panel-danger-2">
              {fieldErrors.name}
            </p>
          ) : (
            <p id={`${nameId}-hint`} className="text-[11px] text-panel-faint">
              این شماره حساب کاربری ندارد؛ با وارد کردن نام، حساب شما ساخته می‌شود.
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor={codeId} className="block text-sm font-semibold text-panel-text">
          کد تایید
        </label>
        <div className="group relative">
          <FieldIcon icon={KeyRound} />
          <input
            ref={codeRef}
            id={codeId}
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            dir="ltr"
            maxLength={6}
            placeholder="– – – – – –"
            aria-invalid={Boolean(fieldErrors.code)}
            aria-describedby={fieldErrors.code ? `${codeId}-error` : undefined}
            disabled={isPending}
            className={cn(fieldClass(Boolean(fieldErrors.code)), "text-center font-mono text-lg tracking-[0.5em]")}
          />
        </div>
        {fieldErrors.code && (
          <p id={`${codeId}-error`} className="text-xs text-panel-danger-2">
            {fieldErrors.code}
          </p>
        )}
      </div>

      <button type="submit" disabled={isPending} className={submitClass}>
        {isPending ? (
          <>
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
            <span>در حال بررسی…</span>
          </>
        ) : (
          <>
            <span>{step.isNewUser ? "ثبت‌نام و ورود" : "ورود به پنل کاربری"}</span>
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </>
        )}
        {pendingBar}
      </button>

      <div className="flex items-center justify-center text-xs">
        {resendIn > 0 ? (
          <span className="text-panel-faint">ارسال دوباره کد تا {formatCountdown(resendIn)}</span>
        ) : (
          <button
            type="button"
            onClick={() => sendCode(step.phone)}
            disabled={isPending}
            className="flex items-center gap-1.5 font-extrabold text-panel-accent hover:underline disabled:opacity-60"
          >
            <RotateCw className="h-3.5 w-3.5" />
            ارسال دوباره کد
          </button>
        )}
      </div>
    </form>
  );
};

export default UserAuthCard;
