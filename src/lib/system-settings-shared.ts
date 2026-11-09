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
} as const;

export type SystemSettingField = keyof typeof SYSTEM_SETTING_KEYS;

export interface SystemSettings {
  userCodeRotationMinutes: number;
  /** Empty string when not set (the consultation button is then hidden). */
  consultationPhone: string;
  /** Empty string when not set (no notice is shown). */
  adPageNotice: string;
}

export const DEFAULT_USER_CODE_ROTATION_MINUTES = 30;
export const MIN_USER_CODE_ROTATION_MINUTES = 1;
/** One week. */
export const MAX_USER_CODE_ROTATION_MINUTES = 10080;
export const MAX_AD_PAGE_NOTICE_LENGTH = 2000;

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  userCodeRotationMinutes: DEFAULT_USER_CODE_ROTATION_MINUTES,
  consultationPhone: "",
  adPageNotice: "",
};

/** Digits of a phone number for a `tel:` link, keeping a leading "+". */
export function phoneToTelHref(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/[^\d]/g, "");
  return `tel:${trimmed.startsWith("+") ? "+" : ""}${digits}`;
}
