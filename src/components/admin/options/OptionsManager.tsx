"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import { ClipboardList, Plus, Search } from "lucide-react";

import { OptionsTable } from "@/components/admin/options/OptionsTable";
import { OptionFormModal } from "@/components/admin/options/OptionFormModal";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { deleteOptionAction, toggleOptionActiveAction } from "@/app/admin/(panel)/car-form/actions";
import type { OptionRecord } from "@/lib/options";
import { toPersianDigits } from "@/lib/utils";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; option: OptionRecord }
  | null;

interface OptionsManagerProps {
  initialOptions: OptionRecord[];
}

export function OptionsManager({ initialOptions }: OptionsManagerProps) {
  const [options, setOptions] = useState<OptionRecord[]>(initialOptions);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<OptionRecord | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [isDeleting, startDeleteTransition] = useTransition();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter(
      (opt) =>
        opt.name.toLowerCase().includes(normalized) ||
        opt.description.toLowerCase().includes(normalized)
    );
  }, [options, query]);

  function showToast(kind: ToastState["kind"], message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }

  function handleCreateSuccess(record: OptionRecord) {
    setOptions((prev) => [record, ...prev]);
    setModal(null);
    showToast("success", `ویژگی «${record.name}» با موفقیت ایجاد شد.`);
  }

  function handleUpdateSuccess(record: OptionRecord) {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === record.id ? record : opt))
    );
    setModal(null);
    showToast("success", `ویژگی «${record.name}» به‌روزرسانی شد.`);
  }

  function handleError(message: string) {
    showToast("error", message);
  }

  function handleToggleActive(option: OptionRecord, next: boolean) {
    setBusyId(option.id);
    void toggleOptionActiveAction(option.id, next).then((result) => {
      setBusyId(null);
      if (result.ok) {
        setOptions((prev) => prev.map((opt) => (opt.id === result.record.id ? result.record : opt)));
        showToast("success", next ? `ویژگی «${option.name}» فعال شد.` : `ویژگی «${option.name}» غیرفعال شد.`);
      } else {
        showToast("error", result.message);
      }
    });
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;

    startDeleteTransition(async () => {
      const result = await deleteOptionAction(target.id);
      setDeleteTarget(null);
      if (result.ok) {
        setOptions((prev) => prev.filter((opt) => opt.id !== target.id));
        showToast("success", `ویژگی «${target.name}» حذف شد.`);
      } else {
        showToast("error", result.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {modal && (
        <OptionFormModal
          mode={modal.mode}
          option={modal.mode === "edit" ? modal.option : null}
          onClose={() => setModal(null)}
          onSuccess={
            modal.mode === "create" ? handleCreateSuccess : handleUpdateSuccess
          }
          onError={handleError}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => (!isDeleting ? setDeleteTarget(null) : undefined)}
        onConfirm={handleConfirmDelete}
        pending={isDeleting}
        title="حذف ویژگی"
        message={
          <>
            آیا از حذف ویژگی{" "}
            <strong className="text-[#F5F5F5]">
              «{deleteTarget?.name ?? ""}»
            </strong>{" "}
            مطمئن هستید؟ این عملیات بازگشت‌پذیر نیست.
          </>
        }
        confirmLabel={isDeleting ? "در حال حذف…" : "حذف ویژگی"}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">
                فرم ثبت خودرو
              </h1>
              <p className="mt-0.5 text-xs text-[#8B93A1]">
                {toPersianDigits(options.length)} ویژگی عمومی؛ کاربران هنگام ثبت آگهی مقدار آن‌ها را وارد می‌کنند
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
          افزودن ویژگی
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="group relative w-full max-w-md">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#5E6672] transition-colors group-focus-within:text-[#FF8A2A]">
            <Search className="h-[18px] w-[18px]" />
          </span>
          <input
            type="search"
            placeholder="جستجو در ویژگی‌ها..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/[0.12] bg-[#07090C] px-12 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
        </div>
      </div>

      <OptionsTable
        options={filteredOptions}
        onEdit={(option) => setModal({ mode: "edit", option })}
        onDelete={(option) => setDeleteTarget(option)}
        onToggleActive={handleToggleActive}
        busyId={busyId}
      />
    </div>
  );
}
