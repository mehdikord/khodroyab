"use client";

import React, { useId, useMemo, useState, useTransition } from "react";
import { AlertCircle, HandCoins, Hash, Loader2, Plus, ShieldCheck, Trash2 } from "lucide-react";

import { AdImagesField, AdSpecFields } from "@/components/ads/AdExtraFields";
import { useAdExtras } from "@/components/ads/useAdExtras";
import { Modal } from "@/components/admin/ui/Modal";
import { Toggle } from "@/components/admin/ui/Toggle";
import { SearchableSelect, type SearchableSelectOption } from "@/components/admin/ui/SearchableSelect";
import {
  createUserCarAction,
  updateUserCarAction,
} from "@/app/admin/(panel)/users/[id]/sale-ads/actions";
import type { UserCarRecord } from "@/lib/user-cars";
import type { CarRecord } from "@/lib/cars";
import type { SaleTermRecord } from "@/lib/sale-terms";
import type { ColorRecord } from "@/lib/colors";
import type { OptionRecord } from "@/lib/options";
import { AD_STATUSES, AD_STATUS_DESCRIPTIONS, AD_STATUS_LABELS, type AdStatus } from "@/lib/ad-status";
import { AdStatusBadge } from "@/components/admin/ads/AdStatusBadge";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface SaleAdFormModalProps {
  mode: "create" | "edit";
  userId: string;
  userName: string;
  ad: UserCarRecord | null;
  cars: CarRecord[];
  saleTerms: SaleTermRecord[];
  colors: ColorRecord[];
  options: OptionRecord[];
  onClose: () => void;
  onSuccess: (record: UserCarRecord) => void;
  onError: (message: string) => void;
}

interface TermRow {
  key: string;
  id?: string;
  saleTermId: string;
  price: string;
  sale: string;
  perecentage: string;
  description: string;
  isActive: boolean;
}

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20"
  );

const labelClassName = "block text-xs font-bold text-[#D2D7DF]";

let rowCounter = 0;
function nextKey(): string {
  rowCounter += 1;
  return `row-${Date.now()}-${rowCounter}`;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-semibold text-red-400">{message}</p>;
}

