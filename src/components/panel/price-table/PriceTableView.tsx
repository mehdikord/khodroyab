import React from "react";

import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import type { PriceTableEntryRecord, PriceTableRow } from "@/lib/price-table";
import { PRICE_TABLE_PRICE_FIELDS } from "@/lib/price-table-shared";
import { cn, toPersianDigits } from "@/lib/utils";
import { PRICE_TABLE_EMPTY, formatUsd } from "@/components/panel/price-table/price-table-format";

interface PriceTableViewProps {
  rows: PriceTableRow[];
  className?: string;
}

const headClass = "whitespace-nowrap px-3 py-3 text-right text-[11px] font-extrabold uppercase tracking-wider text-panel-muted sm:px-4";

function ColorCell({ entry }: { entry: PriceTableEntryRecord | null }) {
  if (!entry?.colorName || !entry.colorCode) return <span className="text-panel-faint">{PRICE_TABLE_EMPTY}</span>;
  return (
    <span className="inline-flex items-center gap-1.5 text-panel-text-2">
      <ColorSwatch code={entry.colorCode} className="h-3.5 w-3.5" />
      <span className="break-words">{entry.colorName}</span>
    </span>
  );
}

function PriceBadge({ price }: { price: string | null | undefined }) {
  if (!price) return <span className="text-panel-faint">{PRICE_TABLE_EMPTY}</span>;
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-lg border border-[#FF6A00]/25 bg-[#FF6A00]/[0.08] px-2 py-1 text-[12px] font-extrabold text-panel-accent sm:text-sm">
      {formatUsd(price)}
    </span>
  );
}

/**
 * Read-only price table (as shown on a seller's public profile). Every
 * eligible car is a row; cells the seller has not filled show "---".
 *
 * Desktop: full table with one column per price. Smaller screens: model/year
 * fold into the name cell and the three prices stack in a single labelled
 * cell (the colour also folds in on phones), so no horizontal scrolling.
 */
export function PriceTableView({ rows, className }: PriceTableViewProps) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-panel-line/[0.1] bg-panel-surface", className)}>
      <table className="w-full table-fixed border-collapse text-sm md:table-auto">
        <thead>
          <tr className="border-b border-panel-line/[0.1] bg-panel-surface-2/60">
            <th scope="col" className={cn(headClass, "hidden w-12 text-center lg:table-cell")}>
              #
            </th>
            <th scope="col" className={cn(headClass, "w-[48%] sm:w-[36%] md:w-auto")}>
              نام خودرو
            </th>
            <th scope="col" className={cn(headClass, "hidden lg:table-cell")}>
              مدل
            </th>
            <th scope="col" className={cn(headClass, "hidden lg:table-cell")}>
              سال ساخت
            </th>
            <th scope="col" className={cn(headClass, "hidden sm:table-cell sm:w-[24%] md:w-auto")}>
              رنگ
            </th>
            <th scope="col" className={cn(headClass, "md:hidden")}>
              قیمت‌ها (دلار)
            </th>
            {PRICE_TABLE_PRICE_FIELDS.map((field) => (
              <th key={field.key} scope="col" className={cn(headClass, "hidden md:table-cell")}>
                {field.label} (دلار)
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-panel-line/[0.06]">
          {rows.map((row, index) => {
            const filled = row.entry !== null;
            return (
              <tr key={row.car.id} className={cn("transition-colors", filled ? "hover:bg-panel-line/[0.03]" : "text-panel-faint")}>
                <td className="hidden px-3 py-3 text-center font-mono text-[11px] text-panel-faint lg:table-cell">
                  {toPersianDigits(index + 1)}
                </td>
                <td className="px-3 py-3 align-top sm:px-4 md:align-middle">
                  <p className={cn("break-words text-[13px] font-bold leading-5 sm:text-sm", filled ? "text-panel-text" : "text-panel-muted")}>
                    {row.car.name}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-4 text-panel-faint sm:text-[11px]">{row.car.brandName}</p>
                  <p className="mt-1 text-[10px] leading-4 text-panel-muted-2 lg:hidden">
                    مدل {toPersianDigits(row.car.model)} · سال {toPersianDigits(row.car.year)}
                  </p>
                  <div className="mt-1.5 text-[11px] sm:hidden">
                    <ColorCell entry={row.entry} />
                  </div>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3 text-panel-text-2 lg:table-cell">{toPersianDigits(row.car.model)}</td>
                <td className="hidden whitespace-nowrap px-4 py-3 text-panel-text-2 lg:table-cell">{toPersianDigits(row.car.year)}</td>
                <td className="hidden px-3 py-3 align-top text-[13px] sm:table-cell sm:px-4 sm:text-sm md:align-middle">
                  <ColorCell entry={row.entry} />
                </td>

                {/* Phone/tablet: the three prices stacked with labels */}
                <td className="px-3 py-3 align-top sm:px-4 md:hidden">
                  <dl className="space-y-1.5">
                    {PRICE_TABLE_PRICE_FIELDS.map((field) => (
                      <div key={field.key} className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                        <dt className="text-[10px] font-bold text-panel-muted">{field.label}</dt>
                        <dd>
                          <PriceBadge price={row.entry?.[field.key]} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </td>

                {/* Desktop: one column per price */}
                {PRICE_TABLE_PRICE_FIELDS.map((field) => (
                  <td key={field.key} className="hidden px-3 py-3 sm:px-4 md:table-cell">
                    <PriceBadge price={row.entry?.[field.key]} />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
