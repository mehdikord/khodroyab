import { z } from "zod";

import {
  PRICE_TABLE_PRICE_FIELDS,
  PRICE_TABLE_PRICE_MAX_DIGITS,
  digitsOnly,
  type PriceTablePriceField,
} from "@/lib/price-table-shared";

export { PRICE_TABLE_PRICE_MAX_DIGITS };

/** One submitted row of the customer's price table. */
export interface PriceTableEntryInput extends Record<PriceTablePriceField, string | null> {
  carId: string;
  colorId: string;
}

export type ParsedPriceTableForm =
  | { success: true; entries: PriceTableEntryInput[] }
  | { success: false; message: string; fieldErrors?: Record<string, string> };

const rawEntrySchema = z.object({
  carId: z.string().regex(/^\d+$/, { error: "شناسه خودرو نامعتبر است" }),
  colorId: z.string().regex(/^\d*$/, { error: "رنگ انتخاب‌شده نامعتبر است" }),
  priceUsd: z.string().trim(),
  clearancePrice: z.string().trim(),
  instantPrice: z.string().trim(),
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

/**
 * Parse the JSON `entries` field of the "save my price table" form.
 *
 * Rows where colour and all three prices are blank are treated as "not filled
 * in" and dropped. A filled row needs a colour and at least one of the raw,
 * clearance or instant prices; the other prices may stay blank.
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
        const key = `${carId}.${field}`;
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

    const entry: PriceTableEntryInput = {
      carId: row.carId,
      colorId: row.colorId,
      priceUsd: null,
      clearancePrice: null,
      instantPrice: null,
    };
    let hasPrice = false;
    let rowValid = true;

    for (const { key } of PRICE_TABLE_PRICE_FIELDS) {
      if (!row[key]) continue;
      hasPrice = true;
      const price = parsePrice(row[key]);
      if ("error" in price) {
        fieldErrors[`${row.carId}.${key}`] = price.error;
        rowValid = false;
      } else {
        entry[key] = price.value;
      }
    }

    const hasColor = row.colorId.length > 0;
    if (!hasColor && !hasPrice) continue; // blank row → nothing saved for this car

    if (!hasColor) {
      fieldErrors[`${row.carId}.colorId`] = "رنگ خودرو را انتخاب کنید";
      rowValid = false;
    }
    if (!hasPrice) {
      fieldErrors[`${row.carId}.priceUsd`] = "حداقل یکی از قیمت‌ها را وارد کنید";
      rowValid = false;
    }

    if (rowValid) entries.push(entry);
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "برخی از ردیف‌های جدول ناقص هستند؛ برای هر ردیف رنگ و حداقل یکی از قیمت‌ها را وارد کنید",
      fieldErrors,
    };
  }

  return { success: true, entries };
}
