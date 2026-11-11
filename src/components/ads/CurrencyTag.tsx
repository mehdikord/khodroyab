import React from "react";

import { currencyLabel, type PriceCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

/** Small "ریال" / "دلار" label shown next to a price. */
export function CurrencyTag({ currency, className }: { currency: PriceCurrency | null | undefined; className?: string }) {
  return <span className={cn("ms-1 align-middle text-[0.7em] font-semibold opacity-70", className)}>{currencyLabel(currency)}</span>;
}

export default CurrencyTag;
