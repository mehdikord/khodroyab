"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import { AlertCircle, Eraser, Loader2, RotateCcw, Save, Search, Table2, X } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { saveMyPriceTableAction } from "@/app/panel/(app)/price-table/actions";
import type { PriceTableCarRecord, PriceTableEntryRecord } from "@/lib/price-table";
import { PRICE_TABLE_COLOR_MAX, digitsOnly, normalizeUsdPrice } from "@/lib/price-table-shared";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface MyPriceTableManagerProps {
  cars: PriceTableCarRecord[];
  initialEntries: PriceTableEntryRecord[];
}

interface Draft {
  color: string;
  /** Digit-only USD price as typed (normalised on every keystroke). */
  priceUsd: string;
}

type Drafts = Record<string, Draft>;

const EMPTY_DRAFT: Draft = { color: "", priceUsd: "" };

function toDrafts(cars: PriceTableCarRecord[], entries: PriceTableEntryRecord[]): Drafts {
  const byCar = new Map(entries.map((entry) => [entry.carId, entry]));
  const drafts: Drafts = {};
  for (const car of cars) {
    const entry = byCar.get(car.id);
    drafts[car.id] = entry ? { color: entry.color, priceUsd: entry.priceUsd } : { ...EMPTY_DRAFT };
  }
  return drafts;
}

function isFilled(draft: Draft): boolean {
  return draft.color.trim().length > 0 || draft.priceUsd.length > 0;
}

function sameDraft(a: Draft, b: Draft): boolean {
  return a.color.trim() === b.color.trim() && a.priceUsd === b.priceUsd;
}

const cellInputClass = (hasError: boolean) =>
  cn(
    "h-10 w-full rounded-lg border bg-panel-bg px-3 text-[13px] text-panel-text outline-none transition-all placeholder:text-panel-faint",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15 disabled:cursor-not-allowed disabled:opacity-60",
    hasError ? "border-red-500/60" : "border-panel-line/[0.12] hover:border-panel-line/25"
  );

const headClass = "whitespace-nowrap px-2 py-3 text-right text-[11px] font-extrabold uppercase tracking-wider text-panel-muted sm:px-3";

/**
 * The customer's own price table, edited inline: every car the admin allowed
 * is a row with a colour and a USD price input. Changes are saved together.
 *
 * Desktop/tablet: full table. Phone: model/year fold under the car name and the
 * two inputs stack inside one cell, so it still reads as a table.
 */
