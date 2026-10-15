"use client";

import React, { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Megaphone, Plus, Search, UserCircle2 } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { Badge } from "@/components/admin/ui/Badge";
import { SaleAdsTable } from "@/components/admin/users/sale-ads/SaleAdsTable";
import { SaleAdFormModal } from "@/components/admin/users/sale-ads/SaleAdFormModal";
import {
  deleteUserCarAction,
  toggleUserCarActiveAction,
} from "@/app/admin/(panel)/users/[id]/sale-ads/actions";
import type { UserRecord } from "@/lib/users";
import type { UserCarRecord } from "@/lib/user-cars";
import type { CarRecord } from "@/lib/cars";
import type { SaleTermRecord } from "@/lib/sale-terms";
import { toPersianDigits } from "@/lib/utils";

interface SaleAdsManagerProps {
  user: UserRecord;
  initialAds: UserCarRecord[];
  cars: CarRecord[];
  saleTerms: SaleTermRecord[];
}

type Filter = "all" | "active" | "inactive";

export function SaleAdsManager({ user, initialAds, cars, saleTerms }: SaleAdsManagerProps) {
  const [ads, setAds] = useState<UserCarRecord[]>(initialAds);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [modalState, setModalState] = useState<{ mode: "create" | "edit"; ad: UserCarRecord | null } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserCarRecord | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const activeCount = ads.filter((ad) => ad.isActive).length;

  const filteredAds = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return ads.filter((ad) => {
      if (filter === "active" && !ad.isActive) return false;
      if (filter === "inactive" && ad.isActive) return false;
      if (!normalized) return true;
      const haystack = `${ad.brandName} ${ad.carName} ${ad.carModel} ${ad.carYear} ${ad.carTypeName} ${ad.description}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [ads, query, filter]);

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 4000);
  }

  function handleToggleActive(ad: UserCarRecord, next: boolean) {
    setBusyId(ad.id);
    void toggleUserCarActiveAction(ad.id, next).then((result) => {
      setBusyId(null);
      if (result.ok) {
        setAds((prev) => prev.map((item) => (item.id === result.record.id ? result.record : item)));
        showToast("success", next ? "آگهی فعال شد" : "آگهی غیرفعال شد");
      } else {
        showToast("error", result.message);
      }
    });
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startDeleteTransition(async () => {
      const result = await deleteUserCarAction(target.id);
      setDeleteTarget(null);
      if (result.ok) {
        setAds((prev) => prev.filter((ad) => ad.id !== target.id));
        showToast("success", "آگهی با موفقیت حذف شد");
      } else {
        showToast("error", result.message);
      }
    });
  }

  const filterButtons: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "همه", count: ads.length },
    { key: "active", label: "فعال", count: activeCount },
    { key: "inactive", label: "غیرفعال", count: ads.length - activeCount },
  ];

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {modalState && (
        <SaleAdFormModal
          mode={modalState.mode}
          userId={user.id}
          userName={user.name}
          ad={modalState.ad}
          cars={cars}
          saleTerms={saleTerms}
          onClose={() => setModalState(null)}
          onSuccess={(record) => {
            if (modalState.mode === "edit") {
              setAds((prev) => prev.map((ad) => (ad.id === record.id ? record : ad)));
              showToast("success", "آگهی با موفقیت به‌روزرسانی شد");
            } else {
              setAds((prev) => [record, ...prev]);
              showToast("success", "آگهی جدید برای کاربر ثبت شد");
            }
            setModalState(null);
          }}
          onError={(message) => showToast("error", message)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          open
          title="حذف آگهی فروش"
          message={
            <>
              آیا از حذف آگهی «{deleteTarget.brandName} {deleteTarget.carName}» مطمئن هستید؟ تمام شرایط فروش ثبت‌شده
              برای این آگهی نیز حذف می‌شود.
            </>
          }
          confirmLabel={isDeleting ? "در حال حذف…" : "حذف آگهی"}
          pending={isDeleting}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteTarget(null)}
          danger
        />
      )}

      {/* Back link */}
      <Link
        href={`/admin/users/${user.id}`}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-[#9BA3AE] transition-colors hover:bg-white/[0.06] hover:text-[#F5F5F5]"
      >
        <ArrowRight className="h-3.5 w-3.5" />
        بازگشت به پروفایل کاربر
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0D1117] p-5 sm:p-6">
        <div className="admin-ambient pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[#FF6A00]/40 bg-[#07090C] shadow-[0_0_24px_-6px_rgba(255,106,0,0.5)]">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-black text-[#FF8A2A]">
                  {user.name.trim().charAt(0) || "?"}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-extrabold text-[#F5F5F5]">آگهی‌های فروش {user.name}</h1>
                <Badge tone={user.isActive ? "success" : "error"}>{user.isActive ? "کاربر فعال" : "کاربر غیرفعال"}</Badge>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8B93A1]">
                <span dir="ltr" className="font-mono">{user.phone}</span>
                <span>·</span>
                <span>
                  {toPersianDigits(ads.length)} آگهی ثبت شده، {toPersianDigits(activeCount)} فعال
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/users/${user.id}`}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 text-sm font-bold text-[#D2D7DF] transition-colors hover:border-white/20 hover:text-[#F5F5F5]"
            >
              <UserCircle2 className="h-4 w-4 text-[#FF8A2A]" />
              پروفایل کاربر
            </Link>
            <button
              type="button"
              onClick={() => setModalState({ mode: "create", ad: null })}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.3)] transition-all hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              ثبت آگهی جدید
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E6672]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در خودرو، مدل، سال یا توضیحات…"
            className="h-11 w-full rounded-xl border border-white/[0.12] bg-[#07090C] pe-11 ps-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
        </div>
        <div className="inline-flex rounded-xl border border-white/[0.08] bg-[#0D1117] p-1">
          {filterButtons.map((button) => (
            <button
              key={button.key}
              type="button"
              onClick={() => setFilter(button.key)}
              className={
                filter === button.key
                  ? "inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#FF6A00]/15 px-3 text-xs font-bold text-[#FF8A2A]"
                  : "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-[#8B93A1] transition-colors hover:text-[#F5F5F5]"
              }
            >
              {button.label}
              <span className="font-mono text-[10px] opacity-80">{toPersianDigits(button.count)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {ads.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/[0.12] bg-[#0D1117]/60 px-6 py-16 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
              <Megaphone className="h-7 w-7" />
            </span>
            <p className="mt-5 text-base font-extrabold text-[#F5F5F5]">هنوز آگهی‌ای برای این کاربر ثبت نشده است</p>
            <p className="mt-2 text-xs leading-6 text-[#8B93A1]">
              اولین آگهی فروش را به نام {user.name} ثبت کنید؛ خودرو، تعداد و شرایط فروش را در همین صفحه وارد می‌کنید.
            </p>
            <button
              type="button"
              onClick={() => setModalState({ mode: "create", ad: null })}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] transition-all hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              ثبت اولین آگهی
            </button>
          </div>
        </div>
      ) : filteredAds.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#0D1117] px-6 py-12 text-center">
          <p className="text-sm font-bold text-[#9BA3AE]">هیچ آگهی‌ای با این فیلتر پیدا نشد</p>
        </div>
      ) : (
        <SaleAdsTable
          ads={filteredAds}
          busyId={busyId}
          onEdit={(ad) => setModalState({ mode: "edit", ad })}
          onDelete={(ad) => setDeleteTarget(ad)}
          onToggleActive={handleToggleActive}
        />
      )}
    </div>
  );
}
