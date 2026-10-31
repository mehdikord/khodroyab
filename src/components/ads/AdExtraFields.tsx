"use client";

import React, { useId, useRef } from "react";
import { Check, ImagePlus, Star, Trash2 } from "lucide-react";

import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import type { AdExtrasState } from "@/components/ads/useAdExtras";
import { AD_IMAGE_MAX_COUNT } from "@/lib/ad-form-shared";
import type { ColorRecord } from "@/lib/colors";
import type { OptionRecord } from "@/lib/options";
import { cn, toPersianDigits } from "@/lib/utils";

/** The admin panel is always dark; the customer panel follows its theme tokens. */
const THEMES = {
  admin: {
    input: "border-white/[0.12] bg-[#07090C] text-[#F5F5F5] placeholder:text-[#5E6672] hover:border-white/20",
    label: "text-[#D2D7DF]",
    title: "text-[#F5F5F5]",
    hint: "text-[#5E6672]",
    error: "text-red-400",
    tile: "border-white/[0.08] bg-[#07090C]/60",
    chip: "border-white/[0.1] bg-[#0D1117] text-[#9BA3AE] hover:border-white/20 hover:text-[#F5F5F5]",
    chipOn: "border-[#FF6A00]/60 bg-[#FF6A00]/15 text-[#FFB070]",
    media: "bg-[#07090C]",
  },
  panel: {
    input: "border-panel-line/[0.12] bg-panel-bg text-panel-text placeholder:text-panel-faint hover:border-panel-line/20",
    label: "text-panel-text-2",
    title: "text-panel-text",
    hint: "text-panel-faint",
    error: "text-panel-danger-2",
    tile: "border-panel-line/[0.08] bg-panel-bg/60",
    chip: "border-panel-line/[0.1] bg-panel-surface text-panel-muted hover:border-panel-line/20 hover:text-panel-text",
    chipOn: "border-[#FF6A00]/60 bg-[#FF6A00]/15 text-panel-accent",
    media: "bg-panel-media",
  },
};

export type AdFieldTheme = keyof typeof THEMES;

interface AdExtraFieldsProps {
  theme: AdFieldTheme;
  extras: AdExtrasState;
  colors: ColorRecord[];
  options: OptionRecord[];
  fieldErrors: Record<string, string>;
  disabled: boolean;
}

function fieldClass(theme: AdFieldTheme, hasError: boolean) {
  return cn(
    "h-12 w-full rounded-xl border px-4 text-sm outline-none transition-all disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    THEMES[theme].input,
    hasError && "border-red-500/50"
  );
}

