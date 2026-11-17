"use client";

import React from "react";
import { ChevronDown, ChevronUp, Edit2, Trash2 } from "lucide-react";

import { Badge } from "@/components/admin/ui/Badge";
import { Toggle } from "@/components/admin/ui/Toggle";
import type { TeamMemberRecord } from "@/lib/team";
import { cn, toPersianDigits } from "@/lib/utils";

interface TeamTableProps {
  members: TeamMemberRecord[];
  /** Reordering is only offered on the full, unfiltered list. */
  canReorder: boolean;
  onMove: (member: TeamMemberRecord, direction: -1 | 1) => void;
  onEdit: (member: TeamMemberRecord) => void;
  onDelete: (member: TeamMemberRecord) => void;
  onToggleActive: (member: TeamMemberRecord) => void;
  busy?: boolean;
  isPendingToggle?: string | null;
}

const moveButtonClass =
  "inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-[#07090C] text-[#8B93A1] transition-colors hover:border-[#FF6A00]/50 hover:text-[#FF8A2A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-30";

/** Team members in display order: position + move arrows, photo/name/role, visibility toggle, actions. */
export function TeamTable({ members, canReorder, onMove, onEdit, onDelete, onToggleActive, busy, isPendingToggle }: TeamTableProps) {
  if (members.length === 0) return null;

  return (
    <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.07] bg-[#0A0D12]">
            <th scope="col" className="w-28 py-4 pr-5 text-right font-bold uppercase tracking-wider text-[#8B93A1]">
              ترتیب
            </th>
            <th scope="col" className="px-4 py-4 text-right font-bold uppercase tracking-wider text-[#8B93A1]">
              عضو تیم
            </th>
            <th scope="col" className="hidden px-4 py-4 text-right font-bold uppercase tracking-wider text-[#8B93A1] lg:table-cell">
              توضیحات
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
          {members.map((member, index) => (
            <tr key={member.id} className={cn("transition-colors hover:bg-white/[0.02]", !member.isActive && "opacity-60")}>
              <td className="py-4 pr-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#FF6A00]/25 bg-[#FF6A00]/10 px-1.5 font-mono text-xs font-black text-[#FF8A2A]">
                    {toPersianDigits(member.sortOrder)}
                  </span>
                  {canReorder && (
                    <span className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => onMove(member, -1)}
                        disabled={busy || index === 0}
                        aria-label={`انتقال ${member.name} به بالا`}
                        className={moveButtonClass}
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMove(member, 1)}
                        disabled={busy || index === members.length - 1}
                        aria-label={`انتقال ${member.name} به پایین`}
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
                  <div className="h-14 w-12 shrink-0 overflow-hidden rounded-xl border border-white/[0.1] bg-[#0A0D12]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={member.photo} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#F5F5F5]">{member.name}</p>
                    <p className="mt-0.5 truncate text-xs text-[#FF8A2A]">{member.position}</p>
                  </div>
                </div>
              </td>

              <td className="hidden max-w-xs px-4 py-4 lg:table-cell">
                {member.bio ? (
                  <p className="line-clamp-2 text-xs leading-6 text-[#8B93A1]">{member.bio}</p>
                ) : (
                  <span className="text-xs text-[#42505F]">—</span>
                )}
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Badge tone={member.isActive ? "success" : "error"}>{member.isActive ? "نمایش" : "مخفی"}</Badge>
                  <Toggle
                    checked={member.isActive}
                    onCheckedChange={() => onToggleActive(member)}
                    label="تغییر وضعیت نمایش عضو تیم"
                    disabled={isPendingToggle === member.id}
                    id={`team-toggle-${member.id}`}
                  />
                </div>
              </td>

              <td className="py-4 pl-5">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(member)}
                    aria-label={`ویرایش ${member.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0A0D12] text-[#8B93A1] transition-colors hover:border-[#FF6A00]/50 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(member)}
                    aria-label={`حذف ${member.name}`}
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
