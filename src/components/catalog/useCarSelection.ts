"use client";

import { useEffect, useMemo, useState } from "react";

import type { SearchableSelectOption } from "@/components/admin/ui/SearchableSelect";
import type { BrandChoice, CarChoice, CarChoicePage } from "@/lib/catalog-shared";
import { toPersianDigits } from "@/lib/utils";

/**
 * Lazy catalogue loading for brand → car pickers. Only the cars of the chosen
 * brand are requested (and cached for a minute), never the whole table.
 */

const CACHE_TTL_MS = 60_000;
const brandCarsCache = new Map<string, { at: number; promise: Promise<CarChoice[]> }>();

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal, credentials: "same-origin", headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`catalog request failed (${response.status})`);
  return (await response.json()) as T;
}

/** Every car of one brand (cached). */
export function fetchBrandCars(brandId: string): Promise<CarChoice[]> {
  const cached = brandCarsCache.get(brandId);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.promise;
  const promise = getJson<{ items: CarChoice[] }>(`/api/catalog/cars?all=1&brand=${encodeURIComponent(brandId)}`).then(
    (body) => body.items
  );
  brandCarsCache.set(brandId, { at: Date.now(), promise });
  promise.catch(() => brandCarsCache.delete(brandId));
  return promise;
}

/** One page of a catalogue search. */
export function fetchCarPage(
  params: { q?: string; brandId?: string; page?: number; size?: number },
  signal?: AbortSignal
): Promise<CarChoicePage> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.brandId) search.set("brand", params.brandId);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  if (params.size) search.set("size", String(params.size));
  return getJson<CarChoicePage>(`/api/catalog/cars?${search.toString()}`, signal);
}

/** Cars of `brandId`, loaded on demand. */
export function useBrandCars(brandId: string) {
  const [state, setState] = useState<{ brandId: string; cars: CarChoice[]; error: string | null }>({
    brandId: "",
    cars: [],
    error: null,
  });

  useEffect(() => {
    if (!brandId) return;
    let cancelled = false;
    fetchBrandCars(brandId).then(
      (cars) => !cancelled && setState({ brandId, cars, error: null }),
      () => !cancelled && setState({ brandId, cars: [], error: "بارگذاری خودروها ناموفق بود؛ دوباره تلاش کنید." })
    );
    return () => {
      cancelled = true;
    };
  }, [brandId]);

  const ready = state.brandId === brandId;
  return {
    cars: brandId && ready ? state.cars : [],
    loading: Boolean(brandId) && !ready,
    error: ready ? state.error : null,
  };
}

export function carOptionOf(car: CarChoice, withBrand = false): SearchableSelectOption {
  return {
    value: car.id,
    label: withBrand ? `${car.brandName} ${car.name}` : car.name,
    description: `${car.carTypeName} · مدل ${toPersianDigits(car.model)}`,
    keywords: `${car.model} ${car.slug}`,
  };
}

export function brandOptionsOf(brands: BrandChoice[]): SearchableSelectOption[] {
  return brands.map((brand) => ({
    value: brand.id,
    label: brand.name,
    description: `${toPersianDigits(brand.carCount)} خودرو`,
  }));
}

/**
 * State for a brand select plus a dependent car select. `initialCar` (e.g. the
 * car an ad already uses) is shown right away, before its brand's cars load.
 */
export function useCarSelection(brands: BrandChoice[], initialCar: CarChoice | null) {
  const [brandId, setBrandId] = useState(initialCar?.brandId ?? "");
  const [carId, setCarId] = useState(initialCar?.id ?? "");
  const { cars, loading, error } = useBrandCars(brandId);

  const brandOptions = useMemo(() => {
    const options = brandOptionsOf(brands);
    if (initialCar && !brands.some((brand) => brand.id === initialCar.brandId)) {
      options.unshift({ value: initialCar.brandId, label: initialCar.brandName });
    }
    return options;
  }, [brands, initialCar]);

  const carList = useMemo(() => {
    if (initialCar && initialCar.brandId === brandId && !cars.some((car) => car.id === initialCar.id)) {
      return [initialCar, ...cars];
    }
    return cars;
  }, [cars, initialCar, brandId]);

  const carOptions = useMemo(() => carList.map((car) => carOptionOf(car)), [carList]);
  const selectedCar = carList.find((car) => car.id === carId) ?? null;

  function selectBrand(next: string) {
    setBrandId(next);
    setCarId(""); // the previous car no longer belongs to the chosen brand
  }

  return {
    brandId,
    carId,
    selectBrand,
    selectCar: setCarId,
    brandOptions,
    carOptions,
    selectedCar,
    carsLoading: loading,
    carsError: error,
    noBrands: brandOptions.length === 0,
  };
}
