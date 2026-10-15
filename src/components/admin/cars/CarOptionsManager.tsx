"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import { Plus, Trash2, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

import { AddCarOptionModal } from "@/components/admin/cars/AddCarOptionModal";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { deleteCarOptionAction } from "@/app/admin/(panel)/cars/[id]/options/actions";
import type { CarOptionRecord } from "@/lib/car-options";
import type { OptionRecord } from "@/lib/options";
import { toPersianDigits } from "@/lib/utils";

interface CarOptionsManagerProps {
  carId: string;
  carName: string;
  initialCarOptions: CarOptionRecord[];
  allOptions: OptionRecord[];
}

export function CarOptionsManager({
  carId,
  carName,
  initialCarOptions,
  allOptions,
}: CarOptionsManagerProps) {
  const [carOptions, setCarOptions] = useState<CarOptionRecord[]>(initialCarOptions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CarOptionRecord | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [isDeleting, startDeleteTransition] = useTransition();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filter options that are not yet added to this car
  const availableOptions = useMemo(() => {
    const addedOptionIds = new Set(carOptions.map((co) => co.optionId));
    return allOptions.filter((opt) => !addedOptionIds.has(opt.id));
  }, [allOptions, carOptions]);

  function showToast(kind: ToastState["kind"], message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }

  function handleAddSuccess(record: CarOptionRecord) {
    setCarOptions((prev) => [...prev, record]);
    setIsAddModalOpen(false);
    showToast("success", `ویژگی «${record.optionName}» با موفقیت اضافه شد.`);
  }

  function handleError(message: string) {
    showToast("error", message);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;

    startDeleteTransition(async () => {
      const result = await deleteCarOptionAction(target.id, carId);
      setDeleteTarget(null);
      if (result.ok) {
        setCarOptions((prev) => prev.filter((co) => co.id !== target.id));
        showToast("success", `ویژگی «${target.optionName}» حذف شد.`);
      } else {
        showToast("error", result.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {isAddModalOpen && (
        <AddCarOptionModal
          carId={carId}
          availableOptions={availableOptions}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddSuccess}
          onError={handleError}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="حذف ویژگی از خودرو"
          message={`آیا مطمئن هستید که می‌خواهید ویژگی «${deleteTarget.optionName}» را از خودرو «${carName}» حذف کنید؟`}
          confirmLabel={isDeleting ? "در حال حذف..." : "حذف"}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteTarget(null)}
          pending={isDeleting}
          danger={true}
        />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/cars"
            className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-[#9BA3AE] transition-colors hover:bg-white/[0.06] hover:text-[#F5F5F5]"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            بازگشت به لیست خودروها
          </Link>
          <h1 className="text-lg font-extrabold text-[#F5F5F5]">
            مدیریت ویژگی‌های خودرو: {carName}
          </h1>
          <p className="mt-1 text-xs text-[#8B93A1]">
            {toPersianDigits(carOptions.length)} ویژگی برای این خودرو ثبت شده است.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          disabled={availableOptions.length === 0}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 hover:shadow-[0_0_36px_rgba(255,106,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-80"
        >
          <Plus className="h-[18px] w-[18px]" />
          افزودن ویژگی جدید
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#07090C]">
        <table className="w-full text-right text-sm">
          <thead className="bg-white/[0.03] text-xs font-bold uppercase tracking-wider text-[#8B93A1]">
            <tr>
              <th className="px-6 py-4">ویژگی</th>
              <th className="px-6 py-4">نوع</th>
              <th className="px-6 py-4">مقدار</th>
              <th className="px-6 py-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {carOptions.map((co) => (
              <tr key={co.id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-semibold text-[#F5F5F5]">
                  {co.optionName}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-white/[0.05] px-2.5 py-0.5 font-mono text-[10px] text-[#D2D7DF]">
                    {co.optionType.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#8B93A1]">
                  {co.displayValue}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => setDeleteTarget(co)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
