/**
 * Client-safe shape of the signed-in customer's profile, as rendered by the
 * user panel. Kept free of server-only imports so client components can
 * import the type.
 */
export interface ProfileRecord {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  image: string | null;
  bio: string | null;
  nationalCode: string | null;
  address: string | null;
  postalCode: string | null;
  tel: string | null;
  /** ISO timestamp */
  createdAt: string;
  /** ISO timestamp */
  updatedAt: string;
}

/** Ad counters shown on the profile hero. */
export interface ProfileAdStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

/**
 * The legacy database default for `national_code` is the literal "1"; treat
 * anything that is not a full 10-digit code as "not provided".
 */
export function displayNationalCode(value: string | null | undefined): string | null {
  if (!value) return null;
  return /^\d{10}$/.test(value) ? value : null;
}

/** Fields that count towards the "profile completion" ring. */
export const PROFILE_COMPLETION_FIELDS: { key: keyof ProfileRecord; label: string }[] = [
  { key: "image", label: "تصویر پروفایل" },
  { key: "email", label: "ایمیل" },
  { key: "nationalCode", label: "کد ملی" },
  { key: "tel", label: "تلفن ثابت" },
  { key: "address", label: "آدرس" },
  { key: "postalCode", label: "کد پستی" },
  { key: "bio", label: "درباره من" },
];

export function profileCompletion(profile: ProfileRecord): { percent: number; missing: string[] } {
  const missing: string[] = [];
  for (const field of PROFILE_COMPLETION_FIELDS) {
    const raw = profile[field.key];
    const value = field.key === "nationalCode" ? displayNationalCode(raw as string | null) : raw;
    if (!value || (typeof value === "string" && value.trim().length === 0)) missing.push(field.label);
  }
  // Name and phone are always present; they anchor the baseline.
  const filled = PROFILE_COMPLETION_FIELDS.length - missing.length + 2;
  const total = PROFILE_COMPLETION_FIELDS.length + 2;
  return { percent: Math.round((filled / total) * 100), missing };
}

/* ───────────────────────── password UX ───────────────────────── */

/** Minimum customer password length (also enforced server-side in validation/user.ts). */
export const PASSWORD_MIN_LENGTH = 6;

/**
 * Rough password strength score (0–4) for the client-side meter.
 * Purely a UX hint; the server only enforces length limits.
 */
export function passwordStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= PASSWORD_MIN_LENGTH) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Za-z]/.test(password) && /\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}
