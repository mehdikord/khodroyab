"use client";

import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { CheckCheck, Search, Table2, X } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { PriceTableCarsTable } from "@/components/admin/price-table/PriceTableCarsTable";
import { setFilteredCarsPriceTableAction, toggleCarPriceTableAction } from "@/app/admin/(panel)/price-table/actions";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";
import { SearchableSelect } from "@/components/admin/ui/SearchableSelect";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { useDebouncedQueryParam, useListParams } from "@/components/admin/ui/useListParams";
import { brandOptionsOf } from "@/components/catalog/useCarSelection";
import type { BrandChoice, PriceTableFilters, PriceTableStatusFilter } from "@/lib/catalog-shared";
import type { CarRecord } from "@/lib/cars";
import { cn, toPersianDigits } from "@/lib/utils";

type Filter = PriceTableStatusFilter;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "", label: "همه" },
  { key: "enabled", label: "مجاز در جدول" },
  { key: "disabled", label: "غیرمجاز" },
];

interface PriceTableManagerProps {
  /** The current page only (server-paginated). */
  initialCars: CarRecord[];
  filters: PriceTableFilters;
  brands: BrandChoice[];
  /** Cars matching all filters. */
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  /** all/enabled: matching search + brand (any status); catalogue*: whole table. */
  counts: { all: number; enabled: number; catalogue: number; catalogueEnabled: number };
}

/**
 * Admin screen for `cars.price_table`: a searchable list of every catalogue
 * car with a per-row switch plus "enable/disable all visible" bulk actions.
 */
