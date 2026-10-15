import { z } from "zod";

import { normalizeDigits } from "@/lib/validation/admin";
import { toPersianDigits } from "@/lib/utils";
import { AD_STATUSES } from "@/lib/ad-status";

/* ───────────────────────── sale-term entry ───────────────────────── */

const optionalNumeric = (label: string, max?: number) =>
  z
    .string()
    .trim()
    .transform((value) => normalizeDigits(value))
    .refine((value) => value === "" || /^\d+$/.test(value), {
      error: `${label} باید عدد باشد`,
    })
    .refine((value) => value === "" || max === undefined || Number(value) <= max, {
      error: `${label} نمی‌تواند بیشتر از ${toPersianDigits(max ?? 0)} باشد`,
    })
    .optional();

export const userCarSaleTermEntrySchema = z.object({
  id: z.string().trim().optional(),
  saleTermId: z
    .string({ error: "انتخاب شرایط فروش الزامی است" })
    .trim()
    .min(1, { error: "انتخاب شرایط فروش الزامی است" }),
  price: z
    .string({ error: "قیمت الزامی است" })
    .trim()
    .min(1, { error: "قیمت الزامی است" })
    .transform((value) => normalizeDigits(value))
    .refine((value) => /^\d+$/.test(value) && Number(value) > 0, {
      error: "قیمت باید عددی بزرگ‌تر از صفر باشد",
    }),
  sale: optionalNumeric("مبلغ تخفیف"),
  perecentage: optionalNumeric("درصد تخفیف", 100),
  description: z
    .string()
    .trim()
    .max(2000, { error: "توضیحات حداکثر ۲۰۰۰ کاراکتر است" })
    .optional(),
  isActive: z.boolean().default(true),
});

/* ───────────────────────── user car (sale ad) ───────────────────────── */

export const userCarSchema = z.object({
  carId: z
    .string({ error: "انتخاب خودرو الزامی است" })
    .trim()
    .min(1, { error: "انتخاب خودرو الزامی است" }),
  qautity: z
    .string({ error: "تعداد الزامی است" })
    .trim()
    .min(1, { error: "تعداد الزامی است" })
    .transform((value) => normalizeDigits(value))
    .refine((value) => /^\d+$/.test(value) && Number(value) > 0, {
      error: "تعداد باید عددی بزرگ‌تر از صفر باشد",
    }),
  description: z
    .string()
    .trim()
    .max(255, { error: "توضیحات حداکثر ۲۵۵ کاراکتر است" })
    .default(""),
  isActive: z.boolean().default(true),
  /** Moderation status; optional because the create flow sets it server-side. */
  status: z
    .enum(AD_STATUSES, { error: "وضعیت تایید نامعتبر است" })
    .optional(),
  saleTerms: z
    .array(userCarSaleTermEntrySchema)
    .max(30, { error: "حداکثر ۳۰ شرایط فروش قابل ثبت است" })
    .superRefine((entries, ctx) => {
      const seen = new Map<string, number>();
      entries.forEach((entry, index) => {
        const firstIndex = seen.get(entry.saleTermId);
        if (firstIndex !== undefined) {
          ctx.addIssue({
            code: "custom",
            path: [index, "saleTermId"],
            message: "این شرایط فروش قبلاً برای همین آگهی انتخاب شده است",
          });
        } else {
          seen.set(entry.saleTermId, index);
        }
      });
    }),
});

export type UserCarSaleTermInput = z.output<typeof userCarSaleTermEntrySchema>;
export type UserCarInput = z.output<typeof userCarSchema>;

export type ParsedUserCarForm =
  | { success: true; data: UserCarInput }
  | { success: false; fieldErrors: Record<string, string>; message: string };

/**
 * Parse the sale-ad form. Sale terms are submitted as a JSON array under the
 * `saleTerms` key; booleans are submitted as the strings "true" / "false".
 */
export function parseUserCarForm(formData: FormData): ParsedUserCarForm {
  let saleTermsRaw: unknown = [];
  const saleTermsField = formData.get("saleTerms");
  if (typeof saleTermsField === "string" && saleTermsField.trim()) {
    try {
      saleTermsRaw = JSON.parse(saleTermsField);
    } catch {
      return {
        success: false,
        fieldErrors: { saleTerms: "ساختار شرایط فروش نامعتبر است" },
        message: "اطلاعات فرم آگهی نامعتبر است",
      };
    }
  }

  const result = userCarSchema.safeParse({
    carId: formData.get("carId") ?? "",
    qautity: formData.get("qautity") ?? "",
    description: formData.get("description") ?? "",
    isActive: formData.get("isActive") !== "false",
    status: (() => {
      const raw = formData.get("status");
      return typeof raw === "string" && raw ? raw : undefined;
    })(),
    saleTerms: Array.isArray(saleTermsRaw)
      ? saleTermsRaw.map((entry) => {
          const e = (entry ?? {}) as Record<string, unknown>;
          return {
            id: typeof e.id === "string" && e.id ? e.id : undefined,
            saleTermId: typeof e.saleTermId === "string" ? e.saleTermId : "",
            price: typeof e.price === "string" ? e.price : "",
            sale: typeof e.sale === "string" ? e.sale : "",
            perecentage: typeof e.perecentage === "string" ? e.perecentage : "",
            description: typeof e.description === "string" ? e.description : "",
            isActive: e.isActive !== false,
          };
        })
      : [],
  });

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = issue.message;
    }
    return {
      success: false,
      fieldErrors,
      message: "اطلاعات فرم آگهی نامعتبر است؛ موارد مشخص‌شده را بررسی کنید",
    };
  }

  return { success: true, data: result.data };
}
