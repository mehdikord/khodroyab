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
