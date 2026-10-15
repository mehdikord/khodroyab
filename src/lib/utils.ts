import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPersianDigits(input: string | number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(input).replace(/\d/g, (d) => persianDigits[Number(d)]);
}

/**
 * Format a numeric string (ASCII or Persian digits, with or without separators)
 * as a grouped Persian number, e.g. "1250000" → "۱,۲۵۰,۰۰۰".
 * Returns an empty string when no digits are present.
 */
export function formatPersianNumber(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return "";
  const ascii = String(input)
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[^\d]/g, "");
  if (!ascii) return "";
  return toPersianDigits(ascii.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}
