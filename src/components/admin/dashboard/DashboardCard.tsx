import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  /** Optional "see all" style link rendered at the end of the header row. */
  action?: { label: string; href: string };
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** Shared surface for every dashboard widget: header row + body. */
export function DashboardCard({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  className,
  bodyClassName,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1117] shadow-card-depth",
        className
      )}
    >
      <header className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-[#FF8A2A]">
              <Icon className="h-[18px] w-[18px]" />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="truncate text-sm font-extrabold text-[#F5F5F5]">{title}</h2>
            {subtitle && <p className="mt-0.5 truncate text-[11px] text-[#8B93A1]">{subtitle}</p>}
          </div>
        </div>
        {action && (
          <Link
            href={action.href}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-[#9BA3AE] transition-colors hover:bg-white/[0.04] hover:text-[#FF8A2A]"
          >
            {action.label}
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        )}
      </header>
      <div className={cn("flex-1 p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/** Empty-state body used by list widgets. */
export function DashboardEmpty({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/[0.1] px-4 py-8 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-[#12161D] text-[#5E6672]">
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-xs leading-6 text-[#8B93A1]">{text}</p>
    </div>
  );
}
