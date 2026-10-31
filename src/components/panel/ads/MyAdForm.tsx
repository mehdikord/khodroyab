"use client";

import React, { useId, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Clock3, HandCoins, Loader2, Plus, Trash2 } from "lucide-react";

import { SearchableSelect, type SearchableSelectOption } from "@/components/admin/ui/SearchableSelect";
import { AdStatusBadge } from "@/components/admin/ads/AdStatusBadge";
import { AdImagesField, AdSpecFields } from "@/components/ads/AdExtraFields";
import { useAdExtras } from "@/components/ads/useAdExtras";
import { createMyAdAction, updateMyAdAction } from "@/app/panel/(app)/ads/actions";
import type { UserCarRecord } from "@/lib/user-cars";
import type { CarRecord } from "@/lib/cars";
import type { SaleTermRecord } from "@/lib/sale-terms";
import type { ColorRecord } from "@/lib/colors";
import type { OptionRecord } from "@/lib/options";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface MyAdFormProps {
  mode: "create" | "edit";
  ad: UserCarRecord | null;
  /** Car picked in the first step of the create flow. */
  initialCarId?: string;
  cars: CarRecord[];
  saleTerms: SaleTermRecord[];
  colors: ColorRecord[];
  options: OptionRecord[];
}

interface TermRow {
  key: string;
  id?: string;
  saleTermId: string;
  price: string;
  sale: string;
  perecentage: string;
  description: string;
}

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-panel-bg px-4 text-sm text-panel-text outline-none transition-all placeholder:text-panel-faint disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-panel-line/[0.12] hover:border-panel-line/20"
  );

const labelClassName = "block text-xs font-bold text-panel-text-2";

let rowCounter = 0;
function nextKey(): string {
  rowCounter += 1;
  return `row-${Date.now()}-${rowCounter}`;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-semibold text-panel-danger-2">{message}</p>;
}

/**
 * Details step of a customer's own sale ad: photos, year, colour, the global
 * options, then sale terms. Customers never set moderation status or
 * visibility: new ads start pending and every edit returns the ad to the
 * moderation queue.
 */
