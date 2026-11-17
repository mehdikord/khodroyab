/**
 * Client-safe shapes for catalogue pickers. The catalogue is large (thousands
 * of cars), so pickers never receive the whole list: brands come as a light
 * list and cars are fetched per brand or per search page from
 * `/api/catalog/cars`.
 */

export interface BrandChoice {
  id: string;
  name: string;
  /** Cars of the brand (or matching the picker's scope). */
  carCount: number;
}

export interface CarChoice {
  id: string;
  name: string;
  model: string;
  slug: string;
  brandId: string;
  brandName: string;
  carTypeName: string;
  imageUrl: string | null;
}

export interface CarChoicePage {
  items: CarChoice[];
  total: number;
  page: number;
  pageCount: number;
}

/** Cars per page in the card picker (first step of a new ad). */
export const CAR_PICKER_PAGE_SIZE = 24;

/** Upper bound of cars returned for one brand (a select, not a page). */
export const BRAND_CARS_LIMIT = 1000;

/** The car an existing ad uses, as a picker choice (no extra request needed). */
export function carChoiceFromAd(ad: {
  carId: string;
  carName: string;
  carModel: string;
  brandId: string;
  brandName: string;
  carTypeName: string;
  imageUrl?: string | null;
}): CarChoice {
  return {
    id: ad.carId,
    name: ad.carName,
    model: ad.carModel,
    slug: "",
    brandId: ad.brandId,
    brandName: ad.brandName,
    carTypeName: ad.carTypeName,
    imageUrl: ad.imageUrl ?? null,
  };
}

export type PriceTableStatusFilter = "" | "enabled" | "disabled";

/** Filters of the admin price-table screen (also used by its bulk action). */
export interface PriceTableFilters {
  q: string;
  brandId: string;
  status: PriceTableStatusFilter;
}
