"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Car,
  CheckCircle2,
  Fingerprint,
  Loader2,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import { SafeImage } from "@/components/panel/SafeImage";
import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import { loadPurchaseRequestLocationsAction, submitPurchaseRequestAction } from "@/app/panel/purchase-request-actions";
import type { ProvinceOption } from "@/lib/branches";
import {
  PURCHASE_REQUEST_DESCRIPTION_MAX,
  PURCHASE_REQUEST_SOURCE_LABELS,
  type PurchaseRequestTarget,
  type PurchaseRequestViewer,
} from "@/lib/purchase-requests-shared";
import { cn, toPersianDigits } from "@/lib/utils";

interface PurchaseRequestButtonProps {
  target: PurchaseRequestTarget;
  viewer: PurchaseRequestViewer;
  /** `lg`: the ad page's main call to action; `sm`: a seller row of the price list. */
  size?: "sm" | "lg";
  className?: string;
}

/** "1234 5678" */
function groupCode(code: string): string {
  return code.length === 8 ? `${code.slice(0, 4)} ${code.slice(4)}` : code;
}

/** «درخواست خرید» button that opens the request form. */
export function PurchaseRequestButton({ target, viewer, size = "lg", className }: PurchaseRequestButtonProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 overflow-hidden font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 active:scale-[0.98]",
          size === "lg"
            ? "h-12 w-full rounded-2xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm text-[#07090C] shadow-orange-subtle hover:brightness-110"
            : "h-8 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-3 text-[11px] text-panel-accent hover:border-[#FF6A00]/70 hover:bg-[#FF6A00]/20",
          className
        )}
      >
        {size === "lg" && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -start-1/2 w-1/3 skew-x-[-20deg] bg-white/30 opacity-0 transition-all duration-700 group-hover:start-[120%] group-hover:opacity-100"
          />
        )}
        <ShoppingBag className={size === "lg" ? "h-[18px] w-[18px]" : "h-3.5 w-3.5"} />
        درخواست خرید
      </button>
      {open && <PurchaseRequestDialog target={target} viewer={viewer} onClose={close} />}
    </>
  );
}

const fieldClass = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-panel-bg px-3.5 text-sm text-panel-text outline-none transition-all placeholder:text-panel-faint",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15 disabled:cursor-not-allowed disabled:opacity-60",
    hasError ? "border-red-500/60" : "border-panel-line/[0.12] hover:border-panel-line/25"
  );

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-[11px] font-semibold text-panel-danger-2">
      {message}
    </p>
  );
}

function Label({ htmlFor, icon: Icon, children, optional }: { htmlFor: string; icon: typeof UserRound; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-panel-text-2">
      <Icon className="h-3.5 w-3.5 text-panel-accent" />
      {children}
      {optional ? (
        <span className="text-[10px] font-semibold text-panel-faint">(اختیاری)</span>
      ) : (
        <span className="text-panel-accent">*</span>
      )}
    </label>
  );
}

