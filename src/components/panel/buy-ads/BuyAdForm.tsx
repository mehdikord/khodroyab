"use client";

import React, { useId, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Eye, Fingerprint, Gavel, Loader2, Lock, Send, ShieldCheck, Zap } from "lucide-react";

import { SearchableSelect, type SearchableSelectOption } from "@/components/admin/ui/SearchableSelect";
import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import type { AdCarChoice } from "@/components/panel/ads/AdCarPicker";
import { BuyAdCard } from "@/components/panel/buy-ads/BuyAdCard";
import { createBuyAdAction, updateBuyAdAction } from "@/app/panel/(app)/ads/buy/actions";
import { BUY_AD_DESCRIPTION_MAX, type BuyAdRecord } from "@/lib/buy-ads-shared";
import { CURRENCY_LABELS, DEFAULT_AD_CURRENCY, type PriceCurrency } from "@/lib/currency";
import { CurrencyToggle } from "@/components/ads/CurrencyToggle";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface BuyAdFormColor {
  id: string;
  name: string;
  code: string;
}

interface BuyAdFormProps {
  mode: "create" | "edit";
  ad: BuyAdRecord | null;
  /** Car picked in the first step of the create flow. */
  initialCarId?: string;
  cars: AdCarChoice[];
  colors: BuyAdFormColor[];
  /** The user's current public code, for the live preview. */
  buyerCode: string;
}

const MILEAGE_PRESETS = [0, 5_000, 20_000, 50_000, 100_000] as const;

const inputClass = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-panel-bg px-4 text-sm text-panel-text outline-none transition-all placeholder:text-panel-faint disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-panel-line/[0.12] hover:border-panel-line/20"
  );

const labelClass = "block text-xs font-bold text-panel-text-2";
const required = <span className="text-[#FF6A00]">*</span>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-semibold text-panel-danger-2">{message}</p>;
}

function StepTitle({ index, title, hint }: { index: number; title: string; hint?: string }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#FF6A00]/35 bg-[#FF6A00]/10 font-mono text-xs font-black text-panel-accent">
        {toPersianDigits(index)}
      </span>
      <div className="min-w-0">
        <h3 className="text-sm font-extrabold text-panel-text">{title}</h3>
        {hint && <p className="text-[11px] text-panel-faint">{hint}</p>}
      </div>
    </div>
  );
}

function digitsToAscii(value: string): string {
  return value.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0)).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

