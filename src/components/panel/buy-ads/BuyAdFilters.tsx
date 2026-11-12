"use client";

import React, { useMemo } from "react";

import { formatPersianNumber, toPersianDigits } from "@/lib/utils";
import {
  BUY_AD_FILTER_DEFAULTS,
  BUY_AD_MILEAGE_STEPS,
  BUY_AD_SORTS,
  BUY_AD_SORT_LABELS,
  type BuyAdFilterValues,
  type BuyAdSearchOptions,
} from "@/lib/buy-ads-shared";
import { UrlFilterBar, type UrlFilterField } from "@/components/panel/search/UrlFilterBar";

interface BuyAdFiltersProps {
  filters: BuyAdFilterValues;
  options: BuyAdSearchOptions;
  total: number;
}

const SORTS = BUY_AD_SORTS.map((sort) => ({ value: sort, label: BUY_AD_SORT_LABELS[sort] }));

const MILEAGE_OPTIONS = BUY_AD_MILEAGE_STEPS.map((km) => ({
  value: String(km),
  label: km === 0 ? "فقط صفر کیلومتر" : `تا ${formatPersianNumber(km)} کیلومتر`,
}));

/** Search controls of the buy-ad tab. */
export function BuyAdFilters({ filters, options, total }: BuyAdFiltersProps) {
  const fields = useMemo<UrlFilterField[]>(() => {
    const years = options.years.map((year) => ({ value: year, label: toPersianDigits(year) }));
    const list = (items: { id: string; name: string }[]) => items.map((item) => ({ value: item.id, label: item.name }));
    return [
      { key: "brand", label: "برند", emptyLabel: "همه برندها", options: list(options.brands), chip: (label) => `برند: ${label}` },
      { key: "carType", label: "نوع خودرو", emptyLabel: "همه انواع", options: list(options.carTypes), chip: (label) => `نوع: ${label}` },
      { key: "color", label: "رنگ", emptyLabel: "همه رنگ‌ها", options: list(options.colors), chip: (label) => `رنگ: ${label}` },
      { key: "mileageMax", label: "کارکرد", emptyLabel: "بدون محدودیت", options: MILEAGE_OPTIONS, chip: (label) => `کارکرد: ${label}` },
      { key: "yearFrom", label: "از سال ساخت", emptyLabel: "بدون محدودیت", options: years, chip: (label) => `از سال ${label}` },
      { key: "yearTo", label: "تا سال ساخت", emptyLabel: "بدون محدودیت", options: years, chip: (label) => `تا سال ${label}` },
    ];
  }, [options]);

  // A stable object, so the bar only resyncs its local state when the URL changes.
  const values = useMemo(() => ({ ...filters }), [filters]);

  return (
    <UrlFilterBar
      values={values}
      defaults={{ ...BUY_AD_FILTER_DEFAULTS }}
      fields={fields}
      sorts={SORTS}
      placeholder="جستجو بر اساس نام خودرو، برند، رنگ، توضیحات، کد آگهی یا کد خریدار…"
      total={total}
      totalLabel="آگهی خرید فعال"
      ariaLabel="جستجو و فیلتر آگهی‌های خرید"
    />
  );
}
