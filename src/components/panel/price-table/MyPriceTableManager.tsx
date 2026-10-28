"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  CalendarDays,
  CalendarPlus,
  Eraser,
  Layers,
  Loader2,
  Palette,
  RotateCcw,
  Save,
  Search,
  Table2,
  Trash2,
  X,
} from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import { saveMyPriceTableAction } from "@/app/panel/(app)/price-table/actions";
import type { ColorRecord } from "@/lib/colors";
import type { PriceTableCarRecord, PriceTableEntryRecord } from "@/lib/price-table";
import {
  PRICE_TABLE_MAX_TIERS,
  PRICE_TABLE_PRICE_FIELDS,
  defaultTierYear,
  digitsOnly,
  isValidTierYear,
  normalizeUsdPrice,
  normalizeYear,
  type PriceTablePriceField,
} from "@/lib/price-table-shared";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface MyPriceTableManagerProps {
  cars: PriceTableCarRecord[];
  colors: ColorRecord[];
  initialEntries: PriceTableEntryRecord[];
}

/** One year tier as edited: `key` is a client-only id, the rest are digit strings ("" = blank). */
interface TierDraft extends Record<PriceTablePriceField, string> {
  key: string;
  year: string;
}

/** One car as edited: colour id ("" = none) and its year tiers (never empty). */
interface Draft {
  colorId: string;
  tiers: TierDraft[];
}

type Drafts = Record<string, Draft>;

type RowFilter = "all" | "filled" | "empty";

let tierSeq = 0;
const nextTierKey = () => `tier-${++tierSeq}`;

function emptyTier(year: string): TierDraft {
  return { key: nextTierKey(), year, priceUsd: "", clearancePrice: "", instantPrice: "" };
}

function emptyDraft(car: PriceTableCarRecord): Draft {
  return { colorId: "", tiers: [emptyTier(defaultTierYear(car.year))] };
}

function toDrafts(cars: PriceTableCarRecord[], entries: PriceTableEntryRecord[]): Drafts {
  const byCar = new Map(entries.map((entry) => [entry.carId, entry]));
  const drafts: Drafts = {};
  for (const car of cars) {
    const entry = byCar.get(car.id);
    drafts[car.id] =
      entry && entry.tiers.length > 0
        ? {
            colorId: entry.colorId ?? "",
            tiers: entry.tiers.map((tier) => ({
              key: nextTierKey(),
              year: tier.year,
              priceUsd: tier.priceUsd ?? "",
              clearancePrice: tier.clearancePrice ?? "",
              instantPrice: tier.instantPrice ?? "",
            })),
          }
        : { ...emptyDraft(car), colorId: entry?.colorId ?? "" };
  }
  return drafts;
}

function isTierPriced(tier: TierDraft): boolean {
  return PRICE_TABLE_PRICE_FIELDS.some(({ key }) => tier[key].length > 0);
}

function isFilled(draft: Draft): boolean {
  return draft.colorId.length > 0 || draft.tiers.some(isTierPriced);
}

function sameDraft(a: Draft, b: Draft): boolean {
  if (a.colorId !== b.colorId || a.tiers.length !== b.tiers.length) return false;
  return a.tiers.every((tier, index) => {
    const other = b.tiers[index];
    return tier.year === other.year && PRICE_TABLE_PRICE_FIELDS.every(({ key }) => tier[key] === other[key]);
  });
}

/** Year proposed for a new tier: one after the newest year already in the row. */
function suggestNextYear(draft: Draft, car: PriceTableCarRecord): string {
  const years = draft.tiers.map((tier) => tier.year).filter(isValidTierYear).map(Number);
  if (years.length === 0) return defaultTierYear(car.year);
  const next = String(Math.max(...years) + 1);
  return isValidTierYear(next) ? next : "";
}

/** Years that appear more than once in a row (shown as a live warning). */
function duplicateYears(draft: Draft): Set<string> {
  const counts = new Map<string, number>();
  for (const tier of draft.tiers) {
    if (tier.year.length === 4) counts.set(tier.year, (counts.get(tier.year) ?? 0) + 1);
  }
  return new Set(Array.from(counts).filter(([, count]) => count > 1).map(([year]) => year));
}

