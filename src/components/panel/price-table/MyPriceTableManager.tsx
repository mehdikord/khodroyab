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

/**
 * One price tier as edited: `key` is a client-only id; year and prices are
 * digit strings and `colorId` a colour id ("" = blank / not chosen).
 */
interface TierDraft extends Record<PriceTablePriceField, string> {
  key: string;
  year: string;
  colorId: string;
}

/** One car as edited: its tiers (never empty). */
interface Draft {
  tiers: TierDraft[];
}

type Drafts = Record<string, Draft>;

type RowFilter = "all" | "filled" | "empty";

let tierSeq = 0;
const nextTierKey = () => `tier-${++tierSeq}`;

function emptyTier(year: string, colorId: string): TierDraft {
  return { key: nextTierKey(), year, colorId, priceUsd: "", clearancePrice: "", instantPrice: "" };
}

/** A fresh row: one tier with the car's year and the car's colour (both editable). */
function emptyDraft(car: PriceTableCarRecord): Draft {
  return { tiers: [emptyTier(defaultTierYear(car.year), car.colorId ?? "")] };
}

function toDrafts(cars: PriceTableCarRecord[], entries: PriceTableEntryRecord[]): Drafts {
  const byCar = new Map(entries.map((entry) => [entry.carId, entry]));
  const drafts: Drafts = {};
  for (const car of cars) {
    const entry = byCar.get(car.id);
    drafts[car.id] =
      entry && entry.tiers.length > 0
        ? {
            tiers: entry.tiers.map((tier) => ({
              key: nextTierKey(),
              year: tier.year,
              colorId: tier.colorId,
              priceUsd: tier.priceUsd ?? "",
              clearancePrice: tier.clearancePrice ?? "",
              instantPrice: tier.instantPrice ?? "",
            })),
          }
        : emptyDraft(car);
  }
  return drafts;
}

function isTierPriced(tier: TierDraft): boolean {
  return PRICE_TABLE_PRICE_FIELDS.some(({ key }) => tier[key].length > 0);
}

function isFilled(draft: Draft): boolean {
  return draft.tiers.some(isTierPriced);
}

function sameDraft(a: Draft, b: Draft): boolean {
  if (a.tiers.length !== b.tiers.length) return false;
  return a.tiers.every((tier, index) => {
    const other = b.tiers[index];
    return (
      tier.year === other.year &&
      tier.colorId === other.colorId &&
      PRICE_TABLE_PRICE_FIELDS.every(({ key }) => tier[key] === other[key])
    );
  });
}

/** Year proposed for a "new year" tier: one after the newest year already in the row. */
function suggestNextYear(draft: Draft, car: PriceTableCarRecord): string {
  const years = draft.tiers.map((tier) => tier.year).filter(isValidTierYear).map(Number);
  if (years.length === 0) return defaultTierYear(car.year);
  const next = String(Math.max(...years) + 1);
  return isValidTierYear(next) ? next : "";
}

/** Tier keys whose (year, colour) pair already appears earlier in the row (live warning). */
function duplicateTierKeys(draft: Draft): Set<string> {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const tier of draft.tiers) {
    if (tier.year.length !== 4 || !tier.colorId) continue;
    const combo = `${tier.year}:${tier.colorId}`;
    if (seen.has(combo)) duplicates.add(tier.key);
    else seen.add(combo);
  }
  return duplicates;
}

const SHORT_PRICE_LABELS: Record<PriceTablePriceField, string> = {
  priceUsd: "خام",
  clearancePrice: "ترخیصی",
  instantPrice: "فوری",
};

const DUPLICATE_MESSAGE = "این سال با همین رنگ قبلاً در این خودرو ثبت شده است";

const inputBase = cn(
  "w-full rounded-xl border bg-panel-bg text-panel-text outline-none transition-all placeholder:text-panel-faint",
  "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15 disabled:cursor-not-allowed disabled:opacity-60"
);

const borderFor = (hasError: boolean) => (hasError ? "border-red-500/60" : "border-panel-line/[0.12] hover:border-panel-line/25");

/** Tier grid on `md+`: year | colour | raw | clearance | instant | remove (header and every tier row). */
const tierGridClass = "md:grid md:grid-cols-[6.5rem_minmax(8.5rem,10rem)_repeat(3,minmax(0,1fr))_2.5rem] md:items-start md:gap-2";

const FILTERS: { key: RowFilter; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "filled", label: "قیمت‌گذاری‌شده" },
  { key: "empty", label: "بدون قیمت" },
];

