"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Megaphone, SearchX } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { SaleAdFormModal } from "@/components/admin/users/sale-ads/SaleAdFormModal";
import { AdsFilters, type AdsFilterValues, type AdsUserOption } from "@/components/admin/ads/AdsFilters";
import { AdsTable } from "@/components/admin/ads/AdsTable";
import {
  deleteUserCarAction,
  toggleUserCarActiveAction,
  updateUserCarStatusAction,
} from "@/app/admin/(panel)/users/[id]/sale-ads/actions";
import type { UserCarRecord } from "@/lib/user-cars";
import type { CarRecord } from "@/lib/cars";
import type { SaleTermRecord } from "@/lib/sale-terms";
import { AD_STATUS_LABELS, type AdStatus } from "@/lib/ad-status";
import { cn, toPersianDigits } from "@/lib/utils";

export type { AdsFilterValues } from "@/components/admin/ads/AdsFilters";
export type AdsStatusCounts = Record<AdStatus, number>;

interface AdsManagerProps {
  ads: UserCarRecord[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  filters: AdsFilterValues;
  statusCounts: AdsStatusCounts;
  cars: CarRecord[];
  saleTerms: SaleTermRecord[];
  users: AdsUserOption[];
}

export function AdsManager({
  ads: initialAds,
  total,
  page,
  pageCount,
  pageSize,
  filters,
  statusCounts,
  cars,
  saleTerms,
  users,
}: AdsManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ads, setAds] = useState<UserCarRecord[]>(initialAds);
  const [editTarget, setEditTarget] = useState<UserCarRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserCarRecord | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const totalAll = statusCounts.pending + statusCounts.approved + statusCounts.rejected;

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 4000);
  }

  function replaceAd(record: UserCarRecord) {
    setAds((prev) => prev.map((ad) => (ad.id === record.id ? record : ad)));
  }

  function handleToggleActive(ad: UserCarRecord, next: boolean) {
    setBusyId(ad.id);
    void toggleUserCarActiveAction(ad.id, next).then((result) => {
      setBusyId(null);
      if (result.ok) {
        replaceAd(result.record);
        showToast("success", next ? "آگهی فعال شد" : "آگهی غیرفعال شد");
      } else {
        showToast("error", result.message);
      }
    });
  }

  function handleChangeStatus(ad: UserCarRecord, status: AdStatus) {
    setBusyId(ad.id);
    void updateUserCarStatusAction(ad.id, status).then((result) => {
      setBusyId(null);
      if (result.ok) {
        replaceAd(result.record);
        showToast("success", `وضعیت آگهی ${result.record.code} به «${AD_STATUS_LABELS[status]}» تغییر کرد`);
        router.refresh(); // keep the status counters in sync
      } else {
        showToast("error", result.message);
      }
    });
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startDeleteTransition(async () => {
      const result = await deleteUserCarAction(target.id);
      setDeleteTarget(null);
      if (result.ok) {
        setAds((prev) => prev.filter((ad) => ad.id !== target.id));
        showToast("success", `آگهی ${target.code} حذف شد`);
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
    return search ? `/admin/ads?${search}` : "/admin/ads";
  }

  const firstIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastIndex = Math.min(page * pageSize, total);

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {editTarget && (
        <SaleAdFormModal
          mode="edit"
          userId={editTarget.userId}
          userName={editTarget.userName}
          ad={editTarget}
          cars={cars}
          saleTerms={saleTerms}
          onClose={() => setEditTarget(null)}
          onSuccess={(record) => {
            replaceAd(record);
            showToast("success", `آگهی ${record.code} به‌روزرسانی شد`);
            setEditTarget(null);
            router.refresh();
          }}
          onError={(message) => showToast("error", message)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          open
          title="حذف آگهی فروش"
          message={
            <>
              آیا از حذف آگهی <span dir="ltr" className="font-mono font-bold text-[#F5F5F5]">{deleteTarget.code}</span> («
              {deleteTarget.brandName} {deleteTarget.carName}» متعلق به {deleteTarget.userName}) مطمئن هستید؟ تمام شرایط فروش
              آن نیز حذف می‌شود.
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
            <Megaphone className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-extrabold text-[#F5F5F5]">همه آگهی‌ها</h1>
            <p className="mt-0.5 text-xs text-[#8B93A1]">
              {toPersianDigits(totalAll)} آگهی در سیستم · {toPersianDigits(statusCounts.pending)} در انتظار تایید
            </p>
          </div>
        </div>
        <Link
          href="/admin/users"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 text-sm font-bold text-[#D2D7DF] transition-colors hover:border-white/20 hover:text-[#F5F5F5]"
        >
          ثبت آگهی از پروفایل کاربر
        </Link>
      </div>

      <AdsFilters filters={filters} cars={cars} users={users} statusCounts={statusCounts} />

      {/* Results */}
      {ads.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/[0.12] bg-[#0D1117]/60 px-6 py-16 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0D1117] text-[#5E6672]">
              {totalAll === 0 ? <Megaphone className="h-7 w-7" /> : <SearchX className="h-7 w-7" />}
            </span>
            <p className="mt-5 text-base font-extrabold text-[#F5F5F5]">
              {totalAll === 0 ? "هنوز آگهی‌ای در سیستم ثبت نشده است" : "آگهی‌ای با این فیلترها پیدا نشد"}
            </p>
            <p className="mt-2 text-xs leading-6 text-[#8B93A1]">
              {totalAll === 0
                ? "از پروفایل هر کاربر می‌توانید اولین آگهی را به نام او ثبت کنید."
                : "عبارت جستجو یا فیلترها را تغییر دهید."}
            </p>
          </div>
        </div>
      ) : (
        <>
          <AdsTable
            ads={ads}
            busyId={busyId}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
            onToggleActive={handleToggleActive}
            onChangeStatus={handleChangeStatus}
          />

          {/* Pagination */}
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

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const className =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors";
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
  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1]);
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) result.push("…");
    result.push(p);
  });
  return result;
}
