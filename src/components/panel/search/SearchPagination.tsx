import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn, toPersianDigits } from "@/lib/utils";

interface SearchPaginationProps {
  page: number;
  pageCount: number;
  /** Current query string (without `page`), e.g. "?q=bmw&sort=newest". */
  baseQuery: string;
  pathname: string;
}

function hrefFor(pathname: string, baseQuery: string, page: number): string {
  const params = new URLSearchParams(baseQuery.replace(/^\?/, ""));
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/** Compact page list: first, last, and a window around the current page. */
function pageWindow(page: number, pageCount: number): (number | "gap")[] {
  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1]);
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) result.push("gap");
    result.push(p);
  });
  return result;
}

export function SearchPagination({ page, pageCount, baseQuery, pathname }: SearchPaginationProps) {
  if (pageCount <= 1) return null;

  const buttonClass =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-bold transition-colors";

  return (
    <nav aria-label="صفحه‌بندی نتایج" className="flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link
          href={hrefFor(pathname, baseQuery, page - 1)}
          aria-label="صفحه قبل"
          className={cn(buttonClass, "border-panel-line/[0.1] bg-panel-surface text-panel-text-2 hover:border-[#FF6A00]/40")}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(buttonClass, "border-panel-line/[0.05] text-panel-faint-2")}>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}

      {pageWindow(page, pageCount).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-panel-faint">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(pathname, baseQuery, item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              buttonClass,
              item === page
                ? "border-[#FF6A00]/50 bg-[#FF6A00]/15 text-panel-accent"
                : "border-panel-line/[0.1] bg-panel-surface text-panel-text-2 hover:border-[#FF6A00]/40"
            )}
          >
            {toPersianDigits(item)}
          </Link>
        )
      )}

      {page < pageCount ? (
        <Link
          href={hrefFor(pathname, baseQuery, page + 1)}
          aria-label="صفحه بعد"
          className={cn(buttonClass, "border-panel-line/[0.1] bg-panel-surface text-panel-text-2 hover:border-[#FF6A00]/40")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(buttonClass, "border-panel-line/[0.05] text-panel-faint-2")}>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
