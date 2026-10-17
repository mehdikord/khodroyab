import { z } from "zod";

import { adminLoginSchema, normalizePhone, type FieldErrors } from "@/lib/validation/admin";
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

/** The customer login form uses the same phone + password rules as the admin one. */
export const userLoginSchema = adminLoginSchema;
export type UserLoginInput = z.infer<typeof userLoginSchema>;

export function parseUserLoginForm(formData: FormData):
  | { success: true; data: UserLoginInput }
  | { success: false; fieldErrors: FieldErrors } {
  const phoneRaw = formData.get("phone");
  const passwordRaw = formData.get("password");

  const result = userLoginSchema.safeParse({
    phone: typeof phoneRaw === "string" ? phoneRaw : "",
    password: typeof passwordRaw === "string" ? passwordRaw : "",
  });

  if (result.success) return { success: true, data: result.data };

  const fieldErrors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { success: false, fieldErrors };
}

/** Collect the first message per field from a zod error. */
export function zodFieldErrors(error: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}
