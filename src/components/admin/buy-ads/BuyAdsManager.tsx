"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, SearchX, ShoppingCart } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { BuyAdsFilters } from "@/components/admin/buy-ads/BuyAdsFilters";
import { BuyAdsTable } from "@/components/admin/buy-ads/BuyAdsTable";
import {
  deleteAdminBuyAdAction,
  setAdminBuyAdActiveAction,
  setAdminBuyAdBiddingAction,
} from "@/app/admin/(panel)/buy-ads/actions";
import type {
  AdminBuyAdCounts,
  AdminBuyAdFilterOptions,
  AdminBuyAdFilterValues,
  AdminBuyAdRecord,
} from "@/lib/admin-buy-ads-shared";
import { cn, toPersianDigits } from "@/lib/utils";

interface BuyAdsManagerProps {
  ads: AdminBuyAdRecord[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  filters: AdminBuyAdFilterValues;
  counts: AdminBuyAdCounts;
  options: AdminBuyAdFilterOptions;
}

export function BuyAdsManager({ ads: initialAds, total, page, pageCount, pageSize, filters, counts, options }: BuyAdsManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ads, setAds] = useState<AdminBuyAdRecord[]>(initialAds);
  const [deleteTarget, setDeleteTarget] = useState<AdminBuyAdRecord | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 4000);
  }

  function patchAd(id: string, patch: Partial<AdminBuyAdRecord>) {
    setAds((prev) => prev.map((ad) => (ad.id === id ? { ...ad, ...patch } : ad)));
  }

  function handleToggleActive(ad: AdminBuyAdRecord, next: boolean) {
    setBusyId(ad.id);
    void setAdminBuyAdActiveAction(ad.id, next).then((result) => {
      setBusyId(null);
      if (result.ok) {
        patchAd(ad.id, { isActive: next });
        showToast("success", next ? `آگهی ${ad.code} فعال شد` : `آگهی ${ad.code} متوقف شد`);
        router.refresh();
      } else {
        showToast("error", result.message);
      }
    });
  }

  function handleToggleBidding(ad: AdminBuyAdRecord, next: boolean) {
    setBusyId(ad.id);
    void setAdminBuyAdBiddingAction(ad.id, next).then((result) => {
      setBusyId(null);
      if (result.ok) {
        patchAd(ad.id, { biddingOpen: next });
        showToast("success", next ? `قیمت‌دهی آگهی ${ad.code} باز شد` : `قیمت‌دهی آگهی ${ad.code} بسته شد`);
        router.refresh();
      } else {
        showToast("error", result.message);
      }
    });
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startDeleteTransition(async () => {
      const result = await deleteAdminBuyAdAction(target.id);
      setDeleteTarget(null);
      if (result.ok) {
        setAds((prev) => prev.filter((ad) => ad.id !== target.id));
        showToast("success", `آگهی خرید ${target.code} حذف شد`);
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
    return search ? `/admin/buy-ads?${search}` : "/admin/buy-ads";
  }

  const firstIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastIndex = Math.min(page * pageSize, total);

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {deleteTarget && (
        <ConfirmDialog
          open
          title="حذف آگهی خرید"
          message={
            <>
              آیا از حذف آگهی خرید <span dir="ltr" className="font-mono font-bold text-[#F5F5F5]">{deleteTarget.code}</span> («
              {deleteTarget.brandName} {deleteTarget.carName}» متعلق به {deleteTarget.buyer.name}) مطمئن هستید؟
              {deleteTarget.offerCount > 0 && ` ${toPersianDigits(deleteTarget.offerCount)} پیشنهاد قیمت آن نیز حذف می‌شود.`}
            </>
          }
          confirmLabel={isDeleting ? "در حال حذف…" : "حذف آگهی"}
          pending={isDeleting}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteTarget(null)}
          danger
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
          <ShoppingCart className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-[#F5F5F5]">آگهی‌های خرید</h1>
          <p className="mt-0.5 text-xs text-[#8B93A1]">
            {toPersianDigits(counts.total)} آگهی خرید · {toPersianDigits(counts.biddingOpen)} با قیمت‌دهی باز ·{" "}
            {toPersianDigits(counts.totalOffers)} پیشنهاد قیمت
          </p>
        </div>
      </div>

      <BuyAdsFilters filters={filters} options={options} counts={counts} />

      {ads.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/[0.12] bg-[#0D1117]/60 px-6 py-16 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0D1117] text-[#5E6672]">
              {counts.total === 0 ? <ShoppingCart className="h-7 w-7" /> : <SearchX className="h-7 w-7" />}
            </span>
            <p className="mt-5 text-base font-extrabold text-[#F5F5F5]">
              {counts.total === 0 ? "هنوز آگهی خریدی ثبت نشده است" : "آگهی خریدی با این فیلترها پیدا نشد"}
            </p>
            <p className="mt-2 text-xs leading-6 text-[#8B93A1]">
              {counts.total === 0 ? "آگهی‌های خرید را کاربران همکار از پنل کاربری ثبت می‌کنند." : "عبارت جستجو یا فیلترها را تغییر دهید."}
            </p>
          </div>
        </div>
      ) : (
        <>
          <BuyAdsTable
            ads={ads}
            busyId={busyId}
            onToggleActive={handleToggleActive}
            onToggleBidding={handleToggleBidding}
            onDelete={setDeleteTarget}
          />

          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-[#8B93A1]">
              نمایش {toPersianDigits(firstIndex)} تا {toPersianDigits(lastIndex)} از {toPersianDigits(total)} آگهی
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
