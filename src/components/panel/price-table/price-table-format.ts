import { formatPersianNumber } from "@/lib/utils";
import { PRICE_TABLE_EMPTY } from "@/lib/price-table-shared";

export { PRICE_TABLE_EMPTY };

/** "12500" → "۱۲,۵۰۰ دلار"; blank → the empty placeholder. */
export function formatUsd(priceUsd: string | null | undefined): string {
  const formatted = formatPersianNumber(priceUsd ?? "");
  return formatted ? `${formatted} دلار` : PRICE_TABLE_EMPTY;
}
