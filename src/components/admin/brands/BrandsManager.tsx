"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Plus, Search, Tag, Tags } from "lucide-react";

import { BrandsTable } from "@/components/admin/brands/BrandsTable";
import { BrandFormModal } from "@/components/admin/brands/BrandFormModal";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";
import { useDebouncedQueryParam, useListParams } from "@/components/admin/ui/useListParams";
import {
  deleteBrandAction,
  toggleBrandActiveAction,
} from "@/app/admin/(panel)/brands/actions";
import type { BrandRecord } from "@/lib/brands";
import { cn, toPersianDigits } from "@/lib/utils";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; brand: BrandRecord }
  | null;

export type BrandsStatusFilter = "" | "active" | "inactive";

interface BrandsManagerProps {
  /** The current page only (server-paginated). */
  initialBrands: BrandRecord[];
  /** Brands matching the filters. */
  total: number;
  /** Brands in the catalogue. */
  allCount: number;
  page: number;
  pageCount: number;
  pageSize: number;
  filters: { q: string; status: BrandsStatusFilter };
}

const STATUS_FILTERS: { key: BrandsStatusFilter; label: string }[] = [
  { key: "", label: "همه" },
  { key: "active", label: "فعال" },
  { key: "inactive", label: "غیرفعال" },
];

