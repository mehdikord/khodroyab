import React from "react";
import { CalendarDays, Crown, Fingerprint } from "lucide-react";

import { SafeImage } from "@/components/panel/SafeImage";
import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import {
  ALL_PRICE_FIELD_KEYS,
  PRICE_TABLE_EMPTY,
  priceFieldsFor,
  type PriceColumn,
  type PriceTableAnyPriceField,
  type PriceTablePriceField,
} from "@/lib/price-table-shared";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";
import { CURRENCY_LABELS, convertPrice, currencyLabel, type PriceCurrency } from "@/lib/currency";

function initials(name: string, count: number): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  return parts
    .slice(0, count)
    .map((part) => part.slice(0, 1))
    .join("")
    .toUpperCase();
}

/** Brand logo on a light tile (logos are usually drawn for white); falls back to the initial. */
export function BrandLogo({ name, image, className }: { name: string; image: string | null; className?: string }) {
  const fallback = (
    <span className="flex h-full w-full items-center justify-center text-[11px] font-black text-panel-accent">
      {initials(name, 1)}
    </span>
  );
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-panel-line/[0.1] bg-white/95 p-1 shadow-sm",
        !image && "bg-[#FF6A00]/[0.1]",
        className
      )}
    >
      {image ? <SafeImage src={image} alt="" className="h-full w-full object-contain" fallback={fallback} /> : fallback}
    </span>
  );
}

/** Round user avatar with initials fallback. */
/** Colour name with its swatch, or the empty placeholder. */
export function ColorLabel({ name, code, className }: { name: string | null; code: string | null; className?: string }) {
  if (!name || !code) return <span className={cn("text-panel-faint", className)}>{PRICE_TABLE_EMPTY}</span>;
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-panel-text-2", className)}>
      <ColorSwatch code={code} className="h-3.5 w-3.5" />
      {name}
    </span>
  );
}

/**
 * A price in dollars or rials. `best` marks the lowest price of its column (emerald + crown),
 * `partner` marks a collaborator price (sky badge); the default style is the
 * accent badge. Blank prices show "---".
 */
export function PriceTag({
  price,
  currency = "usd",
  best = false,
  partner = false,
  size = "md",
  className,
}: {
  price: string | null | undefined;
  currency?: PriceCurrency;
  best?: boolean;
  partner?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  if (!price) return <span className={cn("font-semibold text-panel-faint", className)}>{PRICE_TABLE_EMPTY}</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-lg border font-extrabold tabular-nums",
        size === "sm" ? "px-1.5 py-0.5 text-[12px]" : "px-2 py-1 text-[13px]",
        best
          ? "border-emerald-500/35 bg-emerald-500/[0.1] text-panel-success"
          : partner
            ? "border-sky-500/30 bg-sky-500/[0.08] text-sky-500"
            : "border-[#FF6A00]/25 bg-[#FF6A00]/[0.08] text-panel-accent",
        className
      )}
    >
      {best && <Crown className="h-3 w-3" aria-label="کمترین قیمت" />}
      {formatPersianNumber(price)}
      {currency === "usd" ? (
        <span className="text-[0.8em] font-black opacity-70">$</span>
      ) : (
        <span className="text-[0.7em] font-bold opacity-70">ریال</span>
      )}
    </span>
  );
}

/**
 * Small "≈ equivalent" of a price in the other currency (rial ↔ dollar) at the
 * open-market rate; nothing when the price is blank or no rate is known.
 */
export function PriceEquivalent({
  price,
  currency,
  rialPerUsd,
  className,
}: {
  price: string | null | undefined;
  currency: PriceCurrency;
  rialPerUsd: number | null | undefined;
  className?: string;
}) {
  if (!price || !rialPerUsd) return null;
  const converted = convertPrice(Number(price.replace(/[^\d]/g, "")), currency, rialPerUsd);
  if (!converted || converted.amount <= 0) return null;
  return (
    <span className={cn("block whitespace-nowrap text-[9px] font-semibold leading-4 tabular-nums text-panel-muted-2", className)}>
      ≈ {formatPersianNumber(converted.amount)} {currencyLabel(converted.currency)}
    </span>
  );
}

/** Short labels of the three prices inside a year cell. */
export const SHORT_PRICE_LABELS: Record<PriceTablePriceField, string> = {
  priceUsd: "خام",
  clearancePrice: "ترخیصی",
  instantPrice: "فوری",
};

/** Tiny "کد ۱۲۳۴ ۵۶۷۸" line naming the seller behind a (lowest) price. */
export function SellerCodeHint({ code, className }: { code: string | undefined; className?: string }) {
  if (!code) return null;
  const grouped = code.length === 8 ? `${code.slice(0, 4)} ${code.slice(4)}` : code;
  return (
    <span
      className={cn("inline-flex items-center gap-0.5 whitespace-nowrap text-[9px] font-bold leading-4 text-panel-muted-2", className)}
      title="کد فروشنده"
    >
      <Fingerprint className="h-2.5 w-2.5 text-panel-accent/70" aria-hidden="true" />
      <span className="sr-only">کد فروشنده</span>
      <span dir="ltr" className="font-mono tracking-wider">
        {toPersianDigits(grouped)}
      </span>
    </span>
  );
}

