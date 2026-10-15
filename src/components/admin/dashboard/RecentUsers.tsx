import React from "react";
import Link from "next/link";
import { Users } from "lucide-react";

import type { DashboardRecentUser } from "@/lib/dashboard";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";
import { DashboardEmpty } from "@/components/admin/dashboard/DashboardCard";

interface RecentUsersProps {
  users: DashboardRecentUser[];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 1);
  return parts[0].slice(0, 1) + parts[1].slice(0, 1);
}

/** Most recently registered users. */
export function RecentUsers({ users }: RecentUsersProps) {
  if (users.length === 0) {
    return <DashboardEmpty icon={Users} text="هنوز کاربری ثبت نشده است." />;
  }

  return (
    <ul className="-my-1 divide-y divide-white/[0.05]">
      {users.map((user) => (
        <li key={user.id}>
          <Link
            href={`/admin/users/${user.id}`}
            className="group flex items-center gap-3 py-2.5 transition-colors"
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/[0.08] bg-[#12161D] text-xs font-bold text-[#9BA3AE]">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" className="h-full w-full object-cover" loading="lazy" />
              ) : (
                initials(user.name)
              )}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "-ms-5 mt-6 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-[#0D1117]",
                user.isActive ? "bg-emerald-400" : "bg-[#5E6672]"
              )}
            />
            <div className="min-w-0 flex-1 ps-1">
              <p className="truncate text-xs font-bold text-[#F5F5F5] transition-colors group-hover:text-[#FF8A2A]">
                {user.name}
              </p>
              <p dir="ltr" className="mt-0.5 truncate text-start font-mono text-[10px] text-[#8B93A1]">
                {toPersianDigits(user.phone)}
              </p>
            </div>
            <div className="shrink-0 text-end">
              <p className="text-[11px] font-bold text-[#D2D7DF]">{formatPersianNumber(user.adsCount)} آگهی</p>
              <p className="mt-0.5 text-[10px] text-[#5E6672]">{user.createdAtLabel}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
