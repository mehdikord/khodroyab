// Subscription constants and helpers shared by server code and client components.

/** Every subscription month grants this many days of panel access. */
export const DAYS_PER_MONTH = 30;

/** Active subscriptions with fewer remaining days than this are "expiring". */
export const SUBSCRIPTION_WARNING_DAYS = 10;

export const SUBSCRIPTION_MAX_MONTHS = 120;
export const SUBSCRIPTION_PRICE_MAX_DIGITS = 15;

const DAY_MS = 86_400_000;

/** Whole days left until `endsAt` (a partial day counts as one). */
export function remainingDays(endsAt: Date | string, now: Date = new Date()): number {
  const diff = new Date(endsAt).getTime() - now.getTime();
  return diff > 0 ? Math.ceil(diff / DAY_MS) : 0;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/** Compact summary of a user's current subscription for tables and headers. */
export interface ActiveSubscriptionSummary {
  id: string;
  planName: string;
  endsAt: string;
  remainingDays: number;
}

export function isExpiringSoon(summary: ActiveSubscriptionSummary | null): boolean {
  return summary !== null && summary.remainingDays < SUBSCRIPTION_WARNING_DAYS;
}