export function MyPriceTableManager({ cars, initialEntries }: MyPriceTableManagerProps) {
  const [saved, setSaved] = useState<Drafts>(() => toDrafts(cars, initialEntries));
  const [drafts, setDrafts] = useState<Drafts>(() => toDrafts(cars, initialEntries));
  const [query, setQuery] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isPending, startTransition] = useTransition();
  const topRef = useRef<HTMLDivElement>(null);

  const dirtyIds = useMemo(
    () => new Set(cars.filter((car) => !sameDraft(drafts[car.id] ?? EMPTY_DRAFT, saved[car.id] ?? EMPTY_DRAFT)).map((car) => car.id)),
    [cars, drafts, saved]
  );
  const isDirty = dirtyIds.size > 0;
  const filledCount = useMemo(() => cars.filter((car) => isFilled(drafts[car.id] ?? EMPTY_DRAFT)).length, [cars, drafts]);

  const visibleCars = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const digits = digitsOnly(query);
    if (!normalized) return cars;
    return cars.filter(
      (car) =>
        car.name.toLowerCase().includes(normalized) ||
        car.brandName.toLowerCase().includes(normalized) ||
        car.model.toLowerCase().includes(normalized) ||
        (digits.length > 0 && (car.year.includes(digits) || car.model.includes(digits)))
    );
  }, [cars, query]);

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    window.setTimeout(() => setToast(null), 4500);
  }

  function updateDraft(carId: string, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [carId]: { ...(prev[carId] ?? EMPTY_DRAFT), ...patch } }));
    setFieldErrors((prev) => {
      if (!prev[`${carId}.color`] && !prev[`${carId}.priceUsd`]) return prev;
      const next = { ...prev };
      delete next[`${carId}.color`];
      delete next[`${carId}.priceUsd`];
      return next;
    });
  }

  function handlePriceChange(carId: string, raw: string) {
    updateDraft(carId, { priceUsd: normalizeUsdPrice(raw) });
  }

  function clearRow(carId: string) {
    updateDraft(carId, { ...EMPTY_DRAFT });
  }

  function discardChanges() {
    setDrafts(saved);
    setFieldErrors({});
    setFormError(null);
  }

  function handleSave() {
    if (!isDirty || isPending) return;
    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.set(
      "entries",
      JSON.stringify(cars.map((car) => ({ carId: car.id, ...(drafts[car.id] ?? EMPTY_DRAFT) })))
    );

    startTransition(async () => {
      const result = await saveMyPriceTableAction(formData);
      if (result.ok) {
        const next = toDrafts(cars, result.entries);
        setSaved(next);
        setDrafts(next);
        showToast("success", "جدول قیمت شما ذخیره شد");
      } else {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setFormError(result.message);
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  const errorCount = Object.keys(fieldErrors).length;

  return (
    <div ref={topRef} className="scroll-mt-20 space-y-5">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header */}
      <div className="admin-animate-in flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black text-panel-text sm:text-2xl">
            <Table2 className="h-5 w-5 text-panel-accent" />
            جدول قیمت
          </h1>
          <p className="mt-1 text-xs text-panel-muted sm:text-sm">
            {cars.length === 0
              ? "در حال حاضر خودرویی برای جدول قیمت تعریف نشده است."
              : `${toPersianDigits(filledCount)} از ${toPersianDigits(cars.length)} خودرو قیمت‌گذاری شده است`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={discardChanges}
              disabled={isPending}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-panel-line/[0.12] bg-panel-line/[0.03] px-4 text-xs font-bold text-panel-text-2 transition-colors hover:border-panel-line/25 hover:text-panel-text disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              انصراف از تغییرات
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isPending}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold transition-all",
              "bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] text-[#07090C] shadow-orange-subtle hover:brightness-110",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:brightness-100"
            )}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            ذخیره جدول
          </button>
        </div>
      </div>

      <p className="admin-animate-in rounded-2xl border border-panel-line/[0.08] bg-panel-surface px-4 py-3 text-[11px] leading-6 text-panel-muted sm:text-xs">
        برای هر خودرو، رنگ (مثلاً «سفید») و قیمت به دلار را وارد کنید. ردیف‌هایی که خالی بگذارید در پروفایل شما با «---» نمایش داده
        می‌شوند. لیست خودروها توسط مدیر تعیین می‌شود.
      </p>

      {formError && (
        <div
          role="alert"
          className="admin-animate-in flex items-start gap-2.5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-semibold leading-5 text-panel-danger-2"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {formError}
            {errorCount > 0 && ` (${toPersianDigits(errorCount)} مورد)`}
          </span>
        </div>
      )}

      {cars.length === 0 ? (
        <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
              <Table2 className="h-7 w-7" />
            </span>
            <p className="mt-5 text-base font-extrabold text-panel-text">هنوز خودرویی برای جدول قیمت مجاز نشده است</p>
            <p className="mt-2 text-xs text-panel-muted">پس از تعیین خودروها توسط مدیر، می‌توانید قیمت‌های خود را اینجا ثبت کنید.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="admin-animate-in group relative w-full max-w-md" style={{ animationDelay: "60ms" }}>
            <span className="pointer-events-none absolute inset-y-0 start-0 flex w-11 items-center justify-center text-panel-faint transition-colors group-focus-within:text-panel-accent">
              <Search className="h-[18px] w-[18px]" />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در نام، برند، مدل یا سال..."
              className="h-11 w-full rounded-xl border border-panel-line/[0.12] bg-panel-surface ps-11 pe-10 text-sm text-panel-text outline-none transition-all placeholder:text-panel-faint focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="پاک کردن جستجو"
                className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-panel-faint hover:text-panel-text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Table */}
          <div className="admin-animate-in overflow-hidden rounded-2xl border border-panel-line/[0.1] bg-panel-surface" style={{ animationDelay: "100ms" }}>
            <table className="w-full table-fixed border-collapse text-sm md:table-auto">
              <thead>
                <tr className="border-b border-panel-line/[0.1] bg-panel-surface-2/60">
                  <th scope="col" className={cn(headClass, "hidden w-12 text-center md:table-cell")}>
                    #
                  </th>
                  <th scope="col" className={cn(headClass, "w-[40%] md:w-auto")}>
                    نام خودرو
                  </th>
                  <th scope="col" className={cn(headClass, "hidden md:table-cell")}>
                    مدل
                  </th>
                  <th scope="col" className={cn(headClass, "hidden md:table-cell")}>
                    سال ساخت
                  </th>
                  <th scope="col" className={cn(headClass, "md:hidden")}>
                    رنگ / قیمت (دلار)
                  </th>
                  <th scope="col" className={cn(headClass, "hidden w-40 md:table-cell lg:w-48")}>
                    رنگ
                  </th>
                  <th scope="col" className={cn(headClass, "hidden w-44 md:table-cell lg:w-56")}>
                    قیمت (دلار)
                  </th>
                  <th scope="col" className={cn(headClass, "w-10 px-1 text-center md:w-14")}>
                    <span className="sr-only">پاک کردن ردیف</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel-line/[0.06]">
                {visibleCars.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-xs text-panel-muted">
                      خودرویی با این مشخصات در لیست نیست.
                    </td>
                  </tr>
                )}
                {visibleCars.map((car) => {
                  const draft = drafts[car.id] ?? EMPTY_DRAFT;
                  const colorError = fieldErrors[`${car.id}.color`];
                  const priceError = fieldErrors[`${car.id}.priceUsd`];
                  const dirty = dirtyIds.has(car.id);
                  const filled = isFilled(draft);
                  const rowIndex = cars.indexOf(car);

                  const colorInput = (
                    <div>
                      <input
                        type="text"
                        value={draft.color}
                        onChange={(e) => updateDraft(car.id, { color: e.target.value })}
                        maxLength={PRICE_TABLE_COLOR_MAX}
                        placeholder="رنگ (مثلاً سفید)"
                        aria-label={`رنگ ${car.name}`}
                        aria-invalid={Boolean(colorError)}
                        disabled={isPending}
                        className={cellInputClass(Boolean(colorError))}
                      />
                      {colorError && <p className="mt-1 text-[10px] font-semibold text-panel-danger-2">{colorError}</p>}
                    </div>
                  );

                  const priceInput = (
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatPersianNumber(draft.priceUsd)}
                          onChange={(e) => handlePriceChange(car.id, e.target.value)}
                          placeholder="قیمت به دلار"
                          aria-label={`قیمت دلاری ${car.name}`}
                          aria-invalid={Boolean(priceError)}
                          disabled={isPending}
                          className={cn(cellInputClass(Boolean(priceError)), "pe-9 font-semibold")}
                        />
                        <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-xs font-black text-panel-faint">$</span>
                      </div>
                      {priceError && <p className="mt-1 text-[10px] font-semibold text-panel-danger-2">{priceError}</p>}
                    </div>
                  );

                  return (
                    <tr
                      key={car.id}
                      className={cn(
                        "align-top transition-colors",
                        dirty ? "bg-[#FF6A00]/[0.05]" : filled ? "hover:bg-panel-line/[0.03]" : "hover:bg-panel-line/[0.02]"
                      )}
                    >
                      <td className="hidden px-3 py-3 text-center font-mono text-[11px] text-panel-faint md:table-cell md:align-middle">
                        {toPersianDigits(rowIndex + 1)}
                      </td>
                      <td className="px-2 py-3 sm:px-3 md:align-middle">
                        <div className="flex items-start gap-2">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                              dirty ? "bg-[#FF6A00] shadow-[0_0_8px_#FF6A00]" : filled ? "bg-panel-success" : "bg-panel-line/30"
                            )}
                          />
                          <div className="min-w-0">
                            <p className="break-words text-[13px] font-bold leading-5 text-panel-text sm:text-sm">{car.name}</p>
                            <p className="mt-0.5 text-[10px] leading-4 text-panel-faint sm:text-[11px]">{car.brandName}</p>
                            <p className="mt-1 text-[10px] leading-4 text-panel-muted-2 md:hidden">
                              مدل {toPersianDigits(car.model)} · سال {toPersianDigits(car.year)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-3 text-panel-text-2 md:table-cell md:align-middle">{toPersianDigits(car.model)}</td>
                      <td className="hidden whitespace-nowrap px-3 py-3 text-panel-text-2 md:table-cell md:align-middle">{toPersianDigits(car.year)}</td>

                      {/* Phone: both inputs stacked in one cell */}
                      <td className="px-2 py-3 md:hidden">
                        <div className="space-y-2">
                          {colorInput}
                          {priceInput}
                        </div>
                      </td>

                      {/* Tablet/desktop: separate cells */}
                      <td className="hidden px-3 py-3 md:table-cell md:align-middle">{colorInput}</td>
                      <td className="hidden px-3 py-3 md:table-cell md:align-middle">{priceInput}</td>

                      <td className="px-1 py-3 text-center md:align-middle">
                        <button
                          type="button"
                          onClick={() => clearRow(car.id)}
                          disabled={isPending || !filled}
                          title="پاک کردن این ردیف"
                          aria-label={`پاک کردن ردیف ${car.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-panel-line/[0.1] text-panel-faint transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-panel-danger disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Eraser className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Floating save bar (shown only with unsaved changes) */}
      {isDirty && (
        <div className="panel-card-in sticky bottom-[calc(var(--panel-dock-space)+0.25rem)] z-30">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#FF6A00]/30 bg-panel-surface/95 px-4 py-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md">
            <p className="text-xs font-bold text-panel-text-2">
              {toPersianDigits(dirtyIds.size)} ردیف تغییر کرده و ذخیره نشده است
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={discardChanges}
                disabled={isPending}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-panel-line/[0.12] px-3 text-[11px] font-bold text-panel-muted transition-colors hover:text-panel-text disabled:opacity-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                انصراف
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-4 text-[11px] font-extrabold text-[#07090C] transition-all hover:brightness-110 disabled:opacity-60"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
