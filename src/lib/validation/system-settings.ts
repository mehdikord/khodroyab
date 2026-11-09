import { z } from "zod";

import { normalizeDigits } from "@/lib/validation/admin";
import {
  MAX_AD_PAGE_NOTICE_LENGTH,
  MAX_USER_CODE_ROTATION_MINUTES,
  MIN_USER_CODE_ROTATION_MINUTES,
  type SystemSettings,
} from "@/lib/system-settings-shared";

/** Persian / Arabic digits → ASCII, keeping every other character. */
function asciiDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

const schema = z.object({
  userCodeRotationMinutes: z
    .string()
    .transform((value) => normalizeDigits(value))
    .refine((value) => value.length > 0, "مدت زمان را وارد کنید")
    .transform((value) => Number(value))
    .refine(
      (value) => Number.isInteger(value) && value >= MIN_USER_CODE_ROTATION_MINUTES && value <= MAX_USER_CODE_ROTATION_MINUTES,
      `مدت زمان باید بین ${MIN_USER_CODE_ROTATION_MINUTES} تا ${MAX_USER_CODE_ROTATION_MINUTES} دقیقه باشد`
    ),
  consultationPhone: z
    .string()
    .transform((value) => asciiDigits(value).trim().replace(/\s+/g, " "))
    .refine((value) => value === "" || /^\+?[\d\s\-()]{4,20}$/.test(value), "شماره تماس معتبر نیست")
    .refine((value) => value === "" || normalizeDigits(value).length >= 4, "شماره تماس معتبر نیست"),
  adPageNotice: z
    .string()
    .transform((value) => value.replace(/\r\n/g, "\n").trim())
    .refine((value) => value.length <= MAX_AD_PAGE_NOTICE_LENGTH, `متن حداکثر ${MAX_AD_PAGE_NOTICE_LENGTH} کاراکتر می‌تواند باشد`),
});

export type SystemSettingsParseResult =
  | { success: true; data: SystemSettings }
  | { success: false; message: string; fieldErrors: Record<string, string> };

export function parseSystemSettingsForm(formData: FormData): SystemSettingsParseResult {
  const raw = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  const result = schema.safeParse({
    userCodeRotationMinutes: raw("userCodeRotationMinutes"),
    consultationPhone: raw("consultationPhone"),
    adPageNotice: raw("adPageNotice"),
  });
  if (result.success) return { success: true, data: result.data };

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { success: false, message: "لطفاً خطاهای فرم را برطرف کنید", fieldErrors };
}
