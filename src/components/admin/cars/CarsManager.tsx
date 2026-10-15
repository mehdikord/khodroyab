"use client";

import React, { useMemo, useRef, useState, useTransition, useEffect } from "react";
import { Plus, Search, Car, Loader2 } from "lucide-react";

import { CarsTable } from "@/components/admin/cars/CarsTable";
import { CarFormModal } from "@/components/admin/cars/CarFormModal";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { Modal } from "@/components/admin/ui/Modal";
import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { CarOptionsList } from "@/components/admin/cars/CarOptionsList";
import { deleteCarAction } from "@/app/admin/(panel)/cars/actions";
import { getCarOptionsAction } from "@/app/admin/(panel)/cars/[id]/options/actions";
import type { CarRecord } from "@/lib/cars";
import type { BrandRecord } from "@/lib/brands";
import type { CarTypeRecord } from "@/lib/car-types";
import type { CarOptionRecord } from "@/lib/car-options";
import { toPersianDigits } from "@/lib/utils";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; car: CarRecord }
  | null;

interface CarsManagerProps {
  initialCars: CarRecord[];
  brands: BrandRecord[];
  carTypes: CarTypeRecord[];
}

export function CarsManager({ initialCars, brands, carTypes }: CarsManagerProps) {
  const [cars, setCars] = useState<CarRecord[]>(initialCars);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<CarRecord | null>(null);
  const [viewDetails, setViewDetails] = useState<CarRecord | null>(null);
  const [detailsOptions, setDetailsOptions] = useState<CarOptionRecord[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [isDeleting, startDeleteTransition] = useTransition();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!viewDetails) {
      setDetailsOptions([]);
      return;
    }
    setIsLoadingDetails(true);
    getCarOptionsAction(viewDetails.id).then((options) => {
      setDetailsOptions(options);
      setIsLoadingDetails(false);
    });
  }, [viewDetails]);

  const filteredCars = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return cars;
    return cars.filter(
      (car) =>
        car.name.toLowerCase().includes(normalized) ||
        car.brandName.toLowerCase().includes(normalized) ||
        car.model.toLowerCase().includes(normalized)
    );
  }, [cars, query]);

  function showToast(kind: ToastState["kind"], message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }

  function handleCreateSuccess(record: CarRecord) {
    setCars((prev) => [record, ...prev]);
    setModal(null);
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

      {/* Details Modal (ReadOnly) */}
      {viewDetails && (
        <Modal
          open
          onClose={() => setViewDetails(null)}
          title={`مشخصات خودرو ${viewDetails.name}`}
          size="md"
        >
          {isLoadingDetails ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#FF8A2A]" />
            </div>
          ) : (
            <CarOptionsList options={detailsOptions} />
          )}
        </Modal>
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
                {toPersianDigits(cars.length)} خودرو در سیستم ثبت شده است
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

      <div className="group relative w-full max-w-md">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#5E6672] transition-colors group-focus-within:text-[#FF8A2A]">
            <Search className="h-[18px] w-[18px]" />
          </span>
          <input
            type="search"
            placeholder="جستجو در نام، برند یا مدل..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/[0.12] bg-[#07090C] px-12 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
      </div>

      <CarsTable
        cars={filteredCars}
        onEdit={(car) => setModal({ mode: "edit", car })}
        onDelete={(car) => setDeleteTarget(car)}
        onViewDetails={(car) => setViewDetails(car)}
        isDeleting={isDeleting ? deleteTarget?.id : null}
      />
    </div>
  );
}
