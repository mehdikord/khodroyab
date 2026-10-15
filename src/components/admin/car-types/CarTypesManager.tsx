"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import { Plus, Search, Car } from "lucide-react";

import { CarTypesTable } from "@/components/admin/car-types/CarTypesTable";
import { CarTypeFormModal } from "@/components/admin/car-types/CarTypeFormModal";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { deleteCarTypeAction } from "@/app/admin/(panel)/car-types/actions";
import type { CarTypeRecord } from "@/lib/car-types";
import { toPersianDigits } from "@/lib/utils";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; carType: CarTypeRecord }
  | null;

interface CarTypesManagerProps {
  initialCarTypes: CarTypeRecord[];
}

export function CarTypesManager({ initialCarTypes }: CarTypesManagerProps) {
  const [carTypes, setCarTypes] = useState<CarTypeRecord[]>(initialCarTypes);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<CarTypeRecord | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [isDeleting, startDeleteTransition] = useTransition();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredCarTypes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return carTypes;
    return carTypes.filter(
      (ct) =>
        ct.name.toLowerCase().includes(normalized) ||
        ct.slug.toLowerCase().includes(normalized)
    );
  }, [carTypes, query]);

  function showToast(kind: ToastState["kind"], message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }

  function handleCreateSuccess(record: CarTypeRecord) {
    setCarTypes((prev) => [record, ...prev]);
    setModal(null);
    showToast("success", `نوع خودرو «${record.name}» با موفقیت ایجاد شد.`);
  }

  function handleUpdateSuccess(record: CarTypeRecord) {
    setCarTypes((prev) =>
      prev.map((ct) => (ct.id === record.id ? record : ct))
    );
    setModal(null);
    showToast("success", `نوع خودرو «${record.name}» به‌روزرسانی شد.`);
  }

  function handleError(message: string) {
    showToast("error", message);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;

    startDeleteTransition(async () => {
      const result = await deleteCarTypeAction(target.id);
      setDeleteTarget(null);
      if (result.ok) {
        setCarTypes((prev) => prev.filter((ct) => ct.id !== target.id));
        showToast("success", `نوع خودرو «${target.name}» حذف شد.`);
      } else {
        showToast("error", result.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">
                مدیریت انواع خودرو
              </h1>
              <p className="mt-0.5 text-xs text-[#8B93A1]">
                {toPersianDigits(carTypes.length)} نوع خودرو در سیستم ثبت شده است
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
          افزودن نوع خودرو
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="group relative w-full max-w-md">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#5E6672] transition-colors group-focus-within:text-[#FF8A2A]">
            <Search className="h-[18px] w-[18px]" />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام یا اسلاگ نوع خودرو…"
            aria-label="جستجوی نوع خودرو"
            className="h-11 w-full rounded-xl border border-white/[0.12] bg-[#07090C] pr-12 pl-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] hover:border-white/20 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
        </div>
      </div>

      {filteredCarTypes.length > 0 ? (
        <CarTypesTable
          carTypes={filteredCarTypes}
          onEdit={(ct) => setModal({ mode: "edit", carType: ct })}
          onDelete={(ct) => setDeleteTarget(ct)}
          isDeleting={isDeleting ? deleteTarget?.id ?? null : null}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/[0.1] bg-[#0A0D12] py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#07090C] text-[#42505F]">
            <Car className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#F5F5F5]">
              {carTypes.length === 0
                ? "هنوز نوع خودرویی ثبت نشده است"
                : "نوع خودرویی مطابق جستجو یافت نشد"}
            </p>
          </div>
          {carTypes.length === 0 && (
            <button
              type="button"
              onClick={() => setModal({ mode: "create" })}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-5 text-sm font-bold text-[#FF8A2A] transition-colors hover:bg-[#FF6A00]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50"
            >
              <Plus className="h-[18px] w-[18px]" />
              ایجاد اولین نوع خودرو
            </button>
          )}
        </div>
      )}

      {modal && (
        <CarTypeFormModal
          key={modal.mode === "edit" ? `edit-${modal.carType.id}` : "create"}
          mode={modal.mode}
          carType={modal.mode === "edit" ? modal.carType : null}
          onClose={() => (!isDeleting ? setModal(null) : undefined)}
          onSuccess={
            modal.mode === "edit" ? handleUpdateSuccess : handleCreateSuccess
          }
          onError={handleError}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => (!isDeleting ? setDeleteTarget(null) : undefined)}
        onConfirm={handleConfirmDelete}
        pending={isDeleting}
        title="حذف نوع خودرو"
        message={
          <>
            آیا از حذف نوع خودرو{" "}
            <strong className="text-[#F5F5F5]">
              «{deleteTarget?.name ?? ""}»
            </strong>{" "}
            مطمئن هستید؟ این عملیات بازگشت‌پذیر نیست.
          </>
        }
        confirmLabel={isDeleting ? "در حال حذف…" : "حذف نوع خودرو"}
      />
    </div>
  );
}
