"use client";

import React, { useState } from "react";
import { Crown, Plus } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { SubscriptionPlansTable } from "@/components/admin/subscriptions/SubscriptionPlansTable";
import { SubscriptionPlanFormModal } from "@/components/admin/subscriptions/SubscriptionPlanFormModal";
import {
  deleteSubscriptionPlanAction,
  toggleSubscriptionPlanActiveAction,
} from "@/app/admin/(panel)/subscriptions/actions";
import type { SubscriptionPlanRecord } from "@/lib/subscriptions";
import { toPersianDigits } from "@/lib/utils";

interface SubscriptionPlansManagerProps {
  initialPlans: SubscriptionPlanRecord[];
  /** Number of grants per plan id (plans in use cannot be deleted). */
  usageByPlan: Record<string, number>;
}

export function SubscriptionPlansManager({ initialPlans, usageByPlan }: SubscriptionPlansManagerProps) {
  const [plans, setPlans] = useState<SubscriptionPlanRecord[]>(initialPlans);
  const [modalState, setModalState] = useState<{ mode: "create" | "edit"; plan: SubscriptionPlanRecord | null } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SubscriptionPlanRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteSubscriptionPlanAction(deleteTarget.id);
    setDeleting(false);
    if (result.ok) {
      setPlans((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast("success", "اشتراک با موفقیت حذف شد");
      setDeleteTarget(null);
    } else {
      showToast("error", result.message);
    }
  }

  async function handleToggle(plan: SubscriptionPlanRecord) {
    if (pendingToggleId) return;
    setPendingToggleId(plan.id);
    const result = await toggleSubscriptionPlanActiveAction(plan.id);
    setPendingToggleId(null);
    if (result.ok) {
      setPlans((prev) => prev.map((p) => (p.id === result.record.id ? result.record : p)));
      showToast("success", result.record.isActive ? `اشتراک «${result.record.name}» فعال شد` : `اشتراک «${result.record.name}» غیرفعال شد`);
    } else {
      showToast("error", result.message);
    }
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {modalState && (
        <SubscriptionPlanFormModal
          mode={modalState.mode}
          plan={modalState.plan}
          onClose={() => setModalState(null)}
          onSuccess={(record) => {
            if (modalState.mode === "edit") {
              setPlans((prev) => prev.map((p) => (p.id === record.id ? record : p)));
              showToast("success", "اشتراک به‌روزرسانی شد");
            } else {
              setPlans((prev) => [record, ...prev]);
              showToast("success", "اشتراک جدید ایجاد شد");
            }
            setModalState(null);
          }}
          onError={(msg) => showToast("error", msg)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          open={true}
          title="حذف اشتراک"
          message={`آیا از حذف اشتراک «${deleteTarget.name}» مطمئن هستید؟`}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          pending={deleting}
          danger
        />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-[#F5F5F5]">لیست اشتراک‌ها</h1>
            <p className="mt-0.5 text-xs text-[#8B93A1]">{toPersianDigits(plans.length)} اشتراک تعریف شده</p>
          </div>
        </div>
        <button
          onClick={() => setModalState({ mode: "create", plan: null })}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> ایجاد اشتراک جدید
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#07090C]/60 px-6 py-12 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0D1117] text-[#5E6672]">
            <Crown className="h-6 w-6" />
          </span>
          <p className="mt-4 text-sm font-bold text-[#D2D7DF]">هنوز اشتراکی تعریف نشده است</p>
          <p className="mt-1.5 text-xs leading-6 text-[#5E6672]">با دکمه «ایجاد اشتراک جدید» اولین پلن اشتراک را بسازید.</p>
        </div>
      ) : (
        <SubscriptionPlansTable
          plans={plans}
          usageByPlan={usageByPlan}
          pendingToggleId={pendingToggleId}
          onToggle={handleToggle}
          onEdit={(plan) => setModalState({ mode: "edit", plan })}
          onDelete={(plan) => setDeleteTarget(plan)}
        />
      )}
    </div>
  );
}
