import { z } from "zod";

import { normalizeDigits } from "@/lib/validation/admin";
import { SUBSCRIPTION_MAX_MONTHS, SUBSCRIPTION_PRICE_MAX_DIGITS } from "@/lib/subscriptions-shared";

const DESCRIPTION_MAX = 2000;

export const subscriptionPlanSchema = z.object({
  name: z.string().trim().min(1, { error: "نام اشتراک الزامی است" }).max(255, { error: "نام اشتراک بیش از حد طولانی است" }),
  durationMonths: z
    .string()
    .transform((value) => normalizeDigits(value).trim())
    .pipe(
      z
        .string()
        .regex(/^\d+$/, { error: "مدت دسترسی باید عدد صحیح باشد" })
        .transform(Number)
        .pipe(
          z
            .number()
            .int()
            .min(1, { error: "مدت دسترسی حداقل ۱ ماه است" })
            .max(SUBSCRIPTION_MAX_MONTHS, { error: `مدت دسترسی حداکثر ${SUBSCRIPTION_MAX_MONTHS} ماه است` })
        )
    ),
  price: z
    .string()
    // Accept Persian digits and thousand separators, store digits only.
    .transform((value) => normalizeDigits(value).replace(/[^\d]/g, "").replace(/^0+(?=\d)/, ""))
    .pipe(
      z
        .string()
        .min(1, { error: "قیمت الزامی است" })
        .max(SUBSCRIPTION_PRICE_MAX_DIGITS, { error: "قیمت واردشده بیش از حد بزرگ است" })
    ),
  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX, { error: "توضیحات بیش از حد طولانی است" })
    .transform((value) => value || null),
});

export type SubscriptionPlanInput = z.output<typeof subscriptionPlanSchema>;

export const grantSubscriptionSchema = z.object({
  planId: z.string().regex(/^\d+$/, { error: "اشتراک مورد نظر را انتخاب کنید" }),
  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX, { error: "توضیحات بیش از حد طولانی است" })
    .transform((value) => value || null),
});

function firstErrors(issues: z.core.$ZodIssue[]): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function parseSubscriptionPlanForm(
  formData: FormData
): { success: true; data: SubscriptionPlanInput } | { success: false; fieldErrors: Record<string, string> } {
  const parsed = subscriptionPlanSchema.safeParse({
    name: field(formData, "name"),
    durationMonths: field(formData, "durationMonths"),
    price: field(formData, "price"),
    description: field(formData, "description"),
  });
  if (!parsed.success) return { success: false, fieldErrors: firstErrors(parsed.error.issues) };
  return { success: true, data: parsed.data };
}

export function parseGrantSubscriptionForm(
  formData: FormData
):
  | { success: true; data: z.output<typeof grantSubscriptionSchema> }
  | { success: false; fieldErrors: Record<string, string> } {
  const parsed = grantSubscriptionSchema.safeParse({
    planId: field(formData, "planId"),
    description: field(formData, "description"),
  });
  if (!parsed.success) return { success: false, fieldErrors: firstErrors(parsed.error.issues) };
  return { success: true, data: parsed.data };
}
