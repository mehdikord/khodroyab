import { z } from "zod";

import { userPhoneSchema, zodFieldErrors } from "@/lib/validation/user";
import type { FieldErrors } from "@/lib/validation/admin";
import {
  PURCHASE_REQUEST_DESCRIPTION_MAX,
  PURCHASE_REQUEST_NAME_MAX,
  PURCHASE_REQUEST_NOTE_MAX,
} from "@/lib/purchase-requests-shared";
import { PRICE_MARKETS } from "@/lib/price-market";

/** Where the form was opened: a sale ad, or one seller's row of a car's price list. */
const targetSchema = z.discriminatedUnion("source", [
  z.object({
    source: z.literal("sale_ad"),
    adId: z.string().regex(/^\d{1,20}$/, { error: "آگهی نامعتبر است" }),
  }),
  z.object({
    source: z.literal("price_list"),
    carId: z.string().regex(/^\d{1,20}$/, { error: "خودرو نامعتبر است" }),
    sellerCode: z.string().regex(/^\d{8}$/, { error: "کد فروشنده نامعتبر است" }),
    /** Which of the two price lists (free zone / national plate) the seller's row is in. */
    market: z.enum(PRICE_MARKETS, { error: "لیست قیمت نامعتبر است" }),
    /** The chosen "<year>:<colorId>:<currency>" column of the seller's prices (required). */
    tierKey: z.string().regex(/^\d{4}:\d{1,20}:(usd|rial)$/, { error: "سال و رنگ مورد نظر را انتخاب کنید" }),
  }),
]);

const descriptionSchema = z
  .string()
  .transform((value) => value.replace(/\r\n/g, "\n").trim())
  .refine((value) => value.length <= PURCHASE_REQUEST_DESCRIPTION_MAX, {
    error: `توضیحات حداکثر ${PURCHASE_REQUEST_DESCRIPTION_MAX} کاراکتر می‌تواند باشد`,
  });

const guestSchema = z.object({
  name: z
    .string()
    .transform((value) => value.replace(/\s+/g, " ").trim())
    .refine((value) => value.length >= 2, { error: "نام و نام خانوادگی را وارد کنید" })
    .refine((value) => value.length <= PURCHASE_REQUEST_NAME_MAX, { error: "نام بیش از حد طولانی است" }),
  phone: userPhoneSchema,
  provinceId: z.string().regex(/^\d{1,10}$/, { error: "استان را انتخاب کنید" }),
  cityId: z.string().regex(/^\d{1,10}$/, { error: "شهر را انتخاب کنید" }),
});

export type PurchaseRequestTargetInput = z.infer<typeof targetSchema>;

export interface PurchaseRequestFormInput {
  target: PurchaseRequestTargetInput;
  description: string;
  /** Guests only. */
  guest: { name: string; phone: string; provinceId: number; cityId: number } | null;
}

export type ParsedPurchaseRequestForm =
  | { success: true; data: PurchaseRequestFormInput }
  | { success: false; message: string; fieldErrors: FieldErrors };

function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/** Validate the purchase-request form; guest fields are required only when `isGuest`. */
export function parsePurchaseRequestForm(formData: FormData, isGuest: boolean): ParsedPurchaseRequestForm {
  const fieldErrors: FieldErrors = {};

  const target = targetSchema.safeParse({
    source: field(formData, "source"),
    adId: field(formData, "adId"),
    carId: field(formData, "carId"),
    sellerCode: field(formData, "sellerCode"),
    tierKey: field(formData, "tierKey"),
    market: field(formData, "market"),
  });
  if (!target.success) Object.assign(fieldErrors, zodFieldErrors(target.error));

  const description = descriptionSchema.safeParse(field(formData, "description"));
  if (!description.success) fieldErrors.description = description.error.issues[0]?.message ?? "توضیحات معتبر نیست";

  let guest: PurchaseRequestFormInput["guest"] = null;
  if (isGuest) {
    const parsed = guestSchema.safeParse({
      name: field(formData, "name"),
      phone: field(formData, "phone"),
      provinceId: field(formData, "provinceId"),
      cityId: field(formData, "cityId"),
    });
    if (parsed.success) {
      guest = { ...parsed.data, provinceId: Number(parsed.data.provinceId), cityId: Number(parsed.data.cityId) };
    } else {
      Object.assign(fieldErrors, zodFieldErrors(parsed.error));
    }
  }

  if (!target.success || !description.success || (isGuest && !guest)) {
    return { success: false, message: "لطفاً خطاهای فرم را برطرف کنید", fieldErrors };
  }
  return { success: true, data: { target: target.data, description: description.data, guest } };
}

/** Admin's internal note. */
export const adminNoteSchema = z
  .string()
  .transform((value) => value.replace(/\r\n/g, "\n").trim())
  .refine((value) => value.length <= PURCHASE_REQUEST_NOTE_MAX, {
    error: `یادداشت حداکثر ${PURCHASE_REQUEST_NOTE_MAX} کاراکتر می‌تواند باشد`,
  });
