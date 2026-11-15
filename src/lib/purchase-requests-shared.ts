/**
 * Client-safe types and constants of purchase requests (درخواست خرید).
 * Loaders and writers live in `purchase-requests.ts`, validation in
 * `validation/purchase-requests.ts`.
 */

import type { PriceCurrency } from "@/lib/currency";

/* ───────────────────────── Status & source ───────────────────────── */

export const PURCHASE_REQUEST_STATUSES = ["received", "in_progress", "completed", "no_answer", "cancelled"] as const;
export type PurchaseRequestStatus = (typeof PURCHASE_REQUEST_STATUSES)[number];

export const PURCHASE_REQUEST_STATUS_LABELS: Record<PurchaseRequestStatus, string> = {
  received: "جدید",
  in_progress: "در حال پیگیری",
  completed: "پایان یافته",
  no_answer: "عدم پاسخ‌گویی",
  cancelled: "لغو شده",
};

/** Badge colours of each status (admin dark theme and customer panel alike). */
export const PURCHASE_REQUEST_STATUS_TONES: Record<PurchaseRequestStatus, string> = {
  received: "border-[#FF6A00]/40 bg-[#FF6A00]/10 text-[#FF8A2A]",
  in_progress: "border-sky-500/35 bg-sky-500/10 text-sky-400",
  completed: "border-emerald-500/35 bg-emerald-500/10 text-emerald-400",
  no_answer: "border-amber-500/35 bg-amber-500/10 text-amber-400",
  cancelled: "border-red-500/35 bg-red-500/10 text-red-400",
};

export function isPurchaseRequestStatus(value: unknown): value is PurchaseRequestStatus {
  return typeof value === "string" && (PURCHASE_REQUEST_STATUSES as readonly string[]).includes(value);
}

export const PURCHASE_REQUEST_SOURCES = ["sale_ad", "price_list"] as const;
export type PurchaseRequestSource = (typeof PURCHASE_REQUEST_SOURCES)[number];

export const PURCHASE_REQUEST_SOURCE_LABELS: Record<PurchaseRequestSource, string> = {
  sale_ad: "آگهی فروش",
  price_list: "لیست قیمت",
};

export function isPurchaseRequestSource(value: unknown): value is PurchaseRequestSource {
  return typeof value === "string" && (PURCHASE_REQUEST_SOURCES as readonly string[]).includes(value);
}

/** Who sent it: a guest (درخواست عمومی) or a signed-in customer (درخواست همکاران). */
export type PurchaseRequestAudience = "public" | "members";

export const PURCHASE_REQUEST_AUDIENCE_LABELS: Record<PurchaseRequestAudience, string> = {
  public: "درخواست‌های عمومی",
  members: "درخواست‌های همکاران",
};

export const PURCHASE_REQUEST_DESCRIPTION_MAX = 1000;
export const PURCHASE_REQUEST_NAME_MAX = 120;
export const PURCHASE_REQUEST_NOTE_MAX = 5000;

/* ───────────────────────── Price snapshot ───────────────────────── */

/** One price the requester saw when sending, e.g. "نقدی: 12000" or "۲۰۲۴ · سفید · فوری: 45000". */
export interface PurchaseRequestPriceLine {
  label: string;
  /** Digits only. */
  price: string;
  /** A collaborator price (shown to verified collaborators only). */
  partner?: boolean;
}

export interface PurchaseRequestPriceSnapshot {
  lines: PurchaseRequestPriceLine[];
}

/* ───────────────────────── Records ───────────────────────── */

/** A request as the requester sees it in «درخواست‌های من». */
export interface MyPurchaseRequestRecord {
  id: string;
  source: PurchaseRequestSource;
  status: PurchaseRequestStatus;
  carLabel: string;
  sellerCode: string;
  adCode: string | null;
  /** Link to the ad / car price page, when it still exists. */
  href: string | null;
  year: string | null;
  colorName: string | null;
  description: string | null;
  createdAtLabel: string;
  updatedAtLabel: string;
}

/** A person (requester or seller) as the admin sees them. */
export interface PurchaseRequestPerson {
  id: string;
  name: string;
  companyName: string | null;
  phone: string;
  image: string | null;
  /** Current public code. */
  code: string;
  isCollaborator: boolean;
  isVerified: boolean;
  isActive: boolean;
}

/** One row of the admin list. */
export interface AdminPurchaseRequestRecord {
  id: string;
  source: PurchaseRequestSource;
  status: PurchaseRequestStatus;
  isGuest: boolean;
  seen: boolean;
  name: string;
  phone: string;
  /** Requester's code when sent (members only). */
  requesterCode: string | null;
  provinceName: string | null;
  cityName: string | null;
  description: string | null;
  /** Seller's code when the request was sent. */
  sellerCode: string;
  /** The seller's account today (null once deleted). */
  seller: PurchaseRequestPerson | null;
  carId: string | null;
  carLabel: string;
  carImage: string | null;
  adId: string | null;
  adCode: string | null;
  year: string | null;
  colorName: string | null;
  colorCode: string | null;
  currency: PriceCurrency | null;
  priceLines: PurchaseRequestPriceLine[];
  hasNote: boolean;
  createdAt: string;
  createdAtLabel: string;
  updatedAtLabel: string;
}

