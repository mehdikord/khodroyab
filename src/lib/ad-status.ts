/**
 * Client-safe helpers for the sale-ad moderation status (`UserCarStatus`).
 * Kept free of server-only imports so both server and client components can use it.
 */
export type AdStatus = "pending" | "approved" | "rejected";

export const AD_STATUSES: AdStatus[] = ["pending", "approved", "rejected"];

export const AD_STATUS_LABELS: Record<AdStatus, string> = {
  pending: "در انتظار تایید",
  approved: "تایید شده",
  rejected: "رد شده",
};

export const AD_STATUS_DESCRIPTIONS: Record<AdStatus, string> = {
  pending: "آگهی توسط کاربر ثبت شده و منتظر بررسی مدیر است",
  approved: "آگهی بررسی و تایید شده و قابل نمایش است",
  rejected: "آگهی توسط مدیر رد شده و نمایش داده نمی‌شود",
};

export function isAdStatus(value: unknown): value is AdStatus {
  return typeof value === "string" && (AD_STATUSES as string[]).includes(value);
}
