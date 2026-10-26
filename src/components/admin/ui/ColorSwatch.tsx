import React from "react";

import { cn } from "@/lib/utils";

interface ColorSwatchProps {
  code: string;
  className?: string;
}

/** Small round preview of a hex colour; the ring keeps white/black visible on any theme. */
export function ColorSwatch({ code, className }: ColorSwatchProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block h-4 w-4 shrink-0 rounded-full ring-1 ring-inset ring-gray-500/50", className)}
      style={{ backgroundColor: code }}
    />
  );
}
