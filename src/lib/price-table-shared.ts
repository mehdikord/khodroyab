/** Client-safe constants/helpers for the price table (no server-only or zod imports). */

export const PRICE_TABLE_PRICE_MAX_DIGITS = 12;

/** Placeholder shown wherever a customer has not filled in a cell. */
export const PRICE_TABLE_EMPTY = "---";

/** The three USD prices of a price-table row, in display order. */
export const PRICE_TABLE_PRICE_FIELDS = [
  { key: "priceUsd", label: "قیمت خام" },
  { key: "clearancePrice", label: "قیمت ترخیصی" },
  { key: "instantPrice", label: "قیمت فوری" },
] as const;

export type PriceTablePriceField = (typeof PRICE_TABLE_PRICE_FIELDS)[number]["key"];

/** Fold Persian/Arabic-Indic digits to ASCII and drop everything that is not a digit. */
export function digitsOnly(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[^\d]/g, "");
}

/** Canonical USD price string: ASCII digits, no leading zeros, capped length. */
export function normalizeUsdPrice(input: string): string {
  return digitsOnly(input).replace(/^0+(?=\d)/, "").slice(0, PRICE_TABLE_PRICE_MAX_DIGITS);
}

/* ───────────────────────── Year tiers ───────────────────────── */

/** Most year tiers (price rows) a customer may add for one car. */
export const PRICE_TABLE_MAX_TIERS = 10;

/** Accepted production years: Jalali (13xx/14xx) or Gregorian (19xx/20xx). */
export const PRICE_TABLE_YEAR_MIN = 1300;
export const PRICE_TABLE_YEAR_MAX = 2100;

/** Year as typed: ASCII digits only, at most 4 of them. */
export function normalizeYear(input: string): string {
  return digitsOnly(input).slice(0, 4);
}

export function isValidTierYear(year: string): boolean {
  if (!/^\d{4}$/.test(year)) return false;
  const value = Number(year);
  return value >= PRICE_TABLE_YEAR_MIN && value <= PRICE_TABLE_YEAR_MAX;
}

/** Year a new row starts with: the car's catalogue year when it is a usable year, else blank. */
export function defaultTierYear(carYear: string): string {
  const year = normalizeYear(carYear);
  return isValidTierYear(year) ? year : "";
}

/** Order tiers newest year first (used by read-only views). */
export function compareTierYearsDesc(a: string, b: string): number {
  return Number(b) - Number(a);
}
