"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Pencil, Trash2 } from "lucide-react";

import { deleteBuyAdAction, setBuyAdActiveAction } from "@/app/panel/(app)/ads/buy/actions";
import { cn } from "@/lib/utils";

interface BuyAdOwnerActionsProps {
  id: string;
  isActive: boolean;
  /** Verified collaborator: may change the ad. Otherwise nothing is rendered. */
  canEdit: boolean;
  /** `card`: compact row on the list; `detail`: full-width block on the ad page. */
  variant?: "card" | "detail";
  /** Where to go after deleting (the detail page no longer exists then). */
  afterDeleteHref?: string;
}

/** Edit, pause/resume and delete of one of the user's own buy ads. */
export function BuyAdOwnerActions({ id, isActive, canEdit, variant = "card", afterDeleteHref }: BuyAdOwnerActionsProps) {
  const router = useRouter();
  const [active, setActive] = useState(isActive);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [togglePending, startToggle] = useTransition();
  const [deletePending, startDelete] = useTransition();
  const busy = togglePending || deletePending;

  useEffect(() => setActive(isActive), [isActive]);

  useEffect(() => {
    if (!confirming) return;
    const timer = window.setTimeout(() => setConfirming(false), 5000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  if (!canEdit) return null;

  function toggle() {
    const next = !active;
    setActive(next);
    setError(null);
    startToggle(async () => {
      const result = await setBuyAdActiveAction(id, next);
      if (!result.ok) {
        setActive(!next);
        setError(result.message);
        return;
      }
      router.refresh();
    });
  }

  function remove() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setError(null);
    startDelete(async () => {
      const result = await deleteBuyAdAction(id);
      if (!result.ok) {
        setConfirming(false);
        setError(result.message);
        return;
      }
      if (afterDeleteHref) router.replace(afterDeleteHref);
      router.refresh();
    });
  }

  const isDetail = variant === "detail";

  return (
    <div className={cn("relative z-[2] space-y-2", isDetail && "space-y-3")}>
      <div className={cn("flex items-center gap-2", isDetail && "flex-col items-stretch")}>
        {/* Visibility switch */}
        <button
          type="button"
          role="switch"
          aria-checked={active}
          onClick={toggle}
          disabled={busy}
          className={cn(
            "inline-flex min-w-0 items-center gap-2.5 rounded-xl border px-3 text-start transition-colors disabled:opacity-60",
            isDetail ? "h-12 w-full justify-between" : "h-9 flex-1",
            active
              ? "border-emerald-500/30 bg-emerald-500/[0.07] hover:border-emerald-500/50"
              : "border-panel-line/[0.1] bg-panel-line/[0.03] hover:border-panel-line/20"
          )}
        >
          <span className={cn("truncate font-bold", isDetail ? "text-sm" : "text-[11px]", active ? "text-panel-success" : "text-panel-muted")}>
            {togglePending ? "در حال ذخیره…" : active ? "نمایش در جستجو" : "متوقف‌شده"}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-300",
              active ? "bg-emerald-500" : "bg-panel-line/[0.18]"
            )}
          >
            <span
              className={cn(
                "absolute h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                active ? "end-0.5" : "end-[1.125rem]"
              )}
            />
          </span>
        </button>

        <div className={cn("flex items-center gap-2", isDetail && "grid grid-cols-2")}>
          <Link
            href={`/panel/ads/buy/${id}/edit`}
            aria-disabled={busy}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-xl border border-panel-line/[0.1] bg-panel-line/[0.03] font-bold text-panel-text-2 transition-colors hover:border-[#FF6A00]/40 hover:text-panel-text",
              isDetail ? "h-11 text-sm" : "h-9 px-3 text-[11px]",
              busy && "pointer-events-none opacity-60"
            )}
          >
            <Pencil className="h-3.5 w-3.5" />
            ویرایش
          </Link>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            aria-label={confirming ? "تایید حذف آگهی خرید" : "حذف آگهی خرید"}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-xl border font-bold transition-all disabled:opacity-60",
              isDetail ? "h-11 text-sm" : "h-9 px-3 text-[11px]",
              confirming
                ? "border-red-500/60 bg-red-500 text-white shadow-[0_0_20px_-4px_rgba(239,68,68,0.6)]"
                : "border-panel-line/[0.1] bg-panel-line/[0.03] text-panel-muted hover:border-red-500/40 hover:bg-red-500/10 hover:text-panel-danger-2"
            )}
          >
            {deletePending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            {confirming ? "مطمئنید؟ حذف" : isDetail ? "حذف آگهی" : <span className="sr-only sm:not-sr-only">حذف</span>}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-[11px] font-semibold text-panel-danger-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