function ErrorText({ message, className }: { message: string | undefined; className?: string }) {
  if (!message) return null;
  return <p className={cn("mt-1 text-[10px] font-semibold leading-4 text-panel-danger-2", className)}>{message}</p>;
}

/**
 * The customer's own price table, edited inline. Every car the admin allowed
 * is a card with one or more *price tiers*: a production year (typed by the
 * customer, prefilled with the car's year), a colour from the catalogue and
 * the raw, clearance and instant USD prices. The same year may appear with
 * different colours, but a (year, colour) pair only once per car. Changes are
 * saved together.
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
        (draft?.tiers.some((tier) => colorById.get(tier.colorId)?.name.toLowerCase().includes(normalized)) ?? false) ||
        (digits.length > 0 &&
          (car.year.includes(digits) || car.model.includes(digits) || (draft?.tiers.some((tier) => tier.year.includes(digits)) ?? false)))
      );
    });
  }, [cars, drafts, query, filter, colorById]);

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
      tiers: draft.tiers.map((tier) => (tier.key === tierKey ? { ...tier, ...patch } : tier)),
    }));
  }

  /** Append a tier and focus its first empty input. */
  function appendTier(car: PriceTableCarRecord, tier: TierDraft) {
    if (draftOf(car).tiers.length >= PRICE_TABLE_MAX_TIERS) return;
    updateDraft(car.id, (current) => ({ tiers: [...current.tiers, tier] }));
    const focusField = !tier.year ? "year" : !tier.colorId ? "colorId" : "priceUsd";
    window.requestAnimationFrame(() => document.getElementById(`${tier.key}-${focusField}`)?.focus());
  }

  /** "سال جدید": the year after the newest one, in the last tier's colour. */
  function addYear(car: PriceTableCarRecord) {
    const draft = draftOf(car);
    const last = draft.tiers[draft.tiers.length - 1];
    appendTier(car, emptyTier(suggestNextYear(draft, car), last?.colorId ?? ""));
  }

  /** "رنگ دیگر": the last tier's year, colour left for the customer to pick. */
  function addColor(car: PriceTableCarRecord) {
    const draft = draftOf(car);
    const last = draft.tiers[draft.tiers.length - 1];
    appendTier(car, emptyTier(last?.year || defaultTierYear(car.year), ""));
  }

  function removeTier(carId: string, tierKey: string) {
    updateDraft(carId, (draft) => (draft.tiers.length <= 1 ? draft : { tiers: draft.tiers.filter((tier) => tier.key !== tierKey) }));
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
        cars.map((car) => ({
          carId: car.id,
          tiers: draftOf(car).tiers.map(({ key: _key, ...tier }) => tier),
        }))
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
                {stats.tiers > 0 && <span className="text-panel-faint"> · {toPersianDigits(stats.tiers)} ردیف قیمت</span>}
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
          { icon: CalendarDays, title: "سال و رنگ را انتخاب کنید", text: "سال پیش‌فرض، سال ساخت خودرو است و هر دو قابل تغییرند." },
          { icon: Table2, title: "قیمت‌ها را وارد کنید", text: "قیمت خام، ترخیصی و فوری به دلار؛ یکی از آن‌ها کافی است." },
          { icon: Layers, title: "ردیف‌های بیشتر اضافه کنید", text: "سال جدید، یا همان سال با رنگ دیگر؛ هر سال و رنگ فقط یک بار." },
        ].map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={step.title} className="flex items-start gap-3 rounded-2xl border border-panel-line/[0.08] bg-panel-surface px-3.5 py-3">
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
          هنوز رنگی توسط مدیر تعریف نشده است؛ تا زمان تعریف رنگ‌ها امکان ثبت قیمت وجود ندارد.
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
                placeholder="جستجو در نام، برند، مدل، سال یا رنگ..."
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
              const rowError = fieldErrors[`${car.id}.tiers`];
              const duplicates = duplicateTierKeys(draft);
              const canAddTier = draft.tiers.length < PRICE_TABLE_MAX_TIERS;
              const suggestedYear = canAddTier ? suggestNextYear(draft, car) : "";
              const lastYear = draft.tiers[draft.tiers.length - 1]?.year ?? "";
              const hasErrors = Object.keys(fieldErrors).some((key) => key.startsWith(`${car.id}.`)) || duplicates.size > 0;

              return (
                <article
                  key={car.id}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border bg-panel-surface transition-colors",
                    hasErrors
                      ? "border-red-500/40"
                      : dirty
                        ? "border-[#FF6A00]/40 shadow-[0_0_0_1px_rgba(255,106,0,0.08),0_18px_40px_-28px_rgba(255,106,0,0.6)]"
                        : "border-panel-line/[0.1]"
                  )}
                >
                  {dirty && <span aria-hidden="true" className="absolute inset-y-0 start-0 w-[3px] bg-gradient-to-b from-[#FF6A00] to-[#FF8A2A]" />}

                  {/* Car header */}
                  <div className="flex items-start gap-2.5 border-b border-panel-line/[0.08] bg-panel-surface-2/40 px-3.5 py-3 sm:px-4">
                    <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg bg-panel-line/[0.06] px-1.5 font-mono text-[11px] font-bold text-panel-faint">
                      {toPersianDigits((indexById.get(car.id) ?? 0) + 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-extrabold leading-5 text-panel-text">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "h-1.5 w-1.5 shrink-0 rounded-full",
                              dirty ? "bg-[#FF6A00] shadow-[0_0_8px_#FF6A00]" : filled ? "bg-panel-success" : "bg-panel-line/30"
                            )}
                          />
                          {car.name}
                        </span>
                        <span className="text-[11px] font-semibold text-panel-faint">{car.brandName}</span>
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1 text-[10px]">
                        <span className="rounded-md bg-panel-line/[0.06] px-1.5 py-0.5 font-semibold text-panel-muted-2">مدل {toPersianDigits(car.model)}</span>
                        <span className="rounded-md bg-panel-line/[0.06] px-1.5 py-0.5 font-semibold text-panel-muted-2">سال {toPersianDigits(car.year)}</span>
                        {dirty && <span className="rounded-md bg-[#FF6A00]/10 px-1.5 py-0.5 font-bold text-panel-accent">ذخیره نشده</span>}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => clearRow(car)}
                      disabled={isPending || !filled}
                      title="پاک کردن قیمت‌های این خودرو"
                      aria-label={`پاک کردن ردیف ${car.name}`}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-panel-line/[0.1] text-panel-faint transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-panel-danger disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Eraser className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Tiers */}
                  <div className="space-y-2 p-3 sm:p-4">
                    <div className={cn(tierGridClass, "hidden px-2 text-[10px] font-extrabold text-panel-muted md:grid")} aria-hidden="true">
                      <span>سال ساخت</span>
                      <span>رنگ</span>
                      {PRICE_TABLE_PRICE_FIELDS.map((field) => (
                        <span key={field.key}>{field.label} ($)</span>
                      ))}
                      <span />
                    </div>

                    {draft.tiers.map((tier, index) => {
                      const duplicate = duplicates.has(tier.key);
                      const comboError = fieldErrors[`${car.id}.${index}.combo`] ?? (duplicate ? DUPLICATE_MESSAGE : undefined);
                      const yearError = fieldErrors[`${car.id}.${index}.year`];
                      const colorError = fieldErrors[`${car.id}.${index}.colorId`];
                      const selectedColor = colorById.get(tier.colorId) ?? null;
                      const priced = isTierPriced(tier);

                      const removeButton = (className: string) =>
                        draft.tiers.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => removeTier(car.id, tier.key)}
                            disabled={isPending}
                            title="حذف این ردیف"
                            aria-label={`حذف ردیف ${toPersianDigits(index + 1)} از ${car.name}`}
                            className={cn(
                              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-panel-line/[0.1] text-panel-faint transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-panel-danger disabled:opacity-40",
                              className
                            )}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : null;

                      return (
                        <div
                          key={tier.key}
                          className={cn(
                            "panel-card-in rounded-xl border p-2 transition-colors",
                            comboError
                              ? "border-red-500/50 bg-red-500/[0.04]"
                              : priced
                                ? "border-panel-line/[0.08] bg-panel-bg/50"
                                : "border-dashed border-panel-line/[0.12] bg-transparent"
                          )}
                        >
                          <div className={tierGridClass}>
                            {/* Year + colour (+ remove on phones) */}
                            <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_auto] items-start gap-2 md:contents">
                              <div className="min-w-0">
                                <label htmlFor={`${tier.key}-year`} className="mb-1 block text-[10px] font-bold text-panel-muted md:sr-only">
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
                                    aria-invalid={Boolean(yearError || comboError)}
                                    disabled={isPending}
                                    className={cn(
                                      inputBase,
                                      borderFor(Boolean(yearError || comboError)),
                                      "h-10 pe-2 ps-8 text-center font-mono text-[13px] font-black tracking-wider text-panel-accent"
                                    )}
                                  />
                                </div>
                                <ErrorText message={yearError} />
                              </div>

                              <div className="min-w-0">
                                <label htmlFor={`${tier.key}-colorId`} className="mb-1 block text-[10px] font-bold text-panel-muted md:sr-only">
                                  رنگ
                                </label>
                                <div className="relative">
                                  <select
                                    id={`${tier.key}-colorId`}
                                    value={tier.colorId}
                                    onChange={(e) => updateTier(car.id, tier.key, { colorId: e.target.value })}
                                    aria-label={`رنگ ردیف ${toPersianDigits(index + 1)} ${car.name}`}
                                    aria-invalid={Boolean(colorError || comboError)}
                                    disabled={isPending}
                                    className={cn(
                                      inputBase,
                                      borderFor(Boolean(colorError || comboError)),
                                      "h-10 pe-2 text-[13px]",
                                      selectedColor ? "ps-8" : "ps-3"
                                    )}
                                  >
                                    <option value="">انتخاب رنگ</option>
                                    {colors.map((color) => (
                                      <option key={color.id} value={color.id}>
                                        {color.name}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center">
                                    {selectedColor ? <ColorSwatch code={selectedColor.code} /> : null}
                                  </span>
                                </div>
                                <ErrorText message={colorError} />
                              </div>

                              {removeButton("mt-[18px] md:hidden")}
                            </div>

                            {/* Prices: 3 columns on phones too */}
                            <div className="mt-2 grid grid-cols-3 gap-1.5 md:contents">
                              {PRICE_TABLE_PRICE_FIELDS.map((field) => {
                                const error = fieldErrors[`${car.id}.${index}.${field.key}`];
                                const inputId = `${tier.key}-${field.key}`;
                                return (
                                  <div key={field.key} className="min-w-0">
                                    <label htmlFor={inputId} className="mb-1 block truncate text-[10px] font-bold text-panel-muted md:sr-only">
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
                                        aria-label={`${field.label} ردیف ${toPersianDigits(index + 1)} ${car.name}`}
                                        aria-invalid={Boolean(error)}
                                        disabled={isPending}
                                        className={cn(
                                          inputBase,
                                          borderFor(Boolean(error)),
                                          "h-10 px-2 text-[12px] font-semibold md:pe-7 md:ps-3 md:text-[13px]"
                                        )}
                                      />
                                      <span className="pointer-events-none absolute inset-y-0 end-2.5 hidden items-center text-xs font-black text-panel-faint md:flex">
                                        $
                                      </span>
                                    </div>
                                    <ErrorText message={error} />
                                  </div>
                                );
                              })}
                            </div>

                            {/* Remove (tablet / desktop) */}
                            <div className="hidden md:block">{removeButton("")}</div>
                          </div>

                          {comboError && (
                            <p className="mt-1.5 flex items-center gap-1.5 px-1 text-[11px] font-semibold text-panel-danger-2">
                              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                              {comboError}
                            </p>
                          )}
                        </div>
                      );
                    })}

                    <ErrorText message={rowError} />

                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => addYear(car)}
                        disabled={isPending || !canAddTier}
                        className={cn(
                          "group inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-[#FF6A00]/40 bg-[#FF6A00]/[0.05] px-3.5 text-xs font-extrabold text-panel-accent transition-all",
                          "hover:border-solid hover:border-[#FF6A00]/60 hover:bg-[#FF6A00]/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                        )}
                      >
                        <CalendarPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
                        سال جدید
                        {suggestedYear && (
                          <span className="rounded-md bg-[#FF6A00]/15 px-1.5 py-0.5 font-mono text-[10px] text-panel-accent">
                            {toPersianDigits(suggestedYear)}
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => addColor(car)}
                        disabled={isPending || !canAddTier || colors.length < 2}
                        className={cn(
                          "group inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-panel-line/[0.18] bg-panel-line/[0.03] px-3.5 text-xs font-extrabold text-panel-text-2 transition-all",
                          "hover:border-solid hover:border-[#FF6A00]/50 hover:text-panel-accent active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                        )}
                      >
                        <Palette className="h-4 w-4 transition-transform group-hover:scale-110" />
                        رنگ دیگر
                        {lastYear && (
                          <span className="rounded-md bg-panel-line/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-panel-muted">
                            {toPersianDigits(lastYear)}
                          </span>
                        )}
                      </button>
                      <span className="ms-auto inline-flex items-center gap-1 text-[10px] font-semibold text-panel-faint">
                        <Layers className="h-3 w-3" />
                        {toPersianDigits(draft.tiers.length)} از {toPersianDigits(PRICE_TABLE_MAX_TIERS)} ردیف
                      </span>
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
            <p className="text-xs font-bold text-panel-text-2">{toPersianDigits(dirtyIds.size)} خودرو تغییر کرده و ذخیره نشده است</p>
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
