import { z } from "zod";

import { normalizeDigits, normalizePhone, type FieldErrors } from "@/lib/validation/admin";
import { PASSWORD_MIN_LENGTH } from "@/lib/profile";

/** Iranian mobile numbers: 11 digits starting with 09 (after normalization). */
export const IRANIAN_MOBILE_REGEX = /^09\d{9}$/;

/** bcrypt only hashes the first 72 bytes; refuse longer secrets outright. */
export const PASSWORD_MAX_LENGTH = 72;
export { PASSWORD_MIN_LENGTH };

export const userPasswordSchema = z
  .string({ error: "رمز عبور الزامی است" })
  .min(PASSWORD_MIN_LENGTH, { error: `رمز عبور باید حداقل ${PASSWORD_MIN_LENGTH} کاراکتر باشد` })
  .max(PASSWORD_MAX_LENGTH, { error: `رمز عبور نباید بیشتر از ${PASSWORD_MAX_LENGTH} کاراکتر باشد` });

export const userPhoneSchema = z
  .string({ error: "شماره موبایل الزامی است" })
  .transform((value) => normalizePhone(value))
  .refine((value) => value.length > 0, { error: "شماره موبایل الزامی است" })
  .refine((value) => IRANIAN_MOBILE_REGEX.test(value), {
    error: "شماره موبایل معتبر نیست (نمونه: ۰۹۱۲۳۴۵۶۷۸۹)",
  });

/** Collect the first message per field from a zod error. */
export function zodFieldErrors(error: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

/* ───────────────────────── Self-registration ───────────────────────── */

export const USER_NAME_MAX_LENGTH = 100;
export const COMPANY_NAME_MAX_LENGTH = 120;

/** Optional business name (نام مجموعه); blank → "". */
export const companyNameSchema = z
  .string()
  .trim()
  .max(COMPANY_NAME_MAX_LENGTH, { error: `نام مجموعه حداکثر ${COMPANY_NAME_MAX_LENGTH} کاراکتر است` })
  .refine((value) => value.length === 0 || value.length >= 2, { error: "نام مجموعه باید حداقل ۲ کاراکتر باشد" });

/** Full name of a customer (sign-up step of the OTP flow). */
export const userNameSchema = z
  .string({ error: "نام الزامی است" })
  .trim()
  .min(2, { error: "نام باید حداقل ۲ کاراکتر باشد" })
  .max(USER_NAME_MAX_LENGTH, { error: `نام حداکثر ${USER_NAME_MAX_LENGTH} کاراکتر است` });

/* ───────────────────────── OTP sign-in / sign-up ───────────────────────── */

/** Six ASCII digits; Persian/Arabic digits are folded first. */
export const otpCodeSchema = z
  .string({ error: "کد تایید الزامی است" })
  .transform((value) => normalizeDigits(value).replace(/\s+/g, ""))
  .refine((value) => value.length > 0, { error: "کد تایید الزامی است" })
  .refine((value) => /^\d{6}$/.test(value), { error: "کد تایید باید ۶ رقم باشد" });

type ParseResult<T> = { success: true; data: T } | { success: false; fieldErrors: FieldErrors };

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/** Step 1: the mobile number a code should be sent to. */
export function parseOtpRequestForm(formData: FormData): ParseResult<{ phone: string }> {
  const result = z.object({ phone: userPhoneSchema }).safeParse({ phone: readField(formData, "phone") });
  if (result.success) return { success: true, data: result.data };
  return { success: false, fieldErrors: zodFieldErrors(result.error) };
}

/** Step 2: mobile + code, plus the name when a new account is being created. */
export function parseOtpVerifyForm(
  formData: FormData,
  { requireName }: { requireName: boolean }
): ParseResult<{ phone: string; code: string; name: string }> {
  const result = z
    .object({ phone: userPhoneSchema, code: otpCodeSchema, name: requireName ? userNameSchema : z.string() })
    .safeParse({ phone: readField(formData, "phone"), code: readField(formData, "code"), name: readField(formData, "name") });
  if (result.success) return { success: true, data: { ...result.data, name: result.data.name.trim() } };
  return { success: false, fieldErrors: zodFieldErrors(result.error) };
}