export interface PurchaseRequestStatusLogRecord {
  id: string;
  fromStatus: PurchaseRequestStatus | null;
  toStatus: PurchaseRequestStatus;
  adminName: string;
  createdAtLabel: string;
}

export interface AdminPurchaseRequestDetail extends AdminPurchaseRequestRecord {
  /** The requester's account today (members only; null for guests or once deleted). */
  requester: (PurchaseRequestPerson & { address: string | null; email: string | null }) | null;
  adminNote: string;
  seenAtLabel: string | null;
  logs: PurchaseRequestStatusLogRecord[];
}

/* ───────────────────────── Admin filters ───────────────────────── */

export const ADMIN_PURCHASE_REQUEST_SORTS = ["newest", "oldest", "updated", "unseen", "status", "car", "seller"] as const;
export type AdminPurchaseRequestSort = (typeof ADMIN_PURCHASE_REQUEST_SORTS)[number];

export const ADMIN_PURCHASE_REQUEST_SORT_LABELS: Record<AdminPurchaseRequestSort, string> = {
  newest: "جدیدترین",
  oldest: "قدیمی‌ترین",
  updated: "آخرین تغییر",
  unseen: "مشاهده‌نشده‌ها اول",
  status: "وضعیت",
  car: "خودرو (الفبا)",
  seller: "کد فروشنده",
};

export function isAdminPurchaseRequestSort(value: unknown): value is AdminPurchaseRequestSort {
  return typeof value === "string" && (ADMIN_PURCHASE_REQUEST_SORTS as readonly string[]).includes(value);
}

export interface AdminPurchaseRequestFilterValues {
  q: string;
  status: PurchaseRequestStatus | "";
  source: PurchaseRequestSource | "";
  /** "" = all, "0" = unseen, "1" = seen. */
  seen: "" | "0" | "1";
  brandId: string;
  carId: string;
  /** Seller account id. */
  sellerId: string;
  provinceId: string;
  cityId: string;
  /** Jalali "1405/08/24" (digits may be Persian). */
  from: string;
  to: string;
  sort: AdminPurchaseRequestSort;
}

export const ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS: AdminPurchaseRequestFilterValues = {
  q: "",
  status: "",
  source: "",
  seen: "",
  brandId: "",
  carId: "",
  sellerId: "",
  provinceId: "",
  cityId: "",
  from: "",
  to: "",
  sort: "newest",
};

export const ADMIN_PURCHASE_REQUEST_PARAM_KEYS: Record<keyof AdminPurchaseRequestFilterValues, string> = {
  q: "q",
  status: "status",
  source: "source",
  seen: "seen",
  brandId: "brand",
  carId: "car",
  sellerId: "seller",
  provinceId: "province",
  cityId: "city",
  from: "from",
  to: "to",
  sort: "sort",
};

export interface AdminPurchaseRequestCounts {
  total: number;
  unseen: number;
  byStatus: Record<PurchaseRequestStatus, number>;
  bySource: Record<PurchaseRequestSource, number>;
}

export interface AdminPurchaseRequestOption {
  id: string;
  name: string;
  description?: string;
}

export interface AdminPurchaseRequestFilterOptions {
  brands: AdminPurchaseRequestOption[];
  cars: (AdminPurchaseRequestOption & { brandId: string })[];
  sellers: AdminPurchaseRequestOption[];
  provinces: (AdminPurchaseRequestOption & { cities: AdminPurchaseRequestOption[] })[];
}

/** Unseen requests per audience, for the admin sidebar badges. */
export interface PurchaseRequestUnseenCounts {
  public: number;
  members: number;
}

/* ───────────────────────── Request form ───────────────────────── */

/** What the purchase-request form is about (sent by the button that opens it). */
export type PurchaseRequestTarget =
  | {
      source: "sale_ad";
      adId: string;
      /** Shown in the form header. */
      carLabel: string;
      sellerCode: string;
      adCode: string;
      imageUrl: string | null;
      /** e.g. "۲۰۲۴ · سفید" */
      details: string | null;
    }
  | {
      source: "price_list";
      carId: string;
      carLabel: string;
      sellerCode: string;
      imageUrl: string | null;
      /** The seller's priced (year, colour, currency) columns the requester may pick from. */
      tiers: { key: string; label: string; colorCode: string }[];
    };

/** The viewer of the page that shows the button. */
export interface PurchaseRequestViewer {
  /** Signed in: the form only asks for a note. */
  signedIn: boolean;
  name: string | null;
  phone: string | null;
}
