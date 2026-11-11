import { z } from "zod";

import { normalizeDigits } from "@/lib/validation/admin";
import {
  formatGeoPoint,
  MAX_ABOUT_TEXT_LENGTH,
  MAX_CONTACT_ADDRESS_LENGTH,
  parseGeoPoint,
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

/** Parse an http(s) URL; null when it is not one. */
function asUrl(value: string): URL | null {
  if (!/^https?:\/\//i.test(value)) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

const hostIs = (url: URL, hosts: string[]) => hosts.includes(url.hostname.toLowerCase().replace(/^www\./, ""));

/** A full link, or a user name ("@name", "t.me/name") turned into one. "" when blank, null when invalid. */
function normalizeHandleLink(
  input: string,
  hosts: string[],
  pattern: RegExp,
  toUrl: (name: string) => string
): string | null {
  const value = input.trim();
  if (!value) return "";
  const url = asUrl(value);
  if (url) return hostIs(url, hosts) && url.pathname.length > 1 ? url.toString() : null;
  const hostPrefix = new RegExp(`^(?:www\\.)?(?:${hosts.map((h) => h.replace(/\./g, "\\.")).join("|")})/`, "i");
  const name = value.replace(hostPrefix, "").replace(/^@/, "").replace(/\/+$/, "");
  return pattern.test(name) ? toUrl(name) : null;
}

/** WhatsApp: a wa.me / whatsapp.com link, or a phone number (09…, +98…, 0098…) turned into a wa.me link. */
function normalizeWhatsapp(input: string): string | null {
  const value = asciiDigits(input).trim();
  if (!value) return "";
  const url = asUrl(value);
  if (url) return hostIs(url, ["wa.me", "api.whatsapp.com", "chat.whatsapp.com", "whatsapp.com"]) ? url.toString() : null;
  if (!/^\+?[\d\s\-()]+$/.test(value)) return null;
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = `98${digits.slice(1)}`;
  return digits.length >= 10 && digits.length <= 15 ? `https://wa.me/${digits}` : null;
}

const phoneField = z
  .string()
  .transform((value) => asciiDigits(value).trim().replace(/\s+/g, " "))
  .refine((value) => value === "" || /^\+?[\d\s\-()]{4,20}$/.test(value), "شماره تماس معتبر نیست")
  .refine((value) => value === "" || normalizeDigits(value).length >= 4, "شماره تماس معتبر نیست");

/** Turns a raw string into a normalized one, or reports `message` when the normalizer returns null. */
const normalizedField = (normalize: (value: string) => string | null, message: string) =>
  z.string().transform((value, ctx) => {
    const result = normalize(value);
    if (result === null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message });
      return z.NEVER;
    }
    return result;
  });

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
  consultationPhone: phoneField,
  adPageNotice: z
    .string()
    .transform((value) => value.replace(/\r\n/g, "\n").trim())
    .refine((value) => value.length <= MAX_AD_PAGE_NOTICE_LENGTH, `متن حداکثر ${MAX_AD_PAGE_NOTICE_LENGTH} کاراکتر می‌تواند باشد`),
  aboutText: z
    .string()
    .transform((value) => value.replace(/\r\n/g, "\n").trim())
    .refine((value) => value.length <= MAX_ABOUT_TEXT_LENGTH, `متن حداکثر ${MAX_ABOUT_TEXT_LENGTH} کاراکتر می‌تواند باشد`),
  contactPhone: phoneField,
  contactPostalCode: z
    .string()
    .transform((value) => normalizeDigits(value))
    .refine((value) => value === "" || /^\d{10}$/.test(value), "کد پستی باید ۱۰ رقم باشد"),
  contactAddress: z
    .string()
    .transform((value) => value.replace(/\r\n/g, "\n").trim())
    .refine((value) => value.length <= MAX_CONTACT_ADDRESS_LENGTH, `آدرس حداکثر ${MAX_CONTACT_ADDRESS_LENGTH} کاراکتر می‌تواند باشد`),
  contactTelegram: normalizedField(
    (value) => normalizeHandleLink(value, ["t.me", "telegram.me"], /^[A-Za-z][A-Za-z0-9_]{3,31}$/, (name) => `https://t.me/${name}`),
    "آیدی یا لینک تلگرام معتبر نیست"
  ),
  contactWhatsapp: normalizedField(normalizeWhatsapp, "شماره یا لینک واتس‌اپ معتبر نیست"),
  contactInstagram: normalizedField(
    (value) =>
      normalizeHandleLink(value, ["instagram.com", "instagr.am"], /^[A-Za-z0-9._]{1,30}$/, (name) => `https://instagram.com/${name}`),
    "آیدی یا لینک اینستاگرام معتبر نیست"
  ),
  contactLocation: normalizedField((value) => {
    if (!value.trim()) return "";
    const point = parseGeoPoint(value);
    return point ? formatGeoPoint(point) : null;
  }, "مختصات معتبر نیست؛ مثلاً: 35.6997, 51.3380"),
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
    aboutText: raw("aboutText"),
    contactPhone: raw("contactPhone"),
    contactPostalCode: raw("contactPostalCode"),
    contactAddress: raw("contactAddress"),
    contactTelegram: raw("contactTelegram"),
    contactWhatsapp: raw("contactWhatsapp"),
    contactInstagram: raw("contactInstagram"),
    contactLocation: raw("contactLocation"),
  });
  if (result.success) return { success: true, data: result.data };

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { success: false, message: "لطفاً خطاهای فرم را برطرف کنید", fieldErrors };
}
