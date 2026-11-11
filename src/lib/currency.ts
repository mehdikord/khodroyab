/**
 * Price currencies (client-safe). Sale ads choose one currency for all their
 * prices; a price-table row chooses one for all its tiers.
 */
export const PRICE_CURRENCIES = ["rial", "usd"] as const;
export type PriceCurrency = (typeof PRICE_CURRENCIES)[number];

export const CURRENCY_LABELS: Record<PriceCurrency, string> = {
  rial: "ریال",
  usd: "دلار",
};

/** Default currency of a new sale ad. */
export const DEFAULT_AD_CURRENCY: PriceCurrency = "rial";
/** Default currency of a new price-table row. */
export const DEFAULT_PRICE_TABLE_CURRENCY: PriceCurrency = "usd";

export function isPriceCurrency(value: unknown): value is PriceCurrency {
  return typeof value === "string" && (PRICE_CURRENCIES as readonly string[]).includes(value);
}

export function currencyLabel(currency: PriceCurrency | null | undefined): string {
  return CURRENCY_LABELS[currency ?? DEFAULT_AD_CURRENCY];
}

/** Highest mileage (km) accepted on a sale ad. */
export const MILEAGE_MAX = 9_999_999;

/** Open-market USD rate used to show a price's equivalent in the other currency. */
export interface UsdRateInfo {
  /** Rial per one US dollar. */
  rialPerUsd: number;
  /** Jalali time of the quote, e.g. "1405/08/20 14:30", when known. */
  updatedAtLabel: string | null;
}

/**
 * Equivalent of `amount` (in `currency`) in the other currency, rounded:
 * rial → whole dollars, dollar → whole rials. Null when it cannot be computed.
 */
export function convertPrice(amount: number, currency: PriceCurrency, rialPerUsd: number): { amount: number; currency: PriceCurrency } | null {
  if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(rialPerUsd) || rialPerUsd <= 0) return null;
  return currency === "rial"
    ? { amount: Math.round(amount / rialPerUsd), currency: "usd" }
    : { amount: Math.round(amount * rialPerUsd), currency: "rial" };
}
