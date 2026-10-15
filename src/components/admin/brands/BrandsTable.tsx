"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";

import { Badge } from "@/components/admin/ui/Badge";
import { Toggle } from "@/components/admin/ui/Toggle";
import type { BrandRecord } from "@/lib/brands";
import { toPersianDigits } from "@/lib/utils";

interface BrandsTableProps {
  brands: BrandRecord[];
  onEdit: (brand: BrandRecord) => void;
  onDelete: (brand: BrandRecord) => void;
  onToggleActive: (brand: BrandRecord) => void;
  isDeleting?: string | null;
  isPendingToggle?: string | null;
}

/** RTL data table with brand thumbnail, name/slug, status toggle, and actions. */
export function BrandsTable({
  brands,
  onEdit,
  onDelete,
  onToggleActive,
  isDeleting,
  isPendingToggle,
}: BrandsTableProps) {
  if (brands.length === 0) return null;

  return (
    <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.07] bg-[#0A0D12]">
            <th
              scope="col"
              className="sticky right-0 pr-5 py-4 text-right font-bold text-[#8B93A1] uppercase tracking-wider [&:last-child]:pl-5"
            >
              برند
            </th>
            <th
              scope="col"
              className="px-4 py-4 text-right font-bold text-[#8B93A1] uppercase tracking-wider"
            >
              وضعیت
            </th>
            <th
              scope="col"
              className="px-4 py-4 text-right font-bold text-[#8B93A1] uppercase tracking-wider hidden lg:table-cell"
            >
              تاریخ ایجاد
            </th>
            <th
              scope="col"
              className="pl-5 py-4 text-left font-bold text-[#8B93A1] uppercase tracking-wider"
            >
              عملیات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {brands.map((brand) => (
            <tr
              key={brand.id}
              className="hover:bg-white/[0.02] transition-colors"
            >
              {/* Brand column */}
              <td className="pr-5 py-4">
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.1] bg-[#07090C]">
                    {brand.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={brand.image}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center text-xs font-bold text-[#5E6672]"
                        style={{
                          background: `hsl(${brand.name
                            .split("")
                            .reduce((a, c) => a + c.charCodeAt(0), 0) %
                            360}, 60%, 18%)`,
                        }}
                      >
                        {brand.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Name + slug */}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#F5F5F5]">
                      {brand.name}
                    </p>
                    <p className="truncate font-mono text-[11px] text-[#5E6672]">
                      {brand.slug}
                    </p>
                  </div>
                </div>
              </td>

              {/* Status column */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Badge tone={brand.isActive ? "success" : "error"}>
                    {brand.isActive ? "فعال" : "غیرفعال"}
                  </Badge>
                  <Toggle
                    checked={brand.isActive}
                    onCheckedChange={() => onToggleActive(brand)}
                    label="تغییر وضعیت فعال‌سازی"
                    disabled={isPendingToggle === brand.id}
                    id={`toggle-${brand.id}`}
                  />
                </div>
              </td>

              {/* Created at */}
              <td className="px-4 py-4 text-right hidden lg:table-cell font-mono text-[11px] text-[#8B93A1]">
                {toPersianDigits(
                  new Intl.DateTimeFormat("fa-IR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }).format(new Date(brand.createdAt))
                )}
              </td>

              {/* Actions */}
              <td className="pl-5 py-4">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(brand)}
                    aria-label={`ویرایش برند ${brand.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0A0D12] text-[#8B93A1] transition-colors hover:border-[#FF6A00]/50 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(brand)}
                    disabled={isDeleting === brand.id}
                    aria-label={`حذف برند ${brand.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0A0D12] text-[#8B93A1] transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 disabled:cursor-not-allowed disabled:opacity-50"
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