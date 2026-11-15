"use client";

import React from "react";
import { Loader2 } from "lucide-react";

import {
  PURCHASE_REQUEST_STATUSES,
  PURCHASE_REQUEST_STATUS_LABELS,
  PURCHASE_REQUEST_STATUS_TONES,
  type PurchaseRequestStatus,
} from "@/lib/purchase-requests-shared";
import { cn } from "@/lib/utils";

export function PurchaseRequestStatusBadge({ status, className }: { status: PurchaseRequestStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-lg border px-2 py-1 text-[11px] font-extrabold", PURCHASE_REQUEST_STATUS_TONES[status], className)}>
      {PURCHASE_REQUEST_STATUS_LABELS[status]}
    </span>
  );
}

/** Compact select that changes a request's status (styled with the status colours). */
export function PurchaseRequestStatusSelect({
  value,
  onChange,
  busy,
  className,
  label = "وضعیت درخواست",
}: {
  value: PurchaseRequestStatus;
  onChange: (status: PurchaseRequestStatus) => void;
  busy?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <span className={cn("relative inline-flex", className)}>
      <select
        aria-label={label}
        value={value}
        disabled={busy}
        onChange={(event) => onChange(event.target.value as PurchaseRequestStatus)}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "h-9 w-full cursor-pointer appearance-none rounded-lg border bg-[#07090C] pe-7 ps-2.5 text-xs font-extrabold outline-none transition-all focus:ring-2 focus:ring-[#FF6A00]/30 disabled:cursor-wait disabled:opacity-60",
          PURCHASE_REQUEST_STATUS_TONES[value]
        )}
      >
        {PURCHASE_REQUEST_STATUSES.map((status) => (
          <option key={status} value={status} className="bg-[#0D1117] text-[#F5F5F5]">
            {PURCHASE_REQUEST_STATUS_LABELS[status]}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 end-2 flex items-center text-current opacity-70">
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span className="text-[9px]">▼</span>}
      </span>
    </span>
  );
}
