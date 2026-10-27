import "server-only";

import { z } from "zod";

import type { CurrencyRate, MarketRates } from "@/lib/market-rates-shared";

const SOURCE_URL = "https://raw.githubusercontent.com/iran-market/iran-market.github.io/main/data/popular.json";

/** Upstream is refreshed every ~30 min; a short cache keeps many open dashboards to one request. */
const CACHE_TTL_MS = 25_000;
const FETCH_TIMEOUT_MS = 8_000;

/** The upstream quotes prices in toman (`currency: "IRT"`); we display rial. */
const TOMAN_TO_RIAL = 10;

const nullableNumber = z.number().nullable().optional();

const itemSchema = z.object({
  symbol: z.string(),
  name_fa: z.string().optional(),
  price: z.number().positive(),
  change: nullableNumber,
  change_pct: nullableNumber,
  high: nullableNumber,
  low: nullableNumber,
  prev_close: nullableNumber,
  timestamp: z.string().nullable().optional(),
  timestamp_jalali: z.string().nullable().optional(),
  stale: z.boolean().nullable().optional(),
});

const payloadSchema = z.object({ data: z.array(z.unknown()) });

type Item = z.infer<typeof itemSchema>;

function toRial(value: number | null | undefined): number | null {
  return typeof value === "number" ? Math.round(value * TOMAN_TO_RIAL) : null;
}

function toRate(item: Item, fallbackName: string): CurrencyRate {
  return {
    symbol: item.symbol,
    nameFa: item.name_fa ?? fallbackName,
    priceRial: Math.round(item.price * TOMAN_TO_RIAL),
    changeRial: toRial(item.change),
    changePct: typeof item.change_pct === "number" ? item.change_pct : null,
    highRial: toRial(item.high),
    lowRial: toRial(item.low),
    prevCloseRial: toRial(item.prev_close),
    updatedAtJalali: item.timestamp_jalali ?? null,
    updatedAt: item.timestamp ?? null,
    stale: item.stale === true,
  };
}

function pick(items: Item[], symbol: string, fallbackName: string): CurrencyRate | null {
  const item = items.find((entry) => entry.symbol === symbol);
  return item ? toRate(item, fallbackName) : null;
}

let cache: { rates: MarketRates; at: number } | null = null;
let inFlight: Promise<MarketRates | null> | null = null;

async function fetchFromSource(): Promise<MarketRates | null> {
  try {
    const response = await fetch(SOURCE_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    // Served as text/plain, so parse the body ourselves.
    const payload = payloadSchema.parse(JSON.parse(await response.text()));
    const items = payload.data.flatMap((entry) => {
      const parsed = itemSchema.safeParse(entry);
      return parsed.success ? [parsed.data] : [];
    });

    const rates: MarketRates = {
      usd: pick(items, "USD_IRR_FREE", "دلار آمریکا"),
      eur: pick(items, "EUR_IRR_FREE", "یورو"),
      fetchedAt: new Date().toISOString(),
    };
    if (!rates.usd && !rates.eur) throw new Error("USD/EUR missing from payload");

    cache = { rates, at: Date.now() };
    return rates;
  } catch (error) {
    console.error("[market-rates] fetch failed", error);
    return null;
  }
}

/**
 * Current USD and EUR open-market rates in rial. Served from a short in-memory
 * cache; when the upstream fails the last good value is returned (or null if
 * there has never been one).
 */
export async function getMarketRates(): Promise<MarketRates | null> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.rates;
  inFlight ??= fetchFromSource().finally(() => {
    inFlight = null;
  });
  return (await inFlight) ?? cache?.rates ?? null;
}