function mileageNumber(raw: string): number {
  const digits = digitsToAscii(raw).replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function presetLabel(km: number): string {
  if (km === 0) return "صفر کیلومتر";
  return `${toPersianDigits(km / 1000)} هزار`;
}

/**
 * Create / edit form of a buy ad: the car, its year, mileage and colour, and
 * optional notes, plus the currency collaborators will offer prices in. There
 * is no moderation, so a live preview of the public card sits beside the form.
 */
export function BuyAdForm({ mode, ad, initialCarId, cars, colors, buyerCode }: BuyAdFormProps) {
  const isEdit = mode === "edit";
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const ids = { brand: useId(), car: useId(), year: useId(), mileage: useId(), description: useId() };

  const initialCar = cars.find((car) => car.id === (ad?.carId ?? initialCarId)) ?? null;
  const [brandId, setBrandId] = useState(initialCar?.brandId ?? "");
  const [carId, setCarId] = useState(initialCar?.id ?? "");
  const [year, setYear] = useState(ad?.year ?? "");
  const [mileage, setMileage] = useState(ad ? String(ad.mileage) : "");
  const [colorId, setColorId] = useState(ad?.colorId ?? "");
  const [description, setDescription] = useState(ad?.description ?? "");
  const [currency, setCurrency] = useState<PriceCurrency>(ad?.currency ?? DEFAULT_AD_CURRENCY);
  /** Offers are stored in the ad's currency, so it is fixed once one exists. */
  const currencyLocked = (ad?.offerCount ?? 0) > 0;

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedCar = cars.find((car) => car.id === carId) ?? null;
  const selectedColor = colors.find((color) => color.id === colorId) ?? null;

  const brandOptions = useMemo<SearchableSelectOption[]>(() => {
    const counts = new Map<string, { name: string; count: number }>();
    for (const car of cars) {
      const entry = counts.get(car.brandId) ?? { name: car.brandName, count: 0 };
      entry.count += 1;
      counts.set(car.brandId, entry);
    }
    return Array.from(counts.entries())
      .sort((a, b) => a[1].name.localeCompare(b[1].name, "fa"))
      .map(([id, { name, count }]) => ({ value: id, label: name, description: `${toPersianDigits(count)} خودرو` }));
  }, [cars]);

  const carOptions = useMemo<SearchableSelectOption[]>(
    () =>
      cars
        .filter((car) => car.brandId === brandId)
        .map((car) => ({ value: car.id, label: car.name, description: `${car.carTypeName} · مدل ${toPersianDigits(car.model)}`, keywords: car.model })),
    [cars, brandId]
  );

  const mileageValue = mileageNumber(mileage);
  const mileageFormatted = formatPersianNumber(mileage);

  const preview: BuyAdRecord = {
    id: ad?.id ?? "preview",
    code: ad?.code ?? "",
    carId,
    brandId,
    brandName: selectedCar?.brandName ?? "",
    brandImage: null,
    carName: selectedCar?.name ?? "",
    carModel: selectedCar?.model ?? "",
    carTypeName: selectedCar?.carTypeName ?? "",
    imageUrl: selectedCar?.imageUrl ?? null,
    year: digitsToAscii(year).replace(/[^\d]/g, ""),
    mileage: mileageValue,
    colorId,
    colorName: selectedColor?.name ?? "",
    colorCode: selectedColor?.code ?? "",
    description: description.trim() || null,
    isActive: ad?.isActive ?? true,
    currency,
    biddingOpen: ad?.biddingOpen ?? true,
    offerCount: 0,
    bestOffer: null,
    buyerCode,
    createdAtLabel: ad?.createdAtLabel ?? "همین حالا",
  };

  function handleBrandChange(next: string) {
    setBrandId(next);
    setCarId("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.set("carId", carId);
    formData.set("year", year);
    formData.set("mileage", mileage);
    formData.set("colorId", colorId);
    formData.set("currency", currency);
    formData.set("description", description);

    startTransition(async () => {
      const result = isEdit ? await updateBuyAdAction(ad!.id, formData) : await createBuyAdAction(formData);
      if (result.ok) {
        router.push(`/panel/ads/buy/${result.record.id}`);
        router.refresh();
      } else {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setFormError(result.message);
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  const backHref = isEdit ? `/panel/ads/buy/${ad?.id}` : "/panel/ads/buy";

  return (
    <div ref={containerRef} className="scroll-mt-20 space-y-4">
      <div className="admin-animate-in">
        <Link href={backHref} className="inline-flex items-center gap-1.5 text-xs font-bold text-panel-muted hover:text-panel-text">
          <ArrowRight className="h-3.5 w-3.5" />
          {isEdit ? "بازگشت به آگهی" : "آگهی‌های خرید من"}
        </Link>
        <h1 className="mt-2 text-xl font-black text-panel-text sm:text-2xl">{isEdit ? "ویرایش آگهی خرید" : "ثبت آگهی خرید"}</h1>
        <p className="mt-1 text-xs text-panel-muted sm:text-sm">
          {isEdit ? `کد آگهی: ${toPersianDigits(ad?.code ?? "")}` : "مشخصات خودرویی را که به دنبال خرید آن هستید وارد کنید."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
        {/* Form */}
        <div className="admin-animate-in overflow-hidden rounded-3xl border border-[#FF6A00]/25 bg-panel-surface shadow-[0_24px_48px_-12px_rgba(0,0,0,0.75),0_0_40px_-10px_rgba(255,106,0,0.25)]">
          <form onSubmit={handleSubmit} noValidate className="space-y-7 p-4 sm:p-6">
            {formError && (
              <div role="alert" className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-semibold text-panel-danger">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Publishing notice: no moderation, identity hidden */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] px-3.5 py-3">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-panel-success" />
                <p className="text-[11px] leading-5 text-panel-text-2">
                  <span className="font-extrabold text-panel-success">انتشار فوری.</span> آگهی خرید نیازی به تایید مدیر ندارد و بلافاصله در
                  جستجو نمایش داده می‌شود.
                </p>
              </div>
              <div className="flex items-start gap-2.5 rounded-2xl border border-[#FF6A00]/25 bg-[#FF6A00]/[0.06] px-3.5 py-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-panel-accent" />
                <p className="text-[11px] leading-5 text-panel-text-2">
                  <span className="font-extrabold text-panel-accent">حریم خصوصی.</span> نام و اطلاعات تماس شما نمایش داده نمی‌شود؛ فقط کد
                  کاربری شما.
                </p>
              </div>
            </div>

            {/* 1 · Car */}
            <section>
              <StepTitle index={1} title="خودروی مورد نظر" />
              {isEdit ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor={ids.brand} className={labelClass}>
                      برند {required}
                    </label>
                    <SearchableSelect
                      id={ids.brand}
                      value={brandId}
                      onChange={handleBrandChange}
                      options={brandOptions}
                      disabled={isPending}
                      placeholder="برند خودرو را انتخاب کنید"
                      searchPlaceholder="جستجوی برند…"
                      emptyText="برندی با این نام پیدا نشد"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={ids.car} className={labelClass}>
                      خودرو {required}
                    </label>
                    <SearchableSelect
                      id={ids.car}
                      value={carId}
                      onChange={setCarId}
                      options={carOptions}
                      disabled={isPending || !brandId}
                      hasError={Boolean(fieldErrors.carId)}
                      placeholder={brandId ? "خودرو را انتخاب کنید" : "ابتدا برند را انتخاب کنید"}
                      searchPlaceholder="جستجوی نام یا مدل…"
                      emptyText="خودرویی برای این برند پیدا نشد"
                    />
                    <FieldError message={fieldErrors.carId} />
                  </div>
                </div>
              ) : (
                selectedCar && (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-panel-text">
                        {selectedCar.brandName} {selectedCar.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-panel-muted">
                        {selectedCar.carTypeName} · مدل {toPersianDigits(selectedCar.model)}
                      </p>
                    </div>
                    <Link
                      href="/panel/ads/buy/new"
                      className="inline-flex h-9 shrink-0 items-center rounded-lg border border-panel-line/[0.1] px-3 text-xs font-bold text-panel-text-2 transition-colors hover:border-[#FF6A00]/40 hover:text-panel-text"
                    >
                      تغییر خودرو
                    </Link>
                    <FieldError message={fieldErrors.carId} />
                  </div>
                )
              )}
            </section>

            {/* 2 · Currency of the offers */}
            <section>
              <StepTitle index={2} title="واحد قیمت پیشنهادها" hint="همکاران قیمت پیشنهادی خود را با این واحد ثبت می‌کنند" />
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 px-4 py-3">
                <p className="flex min-w-0 items-start gap-2 text-[11px] leading-5 text-panel-muted">
                  {currencyLocked ? (
                    <>
                      <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-panel-warning" />
                      این آگهی پیشنهاد قیمت دریافت کرده و واحد آن ({CURRENCY_LABELS[currency]}) دیگر قابل تغییر نیست.
                    </>
                  ) : (
                    <>
                      <Gavel className="mt-0.5 h-3.5 w-3.5 shrink-0 text-panel-accent" />
                      پس از دریافت اولین پیشنهاد، واحد قیمت ثابت می‌ماند.
                    </>
                  )}
                </p>
                <CurrencyToggle value={currency} onChange={setCurrency} disabled={isPending || currencyLocked} />
              </div>
              <div className="mt-2">
                <FieldError message={fieldErrors.currency} />
              </div>
            </section>

            {/* 3 · Year and mileage */}
            <section>
              <StepTitle index={3} title="سال ساخت و کارکرد" hint="مشخصاتی که از خودروی مورد نظر انتظار دارید" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor={ids.year} className={labelClass}>
                    سال ساخت {required}
                  </label>
                  <input
                    id={ids.year}
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    maxLength={4}
                    disabled={isPending}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="مثال: 2024 یا 1403"
                    className={cn(inputClass(Boolean(fieldErrors.year)), "text-start font-mono")}
                  />
                  <FieldError message={fieldErrors.year} />
                </div>

                <div className="space-y-2">
                  <label htmlFor={ids.mileage} className={labelClass}>
                    کارکرد (کیلومتر) {required}
                  </label>
                  <div className="relative">
                    <input
                      id={ids.mileage}
                      type="text"
                      inputMode="numeric"
                      dir="ltr"
                      maxLength={9}
                      disabled={isPending}
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      onFocus={(e) => e.currentTarget.select()}
                      placeholder="0"
                      className={cn(inputClass(Boolean(fieldErrors.mileage)), "pe-12 text-start font-mono")}
                    />
                    <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-[11px] font-bold text-panel-muted">km</span>
                  </div>
                  {fieldErrors.mileage ? (
                    <FieldError message={fieldErrors.mileage} />
                  ) : (
                    <p className="text-[11px] text-panel-faint">
                      {mileage === "" ? "برای خودروی نو ۰ وارد کنید." : mileageValue === 0 ? "صفر کیلومتر (نو)" : `${mileageFormatted} کیلومتر`}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5" aria-label="انتخاب سریع کارکرد">
                {MILEAGE_PRESETS.map((km) => {
                  const on = mileage !== "" && mileageValue === km;
                  return (
                    <button
                      key={km}
                      type="button"
                      disabled={isPending}
                      onClick={() => setMileage(String(km))}
                      aria-pressed={on}
                      className={cn(
                        "h-8 rounded-full border px-3 text-[11px] font-bold transition-colors disabled:opacity-60",
                        on
                          ? "border-[#FF6A00]/60 bg-[#FF6A00]/15 text-panel-accent"
                          : "border-panel-line/[0.1] bg-panel-bg text-panel-muted hover:border-panel-line/20 hover:text-panel-text"
                      )}
                    >
                      {presetLabel(km)}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 4 · Colour */}
            <section>
              <StepTitle index={4} title="رنگ خودرو" />
              {colors.length === 0 ? (
                <p className="text-xs font-semibold text-panel-danger-2">هنوز رنگی در سامانه تعریف نشده است.</p>
              ) : (
                <div role="radiogroup" aria-label="رنگ خودرو" className="flex flex-wrap gap-2">
                  {colors.map((color) => {
                    const selected = colorId === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={isPending}
                        onClick={() => setColorId(color.id)}
                        className={cn(
                          "inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition-all disabled:opacity-60",
                          selected
                            ? "border-[#FF6A00]/60 bg-[#FF6A00]/15 text-panel-accent shadow-[0_0_18px_-6px_rgba(255,106,0,0.6)]"
                            : "border-panel-line/[0.1] bg-panel-bg text-panel-muted hover:border-panel-line/20 hover:text-panel-text"
                        )}
                      >
                        <ColorSwatch code={color.code} />
                        {color.name}
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="mt-2">
                <FieldError message={fieldErrors.colorId} />
              </div>
            </section>

            {/* 5 · Notes */}
            <section>
              <StepTitle index={5} title="توضیحات" hint="اختیاری" />
              <textarea
                id={ids.description}
                aria-label="توضیحات آگهی خرید"
                disabled={isPending}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={BUY_AD_DESCRIPTION_MAX}
                rows={4}
                placeholder="مثال: ترجیحاً بدون رنگ، تحویل فوری، آماده پرداخت نقدی…"
                className={cn(inputClass(Boolean(fieldErrors.description)), "h-auto resize-none py-3 leading-7")}
              />
              <div className="mt-1 flex items-center justify-between">
                <FieldError message={fieldErrors.description} />
                <span className="ms-auto text-[11px] text-panel-faint">
                  {toPersianDigits(description.length)} / {toPersianDigits(BUY_AD_DESCRIPTION_MAX)}
                </span>
              </div>
            </section>

            <div className="flex flex-col-reverse gap-2 border-t border-panel-line/[0.07] pt-4 sm:flex-row sm:justify-end">
              <Link
                href={backHref}
                className="flex h-12 items-center justify-center rounded-xl border border-panel-line/[0.12] px-5 text-sm font-bold text-panel-text-2 transition-colors hover:border-panel-line/25 hover:text-panel-text"
              >
                انصراف
              </Link>
              <button
                type="submit"
                disabled={isPending || cars.length === 0}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-[18px] w-[18px] animate-spin" />
                    {isEdit ? "در حال ذخیره…" : "در حال انتشار…"}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 -scale-x-100" />
                    {isEdit ? "ذخیره تغییرات" : "انتشار آگهی خرید"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live preview */}
        <aside className="admin-animate-in space-y-3 lg:sticky lg:top-24" style={{ animationDelay: "80ms" }} aria-label="پیش‌نمایش آگهی">
          <p className="flex items-center gap-1.5 text-xs font-extrabold text-panel-muted">
            <Eye className="h-3.5 w-3.5 text-panel-accent" />
            پیش‌نمایش زنده
            <span className="text-[10px] font-semibold text-panel-faint">— همین‌طور در جستجو دیده می‌شود</span>
          </p>
          <BuyAdCard ad={preview} preview />
          {buyerCode && (
            <p className="flex items-start gap-1.5 text-[11px] leading-5 text-panel-faint">
              <Fingerprint className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              کد کاربری شما به‌صورت دوره‌ای تغییر می‌کند تا هویت شما محفوظ بماند.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
