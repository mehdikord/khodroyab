/** Client-safe constants/helpers for the price table (no server-only or zod imports). */

export const PRICE_TABLE_PRICE_MAX_DIGITS = 12;

/** Placeholder shown wherever a customer has not filled in a cell. */
export const PRICE_TABLE_EMPTY = "---";

/**
 * The three USD prices of a price-table row, in display order. Each one has a
 * public value (`key`, shown to everyone) and a collaborator value
 * (`partnerKey`, shown only to verified collaborators).
 */
export const PRICE_TABLE_PRICE_FIELDS = [
  { key: "priceUsd", partnerKey: "partnerPriceUsd", label: "قیمت خام" },
  { key: "clearancePrice", partnerKey: "partnerClearancePrice", label: "قیمت ترخیصی" },
  { key: "instantPrice", partnerKey: "partnerInstantPrice", label: "قیمت فوری" },
] as const;

/** A public price of a row. */
export type PriceTablePriceField = (typeof PRICE_TABLE_PRICE_FIELDS)[number]["key"];
/** A collaborator price of a row. */
export type PriceTablePartnerField = (typeof PRICE_TABLE_PRICE_FIELDS)[number]["partnerKey"];
/** Any of the six stored prices. */
export type PriceTableAnyPriceField = PriceTablePriceField | PriceTablePartnerField;

/** All six stored prices: for each field, the public then the collaborator value. */
export const PRICE_TABLE_ALL_PRICE_KEYS: readonly PriceTableAnyPriceField[] = PRICE_TABLE_PRICE_FIELDS.flatMap((field) => [
  field.key,
  field.partnerKey,
]);

/** The collaborator prices only. */
export const PRICE_TABLE_PARTNER_KEYS: readonly PriceTablePartnerField[] = PRICE_TABLE_PRICE_FIELDS.map((field) => field.partnerKey);

export const PRICE_TYPE_LABELS = { public: "عمومی", partner: "همکار" } as const;

/**
 * Copy of a row's prices with the collaborator ones blanked unless `showPartner`
 * (the viewer is a verified collaborator). Server code calls this before any
 * price leaves for the browser, so other viewers never receive them.
 */
export function withVisiblePrices<T extends Record<PriceTableAnyPriceField, string | null>>(prices: T, showPartner: boolean): T {
  if (showPartner) return prices;
  const copy = { ...prices };
  for (const key of PRICE_TABLE_PARTNER_KEYS) copy[key] = null as T[typeof key];
  return copy;
}

/** True when at least one of the given row's prices is set. */
export function hasAnyPrice(prices: Record<PriceTableAnyPriceField, string | null>): boolean {
  return PRICE_TABLE_ALL_PRICE_KEYS.some((key) => Boolean(prices[key]));
}

/** Fold Persian/Arabic-Indic digits to ASCII and drop everything that is not a digit. */
export function digitsOnly(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[^\d]/g, "");
}

/** Canonical USD price string: ASCII digits, no leading zeros, capped length. */
export function normalizeUsdPrice(input: string): string {
  return digitsOnly(input).replace(/^0+(?=\d)/, "").slice(0, PRICE_TABLE_PRICE_MAX_DIGITS);
}

/* ───────────────────────── Year tiers ───────────────────────── */

/** Most year tiers (price rows) a customer may add for one car. */
export const PRICE_TABLE_MAX_TIERS = 10;

/** Accepted production years: Jalali (13xx/14xx) or Gregorian (19xx/20xx). */
export const PRICE_TABLE_YEAR_MIN = 1300;
export const PRICE_TABLE_YEAR_MAX = 2100;

/** Year as typed: ASCII digits only, at most 4 of them. */
export function normalizeYear(input: string): string {
  return digitsOnly(input).slice(0, 4);
}

export function isValidTierYear(year: string): boolean {
  if (!/^\d{4}$/.test(year)) return false;
  const value = Number(year);
  return value >= PRICE_TABLE_YEAR_MIN && value <= PRICE_TABLE_YEAR_MAX;
}

/** Order tiers newest year first (used by read-only views). */
export function compareTierYearsDesc(a: string, b: string): number {
  return Number(b) - Number(a);
}

/* ───────────────────────── Price columns (year × colour) ───────────────────────── */

/** One price column of the market price lists: a (production year, colour) pair. */
export interface PriceColumn {
  /** `"<year>:<colorId>"` — key of the column in the per-column price maps. */
  key: string;
  year: string;
  colorId: string;
  colorName: string;
  /** Hex colour code, e.g. "#ffffff". */
  colorCode: string;
}

export function priceColumnKey(year: string, colorId: string): string {
  return `${year}:${colorId}`;
}

/** Column order: oldest year first, then colour name. */
export function comparePriceColumns(a: PriceColumn, b: PriceColumn): number {
  return Number(a.year) - Number(b.year) || a.colorName.localeCompare(b.colorName, "fa") || a.colorId.localeCompare(b.colorId);
}

/** De-duplicated, ordered union of the given columns. */
export function mergePriceColumns(columns: Iterable<PriceColumn>): PriceColumn[] {
  const byKey = new Map<string, PriceColumn>();
  for (const column of Array.from(columns)) if (!byKey.has(column.key)) byKey.set(column.key, column);
  return Array.from(byKey.values()).sort(comparePriceColumns);
}
