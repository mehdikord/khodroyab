import type { PriceCurrency } from "@/lib/currency";

/**
 * Client-safe types and constants of the admin buy-ad (آگهی خرید) section.
 * Unlike the customer-facing records, the admin sees the buyer's and every
 * bidder's real identity (name, phone, photo). Loaders live in `admin-buy-ads.ts`.
 */

export const ADMIN_BUY_AD_SORTS = [
  "newest",
  "oldest",
  "offers_desc",
  "offers_asc",
  "updated",
  "year_desc",
  "year_asc",
  "mileage_asc",
  "brand",
] as const;
export type AdminBuyAdSort = (typeof ADMIN_BUY_AD_SORTS)[number];

export const ADMIN_BUY_AD_SORT_LABELS: Record<AdminBuyAdSort, string> = {
  newest: "جدیدترین",
  oldest: "قدیمی‌ترین",
  offers_desc: "بیشترین پیشنهاد قیمت",
  offers_asc: "کمترین پیشنهاد قیمت",
  updated: "آخرین ویرایش",
  year_desc: "سال ساخت (جدید به قدیم)",
  year_asc: "سال ساخت (قدیم به جدید)",
  mileage_asc: "کمترین کارکرد",
  brand: "برند و خودرو (الفبا)",
};

export function isAdminBuyAdSort(value: unknown): value is AdminBuyAdSort {
  return typeof value === "string" && (ADMIN_BUY_AD_SORTS as readonly string[]).includes(value);
}

export interface AdminBuyAdFilterValues {
  q: string;
  brandId: string;
  carId: string;
  userId: string;
  colorId: string;
  /** "" = all, "1" = active, "0" = paused. */
  active: "" | "1" | "0";
  /** "" = all, "1" = bidding open, "0" = bidding closed. */
  bidding: "" | "1" | "0";
  /** "" = all, "1" = has at least one offer, "0" = no offers. */
  offers: "" | "1" | "0";
  currency: PriceCurrency | "";
  yearFrom: string;
  yearTo: string;
  sort: AdminBuyAdSort;
}

export const ADMIN_BUY_AD_FILTER_DEFAULTS: AdminBuyAdFilterValues = {
  q: "",
  brandId: "",
  carId: "",
  userId: "",
  colorId: "",
  active: "",
  bidding: "",
  offers: "",
  currency: "",
  yearFrom: "",
  yearTo: "",
  sort: "newest",
};

/** URL parameter name of each filter. */
export const ADMIN_BUY_AD_PARAM_KEYS: Record<keyof AdminBuyAdFilterValues, string> = {
  q: "q",
  brandId: "brand",
  carId: "car",
  userId: "user",
  colorId: "color",
  active: "active",
  bidding: "bidding",
  offers: "offers",
  currency: "currency",
  yearFrom: "yearFrom",
  yearTo: "yearTo",
  sort: "sort",
};

/** A person as the admin sees them: buyer of an ad or bidder of an offer. */
export interface AdminBuyAdPerson {
  id: string;
  name: string;
  companyName: string | null;
  phone: string;
  image: string | null;
  /** Current public 8-digit code. */
  code: string;
  isCollaborator: boolean;
  isVerified: boolean;
}

/** One row of the admin buy-ads table. */
export interface AdminBuyAdRecord {
  id: string;
  code: string;
  carId: string;
  brandName: string;
  carName: string;
  carModel: string;
  carTypeName: string;
  imageUrl: string | null;
  year: string;
  mileage: number;
  colorName: string;
  colorCode: string;
  description: string | null;
  isActive: boolean;
  biddingOpen: boolean;
  currency: PriceCurrency;
  offerCount: number;
  /** Lowest offer (digits), null without offers. */
  bestOffer: string | null;
  buyer: AdminBuyAdPerson;
  createdAtLabel: string;
  updatedAtLabel: string;
}

/** One price offer with the bidder's full identity. */
export interface AdminBuyAdOffer {
  id: string;
  price: string;
  bidder: AdminBuyAdPerson;
  edited: boolean;
  createdAtLabel: string;
  updatedAtLabel: string;
}

export interface AdminBuyAdDetail extends AdminBuyAdRecord {
  galleryUrls: string[];
  /** Lowest price first; equal prices keep the order in which they were set. */
  offers: AdminBuyAdOffer[];
}

export interface AdminBuyAdCounts {
  total: number;
  active: number;
  paused: number;
  biddingOpen: number;
  biddingClosed: number;
  withOffers: number;
  totalOffers: number;
}

export interface AdminBuyAdOption {
  id: string;
  name: string;
  description?: string;
  code?: string;
}

export interface AdminBuyAdFilterOptions {
  brands: AdminBuyAdOption[];
  cars: (AdminBuyAdOption & { brandId: string })[];
  users: AdminBuyAdOption[];
  colors: AdminBuyAdOption[];
  years: string[];
}
