import { z } from "zod";

import { PRICE_TABLE_COLOR_MAX, PRICE_TABLE_PRICE_MAX_DIGITS, digitsOnly } from "@/lib/price-table-shared";

export { PRICE_TABLE_COLOR_MAX, PRICE_TABLE_PRICE_MAX_DIGITS };

/** One submitted row of the customer's price table. */
export interface PriceTableEntryInput {
  carId: string;
  color: string;
  /** Normalised digit-only USD price. */
  priceUsd: string;
}

export type ParsedPriceTableForm =
  | { success: true; entries: PriceTableEntryInput[] }
  | { success: false; message: string; fieldErrors?: Record<string, string> };

const rawEntrySchema = z.object({
  carId: z.string().regex(/^\d+$/, { error: "شناسه خودرو نامعتبر است" }),
  color: z.string().trim().max(PRICE_TABLE_COLOR_MAX, { error: `رنگ حداکثر ${PRICE_TABLE_COLOR_MAX} کاراکتر است` }),
  priceUsd: z.string().trim(),
});

const rawEntriesSchema = z.array(rawEntrySchema).max(2000);

/**
 * Parse the JSON `entries` field of the "save my price table" form.
 *
 * Rows where both colour and price are blank are treated as "not filled in"
 * and dropped; a row with only one of the two filled is a per-row error so
 * the table never shows a price without a colour or vice versa.
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

    const color = row.color.replace(/\s+/g, " ").trim();
    const priceDigits = digitsOnly(row.priceUsd).replace(/^0+(?=\d)/, "");
    const hasColor = color.length > 0;
    const hasPrice = row.priceUsd.trim().length > 0;

    if (!hasColor && !hasPrice) continue; // blank row → nothing saved for this car

    if (!hasColor) fieldErrors[`${row.carId}.color`] = "رنگ خودرو را وارد کنید";
    if (!hasPrice) {
      fieldErrors[`${row.carId}.priceUsd`] = "قیمت را وارد کنید";
    } else if (!priceDigits) {
      fieldErrors[`${row.carId}.priceUsd`] = "قیمت باید فقط شامل رقم باشد";
    } else if (priceDigits.length > PRICE_TABLE_PRICE_MAX_DIGITS) {
      fieldErrors[`${row.carId}.priceUsd`] = "قیمت واردشده بیش از حد بزرگ است";
    } else if (priceDigits === "0") {
      fieldErrors[`${row.carId}.priceUsd`] = "قیمت باید بزرگ‌تر از صفر باشد";
    }

    if (hasColor && hasPrice && priceDigits && priceDigits !== "0" && priceDigits.length <= PRICE_TABLE_PRICE_MAX_DIGITS) {
      entries.push({ carId: row.carId, color, priceUsd: priceDigits });
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, message: "برخی از ردیف‌های جدول ناقص هستند؛ رنگ و قیمت هر ردیف را کامل کنید", fieldErrors };
  }

  return { success: true, entries };
}
