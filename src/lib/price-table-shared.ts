/** Client-safe constants/helpers for the price table (no server-only or zod imports). */

export const PRICE_TABLE_COLOR_MAX = 100;
export const PRICE_TABLE_PRICE_MAX_DIGITS = 12;

/** Placeholder shown wherever a customer has not filled in a cell. */
export const PRICE_TABLE_EMPTY = "---";

/** Fold Persian/Arabic-Indic digits to ASCII and drop everything that is not a digit. */
export function digitsOnly(input: string): string {
  return input
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[^\d]/g, "");
}

/** Canonical USD price string: ASCII digits, no leading zeros, capped length. */
export function normalizeUsdPrice(input: string): string {
  return digitsOnly(input).replace(/^0+(?=\d)/, "").slice(0, PRICE_TABLE_PRICE_MAX_DIGITS);
}
