/**
 * Client-safe types and constants for the customer car search.
 * Kept free of server-only imports so client components (filters, cards) can
 * import them; the data loaders live in `panel-search.ts`.
 */

export const SEARCH_SORTS = ["newest", "oldest", "brand", "name", "year_desc", "year_asc"] as const;
export type SearchSort = (typeof SEARCH_SORTS)[number];

export const SEARCH_SORT_LABELS: Record<SearchSort, string> = {
  newest: "جدیدترین",
  oldest: "قدیمی‌ترین",
  brand: "برند (الفبا)",
  name: "نام خودرو (الفبا)",
  year_desc: "سال ساخت (جدید به قدیم)",
  year_asc: "سال ساخت (قدیم به جدید)",
};

export function isSearchSort(value: unknown): value is SearchSort {
  return typeof value === "string" && (SEARCH_SORTS as readonly string[]).includes(value);
}

export interface SearchFilterValues {
  q: string;
  brand: string;
  carType: string;
  saleTerm: string;
  yearFrom: string;
  yearTo: string;
  sort: SearchSort;
}

export interface SearchOption {
  id: string;
  name: string;
  image?: string | null;
}

export interface SearchOptions {
  brands: SearchOption[];
  carTypes: SearchOption[];
  saleTerms: SearchOption[];
  years: string[];
}

/** One point of a sale term's price timeline. */
export interface SearchPricePoint {
  /** Price in tomans. */
  price: number;
  /** ISO timestamp of the change. */
  at: string;
  /** Pre-formatted Persian date (server-side, avoids hydration drift). */
  dateLabel: string;
  /** Pre-formatted Persian time of day. */
  timeLabel: string;
}

/** A sale term attached to an ad, with its price history for the delta badge + chart. */
export interface SearchAdSaleTerm {
  id: string;
  title: string;
  currentPrice: number;
  /** Price before the latest change, or null when the price never changed. */
  previousPrice: number | null;
  /** `currentPrice - previousPrice`; null when there is no previous price. */
  delta: number | null;
  /** Oldest → newest. Always contains at least the current price. */
  history: SearchPricePoint[];
}

/**
 * Public-safe projection of an approved sale ad for the customer panel.
 * Excludes the seller's phone number. Prices are exposed only through the
 * per-term price history (delta badge + chart).
 */
export interface SearchAdRecord {
  id: string;
  code: string;
  carName: string;
  carModel: string;
  carYear: string;
  carTypeName: string;
  brandName: string;
  brandImage: string | null;
  /** First image registered for the car, or null when none exists. */
  imageUrl: string | null;
  userId: string;
  userName: string;
  userImage: string | null;
  saleTerms: SearchAdSaleTerm[];
  createdAtLabel: string;
}

export interface SearchResult {
  ads: SearchAdRecord[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
}

/** Public view of a seller, as other customers see it. */
export interface SellerProfile {
  id: string;
  name: string;
  image: string | null;
  bio: string | null;
  /** Pre-formatted Persian "member since" date. */
  memberSinceLabel: string;
  approvedAdCount: number;
}
