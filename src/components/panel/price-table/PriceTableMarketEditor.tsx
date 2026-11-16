"use client";

import React, { useCallback, useState } from "react";
import { Info, Table2 } from "lucide-react";

import { MyPriceTableManager } from "@/components/panel/price-table/MyPriceTableManager";
import { PriceMarketTabs } from "@/components/panel/price-list/PriceMarketTabs";
import type { SavePriceTableResult } from "@/app/panel/(app)/price-table/actions";
import type { ColorRecord } from "@/lib/colors";
import type { PriceTableCarRecord, PriceTableEntryRecord } from "@/lib/price-table";
import type { PriceTablePriceField } from "@/lib/price-table-shared";
import { PRICE_MARKETS, PRICE_MARKET_LABELS, PRICE_MARKET_PARAM, PRICE_MARKET_TITLES, type PriceMarket } from "@/lib/price-market";
import { toPersianDigits } from "@/lib/utils";

interface PriceTableMarketEditorProps {
  cars: PriceTableCarRecord[];
  colors: ColorRecord[];
  /** Saved rows of each price list. */
  entriesByMarket: Record<PriceMarket, PriceTableEntryRecord[]>;
  priceFields: readonly PriceTablePriceField[];
  /** Tab opened first (from `?market=`). */
  initialMarket: PriceMarket;
  /** Page heading, e.g. «لیست قیمت من». */
  title: string;
  /** Saves one list; omitted = the signed-in customer's own lists. */
  saveActions?: Record<PriceMarket, (formData: FormData) => Promise<SavePriceTableResult>>;
  successMessage?: string;
  /** Rendered between the heading and the tabs (e.g. the admin's user badge). */
  aside?: React.ReactNode;
}

/**
 * A price table split into its two separate lists, free zone and national
 * plate, as tabs. Both editors stay mounted, so unsaved edits survive a tab
 * switch (the tab shows a dot); each list is saved on its own. The URL
 * follows the open tab (`?market=national`).
 */
export function PriceTableMarketEditor({
  cars,
  colors,
  entriesByMarket,
  priceFields,
  initialMarket,
  title,
  saveActions,
  successMessage,
  aside,
}: PriceTableMarketEditorProps) {
  const [market, setMarket] = useState<PriceMarket>(initialMarket);
  const [dirty, setDirty] = useState<Record<PriceMarket, boolean>>({ free_zone: false, national: false });
  const [filled, setFilled] = useState<Record<PriceMarket, number>>({
    free_zone: entriesByMarket.free_zone.length,
    national: entriesByMarket.national.length,
  });
  const onFilled = {
    free_zone: useCallback((value: number) => setFilled((prev) => (prev.free_zone === value ? prev : { ...prev, free_zone: value })), []),
    national: useCallback((value: number) => setFilled((prev) => (prev.national === value ? prev : { ...prev, national: value })), []),
  };
  const onDirty = {
    free_zone: useCallback((value: boolean) => setDirty((prev) => (prev.free_zone === value ? prev : { ...prev, free_zone: value })), []),
    national: useCallback((value: boolean) => setDirty((prev) => (prev.national === value ? prev : { ...prev, national: value })), []),
  };

  function select(next: PriceMarket) {
    setMarket(next);
    const url = new URL(window.location.href);
    if (next === "free_zone") url.searchParams.delete(PRICE_MARKET_PARAM);
    else url.searchParams.set(PRICE_MARKET_PARAM, next);
    window.history.replaceState(window.history.state, "", url.toString());
  }

  const panelId = (item: PriceMarket) => `price-table-panel-${item}`;

  return (
    <div className="space-y-5">
      <div className="admin-animate-in flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black text-panel-text sm:text-2xl">
            <Table2 className="h-5 w-5 text-panel-accent" />
            {title}
          </h1>
          <p className="mt-1 flex items-start gap-1.5 text-xs leading-6 text-panel-muted sm:text-sm">
            <Info className="mt-1 h-3.5 w-3.5 shrink-0 text-panel-accent" />
            قیمت‌های منطقه آزاد و پلاک ملی کاملاً جدا هستند؛ هر خودرو را می‌توانید فقط در یکی یا در هر دو قیمت‌گذاری کنید. هر تب جداگانه ذخیره می‌شود.
          </p>
        </div>
        {aside}
      </div>

      <PriceMarketTabs
        active={market}
        onSelect={select}
        panelIdFor={panelId}
        label="لیست قیمت منطقه آزاد یا پلاک ملی"
        className="admin-animate-in sm:max-w-xl"
        badges={Object.fromEntries(
          PRICE_MARKETS.map((item) => [
            item,
            {
              dirty: dirty[item],
              caption: dirty[item]
                ? "تغییرات ذخیره‌نشده"
                : `${toPersianDigits(filled[item])} خودرو با قیمت`,
            },
          ])
        )}
      />

      {PRICE_MARKETS.map((item) => (
        <section
          key={item}
          id={panelId(item)}
          role="tabpanel"
          aria-labelledby={`market-tab-${item}`}
          aria-label={PRICE_MARKET_LABELS[item]}
          hidden={item !== market}
        >
          <MyPriceTableManager
            market={item}
            embedded
            cars={cars}
            colors={colors}
            initialEntries={entriesByMarket[item]}
            priceFields={priceFields}
            saveAction={saveActions?.[item]}
            title={PRICE_MARKET_TITLES[item]}
            successMessage={successMessage ? `${successMessage} (${PRICE_MARKET_LABELS[item]})` : `لیست قیمت ${PRICE_MARKET_LABELS[item]} ذخیره شد`}
            onDirtyChange={onDirty[item]}
            onFilledChange={onFilled[item]}
          />
        </section>
      ))}
    </div>
  );
}
