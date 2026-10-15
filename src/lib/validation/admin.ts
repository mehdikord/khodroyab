import { z } from "zod";

/**
 * Normalize Persian (۰-۹) and Arabic-Indic (٠-٩) digits in a string to ASCII
 * digits (0-9), then strip everything that is not a digit.
 *
 * This lets administrators type their phone number with any keyboard layout.
 */
export function normalizeDigits(input: string): string {
  return input
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0)) // Persian
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660)) // Arabic-Indic
    .replace(/[^\d]/g, "");
}

/**
 * Normalize a phone number into a canonical digit-only form for lookup.
 * Handles spaces, dashes, parentheses and localized digits.
 */
export function normalizePhone(input: string): string {
  return normalizeDigits(input);
}

/** Iranian mobile numbers: 11 digits starting with 09 (after normalization). */
const IRANIAN_MOBILE_REGEX = /^09\d{9}$/;

export const adminLoginSchema = z.object({
  phone: z
    .string({ error: "شماره موبایل الزامی است" })
    .transform((value) => normalizePhone(value))
    .refine((value) => value.length > 0, { error: "شماره موبایل الزامی است" })
    .refine((value) => IRANIAN_MOBILE_REGEX.test(value), {
      error: "شماره موبایل معتبر نیست (نمونه: ۰۹۱۱۷۹۲۶۹۵۰)",
    }),
  password: z
    .string({ error: "رمز عبور الزامی است" })
    .min(1, { error: "رمز عبور الزامی است" }),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export interface FieldErrors {
  [field: string]: string;
}

/**
 * Parse admin login form data and return either normalized values or
 * per-field error messages suitable for direct display in the UI.
 */
export function parseAdminLoginForm(formData: FormData):
  | { success: true; data: AdminLoginInput }
  | { success: false; fieldErrors: FieldErrors; error?: string } {
  const phoneRaw = formData.get("phone");
  const passwordRaw = formData.get("password");

  const result = adminLoginSchema.safeParse({
    phone: typeof phoneRaw === "string" ? phoneRaw : "",
    password: typeof passwordRaw === "string" ? passwordRaw : "",
  });

  if (result.success) {
    return { success: true, data: result.data };
  }

  const fieldErrors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return { success: false, fieldErrors };
}