/** Photo picker: add several files, remove any, and mark the primary one. */
export function AdImagesField({ theme, extras, fieldErrors, disabled }: Omit<AdExtraFieldsProps, "colors" | "options">) {
  const t = THEMES[theme];
  const inputRef = useRef<HTMLInputElement>(null);
  const { images } = extras;
  const error = extras.imageError ?? fieldErrors.images;

  return (
    <section className="space-y-3">
      <div>
        <h3 className={cn("text-sm font-extrabold", t.title)}>تصاویر آگهی</h3>
        <p className={cn("mt-0.5 text-[11px] leading-5", t.hint)}>
          اختیاری؛ تا {toPersianDigits(AD_IMAGE_MAX_COUNT)} تصویر، هر کدام حداکثر ۲ مگابایت. اگر چند تصویر دارید، تصویر اصلی را با ستاره مشخص کنید.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {images.map((image) => {
          const isPrimary = image.key === extras.primaryKey;
          return (
            <div
              key={image.key}
              className={cn("relative aspect-[4/3] overflow-hidden rounded-2xl border", t.media, isPrimary ? "border-[#FF6A00] ring-2 ring-[#FF6A00]/30" : t.tile)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="h-full w-full object-cover" />
              {isPrimary && (
                <span className="absolute bottom-1.5 start-1.5 rounded-md bg-[#FF6A00] px-1.5 py-0.5 text-[10px] font-extrabold text-[#07090C]">تصویر اصلی</span>
              )}
              <div className="absolute end-1.5 top-1.5 flex gap-1">
                <button
                  type="button"
                  onClick={() => extras.setPrimaryKey(image.key)}
                  disabled={disabled}
                  aria-pressed={isPrimary}
                  title="انتخاب به عنوان تصویر اصلی"
                  aria-label="انتخاب به عنوان تصویر اصلی"
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-sm transition-colors disabled:opacity-50",
                    isPrimary ? "bg-[#FF6A00] text-[#07090C]" : "bg-black/60 text-white hover:bg-[#FF6A00] hover:text-[#07090C]"
                  )}
                >
                  <Star className={cn("h-4 w-4", isPrimary && "fill-current")} />
                </button>
                <button
                  type="button"
                  onClick={() => extras.removeImage(image.key)}
                  disabled={disabled}
                  title="حذف تصویر"
                  aria-label="حذف تصویر"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-red-500 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {images.length < AD_IMAGE_MAX_COUNT && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className={cn(
              "flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed text-xs font-bold transition-colors hover:border-[#FF6A00]/50 disabled:opacity-50",
              t.tile,
              t.label
            )}
          >
            <ImagePlus className="h-6 w-6 text-[#FF8A2A]" />
            افزودن تصویر
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={(event) => {
          extras.addFiles(event.target.files);
          event.target.value = "";
        }}
      />
      {error && <p className={cn("text-xs font-semibold", t.error)}>{error}</p>}
    </section>
  );
}

/** Production year, colour and the admin-defined options of the car form. */
export function AdSpecFields({ theme, extras, colors, options, fieldErrors, disabled }: AdExtraFieldsProps) {
  const t = THEMES[theme];
  const yearId = useId();
  const labelClass = cn("block text-xs font-bold", t.label);
  const required = <span className="text-[#FF6A00]">*</span>;

  return (
    <section className="space-y-5">
      <div className="space-y-2 sm:max-w-xs">
        <label htmlFor={yearId} className={labelClass}>
          سال ساخت خودرو {required}
        </label>
        <input
          id={yearId}
          type="text"
          inputMode="numeric"
          dir="ltr"
          maxLength={4}
          disabled={disabled}
          value={extras.year}
          onChange={(e) => extras.setYear(e.target.value)}
          placeholder="مثال: 2024 یا 1403"
          className={cn(fieldClass(theme, Boolean(fieldErrors.year)), "text-start font-mono")}
        />
        {fieldErrors.year && <p className={cn("text-xs font-semibold", t.error)}>{fieldErrors.year}</p>}
      </div>

      <div className="space-y-2">
        <p className={labelClass}>رنگ خودرو {required}</p>
        {colors.length === 0 ? (
          <p className={cn("text-xs font-semibold", t.error)}>هنوز رنگی در سامانه تعریف نشده است.</p>
        ) : (
          <div role="radiogroup" aria-label="رنگ خودرو" className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const selected = extras.colorId === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={disabled}
                  onClick={() => extras.setColorId(color.id)}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition-colors disabled:opacity-60",
                    selected ? t.chipOn : t.chip
                  )}
                >
                  <ColorSwatch code={color.code} />
                  {color.name}
                </button>
              );
            })}
          </div>
        )}
        {fieldErrors.colorId && <p className={cn("text-xs font-semibold", t.error)}>{fieldErrors.colorId}</p>}
      </div>

      {options.length > 0 && (
        <div className="space-y-4">
          <h3 className={cn("text-sm font-extrabold", t.title)}>ویژگی‌های خودرو</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {options.map((option) => (
              <OptionField
                key={option.id}
                theme={theme}
                option={option}
                extras={extras}
                error={fieldErrors[`options.${option.id}`]}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function OptionField({
  theme,
  option,
  extras,
  error,
  disabled,
}: {
  theme: AdFieldTheme;
  option: OptionRecord;
  extras: AdExtrasState;
  error?: string;
  disabled: boolean;
}) {
  const t = THEMES[theme];
  const id = useId();
  const value = extras.optionValues[option.id];
  const hint = option.description && <p className={cn("text-[11px] leading-5", t.hint)}>{option.description}</p>;
  const errorLine = error && <p className={cn("text-xs font-semibold", t.error)}>{error}</p>;
  const label = (
    <>
      {option.name} {option.isRequired && <span className="text-[#FF6A00]">*</span>}
    </>
  );

  if (option.type === "checkbox") {
    const checked = value === true;
    return (
      <div className="space-y-1.5 self-end">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => extras.setOptionValue(option.id, !checked)}
          className={cn(
            "flex h-12 w-full items-center gap-3 rounded-xl border px-4 text-sm font-bold transition-colors disabled:opacity-60",
            checked ? t.chipOn : t.chip
          )}
        >
          <span className={cn("flex h-5 w-5 items-center justify-center rounded-md border", checked ? "border-[#FF6A00] bg-[#FF6A00] text-[#07090C]" : "border-current opacity-50")}>
            {checked && <Check className="h-3.5 w-3.5" />}
          </span>
          {option.name}
        </button>
        {hint}
        {errorLine}
      </div>
    );
  }

  if (option.type === "select") {
    const chosen = Array.isArray(value) ? value : [];
    if (option.multiple) {
      return (
        <div className="space-y-2 sm:col-span-2">
          <p className={cn("block text-xs font-bold", t.label)}>{label}</p>
          <div className="flex flex-wrap gap-2">
            {option.optionItems.map((item) => {
              const selected = chosen.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  disabled={disabled}
                  onClick={() =>
                    extras.setOptionValue(option.id, selected ? chosen.filter((itemId) => itemId !== item.id) : [...chosen, item.id])
                  }
                  className={cn("inline-flex h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition-colors disabled:opacity-60", selected ? t.chipOn : t.chip)}
                >
                  {selected && <Check className="h-3.5 w-3.5" />}
                  {item.title}
                </button>
              );
            })}
          </div>
          {hint}
          {errorLine}
        </div>
      );
    }
    return (
      <div className="space-y-2">
        <label htmlFor={id} className={cn("block text-xs font-bold", t.label)}>
          {label}
        </label>
        <select
          id={id}
          disabled={disabled}
          value={chosen[0] ?? ""}
          onChange={(e) => extras.setOptionValue(option.id, e.target.value ? [e.target.value] : [])}
          className={fieldClass(theme, Boolean(error))}
        >
          <option value="">انتخاب کنید</option>
          {option.optionItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
        {hint}
        {errorLine}
      </div>
    );
  }

  const isNumber = option.type === "number";
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={cn("block text-xs font-bold", t.label)}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode={isNumber ? "decimal" : undefined}
        dir={isNumber ? "ltr" : undefined}
        maxLength={isNumber ? 30 : 255}
        disabled={disabled}
        value={typeof value === "string" ? value : ""}
        onChange={(e) => extras.setOptionValue(option.id, e.target.value)}
        className={cn(fieldClass(theme, Boolean(error)), isNumber && "text-start font-mono")}
      />
      {hint}
      {errorLine}
    </div>
  );
}