const SHORT_PRICE_LABELS: Record<PriceTablePriceField, string> = {
  priceUsd: "خام",
  clearancePrice: "ترخیصی",
  instantPrice: "فوری",
};

const inputBase = cn(
  "w-full rounded-xl border bg-panel-bg text-panel-text outline-none transition-all placeholder:text-panel-faint",
  "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15 disabled:cursor-not-allowed disabled:opacity-60"
);

const borderFor = (hasError: boolean) => (hasError ? "border-red-500/60" : "border-panel-line/[0.12] hover:border-panel-line/25");

/** Tier grid: year | raw | clearance | instant | remove (shared by the header and every tier row on `sm+`). */
const tierGridClass = "sm:grid sm:grid-cols-[7.5rem_repeat(3,minmax(0,1fr))_2.5rem] sm:items-start sm:gap-2";

const FILTERS: { key: RowFilter; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "filled", label: "قیمت‌گذاری‌شده" },
  { key: "empty", label: "بدون قیمت" },
];

function ErrorText({ message }: { message: string | undefined }) {
  if (!message) return null;
  return <p className="mt-1 text-[10px] font-semibold leading-4 text-panel-danger-2">{message}</p>;
}

/**
 * The customer's own price table, edited inline. Every car the admin allowed
 * is a card with a colour and one or more *year tiers*: a production year
 * (typed by the customer, prefilled with the car's year) and the raw,
 * clearance and instant USD prices for that year. "افزودن سال" adds another
 * tier. Changes are saved together.
 */
