/** Helpers for URL-driven (server-side) pagination of admin and panel lists. */

export type SearchParams = Record<string, string | string[] | undefined>;

/** First value of a search param, or "". */
export function single(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/** Requested 1-based page number from `?page=` (invalid → 1). */
export function requestedPage(searchParams: SearchParams): number {
  const page = Number.parseInt(single(searchParams.page), 10);
  return Number.isFinite(page) && page > 0 ? Math.min(page, 1_000_000) : 1;
}

/** Search text from `?q=`, trimmed and capped. */
export function searchQuery(searchParams: SearchParams, max = 100): string {
  return single(searchParams.q).trim().slice(0, max);
}

/** Positive integer id from a search param, or null. */
export function idParam(value: string | string[] | undefined): bigint | null {
  const raw = single(value);
  if (!/^\d{1,20}$/.test(raw)) return null;
  try {
    return BigInt(raw);
  } catch {
    return null;
  }
}

export interface PageWindow {
  page: number;
  pageCount: number;
  skip: number;
  take: number;
}

/** Clamp the requested page to the available range and compute skip/take. */
export function pageWindow(total: number, requested: number, pageSize: number): PageWindow {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, requested), pageCount);
  return { page, pageCount, skip: (page - 1) * pageSize, take: pageSize };
}

/**
 * Split free text into search tokens (max 6) so "پژو 206 تیپ" matches
 * "پژو 206 تیپ ۲" regardless of word order. Arabic ي/ك are folded to Persian.
 */
export function searchTokens(query: string): string[] {
  return query
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .split(/[\s‌]+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .slice(0, 6);
}
