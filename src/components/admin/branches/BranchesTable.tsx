"use client";

import React from "react";
import { ChevronDown, ChevronUp, Edit2, ExternalLink, MapPin, Phone, Trash2, UserRound } from "lucide-react";

import { Badge } from "@/components/admin/ui/Badge";
import { Toggle } from "@/components/admin/ui/Toggle";
import type { BranchRecord } from "@/lib/branches";
import { cn, toPersianDigits } from "@/lib/utils";

interface BranchesTableProps {
  branches: BranchRecord[];
  /** Reordering is only offered on the full, unfiltered list. */
  canReorder: boolean;
  onMove: (branch: BranchRecord, direction: -1 | 1) => void;
  onEdit: (branch: BranchRecord) => void;
  onDelete: (branch: BranchRecord) => void;
  onToggleActive: (branch: BranchRecord) => void;
  busy?: boolean;
  isPendingToggle?: string | null;
}

const moveButtonClass =
  "inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-[#07090C] text-[#8B93A1] transition-colors hover:border-[#FF6A00]/50 hover:text-[#FF8A2A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-30";

const headClass = "px-4 py-4 text-right font-bold uppercase tracking-wider text-[#8B93A1] whitespace-nowrap";

/** Branches in display order: position + move arrows, title/place, manager/phone, map link, status, actions. */
export function BranchesTable({ branches, canReorder, onMove, onEdit, onDelete, onToggleActive, busy, isPendingToggle }: BranchesTableProps) {
  if (branches.length === 0) return null;

  return (
    <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07]">
      <table className="w-full min-w-[860px] text-sm">
        <thead>
          <tr className="border-b border-white/[0.07] bg-[#0A0D12]">
            <th scope="col" className={cn(headClass, "w-28 pr-5")}>
              ترتیب
            </th>
            <th scope="col" className={headClass}>
              شعبه
            </th>
            <th scope="col" className={headClass}>
              مدیر و تماس
            </th>
            <th scope="col" className={headClass}>
              موقعیت
            </th>
            <th scope="col" className={headClass}>
              وضعیت
            </th>
            <th scope="col" className="py-4 pl-5 text-left font-bold uppercase tracking-wider text-[#8B93A1]">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {branches.map((branch, index) => (
            <tr key={branch.id} className={cn("transition-colors hover:bg-white/[0.02]", !branch.isActive && "opacity-60")}>
              <td className="py-4 pr-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#FF6A00]/25 bg-[#FF6A00]/10 px-1.5 font-mono text-xs font-black text-[#FF8A2A]">
                    {toPersianDigits(branch.sortOrder)}
                  </span>
                  {canReorder && (
                    <span className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => onMove(branch, -1)}
                        disabled={busy || index === 0}
                        aria-label={`انتقال ${branch.title} به بالا`}
                        className={moveButtonClass}
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMove(branch, 1)}
                        disabled={busy || index === branches.length - 1}
                        aria-label={`انتقال ${branch.title} به پایین`}
                        className={moveButtonClass}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  )}
                </div>
              </td>

              <td className="px-4 py-4">
                <p className="max-w-[260px] truncate font-bold text-[#F5F5F5]">{branch.title}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-[#8B93A1]">
                  <MapPin className="h-3.5 w-3.5 text-[#FF8A2A]" />
                  {branch.provinceName}، {branch.cityName}
                </p>
              </td>

              <td className="px-4 py-4">
                <p className="flex items-center gap-1.5 text-[13px] text-[#D2D7DF]">
                  <UserRound className="h-3.5 w-3.5 text-[#5E6672]" />
                  {branch.managerName}
                </p>
                <p dir="ltr" className="mt-1 flex items-center justify-end gap-1.5 font-mono text-xs text-[#8B93A1]">
                  {toPersianDigits(branch.phone)}
                  <Phone className="h-3.5 w-3.5 text-[#5E6672]" />
                </p>
              </td>

              <td className="px-4 py-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-[#07090C] px-2.5 py-1.5 font-mono text-[11px] text-[#8B93A1] transition-colors hover:border-[#FF6A00]/40 hover:text-[#FF8A2A]"
                  dir="ltr"
                >
                  {branch.latitude.toFixed(4)}, {branch.longitude.toFixed(4)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Badge tone={branch.isActive ? "success" : "error"}>{branch.isActive ? "فعال" : "غیرفعال"}</Badge>
                  <Toggle
                    checked={branch.isActive}
                    onCheckedChange={() => onToggleActive(branch)}
                    label="تغییر وضعیت نمایش شعبه"
                    disabled={isPendingToggle === branch.id}
                    id={`branch-toggle-${branch.id}`}
                  />
                </div>
              </td>

              <td className="py-4 pl-5">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(branch)}
                    aria-label={`ویرایش ${branch.title}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0A0D12] text-[#8B93A1] transition-colors hover:border-[#FF6A00]/50 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(branch)}
                    aria-label={`حذف ${branch.title}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0A0D12] text-[#8B93A1] transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