/** Header of a price column: "۲۰۲۵" over the colour swatch + name. */
export function ColumnHeading({ column, active = false, className }: { column: PriceColumn; active?: boolean; className?: string }) {
  return (
    <span className={cn("flex flex-col items-start gap-1 whitespace-nowrap normal-case tracking-normal", className)}>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className={cn("h-3.5 w-3.5", active ? "text-panel-accent" : "text-panel-faint")} />
        سال <span className="font-mono text-[12px] font-black text-panel-text">{toPersianDigits(column.year)}</span>
      </span>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-panel-text-2">
        <ColorSwatch code={column.colorCode} className="h-3 w-3" />
        {column.colorName}
        <span className="rounded border border-panel-line/[0.12] px-1 text-[9px] font-extrabold text-panel-muted">
          {CURRENCY_LABELS[column.currency]}
        </span>
      </span>
    </span>
  );
}

/**
 * Content of one price cell: the enabled prices (raw, clearance, instant)
 * stacked with short labels, or a single dash when nothing was priced for that
 * (year, colour). With `sellers` each price names the seller who entered it. `best` marks fields that equal the column's lowest price.
 * With `showPartner` (verified collaborators) each price is followed by its
 * collaborator price. With `rialPerUsd` each price also shows its small
 * equivalent in the other currency.
 */
export function YearPrices({
  prices,
  currency,
  best,
  highlight,
  showPartner = false,
  rialPerUsd = null,
  fields: enabled = ALL_PRICE_FIELD_KEYS,
  sellers,
  className,
}: {
  prices: Record<PriceTableAnyPriceField, string | null> | undefined;
  /** Price types in use (pricing settings); only these are listed. */
  fields?: readonly PriceTablePriceField[];
  /** Public code of the seller behind each price (market-wide lowest prices). */
  sellers?: Partial<Record<PriceTableAnyPriceField, string>>;
  /** Currency of the column the prices belong to. */
  currency: PriceCurrency;
  best?: Partial<Record<PriceTableAnyPriceField, boolean>>;
  /** Field to emphasise (the active sort field). */
  highlight?: PriceTablePriceField;
  showPartner?: boolean;
  /** Open-market rial per dollar; enables the converted-price hints. */
  rialPerUsd?: number | null;
  className?: string;
}) {
  const fields = priceFieldsFor(enabled);
  // Rough height of a filled cell, so empty cells line up with their row.
  const emptyHeight = fields.length > 1 ? "min-h-[78px]" : showPartner ? "min-h-[64px]" : "min-h-[40px]";
  if (!prices) {
    return (
      <span className={cn("flex items-center justify-center text-lg font-black text-panel-faint", emptyHeight, className)} aria-label="بدون قیمت">
        —
      </span>
    );
  }
  // With a single price type the column heading already names it.
  const single = fields.length === 1;
  return (
    <dl className={cn(showPartner ? "space-y-1.5" : "space-y-1", className)}>
      {fields.map((field) => (
        <div key={field.key} className={cn(showPartner && "rounded-lg bg-panel-line/[0.025] p-1")}>
          <div className="flex items-center justify-between gap-2">
            <dt
              className={cn(
                "text-[10px] font-bold",
                single && !showPartner && "sr-only",
                highlight === field.key && !single ? "text-panel-accent" : "text-panel-muted"
              )}
            >
              {single && showPartner ? "عمومی" : SHORT_PRICE_LABELS[field.key]}
            </dt>
            <dd className={cn("flex flex-col items-end", single && !showPartner && "w-full")}>
              <PriceTag price={prices[field.key]} currency={currency} best={Boolean(best?.[field.key])} size="sm" />
              <PriceEquivalent price={prices[field.key]} currency={currency} rialPerUsd={rialPerUsd} className="mt-0.5" />
              <SellerCodeHint code={prices[field.key] ? sellers?.[field.key] : undefined} className="mt-0.5" />
            </dd>
          </div>
          {showPartner && (
            <div className="mt-1 flex items-center justify-between gap-2">
              <dt className="text-[9px] font-bold text-sky-500/90">همکار</dt>
              <dd className="flex flex-col items-end">
                <PriceTag price={prices[field.partnerKey]} currency={currency} best={Boolean(best?.[field.partnerKey])} partner size="sm" />
                <PriceEquivalent price={prices[field.partnerKey]} currency={currency} rialPerUsd={rialPerUsd} className="mt-0.5 text-sky-500/70" />
                <SellerCodeHint code={prices[field.partnerKey] ? sellers?.[field.partnerKey] : undefined} className="mt-0.5" />
              </dd>
            </div>
          )}
        </div>
      ))}
    </dl>
  );
}
