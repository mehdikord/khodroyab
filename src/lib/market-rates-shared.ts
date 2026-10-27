/** Client-safe types/constants for the live currency rates (no server-only imports). */

/** How often the dashboard asks for fresh rates. */
export const MARKET_RATES_POLL_MS = 30_000;

/** One currency's open-market rate, already converted from toman to rial. */
export interface CurrencyRate {
  symbol: string;
  nameFa: string;
  priceRial: number;
  /** Change since the previous close, in rial. */
  changeRial: number | null;
  changePct: number | null;
  highRial: number | null;
  lowRial: number | null;
  prevCloseRial: number | null;
  /** Upstream trade time as a Jalali string, e.g. "1405/08/03 19:59:59". */
  updatedAtJalali: string | null;
  updatedAt: string | null;
  /** The upstream marks the quote as old (e.g. market closed). */
  stale: boolean;
}

export interface MarketRates {
  usd: CurrencyRate | null;
  eur: CurrencyRate | null;
  /** When our server last fetched the upstream file (ISO). */
  fetchedAt: string;
}
