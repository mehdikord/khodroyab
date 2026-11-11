import React from "react";
import { Car, HeartHandshake, MapPinned, Megaphone, Table2, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ADMIN_PERMISSIONS, ADMIN_PERMISSION_META, type AdminPermission } from "@/lib/auth/permissions";
import { cn } from "@/lib/utils";

export const PERMISSION_ICONS: Record<AdminPermission, LucideIcon> = {
  users: Users,
  sponsors: HeartHandshake,
  branches: MapPinned,
  cars: Car,
  ads: Megaphone,
  price_table: Table2,
};

interface PermissionChipsProps {
  permissions: readonly AdminPermission[];
  /** Show every section, dimming the ones not granted (matrix look). */
  showAll?: boolean;
  size?: "sm" | "md";
}

/** Compact list of the sections a role grants. */
export function PermissionChips({ permissions, showAll = false, size = "md" }: PermissionChipsProps) {
  const list = showAll ? ADMIN_PERMISSIONS : ADMIN_PERMISSIONS.filter((p) => permissions.includes(p));

  if (list.length === 0) {
    return <span className="text-[11px] text-[#5E6672]">بدون دسترسی</span>;
  }

  return (
    <ul className="flex flex-wrap gap-1.5">
      {list.map((permission) => {
        const granted = permissions.includes(permission);
        const Icon = PERMISSION_ICONS[permission];
        return (
          <li
            key={permission}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border font-bold",
              size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
              granted
                ? "border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FFB37A]"
                : "border-white/[0.06] bg-white/[0.02] text-[#4A525E] line-through decoration-white/20"
            )}
          >
            <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
            {ADMIN_PERMISSION_META[permission].label}
          </li>
        );
      })}
    </ul>
  );
}
