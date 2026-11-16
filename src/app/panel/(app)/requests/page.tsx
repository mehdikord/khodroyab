import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarClock, Fingerprint, Inbox, ListOrdered, Megaphone, ShoppingBag } from "lucide-react";

import { requireUser } from "@/lib/auth/user-auth";
import {
  purchaseRequestSourceLabel,
  PURCHASE_REQUEST_STATUS_LABELS,
  PURCHASE_REQUEST_STATUS_TONES,
  listMyPurchaseRequests,
} from "@/lib/purchase-requests";
import { cn, toPersianDigits } from "@/lib/utils";

export const metadata: Metadata = {
  title: "درخواست‌های خرید من | خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** The signed-in customer's purchase requests and where each one stands. */
export default async function MyPurchaseRequestsPage() {
  const user = await requireUser();
  const requests = await listMyPurchaseRequests(BigInt(user.id));

  return (
    <div className="space-y-5">
      <section className="panel-card-in relative overflow-hidden rounded-[28px] border border-panel-line/[0.1] bg-panel-surface px-5 py-5 sm:px-7">
        <div className="panel-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-panel-accent">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-black text-panel-text sm:text-xl">درخواست‌های خرید من</h1>
            <p className="mt-0.5 text-xs leading-6 text-panel-muted">
              درخواست‌هایی که از صفحه آگهی‌ها یا لیست قیمت ثبت کرده‌اید و وضعیت پیگیری هرکدام.
            </p>
          </div>
        </div>
      </section>

      {requests.length === 0 ? (
        <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
            <Inbox className="h-7 w-7" />
          </span>
          <p className="mt-5 text-base font-extrabold text-panel-text">هنوز درخواست خریدی ثبت نکرده‌اید</p>
          <p className="mt-2 text-xs leading-6 text-panel-muted-2">در صفحه هر آگهی یا کنار هر فروشنده در لیست قیمت، دکمه «درخواست خرید» را بزنید.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href="/panel/search" className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-4 text-xs font-bold text-panel-accent">
              <Megaphone className="h-4 w-4" /> آگهی‌ها
            </Link>
            <Link href="/panel/price-list" className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-panel-line/[0.12] px-4 text-xs font-bold text-panel-text-2">
              <ListOrdered className="h-4 w-4" /> لیست قیمت
            </Link>
          </div>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {requests.map((request, index) => (
            <li
              key={request.id}
              className="panel-card-in rounded-3xl border border-panel-line/[0.1] bg-panel-surface p-4"
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-panel-muted">
                    درخواست <span className="font-mono">{toPersianDigits(request.id)}</span> · از {purchaseRequestSourceLabel(request.source, request.market)}
                  </p>
                  <p className="mt-1 break-words text-sm font-black leading-6 text-panel-text">{toPersianDigits(request.carLabel)}</p>
                </div>
                <span className={cn("shrink-0 rounded-lg border px-2 py-1 text-[10px] font-extrabold", PURCHASE_REQUEST_STATUS_TONES[request.status])}>
                  {PURCHASE_REQUEST_STATUS_LABELS[request.status]}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-bold text-panel-text-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-panel-line/[0.06] px-2 py-1">
                  <Fingerprint className="h-3 w-3 text-panel-accent" />
                  فروشنده <span dir="ltr" className="font-mono">{toPersianDigits(request.sellerCode)}</span>
                </span>
                {request.adCode && (
                  <span className="rounded-lg bg-panel-line/[0.06] px-2 py-1">
                    آگهی <span className="font-mono">{toPersianDigits(request.adCode)}</span>
                  </span>
                )}
                {(request.year || request.colorName) && (
                  <span className="rounded-lg bg-panel-line/[0.06] px-2 py-1">
                    {[request.year && toPersianDigits(request.year), request.colorName].filter(Boolean).join(" · ")}
                  </span>
                )}
              </div>

              {request.description && (
                <p className="mt-3 line-clamp-3 whitespace-pre-line break-words rounded-2xl bg-panel-line/[0.03] px-3 py-2 text-[11px] leading-6 text-panel-muted">
                  {request.description}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between gap-2 border-t border-panel-line/[0.06] pt-3 text-[10px] text-panel-muted-2">
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {request.createdAtLabel}
                </span>
                {request.href && (
                  <Link href={request.href} className="inline-flex items-center gap-1 font-bold text-panel-accent hover:underline">
                    مشاهده {request.source === "sale_ad" ? "آگهی" : "قیمت‌ها"}
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
