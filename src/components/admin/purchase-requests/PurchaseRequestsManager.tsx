"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Car,
  ChevronLeft,
  ChevronRight,
  Eye,
  Fingerprint,
  Inbox,
  ListOrdered,
  MapPin,
  Megaphone,
  MessageSquareText,
  Phone,
  SearchX,
  ShoppingBag,
  StickyNote,
  UserRound,
} from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import { PurchaseRequestsFilters } from "@/components/admin/purchase-requests/PurchaseRequestsFilters";
import { PurchaseRequestStatusSelect } from "@/components/admin/purchase-requests/PurchaseRequestStatus";
import { setPurchaseRequestStatusAction } from "@/app/admin/(panel)/purchase-requests/actions";
import {
  PURCHASE_REQUEST_AUDIENCE_LABELS,
  PURCHASE_REQUEST_SOURCE_LABELS,
  PURCHASE_REQUEST_STATUS_LABELS,
  type AdminPurchaseRequestCounts,
  type AdminPurchaseRequestFilterOptions,
  type AdminPurchaseRequestFilterValues,
  type AdminPurchaseRequestRecord,
  type PurchaseRequestAudience,
  type PurchaseRequestStatus,
} from "@/lib/purchase-requests-shared";
import { cn, toPersianDigits } from "@/lib/utils";

