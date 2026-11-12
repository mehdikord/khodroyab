import { z } from "zod";

import { normalizeDigits } from "@/lib/validation/admin";
import { toPersianDigits } from "@/lib/utils";
import { isValidTierYear, normalizeYear } from "@/lib/price-table-shared";
import { MILEAGE_MAX, PRICE_CURRENCIES } from "@/lib/currency";
import { BUY_AD_DESCRIPTION_MAX, BUY_AD_OFFER_MAX_DIGITS } from "@/lib/buy-ads-shared";

export const buyAdSchema = z.object({
  carId: z
    .string({ error: "انتخاب خودرو الزامی است" })
    .trim()
    .regex(/^\d+$/, { error: "انتخاب خودرو الزامی است" }),
  year: z
    .string({ error: "سال ساخت الزامی است" })
    .trim()
    .min(1, { error: "سال ساخت الزامی است" })
    .transform((value) => normalizeYear(value))
    .refine((value) => isValidTierYear(value), { error: "سال ساخت باید یک عدد ۴ رقمی معتبر باشد" }),
  colorId: z
    .string({ error: "انتخاب رنگ الزامی است" })
    .trim()
    .regex(/^\d+$/, { error: "انتخاب رنگ الزامی است" }),
  /** Mileage (کارکرد) in kilometres; 0 = new. Thousands separators are ignored. */
  mileage: z
    .string({ error: "کارکرد خودرو الزامی است" })
    .transform((value) => normalizeDigits(value).replace(/[,\s٬،]/g, ""))
    .refine((value) => value.length > 0, { error: "کارکرد خودرو الزامی است" })
    .refine((value) => /^\d+$/.test(value), { error: "کارکرد خودرو باید عدد باشد" })
    .transform((value) => Number(value))
    .refine((value) => value <= MILEAGE_MAX, {
      error: `کارکرد نمی‌تواند بیشتر از ${toPersianDigits(MILEAGE_MAX.toLocaleString("en-US"))} کیلومتر باشد`,
    }),
  /** Currency of every price offer on the ad. */
  currency: z.enum(PRICE_CURRENCIES, { error: "واحد قیمت (ریال یا دلار) را انتخاب کنید" }),
  description: z
    .string()
    .trim()
    .max(BUY_AD_DESCRIPTION_MAX, { error: `توضیحات حداکثر ${toPersianDigits(BUY_AD_DESCRIPTION_MAX)} کاراکتر است` })
    .transform((value) => (value ? value : null)),
});

export type BuyAdInput = z.output<typeof buyAdSchema>;

export type ParsedBuyAdForm =
  | { success: true; data: BuyAdInput }
  | { success: false; fieldErrors: Record<string, string>; message: string };

export function parseBuyAdForm(formData: FormData): ParsedBuyAdForm {
  const field = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  const result = buyAdSchema.safeParse({
    carId: field("carId"),
    year: field("year"),
    colorId: field("colorId"),
    mileage: field("mileage"),
    currency: field("currency"),
    description: field("description"),
  });

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = issue.message;
    }
    return { success: false, fieldErrors, message: "اطلاعات فرم آگهی خرید نامعتبر است؛ موارد مشخص‌شده را بررسی کنید" };
  }
  return { success: true, data: result.data };
}

/* ───────────────────────── Price offer ───────────────────────── */

export type ParsedOfferPrice = { success: true; price: bigint } | { success: false; message: string };

/**
 * A price offer: a whole number greater than zero (in the ad's currency).
 * Persian digits and thousands separators are accepted.
 */
export function parseOfferPrice(raw: unknown): ParsedOfferPrice {
  const digits = normalizeDigits(typeof raw === "string" ? raw : "").replace(/[,\s٬،]/g, "");
  if (!digits) return { success: false, message: "مبلغ پیشنهادی را وارد کنید" };
  if (!/^\d+$/.test(digits)) return { success: false, message: "مبلغ پیشنهادی باید یک عدد صحیح باشد" };
  const trimmed = digits.replace(/^0+/, "");
  if (!trimmed) return { success: false, message: "مبلغ پیشنهادی باید بزرگ‌تر از صفر باشد" };
  if (trimmed.length > BUY_AD_OFFER_MAX_DIGITS) {
    return { success: false, message: `مبلغ پیشنهادی بیش از حد بزرگ است (حداکثر ${toPersianDigits(BUY_AD_OFFER_MAX_DIGITS)} رقم)` };
  }
  return { success: true, price: BigInt(trimmed) };
}
