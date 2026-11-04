import React from "react";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ProfileSectionProps {
  icon: LucideIcon;
  title: string;
  /** Short note under the title. */
  description?: string;
  /** Small pill next to the title (a count or a status badge). */
  badge?: React.ReactNode;
  /** Primary "manage" link of the section. */
  action?: { href: string; label: string };
  /** Free-form controls in place of (or next to) `action`. */
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * Compact card shared by every section of the admin's user profile page, so new
 * sections can be added without the page growing heavy: a one-line header
 * (icon, title, badge, manage link) above the section's own content.
 */
export function ProfileSection({ icon: Icon, title, description, badge, action, actions, className, children }: ProfileSectionProps) {
  return (
    <section className={cn("admin-animate-in flex flex-col rounded-2xl border border-white/[0.07] bg-[#0D1117] p-4", className)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#FF6A00]/25 bg-[#FF6A00]/10 text-[#FF8A2A]">
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-sm font-extrabold text-[#F5F5F5]">{title}</h3>
              {badge}
            </div>
            {description && <p className="truncate text-[11px] text-[#5E6672]">{description}</p>}
          </div>
        </div>
        {(action || actions) && (
          <div className="flex flex-wrap items-center gap-2">
            {actions}
            {action && (
              <Link
                href={action.href}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-3 text-xs font-bold text-[#FF8A2A] transition-colors hover:bg-[#FF6A00]/20"
              >
                {action.label}
                <ArrowUpLeft className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>
      {children}
    </section>
  );
}

/** Count pill used as a section `badge`. */
export function CountPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/[0.1] bg-white/[0.04] px-2 py-0.5 text-[10px] font-bold text-[#9BA3AE]">
      {children}
    </span>
  );
}

/** Dashed placeholder for a section with nothing to show yet. */
export function SectionEmpty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.1] bg-[#07090C]/60 px-4 py-6 text-center">
      <p className="text-xs font-bold text-[#D2D7DF]">{title}</p>
      {hint && <p className="mt-1 text-[11px] leading-5 text-[#5E6672]">{hint}</p>}
    </div>
  );
}
