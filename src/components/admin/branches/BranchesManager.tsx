"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import { MapPinned, Plus, Search } from "lucide-react";

import { BranchesTable } from "@/components/admin/branches/BranchesTable";
import { BranchFormModal } from "@/components/admin/branches/BranchFormModal";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { SearchableSelect } from "@/components/admin/ui/SearchableSelect";
import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { deleteBranchAction, reorderBranchesAction, toggleBranchActiveAction } from "@/app/admin/(panel)/branches/actions";
import type { BranchRecord, ProvinceOption } from "@/lib/branches";
import { toPersianDigits } from "@/lib/utils";

type ModalState = { mode: "create" } | { mode: "edit"; branch: BranchRecord } | null;

interface BranchesManagerProps {
  initialBranches: BranchRecord[];
  provinces: ProvinceOption[];
}

function byDisplayOrder(a: BranchRecord, b: BranchRecord): number {
  return a.sortOrder - b.sortOrder || Number(BigInt(a.id) - BigInt(b.id));
}

/** Fold Arabic yeh/kaf so searches match either keyboard. */
function fold(input: string): string {
  return input.toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک").trim();
}

/** Full CRUD + ordering for branches (listed on the customer Contact page). */
export function BranchesManager({ initialBranches, provinces }: BranchesManagerProps) {
  const [branches, setBranches] = useState<BranchRecord[]>(() => [...initialBranches].sort(byDisplayOrder));
  const [query, setQuery] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<BranchRecord | null>(null);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [isDeleting, startDeleteTransition] = useTransition();
  const [, startToggleTransition] = useTransition();
  const [isReordering, startReorderTransition] = useTransition();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizedQuery = fold(query);
  const filtered = useMemo(
    () =>
      branches.filter(
        (b) =>
          (!provinceFilter || String(b.provinceId) === provinceFilter) &&
          (!normalizedQuery ||
            [b.title, b.managerName, b.cityName, b.provinceName, b.phone].some((field) => fold(field).includes(normalizedQuery)))
      ),
    [branches, normalizedQuery, provinceFilter]
  );
  const activeCount = branches.filter((b) => b.isActive).length;
  const provinceCount = new Set(branches.map((b) => b.provinceId)).size;
  const nextOrder = branches.reduce((max, b) => Math.max(max, b.sortOrder), 0) + 1;

  // Only provinces that have a branch are useful as a filter.
  const filterOptions = useMemo(() => {
    const used = new Set(branches.map((b) => b.provinceId));
    return provinces.filter((p) => used.has(p.id)).map((p) => ({ value: String(p.id), label: p.name }));
  }, [branches, provinces]);

  function showToast(kind: ToastState["kind"], message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }

  function upsertRecord(record: BranchRecord) {
    setBranches((prev) => [...prev.filter((item) => item.id !== record.id), record].sort(byDisplayOrder));
  }

  function handleSaved(record: BranchRecord, created: boolean) {
    upsertRecord(record);
    setModal(null);
    showToast("success", created ? `شعبه «${record.title}» اضافه شد.` : `شعبه «${record.title}» به‌روزرسانی شد.`);
  }

  function handleToggleActive(branch: BranchRecord) {
    if (pendingToggleId) return;
    setPendingToggleId(branch.id);
    upsertRecord({ ...branch, isActive: !branch.isActive });

    startToggleTransition(async () => {
      const result = await toggleBranchActiveAction(branch.id);
      setPendingToggleId(null);
      if (result.ok) {
        upsertRecord(result.record);
        showToast("success", result.record.isActive ? `«${result.record.title}» به کاربران نمایش داده می‌شود.` : `«${result.record.title}» غیرفعال شد.`);
      } else {
        upsertRecord(branch);
        showToast("error", result.message);
      }
    });
  }

  function handleMove(branch: BranchRecord, direction: -1 | 1) {
    const index = branches.findIndex((item) => item.id === branch.id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= branches.length) return;

    const previous = branches;
    const reordered = [...branches];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setBranches(reordered.map((item, position) => ({ ...item, sortOrder: position + 1 })));

    startReorderTransition(async () => {
      const result = await reorderBranchesAction(reordered.map((item) => item.id));
      if (result.ok) {
        setBranches(result.records);
      } else {
        setBranches(previous);
        showToast("error", result.message);
      }
    });
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startDeleteTransition(async () => {
      const result = await deleteBranchAction(target.id);
      setDeleteTarget(null);
      if (result.ok) {
        setBranches((prev) => prev.filter((b) => b.id !== target.id));
        showToast("success", `شعبه «${target.title}» حذف شد.`);
      } else {
        showToast("error", result.message);
      }
    });
  }

  const isFiltered = Boolean(normalizedQuery || provinceFilter);

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
            <MapPinned className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">مدیریت شعبه‌ها</h1>
            <p className="mt-0.5 text-xs text-[#8B93A1]">
              {toPersianDigits(branches.length)} شعبه در {toPersianDigits(provinceCount)} استان · {toPersianDigits(activeCount)} شعبه فعال
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModal({ mode: "create" })}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 hover:shadow-[0_0_36px_rgba(255,106,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50"
        >
          <Plus className="h-[18px] w-[18px]" />
          شعبه جدید
        </button>
      </div>

      {/* Filters */}
      {branches.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="group relative w-full max-w-md">
            <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#5E6672] transition-colors group-focus-within:text-[#FF8A2A]">
              <Search className="h-[18px] w-[18px]" />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی عنوان، مدیر، شهر یا شماره…"
              aria-label="جستجوی شعبه"
              className="h-11 w-full rounded-xl border border-white/[0.12] bg-[#07090C] pl-4 pr-12 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] hover:border-white/20 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
            />
          </div>
          {filterOptions.length > 1 && (
            <div className="w-full sm:w-60">
              <SearchableSelect
                value={provinceFilter}
                onChange={setProvinceFilter}
                options={filterOptions}
                placeholder="همه استان‌ها"
                searchPlaceholder="جستجوی استان…"
                clearable
              />
            </div>
          )}
        </div>
      )}

      {filtered.length > 0 ? (
        <BranchesTable
          branches={filtered}
          canReorder={!isFiltered}
          onMove={handleMove}
          onEdit={(branch) => setModal({ mode: "edit", branch })}
          onDelete={(branch) => setDeleteTarget(branch)}
          onToggleActive={handleToggleActive}
          busy={isReordering}
          isPendingToggle={pendingToggleId}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/[0.1] bg-[#0A0D12] py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#07090C] text-[#42505F]">
            <MapPinned className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#F5F5F5]">{branches.length === 0 ? "هنوز شعبه‌ای ثبت نشده است" : "شعبه‌ای مطابق جستجو یافت نشد"}</p>
            <p className="mt-1 text-xs text-[#5E6672]">
              {branches.length === 0 ? "شعبه‌های فعال در صفحه «تماس با ما» پنل کاربران روی نقشه نمایش داده می‌شوند" : "عبارت یا استان دیگری را امتحان کنید"}
            </p>
          </div>
          {branches.length === 0 && (
            <button
              type="button"
              onClick={() => setModal({ mode: "create" })}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-5 text-sm font-bold text-[#FF8A2A] transition-colors hover:bg-[#FF6A00]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50"
            >
              <Plus className="h-[18px] w-[18px]" />
              افزودن اولین شعبه
            </button>
          )}
        </div>
      )}

      {modal && (
        <BranchFormModal
          key={modal.mode === "edit" ? `edit-${modal.branch.id}` : "create"}
          mode={modal.mode}
          branch={modal.mode === "edit" ? modal.branch : null}
          provinces={provinces}
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
        title="حذف شعبه"
        message={
          <>
            آیا از حذف شعبه <strong className="text-[#F5F5F5]">«{deleteTarget?.title ?? ""}»</strong> مطمئن هستید؟ این عملیات بازگشت‌پذیر
            نیست.
          </>
        }
        confirmLabel={isDeleting ? "در حال حذف…" : "حذف شعبه"}
      />
    </div>
  );
}
