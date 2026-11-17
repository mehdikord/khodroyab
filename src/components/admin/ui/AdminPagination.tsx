"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn, toPersianDigits } from "@/lib/utils";

interface AdminPaginationProps {
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  /** Noun after the count, e.g. "خودرو". */
  unit: string;
}

/** URL-driven pagination footer (`?page=`), keeping every other search param. */
export function AdminPagination({ total, page, pageCount, pageSize, unit }: AdminPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function pageHref(target: number): string {
    const params = new URLSearchParams(searchParams.toString());
    if (target <= 1) params.delete("page");
    else params.set("page", String(target));
    const search = params.toString();
    return search ? `${pathname}?${search}` : pathname;
  }

  const firstIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastIndex = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-xs text-[#8B93A1]">
        نمایش {toPersianDigits(firstIndex)} تا {toPersianDigits(lastIndex)} از {toPersianDigits(total)} {unit}
      </p>
      {pageCount > 1 && (
        <nav aria-label="صفحه‌بندی" className="flex flex-wrap items-center justify-center gap-1.5">
          <PageLink href={pageHref(page - 1)} disabled={page <= 1} label="صفحه قبل">
            <ChevronRight className="h-4 w-4" />
          </PageLink>
          {buildPageList(page, pageCount).map((item, index) =>
            item === "…" ? (
              <span key={`gap-${index}`} className="px-1 text-xs text-[#5E6672]">
                …
              </span>
            ) : (
              <Link
                key={item}
                href={pageHref(item)}
                scroll
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  "flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 font-mono text-xs font-bold transition-colors",
                  item === page
                    ? "border-[#FF6A00]/50 bg-[#FF6A00]/15 text-[#FF8A2A]"
                    : "border-white/[0.08] text-[#9BA3AE] hover:border-white/20 hover:text-[#F5F5F5]"
                )}
              >
                {toPersianDigits(item)}
              </Link>
            )
          )}
          <PageLink href={pageHref(page + 1)} disabled={page >= pageCount} label="صفحه بعد">
            <ChevronLeft className="h-4 w-4" />
          </PageLink>
        </nav>
      )}
    </div>
  );
}

function PageLink({ href, disabled, label, children }: { href: string; disabled: boolean; label: string; children: React.ReactNode }) {
  const className = "flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors";
  if (disabled) {
    return (
      <span aria-disabled="true" className={cn(className, "cursor-not-allowed opacity-30")}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={label} className={cn(className, "hover:border-white/20 hover:text-[#F5F5F5]")}>
      {children}
    </Link>
  );
}

/** Compact page list: 1 … (p-1) p (p+1) … N. */
function buildPageList(page: number, pageCount: number): (number | "…")[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const sorted = Array.from(new Set([1, pageCount, page - 1, page, page + 1]))
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) result.push("…");
    result.push(p);
  });
  return result;
}