export function MyAdForm({ mode, ad, initialCarId, cars, saleTerms, colors, options }: MyAdFormProps) {
  const isEdit = mode === "edit";
  const router = useRouter();
  const brandIdId = useId();
  const carIdId = useId();
  const qautityId = useId();
  const descriptionId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const initialCar = cars.find((car) => car.id === (ad?.carId ?? initialCarId)) ?? null;
  const [brandId, setBrandId] = useState(initialCar?.brandId ?? "");
  const [carId, setCarId] = useState(initialCar?.id ?? "");
  const extras = useAdExtras(ad);
  const [qautity, setQautity] = useState(ad?.qautity ?? "1");
  const [description, setDescription] = useState(ad?.description ?? "");
  const [rows, setRows] = useState<TermRow[]>(() =>
    (ad?.saleTerms ?? []).map((term) => ({
      key: nextKey(),
      id: term.id,
      saleTermId: term.saleTermId,
      price: term.price,
      sale: term.sale ?? "",
      perecentage: term.perecentage ?? "",
      description: term.description ?? "",
    }))
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
        .map((car) => ({
          value: car.id,
          label: car.name,
          description: `${car.carTypeName} · مدل ${toPersianDigits(car.model)}`,
          keywords: `${car.model} ${car.slug}`,
        })),
    [cars, brandId]
  );

  const selectedCar = cars.find((car) => car.id === carId);
  const noCars = cars.length === 0;

  function handleBrandChange(nextBrandId: string) {
    setBrandId(nextBrandId);
    setCarId("");
  }

  function addRow() {
    const used = new Set(rows.map((row) => row.saleTermId));
    const firstFree = saleTerms.find((term) => !used.has(term.id)) ?? saleTerms[0];
    setRows((prev) => [
      ...prev,
      { key: nextKey(), saleTermId: firstFree?.id ?? "", price: "", sale: "", perecentage: "", description: "" },
    ]);
  }

  function updateRow(key: string, patch: Partial<TermRow>) {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function removeRow(key: string) {
    setRows((prev) => prev.filter((row) => row.key !== key));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.set("carId", carId);
    formData.set("qautity", qautity);
    formData.set("description", description);
    extras.appendTo(formData);
    formData.set(
      "saleTerms",
      JSON.stringify(
        rows.map((row) => ({
          id: row.id,
          saleTermId: row.saleTermId,
          price: row.price,
          sale: row.sale,
          perecentage: row.perecentage,
          description: row.description,
          isActive: true,
        }))
      )
    );

    startTransition(async () => {
      const result = isEdit ? await updateMyAdAction(ad!.id, formData) : await createMyAdAction(formData);
      if (result.ok) {
        router.push(`/panel/ads/${result.record.id}`);
        router.refresh();
      } else {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setFormError(result.message);
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  return (
    <div
      ref={containerRef}
      className="admin-animate-in scroll-mt-20 overflow-hidden rounded-3xl border border-[#FF6A00]/25 bg-panel-surface shadow-[0_24px_48px_-12px_rgba(0,0,0,0.75),0_0_40px_-10px_rgba(255,106,0,0.25)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-panel-line/[0.07] bg-gradient-to-l from-[#FF6A00]/[0.08] to-transparent px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <h2 className="text-base font-black text-panel-text">{isEdit ? "ویرایش آگهی" : "ثبت آگهی جدید"}</h2>
          <p className="mt-1 text-[11px] leading-5 text-panel-muted">
            {isEdit
              ? `کد آگهی: ${toPersianDigits(ad?.code ?? "")} · ${ad?.brandName} ${ad?.carName}`
              : "مشخصات این خودرو و شرایط فروش را وارد کنید؛ آگهی پس از بررسی مدیر منتشر می‌شود."}
          </p>
        </div>
        <Link
          href={isEdit ? `/panel/ads/${ad?.id}` : "/panel/ads"}
          aria-label="بازگشت"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-panel-line/[0.1] bg-panel-elevated text-panel-muted transition-colors hover:text-panel-text"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6 p-4 sm:p-6">
        {formError && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-semibold text-panel-danger"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Moderation notice */}
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/[0.07] px-4 py-3.5">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-panel-warning" />
          <div className="min-w-0 flex-1 text-xs leading-6 text-panel-text-2">
            {isEdit && ad?.status === "approved" ? (
              <>
                این آگهی قبلاً تایید شده است. با ذخیره تغییرات، آگهی دوباره به وضعیت{" "}
                <AdStatusBadge status="pending" size="sm" className="mx-1 align-middle" /> برمی‌گردد و تا تایید مجدد مدیر از
                جستجو حذف می‌شود.
              </>
            ) : isEdit ? (
              <>
                پس از ذخیره تغییرات، آگهی با وضعیت <AdStatusBadge status="pending" size="sm" className="mx-1 align-middle" />{" "}
                برای بررسی مدیر ارسال می‌شود.
              </>
            ) : (
              <>
                آگهی شما با وضعیت <AdStatusBadge status="pending" size="sm" className="mx-1 align-middle" /> ثبت می‌شود و
                پس از تایید مدیر در جستجوی کاربران نمایش داده می‌شود. یک{" "}
                <span className="font-bold text-panel-text">کد یکتای ۶ رقمی</span> برای آن ساخته خواهد شد.
              </>
            )}
          </div>
        </div>

        {noCars && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs font-semibold text-panel-warning">
            هنوز خودرویی در سامانه تعریف نشده است؛ امکان ثبت آگهی وجود ندارد.
          </div>
        )}

        {/* Car */}
        {isEdit ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={brandIdId} className={labelClassName}>
                برند <span className="text-[#FF6A00]">*</span>
              </label>
              <SearchableSelect
                id={brandIdId}
                value={brandId}
                onChange={handleBrandChange}
                options={brandOptions}
                disabled={isPending || noCars}
                placeholder="برند خودرو را انتخاب کنید"
                searchPlaceholder="جستجوی برند…"
                emptyText="برندی با این نام پیدا نشد"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={carIdId} className={labelClassName}>
                خودرو <span className="text-[#FF6A00]">*</span>
              </label>
              <SearchableSelect
                id={carIdId}
                value={carId}
                onChange={setCarId}
                options={carOptions}
                disabled={isPending || noCars || !brandId}
                hasError={Boolean(fieldErrors.carId)}
                placeholder={brandId ? "خودرو را انتخاب کنید" : "ابتدا برند را انتخاب کنید"}
                searchPlaceholder="جستجوی نام یا مدل…"
                emptyText="خودرویی برای این برند پیدا نشد"
              />
              <FieldError message={fieldErrors.carId} />
            </div>
          </section>
        ) : (
          selectedCar && (
            <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 px-4 py-3">
              <div className="min-w-0">
                <p className="text-[11px] text-panel-faint">خودروی انتخاب‌شده</p>
                <p className="mt-0.5 truncate text-sm font-extrabold text-panel-text">
                  {selectedCar.brandName} {selectedCar.name}
                </p>
                <p className="mt-0.5 text-[11px] text-panel-muted">
                  {selectedCar.carTypeName} · مدل {toPersianDigits(selectedCar.model)}
                </p>
              </div>
              <Link
                href="/panel/ads/new"
                className="inline-flex h-9 shrink-0 items-center rounded-lg border border-panel-line/[0.1] px-3 text-xs font-bold text-panel-text-2 transition-colors hover:border-[#FF6A00]/40 hover:text-panel-text"
              >
                تغییر خودرو
              </Link>
              <FieldError message={fieldErrors.carId} />
            </section>
          )
        )}

        <AdImagesField theme="panel" extras={extras} fieldErrors={fieldErrors} disabled={isPending} />

        <AdSpecFields theme="panel" extras={extras} colors={colors} options={options} fieldErrors={fieldErrors} disabled={isPending} />

        {/* Quantity and description */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={qautityId} className={labelClassName}>
                تعداد <span className="text-[#FF6A00]">*</span>
              </label>
              <input
                id={qautityId}
                type="text"
                inputMode="numeric"
                dir="ltr"
                disabled={isPending}
                value={qautity}
                onChange={(e) => setQautity(e.target.value)}
                placeholder="1"
                className={cn(inputClassName(Boolean(fieldErrors.qautity)), "text-start font-mono")}
              />
              <FieldError message={fieldErrors.qautity} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor={descriptionId} className={labelClassName}>
              توضیحات آگهی
            </label>
            <textarea
              id={descriptionId}
              disabled={isPending}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={255}
              rows={3}
              placeholder="توضیح کوتاه درباره خودرو، وضعیت تحویل و…"
              className={cn(inputClassName(Boolean(fieldErrors.description)), "h-auto resize-none py-3 leading-7")}
            />
            <div className="flex items-center justify-between">
              <FieldError message={fieldErrors.description} />
              <span className="ms-auto text-[11px] text-panel-faint">{toPersianDigits(description.length)} / ۲۵۵</span>
            </div>
          </div>
        </section>

        {/* Sale terms */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-panel-accent">
                <HandCoins className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-panel-text">شرایط فروش و قیمت</h3>
                <p className="text-[11px] text-panel-muted-2">برای هر شرط فروش، قیمت و تخفیف جداگانه ثبت کنید</p>
              </div>
            </div>
            <button
              type="button"
              onClick={addRow}
              disabled={isPending || saleTerms.length === 0}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-3 text-xs font-bold text-panel-accent transition-colors hover:border-[#FF6A00]/60 hover:bg-[#FF6A00]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              افزودن شرط فروش
            </button>
          </div>

          {saleTerms.length === 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs font-semibold text-panel-warning">
              در حال حاضر شرایط فروش فعالی تعریف نشده است.
            </div>
          )}

          <FieldError message={fieldErrors.saleTerms} />

          {rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-panel-line/[0.12] bg-panel-bg/40 px-4 py-7 text-center">
              <p className="text-sm font-bold text-panel-muted">هنوز شرط فروشی اضافه نشده است</p>
              <p className="mt-1 text-[11px] text-panel-faint">بدون شرط فروش، آگهی قیمت قابل نمایشی نخواهد داشت.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((row, index) => {
                const prefix = `saleTerms.${index}.`;
                const usedElsewhere = new Set(rows.filter((r) => r.key !== row.key).map((r) => r.saleTermId));
                return (
                  <div key={row.key} className="admin-animate-fade rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest text-panel-faint">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-panel-line/[0.08] bg-panel-line/[0.03] text-panel-accent">
                          {toPersianDigits(index + 1)}
                        </span>
                        {row.id ? "ثبت‌شده" : "جدید"}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeRow(row.key)}
                        disabled={isPending}
                        title="حذف این شرط"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-panel-line/[0.08] text-panel-muted transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-panel-danger-2 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-1.5">
                        <label className={labelClassName}>
                          شرایط فروش <span className="text-[#FF6A00]">*</span>
                        </label>
                        <select
                          value={row.saleTermId}
                          disabled={isPending}
                          onChange={(e) => updateRow(row.key, { saleTermId: e.target.value })}
                          className={cn(inputClassName(Boolean(fieldErrors[`${prefix}saleTermId`])), "h-11")}
                        >
                          {saleTerms.map((term) => (
                            <option key={term.id} value={term.id} disabled={usedElsewhere.has(term.id)}>
                              {term.title}
                            </option>
                          ))}
                        </select>
                        <FieldError message={fieldErrors[`${prefix}saleTermId`]} />
                      </div>

                      <div className="space-y-1.5">
                        <label className={labelClassName}>
                          قیمت (تومان) <span className="text-[#FF6A00]">*</span>
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          dir="ltr"
                          value={row.price}
                          disabled={isPending}
                          onChange={(e) => updateRow(row.key, { price: e.target.value })}
                          placeholder="مثال: 1250000000"
                          className={cn(inputClassName(Boolean(fieldErrors[`${prefix}price`])), "h-11 text-start font-mono")}
                        />
                        {row.price && !fieldErrors[`${prefix}price`] && (
                          <p className="text-[11px] text-panel-faint">{formatPersianNumber(row.price)} تومان</p>
                        )}
                        <FieldError message={fieldErrors[`${prefix}price`]} />
                      </div>

                      <div className="space-y-1.5">
                        <label className={labelClassName}>مبلغ تخفیف (تومان)</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          dir="ltr"
                          value={row.sale}
                          disabled={isPending}
                          onChange={(e) => updateRow(row.key, { sale: e.target.value })}
                          placeholder="اختیاری"
                          className={cn(inputClassName(Boolean(fieldErrors[`${prefix}sale`])), "h-11 text-start font-mono")}
                        />
                        {row.sale && !fieldErrors[`${prefix}sale`] && (
                          <p className="text-[11px] text-panel-faint">{formatPersianNumber(row.sale)} تومان</p>
                        )}
                        <FieldError message={fieldErrors[`${prefix}sale`]} />
                      </div>

                      <div className="space-y-1.5">
                        <label className={labelClassName}>درصد تخفیف</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          dir="ltr"
                          value={row.perecentage}
                          disabled={isPending}
                          onChange={(e) => updateRow(row.key, { perecentage: e.target.value })}
                          placeholder="۰ تا ۱۰۰"
                          className={cn(inputClassName(Boolean(fieldErrors[`${prefix}perecentage`])), "h-11 text-start font-mono")}
                        />
                        <FieldError message={fieldErrors[`${prefix}perecentage`]} />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2 lg:col-span-4">
                        <label className={labelClassName}>توضیحات این شرط</label>
                        <textarea
                          value={row.description}
                          disabled={isPending}
                          onChange={(e) => updateRow(row.key, { description: e.target.value })}
                          rows={2}
                          placeholder="مثال: پیش‌پرداخت ۳۰٪، تحویل ۴۵ روزه، اقساط ۱۲ ماهه…"
                          className={cn(inputClassName(Boolean(fieldErrors[`${prefix}description`])), "h-auto resize-none py-2.5 leading-6")}
                        />
                        <FieldError message={fieldErrors[`${prefix}description`]} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Actions (sticky on mobile so they stay reachable above the dock) */}
        <div className="flex flex-col-reverse gap-2 border-t border-panel-line/[0.07] pt-4 sm:flex-row sm:justify-end">
          <Link
            href={isEdit ? `/panel/ads/${ad?.id}` : "/panel/ads"}
            className="flex h-12 items-center justify-center rounded-xl border border-panel-line/[0.12] px-5 text-sm font-bold text-panel-text-2 transition-colors hover:border-panel-line/25 hover:text-panel-text"
          >
            انصراف
          </Link>
          <button
            type="submit"
            disabled={isPending || noCars}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
                {isEdit ? "در حال ذخیره…" : "در حال ثبت…"}
              </>
            ) : isEdit ? (
              "ذخیره و ارسال برای بررسی"
            ) : (
              "ثبت آگهی"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
