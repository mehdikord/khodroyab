"use client";

import React from "react";
import { ChevronDown, ChevronUp, Edit2, Trash2 } from "lucide-react";

import { Badge } from "@/components/admin/ui/Badge";
import { Toggle } from "@/components/admin/ui/Toggle";
import type { SponsorRecord } from "@/lib/sponsors";
import { cn, toPersianDigits } from "@/lib/utils";

interface SponsorsTableProps {
  sponsors: SponsorRecord[];
  /** Reordering is only offered on the full, unfiltered list. */
  canReorder: boolean;
  onMove: (sponsor: SponsorRecord, direction: -1 | 1) => void;
  onEdit: (sponsor: SponsorRecord) => void;
  onDelete: (sponsor: SponsorRecord) => void;
  onToggleActive: (sponsor: SponsorRecord) => void;
  busy?: boolean;
  isPendingToggle?: string | null;
}

const moveButtonClass =
  "inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-[#07090C] text-[#8B93A1] transition-colors hover:border-[#FF6A00]/50 hover:text-[#FF8A2A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-30";

/** Sponsors in display order: position + move arrows, logo/name, status toggle, actions. */
export function SponsorsTable({ sponsors, canReorder, onMove, onEdit, onDelete, onToggleActive, busy, isPendingToggle }: SponsorsTableProps) {
  if (sponsors.length === 0) return null;

  return (
    <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.07] bg-[#0A0D12]">
            <th scope="col" className="w-28 py-4 pr-5 text-right font-bold uppercase tracking-wider text-[#8B93A1]">
              ترتیب
            </th>
            <th scope="col" className="px-4 py-4 text-right font-bold uppercase tracking-wider text-[#8B93A1]">
              حامی
            </th>
            <th scope="col" className="px-4 py-4 text-right font-bold uppercase tracking-wider text-[#8B93A1]">
              وضعیت
            </th>
            <th scope="col" className="py-4 pl-5 text-left font-bold uppercase tracking-wider text-[#8B93A1]">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {sponsors.map((sponsor, index) => (
            <tr key={sponsor.id} className={cn("transition-colors hover:bg-white/[0.02]", !sponsor.isActive && "opacity-60")}>
              <td className="py-4 pr-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#FF6A00]/25 bg-[#FF6A00]/10 px-1.5 font-mono text-xs font-black text-[#FF8A2A]">
                    {toPersianDigits(sponsor.sortOrder)}
                  </span>
                  {canReorder && (
                    <span className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => onMove(sponsor, -1)}
                        disabled={busy || index === 0}
                        aria-label={`انتقال ${sponsor.name} به بالا`}
                        className={moveButtonClass}
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMove(sponsor, 1)}
                        disabled={busy || index === sponsors.length - 1}
                        aria-label={`انتقال ${sponsor.name} به پایین`}
                        className={moveButtonClass}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  )}
                </div>
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.1] bg-white p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sponsor.logo} alt="" className="h-full w-full object-contain" loading="lazy" />
                  </div>
                  <p className="min-w-0 truncate font-semibold text-[#F5F5F5]">{sponsor.name}</p>
                </div>
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Badge tone={sponsor.isActive ? "success" : "error"}>{sponsor.isActive ? "فعال" : "غیرفعال"}</Badge>
                  <Toggle
                    checked={sponsor.isActive}
                    onCheckedChange={() => onToggleActive(sponsor)}
                    label="تغییر وضعیت نمایش حامی"
                    disabled={isPendingToggle === sponsor.id}
                    id={`sponsor-toggle-${sponsor.id}`}
                  />
                </div>
              </td>

              <td className="py-4 pl-5">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(sponsor)}
                    aria-label={`ویرایش ${sponsor.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0A0D12] text-[#8B93A1] transition-colors hover:border-[#FF6A00]/50 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(sponsor)}
                    aria-label={`حذف ${sponsor.name}`}
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
