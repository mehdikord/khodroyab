"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Megaphone, Plus, Search, X } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { MyAdForm } from "@/components/panel/ads/MyAdForm";
import { MyAdCard } from "@/components/panel/ads/MyAdCard";
import type { UserCarRecord } from "@/lib/user-cars";
import type { CarRecord } from "@/lib/cars";
import type { SaleTermRecord } from "@/lib/sale-terms";
import { AD_STATUS_LABELS, type AdStatus } from "@/lib/ad-status";
import { cn, toPersianDigits } from "@/lib/utils";

interface MyAdsManagerProps {
  initialAds: UserCarRecord[];
  cars: CarRecord[];
  saleTerms: SaleTermRecord[];
}

type StatusFilter = "all" | AdStatus;

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "pending", label: AD_STATUS_LABELS.pending },
  { key: "approved", label: AD_STATUS_LABELS.approved },
  { key: "rejected", label: AD_STATUS_LABELS.rejected },
];

/**
 * "My ads" module: a collapsible create/edit form at the top and the
 * customer's own ads underneath. The form opens from the header button or
 * from a card's edit action.
 */
export function MyAdsManager({ initialAds, cars, saleTerms }: MyAdsManagerProps) {
  const [ads, setAds] = useState<UserCarRecord[]>(initialAds);
  const [formState, setFormState] = useState<{ mode: "create" | "edit"; ad: UserCarRecord | null } | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const counts = useMemo(() => {
    const result: Record<StatusFilter, number> = { all: ads.length, pending: 0, approved: 0, rejected: 0 };
    for (const ad of ads) result[ad.status] += 1;
    return result;
  }, [ads]);

  const visibleAds = useMemo(() => (filter === "all" ? ads : ads.filter((ad) => ad.status === filter)), [ads, filter]);

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    window.setTimeout(() => setToast(null), 4500);
  }

  function openCreate() {
    setFormState({ mode: "create", ad: null });
  }

  function openEdit(ad: UserCarRecord) {
    setFormState({ mode: "edit", ad });
  }

  function closeForm() {
    setFormState(null);
  }

  function handleSuccess(record: UserCarRecord, mode: "create" | "edit") {
    if (mode === "create") {
      setAds((prev) => [record, ...prev]);
      showToast("success", `آگهی با کد ${toPersianDigits(record.code)} ثبت شد و در انتظار تایید مدیر است`);
    } else {
      setAds((prev) => prev.map((item) => (item.id === record.id ? record : item)));
      showToast("success", "تغییرات ذخیره شد؛ آگهی برای بررسی مجدد به مدیر ارسال شد");
    }
    setFilter("all");
    setFormState(null);
    setHighlightedId(record.id);
    window.setTimeout(() => setHighlightedId(null), 3000);
  }

  const formOpen = formState !== null;

  return (
    <div className="space-y-5">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header */}
      <div className="admin-animate-in flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-panel-text sm:text-2xl">آگهی‌های من</h1>
          <p className="mt-1 text-xs text-panel-muted sm:text-sm">
            {ads.length === 0
              ? "هنوز آگهی‌ای ثبت نکرده‌اید."
              : `${toPersianDigits(ads.length)} آگهی · ${toPersianDigits(counts.pending)} در انتظار تایید · ${toPersianDigits(counts.approved)} تایید‌شده`}
          </p>
        </div>
        <button
          type="button"
          onClick={formOpen ? closeForm : openCreate}
          aria-expanded={formOpen}
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold transition-all",
            formOpen
              ? "border border-panel-line/[0.12] bg-panel-line/[0.03] text-panel-text-2 hover:border-panel-line/25 hover:text-panel-text"
              : "bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] text-[#07090C] shadow-orange-subtle hover:brightness-110"
          )}
        >
          {formOpen ? (
            <>
              <X className="h-4 w-4" />
              بستن فرم
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              ثبت آگهی جدید
            </>
          )}
        </button>
      </div>

      {/* Collapsible form (above the list) */}
      {formState && (
        <MyAdForm
          key={formState.ad?.id ?? "create"}
          mode={formState.mode}
          ad={formState.ad}
          cars={cars}
          saleTerms={saleTerms}
          onCancel={closeForm}
          onSuccess={handleSuccess}
        />
      )}

      {/* Status filter chips */}
      {ads.length > 0 && (
        <div className="panel-no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {FILTERS.map((item) => {
            const active = filter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                aria-pressed={active}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-bold transition-colors",
                  active
                    ? "border-[#FF6A00]/50 bg-[#FF6A00]/15 text-panel-accent"
                    : "border-panel-line/[0.1] bg-panel-surface text-panel-muted hover:border-panel-line/20 hover:text-panel-text"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 font-mono text-[10px]",
                    active ? "bg-[#FF6A00]/20 text-panel-accent-soft" : "bg-panel-line/[0.05] text-panel-muted-2"
                  )}
                >
                  {toPersianDigits(counts[item.key])}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* List */}
      {ads.length === 0 ? (
        !formOpen && (
          <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center">
            <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
            <div className="relative">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
                <Megaphone className="h-7 w-7" />
              </span>
              <p className="mt-5 text-base font-extrabold text-panel-text">اولین آگهی خود را ثبت کنید</p>
              <p className="mt-2 text-xs leading-6 text-panel-muted-2">
                آگهی شما پس از بررسی و تایید مدیر، در جستجوی همه کاربران نمایش داده می‌شود.
              </p>
              <button
                type="button"
                onClick={openCreate}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] shadow-orange-subtle transition-all hover:brightness-110"
              >
                <Plus className="h-4 w-4" />
                ثبت آگهی جدید
              </button>
            </div>
          </div>
        )
      ) : visibleAds.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-panel-line/[0.12] px-6 py-10 text-center">
          <p className="text-sm font-bold text-panel-muted">آگهی‌ای با این وضعیت ندارید</p>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="mt-3 text-xs font-bold text-panel-accent hover:underline"
          >
            نمایش همه آگهی‌ها
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visibleAds.map((ad, index) => (
            <MyAdCard
              key={ad.id}
              ad={ad}
              onEdit={openEdit}
              disabled={formOpen && formState?.ad?.id === ad.id}
              highlighted={highlightedId === ad.id}
              delay={Math.min(index, 6) * 45}
            />
          ))}
        </div>
      )}

      {ads.some((ad) => ad.status === "approved") && (
        <p className="text-center text-[11px] text-panel-faint">
          <Link href="/panel/search" className="inline-flex items-center gap-1 font-bold text-panel-muted hover:text-panel-accent">
            <Search className="h-3 w-3" />
            مشاهده آگهی‌های تایید‌شده در جستجو
          </Link>
        </p>
      )}
    </div>
  );
}
