"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import { Plus, Search, Palette } from "lucide-react";

import { ColorsTable } from "@/components/admin/colors/ColorsTable";
import { ColorFormModal } from "@/components/admin/colors/ColorFormModal";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { deleteColorAction } from "@/app/admin/(panel)/colors/actions";
import type { ColorRecord } from "@/lib/colors";
import { toPersianDigits } from "@/lib/utils";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; color: ColorRecord }
  | null;

interface ColorsManagerProps {
  initialColors: ColorRecord[];
}

export function ColorsManager({ initialColors }: ColorsManagerProps) {
  const [colors, setColors] = useState<ColorRecord[]>(initialColors);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<ColorRecord | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [isDeleting, startDeleteTransition] = useTransition();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredColors = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return colors;
    return colors.filter(
      (c) =>
        c.name.toLowerCase().includes(normalized) ||
        c.code.toLowerCase().includes(normalized)
    );
  }, [colors, query]);

  function showToast(kind: ToastState["kind"], message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }

  function handleCreateSuccess(record: ColorRecord) {
    setColors((prev) => [record, ...prev]);
    setModal(null);
    showToast("success", `رنگ «${record.name}» با موفقیت ایجاد شد.`);
  }

  function handleUpdateSuccess(record: ColorRecord) {
    setColors((prev) =>
      prev.map((c) => (c.id === record.id ? record : c))
    );
    setModal(null);
    showToast("success", `رنگ «${record.name}» به‌روزرسانی شد.`);
  }

  function handleError(message: string) {
    showToast("error", message);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;

    startDeleteTransition(async () => {
      const result = await deleteColorAction(target.id);
      setDeleteTarget(null);
      if (result.ok) {
        setColors((prev) => prev.filter((c) => c.id !== target.id));
        showToast("success", `رنگ «${target.name}» حذف شد.`);
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
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">
                مدیریت رنگ‌ها
              </h1>
              <p className="mt-0.5 text-xs text-[#8B93A1]">
                {toPersianDigits(colors.length)} رنگ در سیستم ثبت شده است
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
          افزودن رنگ
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
            placeholder="جستجوی نام یا کد رنگ…"
            aria-label="جستجوی رنگ"
            className="h-11 w-full rounded-xl border border-white/[0.12] bg-[#07090C] pr-12 pl-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] hover:border-white/20 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
        </div>
      </div>

      {filteredColors.length > 0 ? (
        <ColorsTable
          colors={filteredColors}
          onEdit={(c) => setModal({ mode: "edit", color: c })}
          onDelete={(c) => setDeleteTarget(c)}
          isDeleting={isDeleting ? deleteTarget?.id ?? null : null}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/[0.1] bg-[#0A0D12] py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#07090C] text-[#42505F]">
            <Palette className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#F5F5F5]">
              {colors.length === 0
                ? "هنوز رنگی ثبت نشده است"
                : "رنگی مطابق جستجو یافت نشد"}
            </p>
          </div>
          {colors.length === 0 && (
            <button
              type="button"
              onClick={() => setModal({ mode: "create" })}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-5 text-sm font-bold text-[#FF8A2A] transition-colors hover:bg-[#FF6A00]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50"
            >
              <Plus className="h-[18px] w-[18px]" />
              ایجاد اولین رنگ
            </button>
          )}
        </div>
      )}

      {modal && (
        <ColorFormModal
          key={modal.mode === "edit" ? `edit-${modal.color.id}` : "create"}
          mode={modal.mode}
          color={modal.mode === "edit" ? modal.color : null}
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
        title="حذف رنگ"
        message={
          <>
            آیا از حذف رنگ{" "}
            <strong className="text-[#F5F5F5]">
              «{deleteTarget?.name ?? ""}»
            </strong>{" "}
            مطمئن هستید؟ این عملیات بازگشت‌پذیر نیست.
          </>
        }
        confirmLabel={isDeleting ? "در حال حذف…" : "حذف رنگ"}
      />
    </div>
  );
}
