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
  color: string;
  yearFrom: string;
  yearTo: string;
  sort: SearchSort;
}

export interface SearchOption {
  id: string;
  name: string;
  image?: string | null;
  /** Hex code, for colour options. */
  code?: string;
}

export interface SearchOptions {
  brands: SearchOption[];
  carTypes: SearchOption[];
  saleTerms: SearchOption[];
  colors: SearchOption[];
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
  /** Current public price (قیمت عمومی). The history and delta below track this price. */
  currentPrice: number;
  /**
   * Collaborator price (قیمت همکار). Filled only for viewers allowed to see it
   * (verified collaborators, the ad's owner); always null for everyone else.
   */
  partnerPrice: number | null;
  /** Price before the latest change, or null when the price never changed. */
  previousPrice: number | null;
  /** `currentPrice - previousPrice`; null when there is no previous price. */
  delta: number | null;
  /** Oldest → newest. Always contains at least the current price. */
  history: SearchPricePoint[];
}

/**
 * Public-safe projection of an approved sale ad for the customer panel.
 * The seller is identified only by their rotating code. Prices are exposed only through the
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
  colorName: string | null;
  colorCode: string | null;
  /** Cover: the ad's primary photo, else the car's first catalogue photo. */
  imageUrl: string | null;
  /**
   * The seller's current public 8-digit code (rotates automatically). Shown
   * instead of any identity: name, phone, photo and account id never reach
   * other customers.
   */
  sellerCode: string;
  saleTerms: SearchAdSaleTerm[];
  createdAtLabel: string;
}

/** A sale term on the ad detail page, with its full commercial details. */
export interface AdDetailSaleTerm extends SearchAdSaleTerm {
  sale: string | null;
  perecentage: string | null;
  description: string | null;
}

/** Everything the dedicated ad page shows. */
export interface AdDetailRecord extends Omit<SearchAdRecord, "saleTerms"> {
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  /** True when the viewer owns the ad (may see it unapproved). */
  isOwner: boolean;
  /** The owner is a verified collaborator and may edit the ad. */
  canEdit: boolean;
  /** The viewer may see collaborator prices (`partnerPrice` is filled where set). */
  showPartnerPrices: boolean;
  qautity: string;
  description: string;
  /** Gallery: the ad's photos (primary first), else the car's catalogue photos. */
  galleryUrls: string[];
  /** True when `galleryUrls` are catalogue photos rather than the seller's own. */
  galleryIsCatalogue: boolean;
  options: { optionId: string; name: string; value: string }[];
  saleTerms: AdDetailSaleTerm[];
}

export interface SearchResult {
  ads: SearchAdRecord[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
}
