"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import { ChevronDown, Eye, Plus, Search, UsersRound } from "lucide-react";

import { TeamTable } from "@/components/admin/team/TeamTable";
import { TeamMemberFormModal } from "@/components/admin/team/TeamMemberFormModal";
import { TeamSection } from "@/components/panel/about/TeamSection";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { deleteTeamMemberAction, reorderTeamMembersAction, toggleTeamMemberActiveAction } from "@/app/admin/(panel)/team/actions";
import type { TeamMemberRecord } from "@/lib/team";
import { toPersianDigits } from "@/lib/utils";

type ModalState = { mode: "create" } | { mode: "edit"; member: TeamMemberRecord } | null;

function byDisplayOrder(a: TeamMemberRecord, b: TeamMemberRecord): number {
  return a.sortOrder - b.sortOrder || Number(BigInt(a.id) - BigInt(b.id));
}

/** Full CRUD + ordering for the Khodroyab team, with a live preview of the About-page section. */
export function TeamManager({ initialMembers }: { initialMembers: TeamMemberRecord[] }) {
  const [members, setMembers] = useState<TeamMemberRecord[]>(() => [...initialMembers].sort(byDisplayOrder));
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamMemberRecord | null>(null);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [isDeleting, startDeleteTransition] = useTransition();
  const [, startToggleTransition] = useTransition();
  const [isReordering, startReorderTransition] = useTransition();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      normalizedQuery
        ? members.filter(
            (member) => member.name.toLowerCase().includes(normalizedQuery) || member.position.toLowerCase().includes(normalizedQuery)
          )
        : members,
    [members, normalizedQuery]
  );
  const active = useMemo(() => members.filter((member) => member.isActive), [members]);
  const nextOrder = members.reduce((max, member) => Math.max(max, member.sortOrder), 0) + 1;

  function showToast(kind: ToastState["kind"], message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }

  function upsertRecord(record: TeamMemberRecord) {
    setMembers((prev) => [...prev.filter((item) => item.id !== record.id), record].sort(byDisplayOrder));
  }

  function handleSaved(record: TeamMemberRecord, created: boolean) {
    upsertRecord(record);
    setModal(null);
    showToast("success", created ? `«${record.name}» به تیم اضافه شد.` : `اطلاعات «${record.name}» به‌روزرسانی شد.`);
  }

  function handleToggleActive(member: TeamMemberRecord) {
    if (pendingToggleId) return;
    setPendingToggleId(member.id);
    upsertRecord({ ...member, isActive: !member.isActive });

    startToggleTransition(async () => {
      const result = await toggleTeamMemberActiveAction(member.id);
      setPendingToggleId(null);
      if (result.ok) {
        upsertRecord(result.record);
        showToast("success", result.record.isActive ? `«${result.record.name}» در صفحه درباره ما نمایش داده می‌شود.` : `«${result.record.name}» مخفی شد.`);
      } else {
        upsertRecord(member);
        showToast("error", result.message);
      }
    });
  }

  function handleMove(member: TeamMemberRecord, direction: -1 | 1) {
    const index = members.findIndex((item) => item.id === member.id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= members.length) return;

    const previous = members;
    const reordered = [...members];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setMembers(reordered.map((item, position) => ({ ...item, sortOrder: position + 1 })));

    startReorderTransition(async () => {
      const result = await reorderTeamMembersAction(reordered.map((item) => item.id));
      if (result.ok) {
        setMembers(result.records);
      } else {
        setMembers(previous);
        showToast("error", result.message);
      }
    });
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startDeleteTransition(async () => {
      const result = await deleteTeamMemberAction(target.id);
      setDeleteTarget(null);
      if (result.ok) {
        setMembers((prev) => prev.filter((member) => member.id !== target.id));
        showToast("success", `«${target.name}» از تیم حذف شد.`);
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
            <UsersRound className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">تیم خودرویاب</h1>
            <p className="mt-0.5 text-xs text-[#8B93A1]">
              {toPersianDigits(members.length)} عضو ثبت شده · {toPersianDigits(active.length)} عضو در صفحه درباره ما
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModal({ mode: "create" })}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 hover:shadow-[0_0_36px_rgba(255,106,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50"
        >
          <Plus className="h-[18px] w-[18px]" />
          عضو جدید
        </button>
      </div>

      {/* Search */}
      {members.length > 0 && (
        <div className="group relative w-full max-w-md">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#5E6672] transition-colors group-focus-within:text-[#FF8A2A]">
            <Search className="h-[18px] w-[18px]" />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام یا سمت…"
            aria-label="جستجوی عضو تیم"
            className="h-11 w-full rounded-xl border border-white/[0.12] bg-[#07090C] pl-4 pr-12 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] hover:border-white/20 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
        </div>
      )}

      {filtered.length > 0 ? (
        <TeamTable
          members={filtered}
          canReorder={!normalizedQuery}
          onMove={handleMove}
          onEdit={(member) => setModal({ mode: "edit", member })}
          onDelete={(member) => setDeleteTarget(member)}
          onToggleActive={handleToggleActive}
          busy={isReordering}
          isPendingToggle={pendingToggleId}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/[0.1] bg-[#0A0D12] py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#07090C] text-[#42505F]">
            <UsersRound className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#F5F5F5]">{members.length === 0 ? "هنوز عضوی ثبت نشده است" : "عضوی مطابق جستجو یافت نشد"}</p>
            <p className="mt-1 text-xs text-[#5E6672]">
              {members.length === 0 ? "اعضای تیم بعد از متن «درباره خودرویاب» به ترتیب نمایش داده می‌شوند" : "عبارت دیگری را امتحان کنید"}
            </p>
          </div>
          {members.length === 0 && (
            <button
              type="button"
              onClick={() => setModal({ mode: "create" })}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-5 text-sm font-bold text-[#FF8A2A] transition-colors hover:bg-[#FF6A00]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50"
            >
              <Plus className="h-[18px] w-[18px]" />
              افزودن اولین عضو
            </button>
          )}
        </div>
      )}

      {/* Live preview of the About-page section */}
      {active.length > 0 && (
        <details className="group/preview overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0A0D12]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2 text-xs font-bold text-[#D2D7DF]">
              <Eye className="h-4 w-4 text-[#FF8A2A]" />
              پیش‌نمایش بخش تیم در صفحه درباره ما
            </span>
            <span className="flex items-center gap-2 text-[11px] text-[#5E6672]">
              فقط اعضای فعال، به ترتیب نمایش
              <ChevronDown className="h-4 w-4 transition-transform group-open/preview:rotate-180" />
            </span>
          </summary>
          <div className="border-t border-white/[0.06] bg-[#07090C] px-3 py-8 sm:px-6">
            <TeamSection members={active} />
          </div>
        </details>
      )}

      {modal && (
        <TeamMemberFormModal
          key={modal.mode === "edit" ? `edit-${modal.member.id}` : "create"}
          mode={modal.mode}
          member={modal.mode === "edit" ? modal.member : null}
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
        title="حذف عضو تیم"
        message={
          <>
            آیا از حذف <strong className="text-[#F5F5F5]">«{deleteTarget?.name ?? ""}»</strong> از تیم مطمئن هستید؟ این عملیات بازگشت‌پذیر
            نیست و عکس بارگذاری‌شده نیز حذف می‌شود.
          </>
        }
        confirmLabel={isDeleting ? "در حال حذف…" : "حذف عضو"}
      />
    </div>
  );
}