interface PurchaseRequestsManagerProps {
  audience: PurchaseRequestAudience;
  requests: AdminPurchaseRequestRecord[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  filters: AdminPurchaseRequestFilterValues;
  counts: AdminPurchaseRequestCounts;
  options: AdminPurchaseRequestFilterOptions;
}

function groupCode(code: string): string {
  return code.length === 8 ? `${code.slice(0, 4)} ${code.slice(4)}` : code;
}

export function PurchaseRequestsManager({
  audience,
  requests: initialRequests,
  total,
  page,
  pageCount,
  pageSize,
  filters,
  counts,
  options,
}: PurchaseRequestsManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState(initialRequests);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const basePath = `/admin/purchase-requests/${audience}`;

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 4000);
  }

  function changeStatus(request: AdminPurchaseRequestRecord, status: PurchaseRequestStatus) {
    if (status === request.status) return;
    setBusyId(request.id);
    void setPurchaseRequestStatusAction(request.id, status).then((result) => {
      setBusyId(null);
      if (result.ok) {
        setRequests((prev) => prev.map((item) => (item.id === request.id ? { ...item, status, seen: true } : item)));
        showToast("success", `وضعیت درخواست ${toPersianDigits(request.id)} «${PURCHASE_REQUEST_STATUS_LABELS[status]}» شد`);
        router.refresh();
      } else {
        showToast("error", result.message);
      }
    });
  }

  function pageHref(target: number): string {
    const params = new URLSearchParams(searchParams.toString());
    if (target <= 1) params.delete("page");
    else params.set("page", String(target));
    const search = params.toString();
    return search ? `${basePath}?${search}` : basePath;
  }

  const firstIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastIndex = Math.min(page * pageSize, total);

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-extrabold text-[#F5F5F5]">{PURCHASE_REQUEST_AUDIENCE_LABELS[audience]}</h1>
            <p className="mt-0.5 text-xs text-[#8B93A1]">
              {audience === "public" ? "درخواست‌های خرید کاربرانی که وارد حساب نشده‌اند" : "درخواست‌های خرید کاربران واردشده به حساب"} ·{" "}
              {toPersianDigits(counts.total)} درخواست
              {counts.unseen > 0 && <span className="font-bold text-[#FF8A2A]"> · {toPersianDigits(counts.unseen)} مشاهده‌نشده</span>}
            </p>
          </div>
        </div>
        <nav className="inline-flex rounded-xl border border-white/[0.08] bg-[#0D1117] p-1" aria-label="نوع درخواست">
          {(["public", "members"] as const).map((item) => (
            <Link
              key={item}
              href={`/admin/purchase-requests/${item}`}
              aria-current={item === audience ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-bold transition-colors",
                item === audience ? "bg-[#FF6A00]/15 text-[#FF8A2A]" : "text-[#8B93A1] hover:text-[#F5F5F5]"
              )}
            >
              {item === "public" ? "عمومی" : "همکاران"}
            </Link>
          ))}
        </nav>
      </div>

      <PurchaseRequestsFilters audience={audience} filters={filters} options={options} counts={counts} />

      {requests.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/[0.12] bg-[#0D1117]/60 px-6 py-16 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0D1117] text-[#5E6672]">
              {counts.total === 0 ? <Inbox className="h-7 w-7" /> : <SearchX className="h-7 w-7" />}
            </span>
            <p className="mt-5 text-base font-extrabold text-[#F5F5F5]">
              {counts.total === 0 ? "هنوز درخواستی ثبت نشده است" : "درخواستی با این فیلترها پیدا نشد"}
            </p>
            <p className="mt-2 text-xs leading-6 text-[#8B93A1]">
              {counts.total === 0
                ? "درخواست‌ها از دکمه «درخواست خرید» در صفحه آگهی‌ها و لیست قیمت ثبت می‌شوند."
                : "عبارت جستجو یا فیلترها را تغییر دهید."}
            </p>
          </div>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {requests.map((request) => (
              <RequestRow
                key={request.id}
                request={request}
                href={`${basePath}/${request.id}`}
                busy={busyId === request.id}
                onStatus={(status) => changeStatus(request, status)}
              />
            ))}
          </ul>

          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-[#8B93A1]">
              نمایش {toPersianDigits(firstIndex)} تا {toPersianDigits(lastIndex)} از {toPersianDigits(total)} درخواست
            </p>
            {pageCount > 1 && (
              <nav aria-label="صفحه‌بندی" className="flex items-center gap-1.5">
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
        </>
      )}
    </div>
  );
}

function RequestRow({
  request,
  href,
  busy,
  onStatus,
}: {
  request: AdminPurchaseRequestRecord;
  href: string;
  busy: boolean;
  onStatus: (status: PurchaseRequestStatus) => void;
}) {
  const SourceIcon = request.source === "sale_ad" ? Megaphone : ListOrdered;
  return (
    <li
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-[#0D1117] transition-colors hover:border-white/[0.14]",
        request.seen ? "border-white/[0.07]" : "border-[#FF6A00]/35 bg-gradient-to-l from-[#FF6A00]/[0.06] to-[#0D1117]"
      )}
    >
      {!request.seen && <span className="absolute inset-y-3 start-0 w-1 rounded-full bg-[#FF6A00] shadow-[0_0_12px_#FF6A00]" aria-hidden="true" />}
      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)_minmax(0,1fr)_11rem] lg:items-center">
        {/* Requester */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-[#5E6672]">#{toPersianDigits(request.id)}</span>
            {!request.seen && (
              <span className="admin-blink rounded-md bg-[#FF6A00] px-1.5 py-0.5 text-[9px] font-black text-[#07090C]">جدید</span>
            )}
            {request.hasNote && <StickyNote className="h-3.5 w-3.5 text-amber-400" aria-label="دارای یادداشت" />}
          </div>
          <p className="mt-1 flex items-center gap-1.5 truncate text-sm font-extrabold text-[#F5F5F5]">
            <UserRound className="h-4 w-4 shrink-0 text-[#FF8A2A]" />
            {request.name}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8B93A1]">
            <a href={`tel:${request.phone}`} dir="ltr" className="inline-flex items-center gap-1 font-mono hover:text-[#FF8A2A]">
              <Phone className="h-3 w-3" />
              {request.phone}
            </a>
            {request.isGuest ? (
              (request.provinceName || request.cityName) && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {[request.provinceName, request.cityName].filter(Boolean).join(" · ")}
                </span>
              )
            ) : (
              request.requesterCode && (
                <span className="inline-flex items-center gap-1">
                  <Fingerprint className="h-3 w-3" />
                  کد کاربر <span dir="ltr" className="font-mono">{toPersianDigits(groupCode(request.requesterCode))}</span>
                </span>
              )
            )}
          </div>
        </div>

        {/* Car */}
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#07090C]">
            {request.carImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={request.carImage} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <Car className="h-5 w-5 text-[#5E6672]" />
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold text-[#F5F5F5]">{toPersianDigits(request.carLabel)}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
              <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] px-1.5 py-0.5 text-[#9BA3AE]">
                <SourceIcon className="h-3 w-3 text-[#FF8A2A]" />
                {PURCHASE_REQUEST_SOURCE_LABELS[request.source]}
                {request.adCode && <span className="font-mono">{toPersianDigits(request.adCode)}</span>}
              </span>
              {(request.year || request.colorName) && (
                <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] px-1.5 py-0.5 text-[#9BA3AE]">
                  {request.colorCode && <ColorSwatch code={request.colorCode} className="h-2.5 w-2.5" />}
                  {[request.year && toPersianDigits(request.year), request.colorName].filter(Boolean).join(" · ")}
                </span>
              )}
              {request.description && (
                <span className="inline-flex items-center gap-1 text-[#5E6672]" title={request.description}>
                  <MessageSquareText className="h-3 w-3" />
                  توضیحات
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Seller */}
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-[#5E6672]">فروشنده</p>
          <p dir="ltr" className="mt-0.5 text-end font-mono text-sm font-black tracking-wider text-[#FF8A2A] lg:text-start">
            {toPersianDigits(groupCode(request.sellerCode))}
          </p>
          {request.seller ? (
            <Link href={`/admin/users/${request.seller.id}`} className="mt-0.5 block truncate text-[11px] text-[#9BA3AE] hover:text-[#F5F5F5] hover:underline">
              {request.seller.companyName || request.seller.name}
            </Link>
          ) : (
            <p className="mt-0.5 text-[11px] text-[#5E6672]">حساب حذف شده</p>
          )}
        </div>

        {/* Status + actions */}
        <div className="flex items-center gap-2 lg:flex-col lg:items-stretch">
          <PurchaseRequestStatusSelect value={request.status} onChange={onStatus} busy={busy} className="flex-1 lg:flex-none" />
          <Link
            href={href}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-white/[0.1] px-3 text-xs font-bold text-[#D2D7DF] transition-colors hover:border-[#FF6A00]/40 hover:text-[#FF8A2A]"
          >
            <Eye className="h-3.5 w-3.5" />
            جزئیات
          </Link>
          <p className="hidden text-center text-[10px] text-[#5E6672] lg:block">{request.createdAtLabel}</p>
        </div>
      </div>
      <p className="border-t border-white/[0.05] px-4 py-2 text-[10px] text-[#5E6672] lg:hidden">{request.createdAtLabel}</p>
    </li>
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
  const sorted = Array.from(new Set<number>([1, pageCount, page - 1, page, page + 1]))
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) result.push("…");
    result.push(p);
  });
  return result;
}
