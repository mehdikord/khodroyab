/** Minimal Jalali (Persian calendar) helpers. Client-safe. */

function div(a: number, b: number): number {
  return Math.floor(a / b);
}

/**
 * Jalali → Gregorian (the well-known jalaali-js arithmetic).
 * Returns `[year, month, day]` with a 1-based month.
 */
export function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  jy += 1595;
  let days = -355668 + 365 * jy + div(jy, 33) * 8 + div((jy % 33) + 3, 4) + jd + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  let gy = 400 * div(days, 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * div(--days, 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    gy += div(days - 1, 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const monthDays = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (gm = 0; gm < 13 && gd > monthDays[gm]; gm++) gd -= monthDays[gm];
  return [gy, gm, gd];
}

/**
 * Parse a typed Jalali date ("1405/08/24", "۱۴۰۵-۸-۲۴") to the UTC instant of
 * that day's midnight in Tehran (UTC+03:30). Null when not a valid date.
 */
export function parseJalaliDate(input: string): Date | null {
  const ascii = input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .trim();
  const match = ascii.match(/^(1[34]\d{2})[/\-.](\d{1,2})[/\-.](\d{1,2})$/);
  if (!match) return null;
  const [jy, jm, jd] = [Number(match[1]), Number(match[2]), Number(match[3])];
  if (jm < 1 || jm > 12 || jd < 1 || jd > (jm <= 6 ? 31 : 30)) return null;
  const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd);
  // Tehran midnight = 20:30 UTC of the previous day.
  return new Date(Date.UTC(gy, gm - 1, gd, 0, 0, 0) - 3.5 * 60 * 60 * 1000);
}
