"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import { Eye, HeartHandshake, Plus, Search } from "lucide-react";

import { SponsorsTable } from "@/components/admin/sponsors/SponsorsTable";
import { SponsorFormModal } from "@/components/admin/sponsors/SponsorFormModal";
import { SponsorsMarquee } from "@/components/panel/SponsorsMarquee";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { deleteSponsorAction, reorderSponsorsAction, toggleSponsorActiveAction } from "@/app/admin/(panel)/sponsors/actions";
import type { SponsorRecord } from "@/lib/sponsors";
import { toPersianDigits } from "@/lib/utils";

type ModalState = { mode: "create" } | { mode: "edit"; sponsor: SponsorRecord } | null;

interface SponsorsManagerProps {
  initialSponsors: SponsorRecord[];
}

function byDisplayOrder(a: SponsorRecord, b: SponsorRecord): number {
  return a.sortOrder - b.sortOrder || Number(BigInt(a.id) - BigInt(b.id));
}

/** Full CRUD + ordering for sponsors, with a live preview of the login-page strip. */
export function SponsorsManager({ initialSponsors }: SponsorsManagerProps) {
  const [sponsors, setSponsors] = useState<SponsorRecord[]>(() => [...initialSponsors].sort(byDisplayOrder));
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<SponsorRecord | null>(null);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [isDeleting, startDeleteTransition] = useTransition();
  const [, startToggleTransition] = useTransition();
  const [isReordering, startReorderTransition] = useTransition();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () => (normalizedQuery ? sponsors.filter((sponsor) => sponsor.name.toLowerCase().includes(normalizedQuery)) : sponsors),
    [sponsors, normalizedQuery]
  );
  const active = useMemo(() => sponsors.filter((sponsor) => sponsor.isActive), [sponsors]);
  const nextOrder = sponsors.reduce((max, sponsor) => Math.max(max, sponsor.sortOrder), 0) + 1;

  function showToast(kind: ToastState["kind"], message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }

  function upsertRecord(record: SponsorRecord) {
    setSponsors((prev) => [...prev.filter((item) => item.id !== record.id), record].sort(byDisplayOrder));
  }

  function handleSaved(record: SponsorRecord, created: boolean) {
    upsertRecord(record);
    setModal(null);
    showToast("success", created ? `حامی «${record.name}» اضافه شد.` : `حامی «${record.name}» به‌روزرسانی شد.`);
  }

  function handleToggleActive(sponsor: SponsorRecord) {
    if (pendingToggleId) return;
    setPendingToggleId(sponsor.id);
    upsertRecord({ ...sponsor, isActive: !sponsor.isActive });

    startToggleTransition(async () => {
      const result = await toggleSponsorActiveAction(sponsor.id);
      setPendingToggleId(null);
      if (result.ok) {
        upsertRecord(result.record);
        showToast("success", result.record.isActive ? `«${result.record.name}» در صفحه ورود نمایش داده می‌شود.` : `«${result.record.name}» غیرفعال شد.`);
      } else {
        upsertRecord(sponsor);
        showToast("error", result.message);
      }
    });
  }

  function handleMove(sponsor: SponsorRecord, direction: -1 | 1) {
    const index = sponsors.findIndex((item) => item.id === sponsor.id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= sponsors.length) return;

    const previous = sponsors;
    const reordered = [...sponsors];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setSponsors(reordered.map((item, position) => ({ ...item, sortOrder: position + 1 })));

    startReorderTransition(async () => {
      const result = await reorderSponsorsAction(reordered.map((item) => item.id));
      if (result.ok) {
        setSponsors(result.records);
      } else {
        setSponsors(previous);
        showToast("error", result.message);
      }
    });
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startDeleteTransition(async () => {
      const result = await deleteSponsorAction(target.id);
      setDeleteTarget(null);
      if (result.ok) {
        setSponsors((prev) => prev.filter((sponsor) => sponsor.id !== target.id));
        showToast("success", `حامی «${target.name}» حذف شد.`);
      } else {
        showToast("error", result.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">مدیریت حامیان</h1>
            <p className="mt-0.5 text-xs text-[#8B93A1]">
              {toPersianDigits(sponsors.length)} حامی ثبت شده · {toPersianDigits(active.length)} حامی فعال در صفحه ورود
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModal({ mode: "create" })}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 hover:shadow-[0_0_36px_rgba(255,106,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50"
        >
          <Plus className="h-[18px] w-[18px]" />
          حامی جدید
        </button>
      </div>

      {/* Live preview of the login-page strip */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0A0D12]">
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
          <p className="flex items-center gap-2 text-xs font-bold text-[#D2D7DF]">
            <Eye className="h-4 w-4 text-[#FF8A2A]" />
            پیش‌نمایش نوار حامیان صفحه ورود
          </p>
          <span className="text-[11px] text-[#5E6672]">فقط حامیان فعال، به ترتیب نمایش</span>
        </div>
        <div className="px-1 py-4">
          {active.length > 0 ? (
            <SponsorsMarquee sponsors={active} />
          ) : (
            <p className="py-6 text-center text-xs text-[#5E6672]">هیچ حامی فعالی وجود ندارد؛ نوار حامیان در صفحه ورود نمایش داده نمی‌شود.</p>
          )}
        </div>
      </section>

      {/* Search */}
      {sponsors.length > 0 && (
        <div className="group relative w-full max-w-md">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#5E6672] transition-colors group-focus-within:text-[#FF8A2A]">
            <Search className="h-[18px] w-[18px]" />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام حامی…"
            aria-label="جستجوی حامی"
            className="h-11 w-full rounded-xl border border-white/[0.12] bg-[#07090C] pl-4 pr-12 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] hover:border-white/20 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
        </div>
      )}

      {filtered.length > 0 ? (
        <SponsorsTable
          sponsors={filtered}
          canReorder={!normalizedQuery}
          onMove={handleMove}
          onEdit={(sponsor) => setModal({ mode: "edit", sponsor })}
          onDelete={(sponsor) => setDeleteTarget(sponsor)}
          onToggleActive={handleToggleActive}
          busy={isReordering}
          isPendingToggle={pendingToggleId}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/[0.1] bg-[#0A0D12] py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#07090C] text-[#42505F]">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#F5F5F5]">{sponsors.length === 0 ? "هنوز حامی‌ای ثبت نشده است" : "حامی‌ای مطابق جستجو یافت نشد"}</p>
            <p className="mt-1 text-xs text-[#5E6672]">
              {sponsors.length === 0 ? "حامیان فعال در انتهای صفحه ورود کاربران نمایش داده می‌شوند" : "عبارت دیگری را امتحان کنید"}
            </p>
          </div>
          {sponsors.length === 0 && (
            <button
              type="button"
              onClick={() => setModal({ mode: "create" })}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-5 text-sm font-bold text-[#FF8A2A] transition-colors hover:bg-[#FF6A00]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50"
            >
              <Plus className="h-[18px] w-[18px]" />
              افزودن اولین حامی
            </button>
          )}
        </div>
      )}

      {modal && (
        <SponsorFormModal
          key={modal.mode === "edit" ? `edit-${modal.sponsor.id}` : "create"}
          mode={modal.mode}
          sponsor={modal.mode === "edit" ? modal.sponsor : null}
          nextOrder={nextOrder}
          onClose={() => setModal(null)}
          onSuccess={(record) => handleSaved(record, modal.mode === "create")}
          onError={(message) => showToast("error", message)}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => (!isDeleting ? setDeleteTarget(null) : undefined)}
        onConfirm={handleConfirmDelete}
        pending={isDeleting}
        title="حذف حامی"
        message={
          <>
            آیا از حذف حامی <strong className="text-[#F5F5F5]">«{deleteTarget?.name ?? ""}»</strong> مطمئن هستید؟ این عملیات
            بازگشت‌پذیر نیست و لوگوی بارگذاری‌شده نیز حذف می‌شود.
          </>
        }
        confirmLabel={isDeleting ? "در حال حذف…" : "حذف حامی"}
      />
    </div>
  );
}