export function SaleAdFormModal({
  mode,
  userId,
  userName,
  ad,
  cars,
  saleTerms,
  colors,
  options,
  onClose,
  onSuccess,
  onError,
}: SaleAdFormModalProps) {
  const isEdit = mode === "edit";
  const brandIdId = useId();
  const carIdId = useId();
  const qautityId = useId();
  const descriptionId = useId();

  const initialCar = ad ? cars.find((car) => car.id === ad.carId) ?? null : null;
  const [brandId, setBrandId] = useState(initialCar?.brandId ?? "");
  const [carId, setCarId] = useState(ad?.carId ?? "");
  const extras = useAdExtras(ad);
  const [qautity, setQautity] = useState(ad?.qautity ?? "1");
  const [description, setDescription] = useState(ad?.description ?? "");
  const [isActive, setIsActive] = useState(ad?.isActive ?? true);
  const [status, setStatus] = useState<AdStatus>(ad?.status ?? "approved");
  const [rows, setRows] = useState<TermRow[]>(() =>
    (ad?.saleTerms ?? []).map((term) => ({
      key: nextKey(),
      id: term.id,
      saleTermId: term.saleTermId,
      price: term.price,
      sale: term.sale ?? "",
      perecentage: term.perecentage ?? "",
      description: term.description ?? "",
      isActive: term.isActive,
    }))
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  /** Distinct brands derived from the car catalogue, with their car counts. */
  const brandOptions = useMemo<SearchableSelectOption[]>(() => {
    const counts = new Map<string, { name: string; count: number }>();
    for (const car of cars) {
      const entry = counts.get(car.brandId) ?? { name: car.brandName, count: 0 };
      entry.count += 1;
      counts.set(car.brandId, entry);
    }
    return Array.from(counts.entries())
      .sort((a, b) => a[1].name.localeCompare(b[1].name, "fa"))
      .map(([id, { name, count }]) => ({
        value: id,
        label: name,
        description: `${toPersianDigits(count)} خودرو`,
      }));
  }, [cars]);

  /** Cars of the selected brand only. */
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

  function handleBrandChange(nextBrandId: string) {
    setBrandId(nextBrandId);
    setCarId(""); // the previous car no longer belongs to the chosen brand
  }

  const selectedCar = cars.find((car) => car.id === carId);

  function addRow() {
    const used = new Set(rows.map((row) => row.saleTermId));
    const firstFree = saleTerms.find((term) => !used.has(term.id)) ?? saleTerms[0];
    setRows((prev) => [
      ...prev,
      {
        key: nextKey(),
        saleTermId: firstFree?.id ?? "",
        price: "",
        sale: "",
        perecentage: "",
        description: "",
        isActive: true,
      },
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
    formData.set("isActive", String(isActive));
    if (isEdit) formData.set("status", status);
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
          isActive: row.isActive,
        }))
      )
    );

    startTransition(async () => {
      const result = isEdit
        ? await updateUserCarAction(ad!.id, formData)
        : await createUserCarAction(userId, formData);

      if (result.ok) {
        onSuccess(result.record);
      } else {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setFormError(result.message);
        onError(result.message);
      }
    });
  }

  const noCars = cars.length === 0;

  return (
    <Modal
      open
      onClose={isPending ? () => undefined : onClose}
      title={isEdit ? "ویرایش آگهی فروش" : "ثبت آگهی فروش جدید"}
      description={
        isEdit
          ? `به‌روزرسانی آگهی «${ad?.brandName} ${ad?.carName}» برای ${userName}`
          : `ثبت آگهی جدید به نام ${userName}`
      }
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
            form="sale-ad-form"
            disabled={isPending || noCars}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
                {isEdit ? "در حال ذخیره…" : "در حال ثبت…"}
              </>
            ) : isEdit ? (
              "ذخیره تغییرات"
            ) : (
              "ثبت آگهی"
            )}
          </button>
        </>
      }
    >
      <form id="sale-ad-form" onSubmit={handleSubmit} noValidate className="space-y-6">
        {formError && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-semibold text-red-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {noCars && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs font-semibold text-amber-200">
            هنوز خودرویی در سیستم ثبت نشده است. ابتدا از بخش «خودروها» یک خودرو ایجاد کنید.
          </div>
        )}

        {/* ───── Ad core ───── */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          </div>

          {selectedCar && (
            <p className="-mt-2 text-[11px] text-[#5E6672]">
              انتخاب شده: {selectedCar.brandName} {selectedCar.name} · {selectedCar.carTypeName} · مدل{" "}
              {toPersianDigits(selectedCar.model)}
            </p>
          )}

          <AdImagesField theme="admin" extras={extras} fieldErrors={fieldErrors} disabled={isPending} />

          <AdSpecFields theme="admin" extras={extras} colors={colors} options={options} fieldErrors={fieldErrors} disabled={isPending} />

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
              <span className="ms-auto text-[11px] text-[#5E6672]">
                {toPersianDigits(description.length)} / ۲۵۵
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-[#07090C]/60 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[#F5F5F5]">وضعیت آگهی</p>
              <p className="mt-0.5 text-[11px] text-[#8B93A1]">
                {isActive ? "آگهی فعال و قابل نمایش است" : "آگهی غیرفعال و از دید کاربران پنهان است"}
              </p>
            </div>
            <Toggle checked={isActive} onCheckedChange={setIsActive} label="وضعیت آگهی" disabled={isPending} />
          </div>

          {isEdit ? (
            <div className="space-y-3 rounded-2xl border border-white/[0.07] bg-[#07090C]/60 px-4 py-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-[#F5F5F5]">وضعیت تایید</p>
                  <p className="mt-0.5 text-[11px] text-[#8B93A1]">{AD_STATUS_DESCRIPTIONS[status]}</p>
                </div>
                {ad?.code && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] font-bold tracking-widest text-[#9BA3AE]">
                    <Hash className="h-3 w-3 text-[#FF8A2A]" />
                    {toPersianDigits(ad.code)}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="وضعیت تایید">
                {AD_STATUSES.map((option) => {
                  const selected = status === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={isPending}
                      onClick={() => setStatus(option)}
                      className={cn(
                        "flex h-11 items-center justify-center rounded-xl border text-xs font-bold transition-all disabled:opacity-60",
                        selected
                          ? option === "approved"
                            ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-200"
                            : option === "rejected"
                              ? "border-red-500/50 bg-red-500/15 text-red-200"
                              : "border-amber-500/50 bg-amber-500/15 text-amber-200"
                          : "border-white/[0.1] bg-[#0D1117] text-[#8B93A1] hover:border-white/20 hover:text-[#F5F5F5]"
                      )}
                    >
                      {AD_STATUS_LABELS[option]}
                    </button>
                  );
                })}
              </div>
              <FieldError message={fieldErrors.status} />
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              <div className="min-w-0 flex-1 text-xs leading-6 text-[#B6BDC8]">
                این آگهی توسط مدیر ثبت می‌شود؛ بنابراین به‌صورت خودکار با وضعیت{" "}
                <AdStatusBadge status="approved" size="sm" className="mx-1 align-middle" /> ذخیره می‌شود و یک{" "}
                <span className="font-bold text-[#F5F5F5]">کد یکتای ۶ رقمی</span> برای آن تولید خواهد شد.
              </div>
            </div>
          )}
        </section>

        {/* ───── Sale terms ───── */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
                <HandCoins className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-[#F5F5F5]">شرایط فروش و قیمت</h3>
                <p className="text-[11px] text-[#8B93A1]">
                  برای هر شرط فروش (نقدی، اقساطی و…) قیمت و تخفیف جداگانه ثبت کنید
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={addRow}
              disabled={isPending || saleTerms.length === 0}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-3 text-xs font-bold text-[#FF8A2A] transition-colors hover:border-[#FF6A00]/60 hover:bg-[#FF6A00]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              افزودن شرط فروش
            </button>
          </div>

          {saleTerms.length === 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs font-semibold text-amber-200">
              هیچ شرایط فروش فعالی تعریف نشده است. از بخش «شرایط فروش» حداقل یک مورد ایجاد کنید.
            </div>
          )}

          {fieldErrors.saleTerms && <FieldError message={fieldErrors.saleTerms} />}

          {rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#07090C]/40 px-4 py-8 text-center">
              <p className="text-sm font-bold text-[#9BA3AE]">هنوز شرط فروشی اضافه نشده است</p>
              <p className="mt-1 text-[11px] text-[#5E6672]">
                بدون شرط فروش، آگهی قیمت قابل نمایشی نخواهد داشت.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((row, index) => {
                const prefix = `saleTerms.${index}.`;
                const usedElsewhere = new Set(
                  rows.filter((r) => r.key !== row.key).map((r) => r.saleTermId)
                );
                return (
                  <div
                    key={row.key}
                    className="admin-animate-fade relative rounded-2xl border border-white/[0.08] bg-[#07090C]/60 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest text-[#5E6672]">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-[#FF8A2A]">
                          {toPersianDigits(index + 1)}
                        </span>
                        {row.id ? "ثبت‌شده" : "جدید"}
                      </span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-[11px] font-semibold text-[#9BA3AE]">
                          <span>{row.isActive ? "فعال" : "غیرفعال"}</span>
                          <Toggle
                            checked={row.isActive}
                            onCheckedChange={(checked) => updateRow(row.key, { isActive: checked })}
                            label="وضعیت شرط فروش"
                            disabled={isPending}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeRow(row.key)}
                          disabled={isPending}
                          title="حذف این شرط"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
                          <p className="text-[11px] text-[#5E6672]">{formatPersianNumber(row.price)} تومان</p>
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
                          <p className="text-[11px] text-[#5E6672]">{formatPersianNumber(row.sale)} تومان</p>
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
      </form>
    </Modal>
  );
}
