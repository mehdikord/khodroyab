import { z } from "zod";

import {
  PRICE_TABLE_MAX_TIERS,
  PRICE_TABLE_PRICE_FIELDS,
  PRICE_TABLE_PRICE_MAX_DIGITS,
  PRICE_TABLE_YEAR_MAX,
  PRICE_TABLE_YEAR_MIN,
  digitsOnly,
  isValidTierYear,
  type PriceTablePriceField,
} from "@/lib/price-table-shared";
import { toPersianDigits } from "@/lib/utils";

export { PRICE_TABLE_PRICE_MAX_DIGITS };

/** One validated year tier: a year plus at least one of the three prices. */
export interface PriceTableTierInput extends Record<PriceTablePriceField, string | null> {
  year: string;
}

/** One submitted row of the customer's price table. */
export interface PriceTableEntryInput {
  carId: string;
  colorId: string;
  /** Non-empty, in the customer's order, with unique years. */
  tiers: PriceTableTierInput[];
}

export type ParsedPriceTableForm =
  | { success: true; entries: PriceTableEntryInput[] }
  | { success: false; message: string; fieldErrors?: Record<string, string> };

/**
 * Field-error keys used by the editor:
 * - `<carId>.colorId`             colour select of a row
 * - `<carId>.tiers`               row-level message (no price, too many tiers…)
 * - `<carId>.<index>.<field>`     one input of the tier at `index` (year or a price)
 */
export function tierErrorKey(carId: string, index: number, field: "year" | PriceTablePriceField): string {
  return `${carId}.${index}.${field}`;
}

const rawTierSchema = z.object({
  year: z.string().trim().max(32),
  priceUsd: z.string().trim().max(64),
  clearancePrice: z.string().trim().max(64),
  instantPrice: z.string().trim().max(64),
});

const rawEntrySchema = z.object({
  carId: z.string().regex(/^\d+$/, { error: "شناسه خودرو نامعتبر است" }),
  colorId: z.string().regex(/^\d*$/, { error: "رنگ انتخاب‌شده نامعتبر است" }),
  tiers: z.array(rawTierSchema).max(PRICE_TABLE_MAX_TIERS * 2),
});

const rawEntriesSchema = z.array(rawEntrySchema).max(2000);

/** Validate one typed price; returns the normalised digits or an error message. */
function parsePrice(raw: string): { value: string } | { error: string } {
  const digits = digitsOnly(raw).replace(/^0+(?=\d)/, "");
  if (!digits) return { error: "قیمت باید فقط شامل رقم باشد" };
  if (digits.length > PRICE_TABLE_PRICE_MAX_DIGITS) return { error: "قیمت واردشده بیش از حد بزرگ است" };
  if (digits === "0") return { error: "قیمت باید بزرگ‌تر از صفر باشد" };
  return { value: digits };
}

function isBlankTier(tier: z.infer<typeof rawTierSchema>): boolean {
  return PRICE_TABLE_PRICE_FIELDS.every(({ key }) => !tier[key]);
}

/**
 * Parse the JSON `entries` field of the "save my price table" form.
 *
 * - A tier whose three prices are blank is ignored (its year alone means nothing).
 * - A row with no colour and no priced tier is "not filled in" and dropped.
 * - A filled row needs a colour and at least one priced tier.
 * - Every priced tier needs a valid 4-digit year that is unique within the row,
 *   and at least one of the raw, clearance or instant prices.
 */
export function parsePriceTableForm(formData: FormData): ParsedPriceTableForm {
  const raw = formData.get("entries");
  if (typeof raw !== "string") return { success: false, message: "اطلاعات جدول قیمت نامعتبر است" };

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { success: false, message: "اطلاعات جدول قیمت نامعتبر است" };
  }

  const parsed = rawEntriesSchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const [index, field] = issue.path;
      if (typeof index === "number" && typeof field === "string") {
        const item = (json as { carId?: unknown }[])[index];
        const carId = typeof item?.carId === "string" ? item.carId : String(index);
        const key = field === "colorId" ? `${carId}.colorId` : `${carId}.tiers`;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
    }
    return { success: false, message: "برخی از ردیف‌های جدول نامعتبر هستند", fieldErrors };
  }

  const fieldErrors: Record<string, string> = {};
  const entries: PriceTableEntryInput[] = [];
  const seen = new Set<string>();

  for (const row of parsed.data) {
    if (seen.has(row.carId)) continue;
    seen.add(row.carId);

    const hasColor = row.colorId.length > 0;
    const pricedCount = row.tiers.filter((tier) => !isBlankTier(tier)).length;
    if (!hasColor && pricedCount === 0) continue; // blank row → nothing saved for this car

    let rowValid = true;
    const tiers: PriceTableTierInput[] = [];
    const years = new Set<string>();

    if (pricedCount > PRICE_TABLE_MAX_TIERS) {
      fieldErrors[`${row.carId}.tiers`] = `حداکثر ${PRICE_TABLE_MAX_TIERS} سال برای هر خودرو قابل ثبت است`;
      rowValid = false;
    }

    row.tiers.forEach((rawTier, index) => {
      if (isBlankTier(rawTier)) return;

      const tier: PriceTableTierInput = { year: digitsOnly(rawTier.year), priceUsd: null, clearancePrice: null, instantPrice: null };

      if (!tier.year) {
        fieldErrors[tierErrorKey(row.carId, index, "year")] = "سال را وارد کنید";
        rowValid = false;
      } else if (!isValidTierYear(tier.year)) {
        fieldErrors[tierErrorKey(row.carId, index, "year")] =
          `سال باید ۴ رقمی و بین ${toPersianDigits(PRICE_TABLE_YEAR_MIN)} تا ${toPersianDigits(PRICE_TABLE_YEAR_MAX)} باشد`;
        rowValid = false;
      } else if (years.has(tier.year)) {
        fieldErrors[tierErrorKey(row.carId, index, "year")] = "این سال تکراری است";
        rowValid = false;
      } else {
        years.add(tier.year);
      }

      for (const { key } of PRICE_TABLE_PRICE_FIELDS) {
        if (!rawTier[key]) continue;
        const price = parsePrice(rawTier[key]);
        if ("error" in price) {
          fieldErrors[tierErrorKey(row.carId, index, key)] = price.error;
          rowValid = false;
        } else {
          tier[key] = price.value;
        }
      }

      tiers.push(tier);
    });

    if (!hasColor) {
      fieldErrors[`${row.carId}.colorId`] = "رنگ خودرو را انتخاب کنید";
      rowValid = false;
    }
    if (pricedCount === 0) {
      fieldErrors[`${row.carId}.tiers`] = "حداقل یکی از قیمت‌ها را وارد کنید";
      rowValid = false;
    }

    if (rowValid) entries.push({ carId: row.carId, colorId: row.colorId, tiers });
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "برخی از ردیف‌های جدول ناقص هستند؛ برای هر ردیف رنگ، سال و حداقل یکی از قیمت‌ها را وارد کنید",
      fieldErrors,
    };
  }

  return { success: true, entries };
}
