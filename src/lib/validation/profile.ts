import { z } from "zod";

import { normalizeDigits, type FieldErrors } from "@/lib/validation/admin";
import { companyNameSchema, zodFieldErrors } from "@/lib/validation/user";

/* ───────────────────────── helpers ───────────────────────── */

const optionalTrimmed = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, { error: `${label} نباید بیشتر از ${max} کاراکتر باشد` })
    .optional()
    .or(z.literal(""));

/** Optional digit-only field (Persian/Arabic digits normalized) with an exact length. */
const optionalDigits = (length: number, label: string) =>
  z
    .string()
    .transform((value) => normalizeDigits(value))
    .refine((value) => value.length === 0 || value.length === length, {
      error: `${label} باید ${length} رقم باشد`,
    });

/** Iranian national code checksum (last digit is a weighted mod-11 control). */
export function isValidNationalCode(code: string): boolean {
  if (!/^\d{10}$/.test(code)) return false;
  if (/^(\d)\1{9}$/.test(code)) return false;
  const check = Number(code[9]);
  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(code[i]) * (10 - i);
  const remainder = sum % 11;
  return remainder < 2 ? check === remainder : check === 11 - remainder;
}

/** Iranian legal-entity national ID (شناسه ملی): 11 digits, last one a weighted mod-11 control. */
export function isValidCompanyNationalId(code: string): boolean {
  if (!/^\d{11}$/.test(code)) return false;
  if (/^0+$/.test(code.slice(3, 9))) return false;
  const check = Number(code[10]);
  const offset = Number(code[9]) + 2;
  const weights = [29, 27, 23, 19, 17];
  let sum = 0;
  for (let i = 0; i < 10; i += 1) sum += (Number(code[i]) + offset) * weights[i % 5];
  const remainder = sum % 11;
  return (remainder === 10 ? 0 : remainder) === check;
}

/* ───────────────────────── profile ───────────────────────── */

export const profileUpdateSchema = z.object({
  name: z
    .string({ error: "نام الزامی است" })
    .trim()
    .min(2, { error: "نام باید حداقل ۲ کاراکتر باشد" })
    .max(80, { error: "نام نباید بیشتر از ۸۰ کاراکتر باشد" }),
  companyName: companyNameSchema,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(120, { error: "ایمیل بیش از حد طولانی است" })
    .refine((value) => value.length === 0 || z.email().safeParse(value).success, {
      error: "ایمیل معتبر نیست",
    }),
  nationalCode: optionalDigits(10, "کد ملی").refine((value) => value.length === 0 || isValidNationalCode(value), {
    error: "کد ملی معتبر نیست",
  }),
  tel: z
    .string()
    .transform((value) => normalizeDigits(value))
    .refine((value) => value.length === 0 || (value.length >= 8 && value.length <= 11), {
      error: "تلفن ثابت معتبر نیست (با کد شهر)",
    }),
  postalCode: optionalDigits(10, "کد پستی"),
  address: optionalTrimmed(255, "آدرس"),
  bio: optionalTrimmed(600, "درباره من"),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function parseProfileUpdateForm(
  formData: FormData
): { success: true; data: ProfileUpdateInput } | { success: false; fieldErrors: FieldErrors } {
  const result = profileUpdateSchema.safeParse({
    name: str(formData, "name"),
    companyName: str(formData, "companyName"),
    email: str(formData, "email"),
    nationalCode: str(formData, "nationalCode"),
    tel: str(formData, "tel"),
    postalCode: str(formData, "postalCode"),
    address: str(formData, "address"),
    bio: str(formData, "bio"),
  });
  if (result.success) return { success: true, data: result.data };
  return { success: false, fieldErrors: zodFieldErrors(result.error) };
}
