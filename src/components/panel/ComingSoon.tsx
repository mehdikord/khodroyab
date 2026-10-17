import React from "react";
import type { LucideIcon } from "lucide-react";

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Placeholder body for panel modules that land in a later phase. */
export function ComingSoon({ icon: Icon, title, description }: ComingSoonProps) {
  return (
    <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center">
      <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
          <Icon className="h-7 w-7" />
        </span>
        <p className="mt-5 text-base font-extrabold text-panel-text">{title}</p>
        <p className="mt-2 text-xs leading-6 text-panel-muted-2">{description}</p>
      </div>
    </div>
  );
}