/** Full CRUD orchestrator for the brands module (one server page at a time). */
export function BrandsManager({ initialBrands, total, allCount, page, pageCount, pageSize, filters }: BrandsManagerProps) {
  const [brands, setBrands] = useState<BrandRecord[]>(initialBrands);
  const { setParams, isPending: isNavigating, refresh } = useListParams();
  const [query, setQuery] = useDebouncedQueryParam(filters.q, setParams);
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<BrandRecord | null>(null);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [isDeleting, startDeleteTransition] = useTransition();
  const [isToggling, startToggleTransition] = useTransition();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A new server page (navigation, filter or refresh) replaces the local copy.
  useEffect(() => setBrands(initialBrands), [initialBrands]);

  const filteredBrands = brands;
  const hasFilters = Boolean(filters.q || filters.status);

  function showToast(kind: ToastState["kind"], message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }

  function handleCreateSuccess(record: BrandRecord) {
    setModal(null);
    refresh(); // the new brand belongs to the first page of the server list
    showToast("success", `برند «${record.name}» با موفقیت ایجاد شد.`);
  }

  function handleUpdateSuccess(record: BrandRecord) {
    setBrands((prev) =>
      prev.map((brand) => (brand.id === record.id ? record : brand))
    );
    setModal(null);
    showToast("success", `برند «${record.name}» به‌روزرسانی شد.`);
  }

  function handleError(message: string) {
    showToast("error", message);
  }

  function handleToggleActive(brand: BrandRecord) {
    if (pendingToggleId) return;
    setPendingToggleId(brand.id);

    // Optimistic update for instant feedback.
    setBrands((prev) =>
      prev.map((item) =>
        item.id === brand.id ? { ...item, isActive: !item.isActive } : item
      )
    );

    startToggleTransition(async () => {
      const result = await toggleBrandActiveAction(brand.id);
      setPendingToggleId(null);
      if (result.ok) {
        setBrands((prev) =>
          prev.map((item) => (item.id === result.record.id ? result.record : item))
        );
        showToast(
          "success",
          result.record.isActive
            ? `برند «${result.record.name}» فعال شد.`
            : `برند «${result.record.name}» غیرفعال شد.`
        );
      } else {
        // Roll back the optimistic update on failure.
        setBrands((prev) =>
          prev.map((item) => (item.id === brand.id ? brand : item))
        );
        showToast("error", result.message);
      }
    });
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;

    startDeleteTransition(async () => {
      const result = await deleteBrandAction(target.id);
      setDeleteTarget(null);
      if (result.ok) {
        setBrands((prev) => prev.filter((brand) => brand.id !== target.id));
        showToast("success", `برند «${target.name}» حذف شد.`);
        refresh(); // pull the next brand up into this page
      } else {
        showToast("error", result.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">
                مدیریت برندها
              </h1>
              <p className="mt-0.5 text-xs text-[#8B93A1]">
                {toPersianDigits(allCount)} برند در کاتالوگ ثبت شده است
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModal({ mode: "create" })}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 hover:shadow-[0_0_36px_rgba(255,106,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50"
        >
          <Plus className="h-[18px] w-[18px]" />
          برند جدید
        </button>
      </div>

      {/* Toolbar: search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="group relative w-full max-w-md">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#5E6672] transition-colors group-focus-within:text-[#FF8A2A]">
            <Search className="h-[18px] w-[18px]" />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام یا اسلاگ برند…"
            aria-label="جستجوی برند"
            className="h-11 w-full rounded-xl border border-white/[0.12] bg-[#07090C] pr-12 pl-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] hover:border-white/20 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
        </div>
        <div role="tablist" aria-label="فیلتر وضعیت" className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-[#0A0D12] p-1">
          {STATUS_FILTERS.map((item) => (
            <button
              key={item.key || "all"}
              type="button"
              role="tab"
              aria-selected={filters.status === item.key}
              onClick={() => setParams({ status: item.key })}
              className={cn(
                "inline-flex h-9 items-center rounded-lg px-3 text-xs font-bold transition-colors",
                filters.status === item.key ? "bg-[#FF6A00]/15 text-[#FF8A2A]" : "text-[#8B93A1] hover:bg-white/[0.04] hover:text-[#F5F5F5]"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        {isNavigating && <Loader2 className="h-4 w-4 animate-spin text-[#FF8A2A]" aria-label="در حال بارگذاری" />}
      </div>

      {/* Table / empty state */}
      {filteredBrands.length > 0 ? (
        <>
        <BrandsTable
          brands={filteredBrands}
          onEdit={(brand) => setModal({ mode: "edit", brand })}
          onDelete={(brand) => setDeleteTarget(brand)}
          onToggleActive={handleToggleActive}
          isDeleting={isDeleting ? deleteTarget?.id ?? null : null}
          isPendingToggle={pendingToggleId}
        />
        <AdminPagination total={total} page={page} pageCount={pageCount} pageSize={pageSize} unit="برند" />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/[0.1] bg-[#0A0D12] py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#07090C] text-[#42505F]">
            <Tags className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#F5F5F5]">
              {!hasFilters && allCount === 0
                ? "هنوز برندی ثبت نشده است"
                : "برندی مطابق جستجو یافت نشد"}
            </p>
            <p className="mt-1 text-xs text-[#5E6672]">
              {!hasFilters && allCount === 0
                ? "برای شروع، اولین برند را ایجاد کنید"
                : "عبارت دیگری را امتحان کنید"}
            </p>
          </div>
          {!hasFilters && allCount === 0 && (
            <button
              type="button"
              onClick={() => setModal({ mode: "create" })}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-5 text-sm font-bold text-[#FF8A2A] transition-colors hover:bg-[#FF6A00]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50"
            >
              <Plus className="h-[18px] w-[18px]" />
              ایجاد اولین برند
            </button>
          )}
        </div>
      )}

      {/* Create/Edit modal */}
      {modal && (
        <BrandFormModal
          key={modal.mode === "edit" ? `edit-${modal.brand.id}` : "create"}
          mode={modal.mode}
          brand={modal.mode === "edit" ? modal.brand : null}
          onClose={() => (!isDeleting ? setModal(null) : undefined)}
          onSuccess={
            modal.mode === "edit" ? handleUpdateSuccess : handleCreateSuccess
          }
          onError={handleError}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => (!isDeleting ? setDeleteTarget(null) : undefined)}
        onConfirm={handleConfirmDelete}
        pending={isDeleting}
        title="حذف برند"
        message={
          <>
            آیا از حذف برند{" "}
            <strong className="text-[#F5F5F5]">
              «{deleteTarget?.name ?? ""}»
            </strong>{" "}
            مطمئن هستید؟ این عملیات بازگشت‌پذیر نیست.{" "}
            {deleteTarget?.image && (
              <span className="mt-2 block text-xs text-[#5E6672]">
                تصویر بارگذاری‌شده این برند نیز حذف خواهد شد.
              </span>
            )}
          </>
        }
        confirmLabel={isDeleting ? "در حال حذف…" : "حذف برند"}
      />
    </div>
  );
}