"use client";

import React, { useMemo } from "react";

import { toPersianDigits } from "@/lib/utils";
import { SEARCH_SORTS, SEARCH_SORT_LABELS, type SearchFilterValues, type SearchOptions } from "@/lib/panel-search-shared";
import { UrlFilterBar, type UrlFilterField } from "@/components/panel/search/UrlFilterBar";

interface SearchFiltersProps {
  filters: SearchFilterValues;
  options: SearchOptions;
  total: number;
}

const DEFAULTS: SearchFilterValues = {
  q: "",
  brand: "",
  carType: "",
  saleTerm: "",
  color: "",
  yearFrom: "",
  yearTo: "",
  sort: "newest",
};

const SORTS = SEARCH_SORTS.map((sort) => ({ value: sort, label: SEARCH_SORT_LABELS[sort] }));

/** Search controls of the sale-ad tab. */
export function SearchFilters({ filters, options, total }: SearchFiltersProps) {
  const fields = useMemo<UrlFilterField[]>(() => {
    const years = options.years.map((year) => ({ value: year, label: toPersianDigits(year) }));
    const list = (items: { id: string; name: string }[]) => items.map((item) => ({ value: item.id, label: item.name }));
    return [
      { key: "brand", label: "برند", emptyLabel: "همه برندها", options: list(options.brands), chip: (label) => `برند: ${label}` },
      { key: "carType", label: "نوع خودرو", emptyLabel: "همه انواع", options: list(options.carTypes), chip: (label) => `نوع: ${label}` },
      { key: "saleTerm", label: "شرایط فروش", emptyLabel: "همه شرایط", options: list(options.saleTerms), chip: (label) => `شرایط: ${label}` },
      { key: "color", label: "رنگ", emptyLabel: "همه رنگ‌ها", options: list(options.colors), chip: (label) => `رنگ: ${label}` },
      { key: "yearFrom", label: "از سال ساخت", emptyLabel: "بدون محدودیت", options: years, chip: (label) => `از سال ${label}` },
      { key: "yearTo", label: "تا سال ساخت", emptyLabel: "بدون محدودیت", options: years, chip: (label) => `تا سال ${label}` },
    ];
  }, [options]);

  // A stable object, so the bar only resyncs its local state when the URL changes.
  const values = useMemo(() => ({ ...filters }), [filters]);

  return (
    <UrlFilterBar
      values={values}
      defaults={{ ...DEFAULTS }}
      fields={fields}
      sorts={SORTS}
      placeholder="جستجو بر اساس نام خودرو، مدل، برند، کد آگهی یا کد فروشنده…"
      total={total}
      totalLabel="آگهی تایید‌شده"
      ariaLabel="جستجو و فیلتر آگهی‌ها"
    />
  );
}
