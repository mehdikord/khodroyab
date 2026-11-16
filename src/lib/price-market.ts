/**
 * The two separate price lists (client-safe). Both work identically (same
 * cars, price types and features); each seller's prices are kept apart per
 * market: a car may be priced in one list and left blank in the other.
 */

import type { PriceCurrency } from "@/lib/currency";

export const PRICE_MARKETS = ["free_zone", "national"] as const;
export type PriceMarket = (typeof PRICE_MARKETS)[number];

/** The list shown when no market is chosen (the original price list). */
export const DEFAULT_PRICE_MARKET: PriceMarket = "free_zone";

export const PRICE_MARKET_LABELS: Record<PriceMarket, string> = {
  free_zone: "منطقه آزاد",
  national: "پلاک ملی",
};

/** Longer names, e.g. for headings: "خودروهای منطقه آزاد". */
export const PRICE_MARKET_TITLES: Record<PriceMarket, string> = {
  free_zone: "خودروهای منطقه آزاد",
  national: "خودروهای پلاک ملی",
};

/** Currency of a new price row in each list (the seller may change it). */
export const PRICE_MARKET_DEFAULT_CURRENCY: Record<PriceMarket, PriceCurrency> = {
  free_zone: "usd",
  national: "rial",
};

export function isPriceMarket(value: unknown): value is PriceMarket {
  return typeof value === "string" && (PRICE_MARKETS as readonly string[]).includes(value);
}

/** URL `?market=` value of a list: absent for the default list. */
export const PRICE_MARKET_PARAM = "market";

/** The market of a `?market=` search param (anything else → the default list). */
export function parsePriceMarket(raw: string | string[] | undefined | null): PriceMarket {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return isPriceMarket(value) ? value : DEFAULT_PRICE_MARKET;
}

/** `path` with the market's query string, e.g. "/panel/price-list?market=national". */
export function withPriceMarket(path: string, market: PriceMarket): string {
  if (market === DEFAULT_PRICE_MARKET) return path;
  return `${path}${path.includes("?") ? "&" : "?"}${PRICE_MARKET_PARAM}=${market}`;
}
