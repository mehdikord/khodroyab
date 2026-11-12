import React from "react";
import Link from "next/link";
import { BadgeCheck, ExternalLink } from "lucide-react";

import type { AdminBuyAdPerson } from "@/lib/admin-buy-ads-shared";
import { cn } from "@/lib/utils";

/** Avatar of a buyer or bidder: their photo, or the first letter of their name. */
export function PersonAvatar({ person, size = "md" }: { person: AdminBuyAdPerson; size?: "md" | "lg" }) {
  return (
    <span
      className={cn(
        "shrink-0 overflow-hidden rounded-xl border border-white/[0.1] bg-[#07090C]",
        size === "lg" ? "h-14 w-14" : "h-10 w-10"
      )}
    >
      {person.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={person.image} alt={person.name} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <span className={cn("flex h-full w-full items-center justify-center font-bold text-[#5E6672]", size === "lg" ? "text-lg" : "text-sm")}>
          {person.name.trim().charAt(0) || "?"}
        </span>
      )}
    </span>
  );
}

/** Name, company, phone and public code of a buyer or bidder, linking to their admin profile. */
export function PersonCell({ person, showCode = true }: { person: AdminBuyAdPerson; showCode?: boolean }) {
  return (
    <Link href={`/admin/users/${person.id}`} className="group flex min-w-0 items-center gap-2.5" title="پروفایل کاربر">
      <PersonAvatar person={person} />
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-sm font-semibold text-[#F5F5F5] group-hover:text-[#FF8A2A]">
          <span className="truncate">{person.name}</span>
          {person.isVerified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-label="احراز هویت شده" />}
          <ExternalLink className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
        {person.companyName && <span className="block truncate text-[11px] text-[#9BA3AE]">{person.companyName}</span>}
        <span className="flex flex-wrap items-center gap-x-2 text-[11px] text-[#8B93A1]">
          <span dir="ltr" className="font-mono">
            {person.phone}
          </span>
          {showCode && person.code && (
            <span dir="ltr" className="rounded border border-white/[0.08] bg-[#07090C] px-1 font-mono text-[10px] tracking-[0.12em] text-[#FF8A2A]">
              {person.code}
            </span>
          )}
        </span>
      </span>
    </Link>
  );
}
