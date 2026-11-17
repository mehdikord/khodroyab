"use client";

import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Loader2, Plus, Search, Car } from "lucide-react";

import { CarsTable } from "@/components/admin/cars/CarsTable";
import { CarFormModal } from "@/components/admin/cars/CarFormModal";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";
import { SearchableSelect } from "@/components/admin/ui/SearchableSelect";
import { useDebouncedQueryParam, useListParams } from "@/components/admin/ui/useListParams";
import { brandOptionsOf } from "@/components/catalog/useCarSelection";
import type { BrandChoice } from "@/lib/catalog-shared";
import { deleteCarAction } from "@/app/admin/(panel)/cars/actions";
import type { CarRecord } from "@/lib/cars";
import type { CarTypeRecord } from "@/lib/car-types";
import { toPersianDigits } from "@/lib/utils";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; car: CarRecord }
  | null;

interface CarsManagerProps {
  /** The current page only (server-paginated). */
  initialCars: CarRecord[];
  /** Cars matching the filters. */
  total: number;
  /** Cars in the catalogue. */
  allCount: number;
  page: number;
  pageCount: number;
  pageSize: number;
  filters: { q: string; brandId: string; carTypeId: string };
  /** Brands for the filter select (with car counts). */
  filterBrands: BrandChoice[];
  /** Active brands for the create/edit form. */
  brands: { id: string; name: string }[];
  carTypes: CarTypeRecord[];
}

export function CarsManager({
  initialCars,
  total,
  allCount,
  page,
  pageCount,
  pageSize,
  filters,
  filterBrands,
  brands,
  carTypes,
}: CarsManagerProps) {
  const [cars, setCars] = useState<CarRecord[]>(initialCars);
  const { setParams, isPending: isNavigating, refresh } = useListParams();
  const [query, setQuery] = useDebouncedQueryParam(filters.q, setParams);
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<CarRecord | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [isDeleting, startDeleteTransition] = useTransition();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A new server page (navigation, filter or refresh) replaces the local copy.
  useEffect(() => setCars(initialCars), [initialCars]);

  const brandFilterOptions = useMemo(() => brandOptionsOf(filterBrands), [filterBrands]);
  const typeFilterOptions = useMemo(() => carTypes.map((type) => ({ value: type.id, label: type.name })), [carTypes]);
  const hasFilters = Boolean(filters.q || filters.brandId || filters.carTypeId);

  function showToast(kind: ToastState["kind"], message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }

  function handleCreateSuccess(record: CarRecord) {
    setModal(null);
    refresh(); // the new car belongs to the first page of the server list
    showToast("success", `خودرو «${record.name}» با موفقیت ثبت شد.`);
  }

  function handleUpdateSuccess(record: CarRecord) {
    setCars((prev) =>
      prev.map((c) => (c.id === record.id ? record : c))
    );
    setModal(null);
    showToast("success", `خودرو «${record.name}» به‌روزرسانی شد.`);
  }

  function handleError(message: string) {
    showToast("error", message);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;

    startDeleteTransition(async () => {
      const result = await deleteCarAction(target.id);
      setDeleteTarget(null);
      if (result.ok) {
        setCars((prev) => prev.filter((c) => c.id !== target.id));
        showToast("success", `خودرو «${target.name}» حذف شد.`);
        refresh(); // pull the next car up into this page
      } else {
        showToast("error", result.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {modal && (
        <CarFormModal
          mode={modal.mode}
          car={modal.mode === "edit" ? modal.car : null}
          brands={brands}
          carTypes={carTypes}
          onClose={() => setModal(null)}
          onSuccess={modal.mode === "create" ? handleCreateSuccess : handleUpdateSuccess}
          onError={handleError}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="حذف خودرو"
          message={`آیا مطمئن هستید که می‌خواهید خودرو «${deleteTarget.name}» را حذف کنید؟ این عمل غیرقابل بازگشت است.`}
          confirmLabel={isDeleting ? "در حال حذف..." : "حذف"}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteTarget(null)}
          pending={isDeleting}
          danger={true}
        />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">
                مدیریت خودروها
              </h1>
              <p className="mt-0.5 text-xs text-[#8B93A1]">
                {toPersianDigits(allCount)} خودرو در سیستم ثبت شده است
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
          افزودن خودرو
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
      <div className="group relative w-full md:col-span-5">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#5E6672] transition-colors group-focus-within:text-[#FF8A2A]">
            <Search className="h-[18px] w-[18px]" />
          </span>
          <input
            type="search"
            placeholder="جستجو در نام، برند یا مدل..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/[0.12] bg-[#07090C] px-12 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
      </div>
        <SearchableSelect
          className="md:col-span-4"
          value={filters.brandId}
          onChange={(value) => setParams({ brand: value })}
          options={brandFilterOptions}
          clearable
          placeholder="همه برندها"
          searchPlaceholder="جستجوی برند…"
          emptyText="برندی پیدا نشد"
        />
        <div className="flex items-center gap-2 md:col-span-3">
          <SearchableSelect
            className="flex-1"
            value={filters.carTypeId}
            onChange={(value) => setParams({ type: value })}
            options={typeFilterOptions}
            clearable
            placeholder="همه انواع"
            searchPlaceholder="جستجوی نوع…"
            emptyText="نوعی پیدا نشد"
          />
          {isNavigating && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#FF8A2A]" aria-label="در حال بارگذاری" />}
        </div>
      </div>

      {cars.length > 0 ? (
        <>
          <CarsTable
            cars={cars}
            onEdit={(car) => setModal({ mode: "edit", car })}
            onDelete={(car) => setDeleteTarget(car)}
            isDeleting={isDeleting ? deleteTarget?.id : null}
          />
          <AdminPagination total={total} page={page} pageCount={pageCount} pageSize={pageSize} unit="خودرو" />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/[0.1] bg-[#0A0D12] px-6 py-16 text-center">
          <p className="text-sm font-bold text-[#F5F5F5]">
            {hasFilters ? "خودرویی مطابق جستجو یا فیلتر یافت نشد" : "هنوز خودرویی ثبت نشده است"}
          </p>
          <p className="mt-1 text-xs text-[#5E6672]">
            {hasFilters ? "عبارت یا فیلتر دیگری را امتحان کنید" : "از دکمه «افزودن خودرو» یا بخش «ورود اطلاعات» استفاده کنید"}
          </p>
        </div>
      )}
    </div>
  );
}
