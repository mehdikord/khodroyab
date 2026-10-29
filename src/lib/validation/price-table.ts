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

/** One validated tier: a year, a colour and at least one of the three prices. */
export interface PriceTableTierInput extends Record<PriceTablePriceField, string | null> {
  year: string;
  colorId: string;
}

/** One submitted row of the customer's price table. */
export interface PriceTableEntryInput {
  carId: string;
  /** Non-empty, in the customer's order, with unique (year, colour) pairs. */
  tiers: PriceTableTierInput[];
}

export type ParsedPriceTableForm =
  | { success: true; entries: PriceTableEntryInput[] }
  | { success: false; message: string; fieldErrors?: Record<string, string> };

/**
 * Field-error keys used by the editor:
 * - `<carId>.tiers`               row-level message (no price, too many tiers…)
 * - `<carId>.<index>.<field>`     one input of the tier at `index` (year, colorId or a price)
 * - `<carId>.<index>.combo`       the tier repeats a (year, colour) pair already in the row
 */
export function tierErrorKey(carId: string, index: number, field: "year" | "colorId" | "combo" | PriceTablePriceField): string {
  return `${carId}.${index}.${field}`;
}

const rawTierSchema = z.object({
  year: z.string().trim().max(32),
  colorId: z.string().regex(/^\d*$/, { error: "رنگ انتخاب‌شده نامعتبر است" }),
  priceUsd: z.string().trim().max(64),
  clearancePrice: z.string().trim().max(64),
  instantPrice: z.string().trim().max(64),
});

const rawEntrySchema = z.object({
  carId: z.string().regex(/^\d+$/, { error: "شناسه خودرو نامعتبر است" }),
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
 * - A tier whose three prices are blank is ignored (its year/colour alone mean nothing).
 * - A row without any priced tier is "not filled in" and dropped.
 * - Every priced tier needs a valid 4-digit year, a colour and at least one
 *   price; its (year, colour) pair must be unique within the row — the same
 *   year may repeat with a different colour.
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
      const [index] = issue.path;
      if (typeof index === "number") {
        const item = (json as { carId?: unknown }[])[index];
        const carId = typeof item?.carId === "string" ? item.carId : String(index);
        const key = `${carId}.tiers`;
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

    const pricedCount = row.tiers.filter((tier) => !isBlankTier(tier)).length;
    if (pricedCount === 0) continue; // blank row → nothing saved for this car

    let rowValid = true;
    const tiers: PriceTableTierInput[] = [];
    const combos = new Set<string>();

    if (pricedCount > PRICE_TABLE_MAX_TIERS) {
      fieldErrors[`${row.carId}.tiers`] = `حداکثر ${toPersianDigits(PRICE_TABLE_MAX_TIERS)} ردیف قیمت برای هر خودرو قابل ثبت است`;
      rowValid = false;
    }

    row.tiers.forEach((rawTier, index) => {
      if (isBlankTier(rawTier)) return;

      const tier: PriceTableTierInput = {
        year: digitsOnly(rawTier.year),
        colorId: rawTier.colorId,
        priceUsd: null,
        clearancePrice: null,
        instantPrice: null,
      };

      let yearOk = false;
      if (!tier.year) {
        fieldErrors[tierErrorKey(row.carId, index, "year")] = "سال را وارد کنید";
      } else if (!isValidTierYear(tier.year)) {
        fieldErrors[tierErrorKey(row.carId, index, "year")] =
          `سال باید ۴ رقمی و بین ${toPersianDigits(PRICE_TABLE_YEAR_MIN)} تا ${toPersianDigits(PRICE_TABLE_YEAR_MAX)} باشد`;
      } else {
        yearOk = true;
      }

      if (!tier.colorId) {
        fieldErrors[tierErrorKey(row.carId, index, "colorId")] = "رنگ را انتخاب کنید";
      }

      if (yearOk && tier.colorId) {
        const combo = `${tier.year}:${tier.colorId}`;
        if (combos.has(combo)) {
          fieldErrors[tierErrorKey(row.carId, index, "combo")] = "این سال با همین رنگ قبلاً در این خودرو ثبت شده است";
          rowValid = false;
        } else {
          combos.add(combo);
        }
      } else {
        rowValid = false;
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

    if (rowValid) entries.push({ carId: row.carId, tiers });
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "برخی از ردیف‌های جدول ناقص هستند؛ برای هر ردیف قیمت، سال، رنگ و حداقل یکی از قیمت‌ها را وارد کنید",
      fieldErrors,
    };
  }

  return { success: true, entries };
}
