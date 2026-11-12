import type { PriceCurrency } from "@/lib/currency";

/**
 * Client-safe types and constants of buy ads (آگهی خرید). A buy ad is a
 * collaborator's request for a car: model, year, colour, mileage and optional
 * notes, with no moderation. Verified collaborators may send price offers. The data loaders live in `buy-ads.ts`.
 */

/** Maximum length of a buy ad's notes. */
export const BUY_AD_DESCRIPTION_MAX = 1000;

export const BUY_AD_SORTS = ["newest", "oldest", "brand", "name", "year_desc", "year_asc", "mileage_asc"] as const;
export type BuyAdSort = (typeof BUY_AD_SORTS)[number];

export const BUY_AD_SORT_LABELS: Record<BuyAdSort, string> = {
  newest: "جدیدترین",
  oldest: "قدیمی‌ترین",
  brand: "برند (الفبا)",
  name: "نام خودرو (الفبا)",
  year_desc: "سال ساخت (جدید به قدیم)",
  year_asc: "سال ساخت (قدیم به جدید)",
  mileage_asc: "کمترین کارکرد",
};

export function isBuyAdSort(value: unknown): value is BuyAdSort {
  return typeof value === "string" && (BUY_AD_SORTS as readonly string[]).includes(value);
}

/** Upper bounds offered by the "maximum mileage" filter, in kilometres. */
export const BUY_AD_MILEAGE_STEPS = [0, 10_000, 30_000, 50_000, 100_000, 200_000] as const;

export interface BuyAdFilterValues {
  q: string;
  brand: string;
  carType: string;
  color: string;
  yearFrom: string;
  yearTo: string;
  /** Maximum requested mileage in km, as a digit string ("" = any). */
  mileageMax: string;
  sort: BuyAdSort;
}

export const BUY_AD_FILTER_DEFAULTS: BuyAdFilterValues = {
  q: "",
  brand: "",
  carType: "",
  color: "",
  yearFrom: "",
  yearTo: "",
  mileageMax: "",
  sort: "newest",
};

export interface BuyAdFilterOption {
  id: string;
  name: string;
  /** Hex code, for colour options. */
  code?: string;
}

export interface BuyAdSearchOptions {
  brands: BuyAdFilterOption[];
  carTypes: BuyAdFilterOption[];
  colors: BuyAdFilterOption[];
  years: string[];
}

/**
 * Public-safe projection of a buy ad. The buyer is identified only by their
 * rotating public code: name, phone, photo and account id never reach other
 * customers.
 */
export interface BuyAdRecord {
  id: string;
  code: string;
  carId: string;
  brandId: string;
  brandName: string;
  brandImage: string | null;
  carName: string;
  carModel: string;
  carTypeName: string;
  /** The car's first catalogue photo (buy ads have no photos of their own). */
  imageUrl: string | null;
  year: string;
  /** Requested mileage in kilometres; 0 = brand new. */
  mileage: number;
  colorId: string;
  colorName: string;
  colorCode: string;
  description: string | null;
  isActive: boolean;
  /** Currency of every price offer on the ad. */
  currency: PriceCurrency;
  /** Collaborators may send price offers. */
  biddingOpen: boolean;
  /** Number of price offers received. */
  offerCount: number;
  /** Lowest offer (digits); filled only on the owner's own list. */
  bestOffer: string | null;
  /** The buyer's current public 8-digit code. */
  buyerCode: string;
  createdAtLabel: string;
}

/** Everything the buy ad page shows. */
export interface BuyAdDetailRecord extends BuyAdRecord {
  /** The viewer owns the ad (may see it while paused and manage it). */
  isOwner: boolean;
  /** The owner is a verified collaborator and may edit the ad. */
  canEdit: boolean;
  /** Catalogue photos of the requested car. */
  galleryUrls: string[];
  updatedAtLabel: string;
}

export interface BuyAdSearchResult {
  ads: BuyAdRecord[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
}

/* ───────────────────────── Price offers ───────────────────────── */

/** The offers list refreshes itself this often. */
export const BUY_AD_OFFER_POLL_MS = 20_000;

/** Longest accepted offer, in digits. */
export const BUY_AD_OFFER_MAX_DIGITS = 15;

/** One price offer on a buy ad. Bidders are identified only by their public code. */
export interface BuyAdOffer {
  id: string;
  /** Whole number in the ad's currency, as digits. */
  price: string;
  /** The bidder's current public 8-digit code. */
  bidderCode: string;
  /** The viewer sent this offer. */
  isMine: boolean;
  /** The offer was changed after it was first sent. */
  edited: boolean;
  /** Pre-formatted Persian date and time of the latest change. */
  updatedAtLabel: string;
}

/**
 * Everything the offers panel of a buy ad needs, from the viewer's point of
 * view. Offers are sorted from the lowest to the highest price.
 */
export interface BuyAdOffersState {
  adId: string;
  currency: PriceCurrency;
  biddingOpen: boolean;
  /** The viewer owns the ad: sees the offers, may open/close bidding, never bids. */
  isOwner: boolean;
  /** Verified collaborators and the owner see the offers; everyone else sees a lock. */
  canView: boolean;
  /** The viewer may send, edit or withdraw an offer right now. */
  canBid: boolean;
  /** Lowest price first; empty when `canView` is false. */
  offers: BuyAdOffer[];
  /** The viewer's own offer, if any. */
  myOffer: { id: string; price: string; rank: number } | null;
}