export function PriceTableManager({ initialCars, filters, brands, total, page, pageCount, pageSize, counts }: PriceTableManagerProps) {
  const [cars, setCars] = useState<CarRecord[]>(initialCars);
  const { setParams, refresh } = useListParams();
  const [query, setQuery] = useDebouncedQueryParam(filters.q, setParams);
  const filter = filters.status;
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [bulkConfirm, setBulkConfirm] = useState<boolean | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isBulkPending, startBulkTransition] = useTransition();
  const [, startToggleTransition] = useTransition();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A new server page (navigation, filter or refresh) replaces the local copy.
  useEffect(() => setCars(initialCars), [initialCars]);

  const brandOptions = useMemo(() => brandOptionsOf(brands), [brands]);
  const visibleCars = cars;

  /** Matching cars (all pages) that a bulk action would change. */
  const enableAllCount = filter === "enabled" ? 0 : counts.all - counts.enabled;
  const disableAllCount = filter === "disabled" ? 0 : counts.enabled;

  function showToast(kind: ToastState["kind"], message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }

  function handleToggle(car: CarRecord) {
    if (pendingId || isBulkPending) return;
    setPendingId(car.id);
    // Optimistic flip for instant feedback; reverted if the server disagrees.
    setCars((prev) => prev.map((c) => (c.id === car.id ? { ...c, priceTable: !c.priceTable } : c)));

    startToggleTransition(async () => {
      const result = await toggleCarPriceTableAction(car.id);
      setPendingId(null);
      if (result.ok) {
        setCars((prev) => prev.map((c) => (c.id === result.record.id ? result.record : c)));
        showToast(
          "success",
          result.record.priceTable
            ? `خودرو «${result.record.name}» به جدول قیمت اضافه شد`
            : `خودرو «${result.record.name}» از جدول قیمت حذف شد`
        );
      } else {
        setCars((prev) => prev.map((c) => (c.id === car.id ? car : c)));
        showToast("error", result.message);
      }
    });
  }

  function handleBulk(enabled: boolean) {
    setBulkConfirm(null);
    if (isBulkPending) return;
    startBulkTransition(async () => {
      const result = await setFilteredCarsPriceTableAction(filters, enabled);
      if (result.ok) {
        showToast(
          "success",
          enabled
            ? `${toPersianDigits(result.count)} خودرو به جدول قیمت اضافه شد`
            : `${toPersianDigits(result.count)} خودرو از جدول قیمت حذف شد`
        );
        refresh();
      } else {
        showToast("error", result.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
            <Table2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">مدیریت جدول قیمت</h1>
            <p className="mt-0.5 text-xs text-[#8B93A1]">
              {toPersianDigits(counts.catalogueEnabled)} از {toPersianDigits(counts.catalogue)} خودرو برای استفاده در جدول قیمت کاربران مجاز است
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setBulkConfirm(true)}
            disabled={isBulkPending || enableAllCount === 0}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-4 text-xs font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            <CheckCheck className="h-4 w-4" />
            مجاز کردن همه موارد مطابق فیلتر
            {enableAllCount > 0 && <span className="rounded-md bg-black/15 px-1.5 py-0.5 text-[10px]">{toPersianDigits(enableAllCount)}</span>}
          </button>
          <button
            type="button"
            onClick={() => setBulkConfirm(false)}
            disabled={isBulkPending || disableAllCount === 0}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.03] px-4 text-xs font-bold text-[#D2D7DF] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="h-4 w-4" />
            غیرمجاز کردن همه موارد مطابق فیلتر
            {disableAllCount > 0 && <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px]">{toPersianDigits(disableAllCount)}</span>}
          </button>
        </div>
      </div>

      <p className="rounded-2xl border border-[#FF6A00]/20 bg-[#FF6A00]/[0.06] px-4 py-3 text-xs leading-6 text-[#D2D7DF]">
        فقط خودروهایی که در این صفحه «مجاز» می‌کنید در جدول قیمت کاربران قابل استفاده هستند. با غیرمجاز کردن یک خودرو،
        آن خودرو از جدول قیمت همه کاربران پنهان می‌شود (اطلاعات ثبت‌شده کاربران حذف نمی‌شود و با مجاز شدن دوباره نمایش داده می‌شود).
      </p>

      {/* Search + filter */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-3 sm:flex-row md:max-w-2xl">
        <div className="group relative w-full sm:flex-1">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#5E6672] transition-colors group-focus-within:text-[#FF8A2A]">
            <Search className="h-[18px] w-[18px]" />
          </span>
          <input
            type="search"
            placeholder="جستجو در نام، برند، مدل یا سال..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/[0.12] bg-[#07090C] px-12 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
        </div>
          <SearchableSelect
            className="sm:w-64"
            value={filters.brandId}
            onChange={(value) => setParams({ brand: value })}
            options={brandOptions}
            clearable
            placeholder="همه برندها"
            searchPlaceholder="جستجوی برند…"
            emptyText="برندی پیدا نشد"
          />
        </div>

        <div role="tablist" aria-label="فیلتر وضعیت" className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-[#0A0D12] p-1">
          {FILTERS.map((item) => {
            const active = filter === item.key;
            const count = item.key === "" ? counts.all : item.key === "enabled" ? counts.enabled : counts.all - counts.enabled;
            return (
              <button
                key={item.key || "all"}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setParams({ status: item.key })}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-colors",
                  active ? "bg-[#FF6A00]/15 text-[#FF8A2A]" : "text-[#8B93A1] hover:bg-white/[0.04] hover:text-[#F5F5F5]"
                )}
              >
                {item.label}
                <span className={cn("rounded-md px-1.5 py-0.5 text-[10px]", active ? "bg-[#FF6A00]/20" : "bg-white/[0.06]")}>
                  {toPersianDigits(count)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {visibleCars.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.1] px-6 py-14 text-center">
          <p className="text-sm font-bold text-[#F5F5F5]">خودرویی یافت نشد</p>
          <p className="mt-1 text-xs text-[#8B93A1]">
            {counts.catalogue === 0 ? "ابتدا از بخش «خودروها» خودرو ثبت کنید." : "عبارت جستجو یا فیلتر را تغییر دهید."}
          </p>
        </div>
      ) : (
        <>
          <PriceTableCarsTable cars={visibleCars} pendingId={pendingId} disabled={isBulkPending} onToggle={handleToggle} />
          <AdminPagination total={total} page={page} pageCount={pageCount} pageSize={pageSize} unit="خودرو" />
        </>
      )}

      <ConfirmDialog
        open={bulkConfirm !== null}
        onClose={() => setBulkConfirm(null)}
        onConfirm={() => bulkConfirm !== null && handleBulk(bulkConfirm)}
        pending={isBulkPending}
        title={bulkConfirm ? "مجاز کردن گروهی" : "غیرمجاز کردن گروهی"}
        message={`این عملیات روی ${toPersianDigits(bulkConfirm ? enableAllCount : disableAllCount)} خودروی مطابق جستجو و فیلتر فعلی (در همه صفحات) اعمال می‌شود. ادامه می‌دهید؟`}
        confirmLabel={bulkConfirm ? "مجاز کن" : "غیرمجاز کن"}
      />
    </div>
  );
}