function PurchaseRequestDialog({
  target,
  viewer,
  onClose,
}: {
  target: PurchaseRequestTarget;
  viewer: PurchaseRequestViewer;
  onClose: () => void;
}) {
  const titleId = useId();
  const ids = { name: useId(), phone: useId(), province: useId(), city: useId(), description: useId() };
  const panelRef = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);

  const [provinces, setProvinces] = useState<ProvinceOption[] | null>(null);
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [description, setDescription] = useState("");
  const [tierKey, setTierKey] = useState("");

  const isGuest = !viewer.signedIn;
  const cities = useMemo(() => provinces?.find((p) => String(p.id) === provinceId)?.cities ?? [], [provinces, provinceId]);

  useEffect(() => {
    setPortalTarget(document.querySelector<HTMLElement>(".panel-root") ?? document.body);
  }, []);

  // Provinces and cities are only needed by guests; load them when the form opens.
  useEffect(() => {
    if (!isGuest) return;
    let cancelled = false;
    void loadPurchaseRequestLocationsAction().then((list) => {
      if (!cancelled) setProvinces(list);
    });
    return () => {
      cancelled = true;
    };
  }, [isGuest]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus?.();
    };
  }, [isPending, onClose]);

  useEffect(() => {
    if (!portalTarget) return;
    const first = panelRef.current?.querySelector<HTMLElement>("[data-autofocus]");
    first?.focus({ preventScroll: true });
  }, [portalTarget]);

  function clearError(key: string) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("source", target.source);
    if (target.source === "sale_ad") formData.set("adId", target.adId);
    else {
      formData.set("carId", target.carId);
      formData.set("sellerCode", target.sellerCode);
      formData.set("tierKey", tierKey);
    }
    setFormError(null);
    startTransition(async () => {
      const result = await submitPurchaseRequestAction(formData);
      if (result.ok) {
        setDoneId(result.id);
        setFieldErrors({});
      } else {
        setFormError(result.message);
        setFieldErrors(result.fieldErrors ?? {});
      }
    });
  }

  if (!portalTarget) return null;

  const details = target.source === "sale_ad" ? target.details : null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="بستن"
        onClick={() => !isPending && onClose()}
        className="admin-animate-fade absolute inset-0 bg-[#03050A]/80 backdrop-blur-md"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "panel-sheet relative flex max-h-[94dvh] w-full flex-col overflow-hidden border border-panel-line/[0.1] bg-panel-surface",
          "rounded-t-[30px] shadow-[0_-24px_80px_rgba(0,0,0,0.9)]",
          "sm:max-w-[30rem] sm:rounded-[30px] sm:shadow-[0_40px_90px_rgba(0,0,0,0.85),0_0_80px_-24px_rgba(255,106,0,0.45)]"
        )}
      >
        {/* Header: car photo band with the request's subject */}
        <div className="relative shrink-0 overflow-hidden">
          <div className="absolute inset-0">
            {target.imageUrl ? (
              <SafeImage src={target.imageUrl} alt="" className="h-full w-full object-cover" fallback={<span />} />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-panel-surface via-panel-surface/85 to-panel-surface/40" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#FF6A00]/25 via-transparent to-transparent" />
          </div>
          <div className="relative px-5 pb-4 pt-3 sm:pt-5">
            <div className="flex justify-center pb-2 sm:hidden" aria-hidden="true">
              <span className="h-1.5 w-12 rounded-full bg-panel-line/[0.25]" />
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#FF6A00]/40 bg-[#FF6A00]/15 text-panel-accent shadow-[0_0_30px_-6px_rgba(255,106,0,0.6)] backdrop-blur">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold tracking-wide text-panel-accent">
                  درخواست خرید · از {PURCHASE_REQUEST_SOURCE_LABELS[target.source]}
                </p>
                <h2 id={titleId} className="mt-0.5 break-words text-base font-black leading-7 text-panel-text">
                  {target.carLabel}
                </h2>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                  <span className="inline-flex items-center gap-1 rounded-lg border border-[#FF6A00]/30 bg-panel-bg/70 px-2 py-1 text-panel-text-2 backdrop-blur">
                    <Fingerprint className="h-3 w-3 text-panel-accent" />
                    فروشنده
                    <span dir="ltr" className="font-mono tracking-wider text-panel-text">
                      {toPersianDigits(groupCode(target.sellerCode))}
                    </span>
                  </span>
                  {target.source === "sale_ad" && (
                    <span className="rounded-lg border border-panel-line/[0.1] bg-panel-bg/70 px-2 py-1 text-panel-text-2 backdrop-blur">
                      آگهی <span className="font-mono">{toPersianDigits(target.adCode)}</span>
                    </span>
                  )}
                  {details && (
                    <span className="rounded-lg border border-panel-line/[0.1] bg-panel-bg/70 px-2 py-1 text-panel-text-2 backdrop-blur">{details}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                aria-label="بستن"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-panel-line/[0.1] bg-panel-bg/70 text-panel-muted backdrop-blur transition-colors hover:text-panel-text disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="panel-scrollbar min-h-0 flex-1 overflow-y-auto border-t border-panel-line/[0.07] px-5 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
          {doneId ? (
            <SuccessState id={doneId} signedIn={viewer.signedIn} onClose={onClose} />
          ) : (
            <form onSubmit={handleSubmit} noValidate aria-busy={isPending} className="space-y-4">
              {formError && (
                <div role="alert" className="admin-animate-in flex items-start gap-2.5 rounded-2xl border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-xs leading-6 text-panel-danger">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {isGuest ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor={ids.name} icon={UserRound}>
                        نام و نام خانوادگی
                      </Label>
                      <input
                        id={ids.name}
                        name="name"
                        data-autofocus
                        autoComplete="name"
                        maxLength={120}
                        disabled={isPending}
                        onChange={() => clearError("name")}
                        aria-invalid={Boolean(fieldErrors.name)}
                        aria-describedby={`${ids.name}-error`}
                        className={fieldClass(Boolean(fieldErrors.name))}
                        placeholder="مثلاً علی رضایی"
                      />
                      <FieldError id={`${ids.name}-error`} message={fieldErrors.name} />
                    </div>
                    <div>
                      <Label htmlFor={ids.phone} icon={Phone}>
                        شماره موبایل
                      </Label>
                      <input
                        id={ids.phone}
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        dir="ltr"
                        autoComplete="tel"
                        maxLength={14}
                        disabled={isPending}
                        onChange={() => clearError("phone")}
                        aria-invalid={Boolean(fieldErrors.phone)}
                        aria-describedby={`${ids.phone}-error`}
                        className={cn(fieldClass(Boolean(fieldErrors.phone)), "text-left font-mono tracking-wide")}
                        placeholder="09xxxxxxxxx"
                      />
                      <FieldError id={`${ids.phone}-error`} message={fieldErrors.phone} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={ids.province} icon={MapPin}>
                        استان
                      </Label>
                      <select
                        id={ids.province}
                        name="provinceId"
                        value={provinceId}
                        onChange={(e) => {
                          setProvinceId(e.target.value);
                          setCityId("");
                          clearError("provinceId");
                        }}
                        disabled={isPending || !provinces}
                        aria-invalid={Boolean(fieldErrors.provinceId)}
                        className={fieldClass(Boolean(fieldErrors.provinceId))}
                      >
                        <option value="">{provinces ? "انتخاب استان" : "در حال بارگذاری…"}</option>
                        {provinces?.map((province) => (
                          <option key={province.id} value={province.id}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                      <FieldError id={`${ids.province}-error`} message={fieldErrors.provinceId} />
                    </div>
                    <div>
                      <Label htmlFor={ids.city} icon={MapPin}>
                        شهر
                      </Label>
                      <select
                        id={ids.city}
                        name="cityId"
                        value={cityId}
                        onChange={(e) => {
                          setCityId(e.target.value);
                          clearError("cityId");
                        }}
                        disabled={isPending || !provinceId}
                        aria-invalid={Boolean(fieldErrors.cityId)}
                        className={fieldClass(Boolean(fieldErrors.cityId))}
                      >
                        <option value="">{provinceId ? "انتخاب شهر" : "ابتدا استان"}</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      <FieldError id={`${ids.city}-error`} message={fieldErrors.cityId} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] px-3.5 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-panel-success">
                    <UserRound className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 text-xs leading-6">
                    <p className="font-bold text-panel-text">
                      ثبت با حساب کاربری شما{viewer.name ? `: ${viewer.name}` : ""}
                    </p>
                    <p className="text-[11px] text-panel-muted">
                      نام و شماره تماس{viewer.phone ? <span dir="ltr" className="mx-1 font-mono">{viewer.phone}</span> : " "}از پروفایل شما ارسال می‌شود.
                    </p>
                  </div>
                </div>
              )}

              {target.source === "price_list" && target.tiers.length > 0 && (
                <fieldset>
                  <legend className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-panel-text-2">
                    <Car className="h-3.5 w-3.5 text-panel-accent" />
                    سال و رنگ مورد نظر
                    <span className="text-[10px] font-semibold text-panel-faint">(اختیاری)</span>
                  </legend>
                  <div className="flex flex-wrap gap-1.5" role="radiogroup">
                    {[{ key: "", label: "فرقی ندارد", colorCode: "" }, ...target.tiers].map((tier) => {
                      const active = tierKey === tier.key;
                      return (
                        <button
                          key={tier.key || "any"}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setTierKey(tier.key)}
                          disabled={isPending}
                          className={cn(
                            "inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[11px] font-bold transition-all",
                            active
                              ? "border-[#FF6A00]/60 bg-gradient-to-l from-[#FF6A00]/25 to-[#FF6A00]/5 text-panel-text"
                              : "border-panel-line/[0.1] bg-panel-bg text-panel-muted hover:border-panel-line/25 hover:text-panel-text"
                          )}
                        >
                          {tier.colorCode && <ColorSwatch code={tier.colorCode} className="h-3 w-3" />}
                          {toPersianDigits(tier.label)}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              <div>
                <Label htmlFor={ids.description} icon={MessageSquareText} optional>
                  توضیحات
                </Label>
                <textarea
                  id={ids.description}
                  name="description"
                  rows={4}
                  value={description}
                  data-autofocus={isGuest ? undefined : true}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    clearError("description");
                  }}
                  maxLength={PURCHASE_REQUEST_DESCRIPTION_MAX}
                  disabled={isPending}
                  placeholder="مثلاً زمان مناسب تماس، شرایط پرداخت یا سؤال درباره خودرو…"
                  aria-invalid={Boolean(fieldErrors.description)}
                  className={cn(fieldClass(Boolean(fieldErrors.description)), "h-auto resize-none py-3 leading-7")}
                />
                <div className="mt-1 flex items-center justify-between gap-2">
                  <FieldError id={`${ids.description}-error`} message={fieldErrors.description} />
                  <span className="ms-auto font-mono text-[10px] text-panel-faint">
                    {toPersianDigits(description.length)} / {toPersianDigits(PURCHASE_REQUEST_DESCRIPTION_MAX)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] text-sm font-extrabold text-[#07090C] shadow-orange-subtle transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 active:scale-[0.99] disabled:cursor-wait disabled:opacity-80"
              >
                {isPending ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <Send className="h-[18px] w-[18px] transition-transform group-hover:-translate-x-0.5" />}
                {isPending ? "در حال ارسال…" : "ثبت درخواست خرید"}
              </button>
              <p className="text-center text-[10px] leading-5 text-panel-faint">
                کارشناسان خودرو یاب پس از بررسی، برای هماهنگی با شما تماس می‌گیرند.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>,
    portalTarget
  );
}

function SuccessState({ id, signedIn, onClose }: { id: string; signedIn: boolean; onClose: () => void }) {
  return (
    <div className="admin-animate-in flex flex-col items-center py-4 text-center">
      <span className="relative flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-emerald-500/20 motion-safe:animate-ping" aria-hidden="true" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/15 text-panel-success">
          <CheckCircle2 className="h-10 w-10" />
        </span>
      </span>
      <p className="mt-5 text-lg font-black text-panel-text">درخواست شما ثبت شد</p>
      <p className="mt-1.5 text-xs leading-6 text-panel-muted">
        شماره پیگیری: <span className="font-mono font-black text-panel-accent">{toPersianDigits(id)}</span>
        <br />
        به‌زودی کارشناسان خودرو یاب با شما تماس می‌گیرند.
      </p>
      <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
        {signedIn && (
          <Link
            href="/panel/requests"
            className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 text-xs font-bold text-panel-accent transition-colors hover:bg-[#FF6A00]/20"
          >
            درخواست‌های من
            <ArrowLeft className="h-4 w-4" />
          </Link>
        )}
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-panel-line/[0.1] bg-panel-bg text-xs font-bold text-panel-text-2 transition-colors hover:text-panel-text"
        >
          بستن
        </button>
      </div>
    </div>
  );
}