export function MyPriceTableManager({ cars, colors, initialEntries }: MyPriceTableManagerProps) {
  const [saved, setSaved] = useState<Drafts>(() => toDrafts(cars, initialEntries));
  const [drafts, setDrafts] = useState<Drafts>(saved);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<RowFilter>("all");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isPending, startTransition] = useTransition();
  const topRef = useRef<HTMLDivElement>(null);
  const colorById = useMemo(() => new Map(colors.map((color) => [color.id, color])), [colors]);
  const carById = useMemo(() => new Map(cars.map((car) => [car.id, car])), [cars]);
  const indexById = useMemo(() => new Map(cars.map((car, index) => [car.id, index])), [cars]);

  const draftOf = (car: PriceTableCarRecord) => drafts[car.id] ?? emptyDraft(car);

  const dirtyIds = useMemo(
    () => new Set(cars.filter((car) => drafts[car.id] && saved[car.id] && !sameDraft(drafts[car.id], saved[car.id])).map((car) => car.id)),
    [cars, drafts, saved]
  );
  const isDirty = dirtyIds.size > 0;

  const stats = useMemo(() => {
    let filled = 0;
    let tiers = 0;
    for (const car of cars) {
      const draft = drafts[car.id];
      if (!draft || !isFilled(draft)) continue;
      filled += 1;
      tiers += draft.tiers.filter(isTierPriced).length;
    }
    return { filled, tiers };
  }, [cars, drafts]);

  const visibleCars = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const digits = digitsOnly(query);
    return cars.filter((car) => {
      const draft = drafts[car.id];
      const filled = draft ? isFilled(draft) : false;
      if (filter === "filled" && !filled) return false;
      if (filter === "empty" && filled) return false;
      if (!normalized) return true;
      return (
        car.name.toLowerCase().includes(normalized) ||
        car.brandName.toLowerCase().includes(normalized) ||
        car.model.toLowerCase().includes(normalized) ||
        (digits.length > 0 &&
          (car.year.includes(digits) || car.model.includes(digits) || (draft?.tiers.some((tier) => tier.year.includes(digits)) ?? false)))
      );
    });
  }, [cars, drafts, query, filter]);

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    window.setTimeout(() => setToast(null), 4500);
  }

  /** Apply a change to one car's draft and drop that car's stale server errors. */
  function updateDraft(carId: string, change: (draft: Draft) => Draft) {
    const car = carById.get(carId);
    if (!car) return;
    setDrafts((prev) => ({ ...prev, [carId]: change(prev[carId] ?? emptyDraft(car)) }));
    setFieldErrors((prev) => {
      const prefix = `${carId}.`;
      if (!Object.keys(prev).some((key) => key.startsWith(prefix))) return prev;
      return Object.fromEntries(Object.entries(prev).filter(([key]) => !key.startsWith(prefix)));
    });
  }

  function updateTier(carId: string, tierKey: string, patch: Partial<TierDraft>) {
    updateDraft(carId, (draft) => ({
      ...draft,
      tiers: draft.tiers.map((tier) => (tier.key === tierKey ? { ...tier, ...patch } : tier)),
    }));
  }

  function addTier(car: PriceTableCarRecord) {
    const draft = draftOf(car);
    if (draft.tiers.length >= PRICE_TABLE_MAX_TIERS) return;
    const tier = emptyTier(suggestNextYear(draft, car));
    updateDraft(car.id, (current) => ({ ...current, tiers: [...current.tiers, tier] }));
    // Year is prefilled, so jump straight to the first price of the new tier.
    window.requestAnimationFrame(() => {
      document.getElementById(`${tier.key}-${tier.year ? "priceUsd" : "year"}`)?.focus();
    });
  }

  function removeTier(carId: string, tierKey: string) {
    updateDraft(carId, (draft) =>
      draft.tiers.length <= 1 ? draft : { ...draft, tiers: draft.tiers.filter((tier) => tier.key !== tierKey) }
    );
  }

  function clearRow(car: PriceTableCarRecord) {
    updateDraft(car.id, () => emptyDraft(car));
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
      JSON.stringify(
        cars.map((car) => {
          const draft = draftOf(car);
          return { carId: car.id, colorId: draft.colorId, tiers: draft.tiers.map(({ key: _key, ...tier }) => tier) };
        })
      )
    );

    startTransition(async () => {
      const result = await saveMyPriceTableAction(formData);
      if (result.ok) {
        const next = toDrafts(cars, result.entries);
        setSaved(next);
        setDrafts(next);
        showToast("success", "جدول قیمت شما ذخیره شد");
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
          if (filter !== "all") setFilter("all");
        }
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
            جدول من
          </h1>
          <p className="mt-1 text-xs text-panel-muted sm:text-sm">
            {cars.length === 0 ? (
              "در حال حاضر خودرویی برای جدول قیمت تعریف نشده است."
            ) : (
              <>
                {toPersianDigits(stats.filled)} از {toPersianDigits(cars.length)} خودرو قیمت‌گذاری شده
                {stats.tiers > 0 && <span className="text-panel-faint"> · {toPersianDigits(stats.tiers)} ردیف قیمت سالانه</span>}
              </>
            )}
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

      {/* How it works */}
      <ol className="admin-animate-in grid grid-cols-1 gap-2 sm:grid-cols-3" style={{ animationDelay: "40ms" }}>
        {[
          { icon: Palette, title: "رنگ را انتخاب کنید", text: "رنگ خودرویی که قیمت می‌دهید." },
          { icon: CalendarDays, title: "سال و قیمت‌ها را وارد کنید", text: "سال پیش‌فرض، سال ساخت خودرو است و قابل تغییر است." },
          { icon: CalendarPlus, title: "سال‌های دیگر را اضافه کنید", text: "برای هر سال، قیمت خام، ترخیصی و فوری جدا ثبت می‌شود." },
        ].map((step, index) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="flex items-start gap-3 rounded-2xl border border-panel-line/[0.08] bg-panel-surface px-3.5 py-3"
            >
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#FF6A00]/25 bg-[#FF6A00]/10 text-panel-accent">
                <Icon className="h-4 w-4" />
                <span className="absolute -end-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF6A00] text-[9px] font-black text-[#07090C]">
                  {toPersianDigits(index + 1)}
                </span>
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-extrabold text-panel-text">{step.title}</span>
                <span className="mt-0.5 block text-[11px] leading-5 text-panel-muted">{step.text}</span>
              </span>
            </li>
          );
        })}
      </ol>

      {cars.length > 0 && colors.length === 0 && (
        <p className="admin-animate-in rounded-2xl border border-panel-warning/30 bg-panel-warning/10 px-4 py-3 text-[11px] font-semibold leading-6 text-panel-warning sm:text-xs">
          هنوز رنگی توسط مدیر تعریف نشده است؛ تا زمان تعریف رنگ‌ها امکان ثبت ردیف جدید وجود ندارد.
        </p>
      )}

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
          {/* Toolbar: search + filter */}
          <div className="admin-animate-in flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "60ms" }}>
            <div className="group relative w-full sm:max-w-md">
              <span className="pointer-events-none absolute inset-y-0 start-0 flex w-11 items-center justify-center text-panel-faint transition-colors group-focus-within:text-panel-accent">
                <Search className="h-[18px] w-[18px]" />
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو در نام، برند، مدل یا سال..."
                className="h-11 w-full rounded-xl border border-panel-line/[0.12] bg-panel-surface pe-10 ps-11 text-sm text-panel-text outline-none transition-all placeholder:text-panel-faint focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
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

            <div role="radiogroup" aria-label="فیلتر ردیف‌ها" className="flex rounded-xl border border-panel-line/[0.1] bg-panel-surface p-1">
              {FILTERS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="radio"
                  aria-checked={filter === item.key}
                  onClick={() => setFilter(item.key)}
                  className={cn(
                    "flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-[11px] font-bold transition-all sm:flex-none",
                    filter === item.key
                      ? "bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] text-[#07090C] shadow-orange-subtle"
                      : "text-panel-muted hover:text-panel-text"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cars */}
          <div className="space-y-3">
            {visibleCars.length === 0 && (
              <p className="rounded-2xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-4 py-10 text-center text-xs text-panel-muted">
                خودرویی با این مشخصات در لیست نیست.
              </p>
            )}

            {visibleCars.map((car) => {
              const draft = draftOf(car);
              const dirty = dirtyIds.has(car.id);
              const filled = isFilled(draft);
              const colorError = fieldErrors[`${car.id}.colorId`];
              const rowError = fieldErrors[`${car.id}.tiers`];
              const selectedColor = colorById.get(draft.colorId) ?? null;
              const duplicates = duplicateYears(draft);
              const canAddTier = draft.tiers.length < PRICE_TABLE_MAX_TIERS;
              const suggestedYear = canAddTier ? suggestNextYear(draft, car) : "";

              return (
                <article
                  key={car.id}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border bg-panel-surface transition-colors",
                    dirty
                      ? "border-[#FF6A00]/40 shadow-[0_0_0_1px_rgba(255,106,0,0.08),0_18px_40px_-28px_rgba(255,106,0,0.6)]"
                      : rowError || colorError
                        ? "border-red-500/40"
                        : "border-panel-line/[0.1]"
                  )}
                >
                  {dirty && <span aria-hidden="true" className="absolute inset-y-0 start-0 w-[3px] bg-gradient-to-b from-[#FF6A00] to-[#FF8A2A]" />}

                  <div className="flex flex-col lg:flex-row">
                    {/* Car + colour */}
                    <div className="shrink-0 space-y-3 border-b border-panel-line/[0.08] bg-panel-surface-2/40 p-3.5 sm:p-4 lg:w-72 lg:border-b-0 lg:border-e">
                      <div className="flex items-start gap-2.5">
                        <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg bg-panel-line/[0.06] px-1.5 font-mono text-[11px] font-bold text-panel-faint">
                          {toPersianDigits((indexById.get(car.id) ?? 0) + 1)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1.5 break-words text-sm font-extrabold leading-5 text-panel-text">
                            <span
                              aria-hidden="true"
                              className={cn(
                                "h-1.5 w-1.5 shrink-0 rounded-full",
                                dirty ? "bg-[#FF6A00] shadow-[0_0_8px_#FF6A00]" : filled ? "bg-panel-success" : "bg-panel-line/30"
                              )}
                            />
                            {car.name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-panel-faint">{car.brandName}</p>
                          <div className="mt-1.5 flex flex-wrap gap-1 text-[10px]">
                            <span className="rounded-md bg-panel-line/[0.06] px-1.5 py-0.5 font-semibold text-panel-muted-2">
                              مدل {toPersianDigits(car.model)}
                            </span>
                            <span className="rounded-md bg-panel-line/[0.06] px-1.5 py-0.5 font-semibold text-panel-muted-2">
                              سال {toPersianDigits(car.year)}
                            </span>
                            {dirty && (
                              <span className="rounded-md bg-[#FF6A00]/10 px-1.5 py-0.5 font-bold text-panel-accent">ذخیره نشده</span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => clearRow(car)}
                          disabled={isPending || !filled}
                          title="پاک کردن این خودرو"
                          aria-label={`پاک کردن ردیف ${car.name}`}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-panel-line/[0.1] text-panel-faint transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-panel-danger disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Eraser className="h-4 w-4" />
                        </button>
                      </div>

                      <div>
                        <label htmlFor={`color-${car.id}`} className="mb-1 block text-[10px] font-bold text-panel-muted">
                          رنگ
                        </label>
                        <div className="relative">
                          <select
                            id={`color-${car.id}`}
                            value={draft.colorId}
                            onChange={(e) => {
                              const colorId = e.target.value;
                              updateDraft(car.id, (current) => ({ ...current, colorId }));
                            }}
                            aria-invalid={Boolean(colorError)}
                            disabled={isPending}
                            className={cn(inputBase, borderFor(Boolean(colorError)), "h-10 px-3 text-[13px]", selectedColor && "ps-8")}
                          >
                            <option value="">انتخاب رنگ</option>
                            {colors.map((color) => (
                              <option key={color.id} value={color.id}>
                                {color.name}
                              </option>
                            ))}
                          </select>
                          {selectedColor && (
                            <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center">
                              <ColorSwatch code={selectedColor.code} />
                            </span>
                          )}
                        </div>
                        <ErrorText message={colorError} />
                      </div>
                    </div>

                    {/* Year tiers */}
                    <div className="min-w-0 flex-1 space-y-2 p-3 sm:p-4">
                      <div className={cn(tierGridClass, "hidden px-1 text-[10px] font-extrabold text-panel-muted sm:grid")} aria-hidden="true">
                        <span>سال ساخت</span>
                        {PRICE_TABLE_PRICE_FIELDS.map((field) => (
                          <span key={field.key}>{field.label} ($)</span>
                        ))}
                        <span />
                      </div>

                      {draft.tiers.map((tier, index) => {
                        const yearError =
                          fieldErrors[`${car.id}.${index}.year`] ??
                          (duplicates.has(tier.year) ? "این سال تکراری است" : undefined);
                        const priced = isTierPriced(tier);
                        return (
                          <div
                            key={tier.key}
                            className={cn(
                              tierGridClass,
                              "panel-card-in rounded-xl border p-2 transition-colors",
                              priced ? "border-panel-line/[0.08] bg-panel-bg/50" : "border-dashed border-panel-line/[0.12] bg-transparent"
                            )}
                          >
                            {/* Year (+ remove on phones) */}
                            <div className="flex items-start gap-2 sm:block">
                              <div className="min-w-0 flex-1">
                                <label htmlFor={`${tier.key}-year`} className="mb-1 block text-[10px] font-bold text-panel-muted sm:sr-only">
                                  سال ساخت
                                </label>
                                <div className="relative">
                                  <span className="pointer-events-none absolute inset-y-0 start-2.5 flex items-center text-panel-accent">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                  </span>
                                  <input
                                    id={`${tier.key}-year`}
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    maxLength={4}
                                    value={toPersianDigits(tier.year)}
                                    onChange={(e) => updateTier(car.id, tier.key, { year: normalizeYear(e.target.value) })}
                                    placeholder="سال"
                                    aria-label={`سال ساخت ردیف ${toPersianDigits(index + 1)} ${car.name}`}
                                    aria-invalid={Boolean(yearError)}
                                    disabled={isPending}
                                    className={cn(
                                      inputBase,
                                      borderFor(Boolean(yearError)),
                                      "h-10 ps-8 pe-2 text-center font-mono text-[13px] font-black tracking-wider text-panel-accent"
                                    )}
                                  />
                                </div>
                                <ErrorText message={yearError} />
                              </div>
                              {draft.tiers.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeTier(car.id, tier.key)}
                                  disabled={isPending}
                                  aria-label={`حذف سال ${toPersianDigits(tier.year)} از ${car.name}`}
                                  className="mt-[18px] inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-panel-line/[0.1] text-panel-faint transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-panel-danger disabled:opacity-40 sm:hidden"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>

                            {/* Prices: 3 columns on phones too */}
                            <div className="mt-2 grid grid-cols-3 gap-1.5 sm:contents">
                              {PRICE_TABLE_PRICE_FIELDS.map((field) => {
                                const error = fieldErrors[`${car.id}.${index}.${field.key}`];
                                const inputId = `${tier.key}-${field.key}`;
                                return (
                                  <div key={field.key} className="min-w-0">
                                    <label htmlFor={inputId} className="mb-1 block truncate text-[10px] font-bold text-panel-muted sm:sr-only">
                                      {SHORT_PRICE_LABELS[field.key]}
                                    </label>
                                    <div className="relative">
                                      <input
                                        id={inputId}
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="off"
                                        value={formatPersianNumber(tier[field.key])}
                                        onChange={(e) => updateTier(car.id, tier.key, { [field.key]: normalizeUsdPrice(e.target.value) })}
                                        placeholder={SHORT_PRICE_LABELS[field.key]}
                                        aria-label={`${field.label} سال ${toPersianDigits(tier.year)} ${car.name}`}
                                        aria-invalid={Boolean(error)}
                                        disabled={isPending}
                                        className={cn(
                                          inputBase,
                                          borderFor(Boolean(error)),
                                          "h-10 px-2 text-[12px] font-semibold sm:pe-7 sm:ps-3 sm:text-[13px]"
                                        )}
                                      />
                                      <span className="pointer-events-none absolute inset-y-0 end-2.5 hidden items-center text-xs font-black text-panel-faint sm:flex">
                                        $
                                      </span>
                                    </div>
                                    <ErrorText message={error} />
                                  </div>
                                );
                              })}
                            </div>

                            {/* Remove (tablet / desktop) */}
                            <div className="hidden sm:block">
                              {draft.tiers.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeTier(car.id, tier.key)}
                                  disabled={isPending}
                                  title="حذف این سال"
                                  aria-label={`حذف سال ${toPersianDigits(tier.year)} از ${car.name}`}
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-panel-line/[0.1] text-panel-faint transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-panel-danger disabled:opacity-40"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      <ErrorText message={rowError} />

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => addTier(car)}
                          disabled={isPending || !canAddTier}
                          className={cn(
                            "group inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-[#FF6A00]/40 bg-[#FF6A00]/[0.05] px-3.5 text-xs font-extrabold text-panel-accent transition-all",
                            "hover:border-solid hover:border-[#FF6A00]/60 hover:bg-[#FF6A00]/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                          )}
                        >
                          <CalendarPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
                          افزودن سال
                          {suggestedYear && (
                            <span className="rounded-md bg-[#FF6A00]/15 px-1.5 py-0.5 font-mono text-[10px] text-panel-accent">
                              {toPersianDigits(suggestedYear)}
                            </span>
                          )}
                        </button>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-panel-faint">
                          <Layers className="h-3 w-3" />
                          {toPersianDigits(draft.tiers.length)} از {toPersianDigits(PRICE_TABLE_MAX_TIERS)} سال
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* Floating save bar (shown only with unsaved changes) */}
      {isDirty && (
        <div className="panel-card-in sticky bottom-[calc(var(--panel-dock-space)+0.25rem)] z-30">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#FF6A00]/30 bg-panel-surface/95 px-4 py-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md">
            <p className="text-xs font-bold text-panel-text-2">
              {toPersianDigits(dirtyIds.size)} خودرو تغییر کرده و ذخیره نشده است
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
