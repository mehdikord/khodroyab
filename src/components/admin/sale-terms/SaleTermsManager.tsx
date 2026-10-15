"use client";

import React, { useState } from "react";
import { Plus, HandCoins } from "lucide-react";
import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { SaleTermsTable } from "@/components/admin/sale-terms/SaleTermsTable";
import { SaleTermFormModal } from "@/components/admin/sale-terms/SaleTermFormModal";
import { deleteSaleTermAction } from "@/app/admin/(panel)/sale-terms/actions";
import type { SaleTermRecord } from "@/lib/sale-terms";
import { toPersianDigits } from "@/lib/utils";

interface SaleTermsManagerProps {
  initialTerms: SaleTermRecord[];
}

export function SaleTermsManager({ initialTerms }: SaleTermsManagerProps) {
  const [terms, setTerms] = useState<SaleTermRecord[]>(initialTerms);
  const [modalState, setModalState] = useState<{ mode: "create" | "edit"; term: SaleTermRecord | null } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SaleTermRecord | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteSaleTermAction(deleteTarget.id);
    if (result.ok) {
      setTerms((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      showToast("success", "شرایط فروش با موفقیت حذف شد");
      setDeleteTarget(null);
    } else {
      showToast("error", result.message);
    }
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {modalState && (
        <SaleTermFormModal
          mode={modalState.mode}
          term={modalState.term}
          onClose={() => setModalState(null)}
          onSuccess={(record) => {
            if (modalState.mode === "edit") {
              setTerms((prev) => prev.map((t) => (t.id === record.id ? record : t)));
              showToast("success", "شرایط فروش به‌روزرسانی شد");
            } else {
              setTerms((prev) => [record, ...prev]);
              showToast("success", "شرایط فروش ایجاد شد");
            }
            setModalState(null);
          }}
          onError={(msg) => showToast("error", msg)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          open={true}
          title="حذف شرایط فروش"
          message={`آیا از حذف «${deleteTarget.title}» مطمئن هستید؟`}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          danger
        />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
            <HandCoins className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-[#F5F5F5]">مدیریت شرایط فروش</h1>
            <p className="mt-0.5 text-xs text-[#8B93A1]">{toPersianDigits(terms.length)} شرط فروش ثبت شده</p>
          </div>
        </div>
        <button
          onClick={() => setModalState({ mode: "create", term: null })}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> افزودن شرط فروش
        </button>
      </div>

      <SaleTermsTable
        terms={terms}
        onEdit={(term) => setModalState({ mode: "edit", term })}
        onDelete={(term) => setDeleteTarget(term)}
      />
    </div>
  );
}
