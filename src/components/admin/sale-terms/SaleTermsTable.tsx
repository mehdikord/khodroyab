"use client";

import React from "react";
import { Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/admin/ui/Badge";
import type { SaleTermRecord } from "@/lib/sale-terms";
import { toPersianDigits } from "@/lib/utils";

interface SaleTermsTableProps {
  terms: SaleTermRecord[];
  onEdit: (term: SaleTermRecord) => void;
  onDelete: (term: SaleTermRecord) => void;
  isDeleting?: string | null;
}

export function SaleTermsTable({
  terms,
  onEdit,
  onDelete,
  isDeleting,
}: SaleTermsTableProps) {
  if (terms.length === 0) return null;

  return (
    <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07]">
      <table className="w-full text-sm text-right">
        <thead>
          <tr className="border-b border-white/[0.07] bg-[#0A0D12]">
            <th scope="col" className="px-6 py-4 font-bold text-[#8B93A1] uppercase tracking-wider">
              شرط فروش
            </th>
            <th scope="col" className="px-6 py-4 font-bold text-[#8B93A1] uppercase tracking-wider">
              توضیحات
            </th>
            <th scope="col" className="px-6 py-4 text-center font-bold text-[#8B93A1] uppercase tracking-wider">
              وضعیت
            </th>
            <th scope="col" className="px-6 py-4 text-center font-bold text-[#8B93A1] uppercase tracking-wider">
              تاریخ ایجاد
            </th>
            <th scope="col" className="px-6 py-4 text-left font-bold text-[#8B93A1] uppercase tracking-wider">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {terms.map((term) => (
            <tr key={term.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.1] bg-[#07090C]">
                    {term.image ? (
                      <img
                        src={term.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-[#42505F]" />
                    )}
                  </div>
                  <span className="font-semibold text-[#F5F5F5]">{term.title}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-[#D2D7DF] max-w-[300px] truncate">
                {term.description || "-"}
              </td>
              <td className="px-6 py-4 text-center">
                <Badge tone={term.isActive ? "success" : "error"}>
                  {term.isActive ? "فعال" : "غیرفعال"}
                </Badge>
              </td>
              <td className="px-6 py-4 text-center font-mono text-[11px] text-[#8B93A1]">
                {toPersianDigits(new Date(term.createdAt).toLocaleDateString("fa-IR"))}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onEdit(term)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-[#FF6A00]/40 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A]"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(term)}
                    disabled={isDeleting === term.id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
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
