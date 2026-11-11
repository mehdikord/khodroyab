/**
 * Client-safe keys, defaults and limits of the system settings (تنظیمات سیستم).
 * The loaders live in `system-settings.ts`; validation in `validation/system-settings.ts`.
 */

export const SYSTEM_SETTING_KEYS = {
  /** Minutes a user's public code stays valid before a new one is generated. */
  userCodeRotationMinutes: "user_code_rotation_minutes",
  /** Phone number shown in the panel's free car-buying consultation button. */
  consultationPhone: "consultation_phone",
  /** Warning text shown at the top of every customer-panel page (empty = hidden). */
  adPageNotice: "ad_page_notice",
  /** Body text of the panel's "About Khodroyab" page (empty = placeholder). */
  aboutText: "about_text",
  /** Contact page: office phone number. */
  contactPhone: "contact_phone",
  /** Contact page: 10-digit postal code (digits only). */
  contactPostalCode: "contact_postal_code",
  /** Contact page: office address. */
  contactAddress: "contact_address",
  /** Contact page: social links, stored as full URLs. */
  contactTelegram: "contact_telegram",
  contactWhatsapp: "contact_whatsapp",
  contactInstagram: "contact_instagram",
  /** Contact page: office location as "lat,lng". */
  contactLocation: "contact_location",
} as const;

export type SystemSettingField = keyof typeof SYSTEM_SETTING_KEYS;

export interface SystemSettings {
  userCodeRotationMinutes: number;
  /** Empty string when not set (the consultation button is then hidden). */
  consultationPhone: string;
  /** Empty string when not set (no notice is shown). */
  adPageNotice: string;
  /** Text of the "About Khodroyab" page; paragraphs separated by blank lines. */
  aboutText: string;
  /** Contact page fields; each is an empty string when not set (its block is then hidden). */
  contactPhone: string;
  contactPostalCode: string;
  contactAddress: string;
  contactTelegram: string;
  contactWhatsapp: string;
  contactInstagram: string;
  /** "lat,lng" or empty. */
  contactLocation: string;
}

export const DEFAULT_USER_CODE_ROTATION_MINUTES = 30;
export const MIN_USER_CODE_ROTATION_MINUTES = 1;
/** One week. */
export const MAX_USER_CODE_ROTATION_MINUTES = 10080;
export const MAX_AD_PAGE_NOTICE_LENGTH = 2000;
export const MAX_ABOUT_TEXT_LENGTH = 10000;
export const MAX_CONTACT_ADDRESS_LENGTH = 500;

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  userCodeRotationMinutes: DEFAULT_USER_CODE_ROTATION_MINUTES,
  consultationPhone: "",
  adPageNotice: "",
  aboutText: "",
  contactPhone: "",
  contactPostalCode: "",
  contactAddress: "",
  contactTelegram: "",
  contactWhatsapp: "",
  contactInstagram: "",
  contactLocation: "",
};

export interface GeoPoint {
  lat: number;
  lng: number;
}

/**
 * Read a location typed or pasted by the administrator: "35.7, 51.4", Persian
 * digits, or a Google Maps link containing "@35.7,51.4". Null when not valid.
 */
export function parseGeoPoint(input: string): GeoPoint | null {
  const ascii = input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[٫]/g, ".");
  // A map link's "@lat,lng" wins over any other numbers in it (place names, zoom…).
  const match =
    ascii.match(/@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/) ??
    ascii.match(/(-?\d{1,2}(?:\.\d+)?)\s*[,،\s]\s*(-?\d{1,3}(?:\.\d+)?)/);
  if (!match) return null;
  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

/** "lat,lng" with at most 6 decimals (≈10 cm). */
export function formatGeoPoint({ lat, lng }: GeoPoint): string {
  const round = (n: number) => String(Math.round(n * 1e6) / 1e6);
  return `${round(lat)},${round(lng)}`;
}

/** Postal code shown as 12345-67890. */
export function formatPostalCode(code: string): string {
  return code.length === 10 ? `${code.slice(0, 5)}-${code.slice(5)}` : code;
}

/** Digits of a phone number for a `tel:` link, keeping a leading "+". */
export function phoneToTelHref(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/[^\d]/g, "");
  return `tel:${trimmed.startsWith("+") ? "+" : ""}${digits}`;
}
