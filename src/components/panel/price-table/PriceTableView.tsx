import React from "react";
import { CalendarDays } from "lucide-react";

import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import type { PriceTableEntryRecord, PriceTableRow, PriceTableTierRecord } from "@/lib/price-table";
import { PRICE_TABLE_PRICE_FIELDS } from "@/lib/price-table-shared";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";
import { PRICE_TABLE_EMPTY, formatUsd } from "@/components/panel/price-table/price-table-format";

interface PriceTableViewProps {
  rows: PriceTableRow[];
  className?: string;
}

const headClass = "whitespace-nowrap px-3 py-3 text-right text-[11px] font-extrabold uppercase tracking-wider text-panel-muted";

/** Colour of a tier with its swatch. */
function TierColor({ tier, className }: { tier: PriceTableTierRecord | null; className?: string }) {
  if (!tier) return <span className={cn("text-panel-faint", className)}>{PRICE_TABLE_EMPTY}</span>;
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-panel-text-2", className)}>
      <ColorSwatch code={tier.colorCode} className="h-3.5 w-3.5" />
      {tier.colorName}
    </span>
  );
}

function PriceBadge({ price, size = "md" }: { price: string | null | undefined; size?: "sm" | "md" }) {
  if (!price) return <span className="text-panel-faint">{PRICE_TABLE_EMPTY}</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-lg border border-[#FF6A00]/25 bg-[#FF6A00]/[0.08] font-extrabold tabular-nums text-panel-accent",
        size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-[13px]"
      )}
    >
      {size === "sm" ? `${formatPersianNumber(price)}$` : formatUsd(price)}
    </span>
  );
}

/** The production year of a tier as a compact pill. */
export function YearPill({ year, className }: { year: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-panel-line/[0.12] bg-panel-bg/70 px-2 py-1 font-mono text-[12px] font-black text-panel-text",
        className
      )}
    >
      <CalendarDays className="h-3 w-3 text-panel-accent" />
      {toPersianDigits(year)}
    </span>
  );
}

/** Tiers to render for a row: the saved ones, or a single blank placeholder tier. */
function tiersOf(entry: PriceTableEntryRecord | null): (PriceTableTierRecord | null)[] {
  return entry && entry.tiers.length > 0 ? entry.tiers : [null];
}

const tierKey = (tier: PriceTableTierRecord | null) => (tier ? `${tier.year}:${tier.colorId}` : "empty");

/**
 * Read-only price table (as shown on a seller's public profile). Every
 * eligible car is listed; a priced car shows one line per (year, colour) the
 * seller entered, with the raw / clearance / instant price. Gaps show "---".
 *
 * Desktop (`md+`): one `<tbody>` per car, the car cell spanning its lines so
 * the price columns stay aligned. Phones: one card per car.
 */
export function PriceTableView({ rows, className }: PriceTableViewProps) {
  return (
    <div className={className}>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-panel-line/[0.1] bg-panel-surface md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-panel-line/[0.1] bg-panel-surface-2/60">
              <th scope="col" className={cn(headClass, "hidden w-12 text-center lg:table-cell")}>
                #
              </th>
              <th scope="col" className={cn(headClass, "ps-4")}>
                نام خودرو
              </th>
              <th scope="col" className={headClass}>
                سال ساخت
              </th>
              <th scope="col" className={headClass}>
                رنگ
              </th>
              {PRICE_TABLE_PRICE_FIELDS.map((field) => (
                <th key={field.key} scope="col" className={headClass}>
                  {field.label} (دلار)
                </th>
              ))}
            </tr>
          </thead>
          {rows.map((row, index) => {
            const filled = row.entry !== null;
            const tiers = tiersOf(row.entry);
            return (
              <tbody
                key={row.car.id}
                className={cn("border-b border-panel-line/[0.06] transition-colors last:border-b-0", filled ? "hover:bg-panel-line/[0.025]" : "text-panel-faint")}
              >
                {tiers.map((tier, tierIndex) => (
                  <tr key={tierKey(tier)} className={cn(tierIndex > 0 && "border-t border-dashed border-panel-line/[0.07]")}>
                    {tierIndex === 0 && (
                      <>
                        <td rowSpan={tiers.length} className="hidden px-3 py-3 text-center align-top font-mono text-[11px] text-panel-faint lg:table-cell">
                          {toPersianDigits(index + 1)}
                        </td>
                        <td rowSpan={tiers.length} className="px-3 py-3 ps-4 align-top">
                          <p className={cn("break-words text-sm font-bold leading-5", filled ? "text-panel-text" : "text-panel-muted")}>{row.car.name}</p>
                          <p className="mt-0.5 text-[11px] leading-4 text-panel-faint">
                            {row.car.brandName} · مدل {toPersianDigits(row.car.model)}
                          </p>
                          {tiers.length > 1 && (
                            <span className="mt-1.5 inline-flex rounded-md bg-[#FF6A00]/10 px-1.5 py-0.5 text-[10px] font-bold text-panel-accent">
                              {toPersianDigits(tiers.length)} قیمت
                            </span>
                          )}
                        </td>
                      </>
                    )}
                    <td className="whitespace-nowrap px-3 py-2.5">
                      {tier ? <YearPill year={tier.year} /> : <span className="text-panel-faint">{PRICE_TABLE_EMPTY}</span>}
                    </td>
                    <td className="px-3 py-2.5 text-[13px]">
                      <TierColor tier={tier} />
                    </td>
                    {PRICE_TABLE_PRICE_FIELDS.map((field) => (
                      <td key={field.key} className="px-3 py-2.5">
                        <PriceBadge price={tier?.[field.key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            );
          })}
        </table>
      </div>

      {/* Phone cards */}
      <div className="space-y-2.5 md:hidden">
        {rows.map((row) => {
          const filled = row.entry !== null;
          return (
            <article
              key={row.car.id}
              className={cn("overflow-hidden rounded-2xl border bg-panel-surface", filled ? "border-panel-line/[0.1]" : "border-dashed border-panel-line/[0.1]")}
            >
              <div className="px-3.5 py-3">
                <p className={cn("break-words text-[13px] font-bold leading-5", filled ? "text-panel-text" : "text-panel-muted")}>{row.car.name}</p>
                <p className="mt-0.5 text-[10px] leading-4 text-panel-faint">
                  {row.car.brandName} · مدل {toPersianDigits(row.car.model)}
                </p>
              </div>

              {filled ? (
                <div className="divide-y divide-dashed divide-panel-line/[0.08] border-t border-panel-line/[0.08] bg-panel-bg/40">
                  {row.entry!.tiers.map((tier) => (
                    <div key={tierKey(tier)} className="space-y-2 px-3 py-2.5">
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <YearPill year={tier.year} className="text-[11px]" />
                        <TierColor tier={tier} />
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {PRICE_TABLE_PRICE_FIELDS.map((field) => (
                          <div key={field.key} className="min-w-0 rounded-lg bg-panel-surface/70 px-1.5 py-1.5 text-center">
                            <p className="truncate text-[9px] font-extrabold text-panel-muted">{field.label.replace("قیمت ", "")}</p>
                            <div className="mt-1 flex justify-center">
                              <PriceBadge price={tier[field.key]} size="sm" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="border-t border-dashed border-panel-line/[0.08] px-3.5 py-2 text-[11px] text-panel-faint">قیمتی ثبت نشده است</p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
