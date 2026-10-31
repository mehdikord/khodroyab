import React from "react";
import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";

export default function AdNotFound() {
  return (
    <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-16 text-center">
      <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
          <SearchX className="h-7 w-7" />
        </span>
        <p className="mt-5 text-base font-extrabold text-panel-text">آگهی پیدا نشد</p>
        <p className="mt-2 text-xs leading-6 text-panel-muted-2">این آگهی وجود ندارد یا هنوز منتشر نشده است.</p>
        <Link
          href="/panel/search"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-panel-line/[0.1] bg-panel-line/[0.03] px-5 text-sm font-bold text-panel-text-2 transition-colors hover:border-[#FF6A00]/40 hover:text-panel-text"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به جستجو
        </Link>
      </div>
    </div>
  );
}
