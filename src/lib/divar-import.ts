import "server-only";

import { readFile, stat } from "node:fs/promises";
import path from "node:path";

import { slugify } from "@/lib/validation/car-types";

/**
 * Importer for the brand/car tree exported from Divar (`data/cars.json`).
 *
 * The file is a tree: ROOT → brands → cars, where a car may itself have
 * children (trims/variants), nested several levels deep. Our catalogue only
 * has Brand → Car, so every node under a brand — parents and all of their
 * descendants — is flattened into a car of that brand.
 */

export const DIVAR_DATA_PATH = path.join(process.cwd(), "data", "cars.json");

interface DivarNode {
  data?: {
    key?: unknown;
    title?: unknown;
    icon?: { image_url_light?: unknown } | null;
  };
  children?: unknown;
}

export interface DivarCar {
  name: string;
  /** English name from Divar, stored in `Car.model`. */
  model: string;
  slug: string;
}

export interface DivarBrand {
  key: string;
  name: string;
  slug: string;
  image: string | null;
  cars: DivarCar[];
}

/**
 * Canonical form used to decide whether two names are "the same": folds
 * Arabic/Persian letter and digit variants, drops ZWNJ, spaces and
 * punctuation, and lower-cases.
 */
export function normalizeName(input: string): string {
  return input
    .normalize("NFKC")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .toLowerCase()
    .replace(/[\s‌‍‎‏\-_.,()]+/g, "");
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function childrenOf(node: DivarNode): DivarNode[] {
  return Array.isArray(node.children) ? (node.children as DivarNode[]) : [];
}

/** Divar suffixes some duplicate keys with "-normal"; it carries no meaning. */
function cleanKey(key: string): string {
  return key.replace(/-normal$/i, "").trim();
}

function parseTree(raw: unknown): DivarBrand[] {
  const root = (raw as { options?: DivarNode } | null)?.options;
  if (!root) throw new Error("ساختار فایل اطلاعات دیوار نامعتبر است");

  const brands: DivarBrand[] = [];
  const seenBrands = new Set<string>();

  for (const brandNode of childrenOf(root)) {
    const key = text(brandNode.data?.key);
    const name = text(brandNode.data?.title);
    if (!key || !name) continue;

    const brandNorm = normalizeName(name);
    if (seenBrands.has(brandNorm)) continue;
    seenBrands.add(brandNorm);

    const cars: DivarCar[] = [];
    const seenCars = new Set<string>();
    // Depth-first walk so a parent is followed by its own variants.
    const stack = [...childrenOf(brandNode)].reverse();
    while (stack.length > 0) {
      const node = stack.pop()!;
      const carName = text(node.data?.title);
      const carKey = cleanKey(text(node.data?.key));
      if (carName && carKey) {
        const norm = normalizeName(carName);
        if (!seenCars.has(norm)) {
          seenCars.add(norm);
          cars.push({
            name: carName.slice(0, 255),
            model: carKey.slice(0, 255),
            slug: slugify(carKey) || slugify(carName) || "car",
          });
        }
      }
      stack.push(...[...childrenOf(node)].reverse());
    }

    const image = text(brandNode.data?.icon?.image_url_light);
    brands.push({
      key,
      name: name.slice(0, 255),
      slug: slugify(key) || slugify(name) || "brand",
      image: image.startsWith("https://") ? image.slice(0, 255) : null,
      cars,
    });
  }

  return brands;
}

let cache: { mtimeMs: number; brands: DivarBrand[] } | null = null;

/** Parsed brand list from `data/cars.json`, cached until the file changes. */
export async function loadDivarBrands(): Promise<DivarBrand[]> {
  const info = await stat(DIVAR_DATA_PATH);
  if (cache && cache.mtimeMs === info.mtimeMs) return cache.brands;
  const content = await readFile(DIVAR_DATA_PATH, "utf8");
  const brands = parseTree(JSON.parse(content));
  cache = { mtimeMs: info.mtimeMs, brands };
  return brands;
}

export interface ExistingBrandRef {
  id: bigint;
  name: string;
  slug: string;
}

/** Find a catalogue brand matching a Divar brand by name or slug. */
export function matchBrand<T extends ExistingBrandRef>(
  brand: DivarBrand,
  existing: T[]
): T | undefined {
  const norm = normalizeName(brand.name);
  return existing.find(
    (item) =>
      normalizeName(item.name) === norm ||
      (item.slug !== "" && item.slug.toLowerCase() === brand.slug)
  );
}

export interface CarTypeRef {
  id: bigint;
  name: string;
}

/**
 * Pick a car type for a Divar car: a type whose name appears in the car's
 * name (e.g. "کوپه", "هاچ بک"), otherwise the default chosen by the admin.
 */
export function resolveCarTypeId(
  carName: string,
  carTypes: CarTypeRef[],
  defaultId: bigint
): bigint {
  const norm = normalizeName(carName);
  for (const type of carTypes) {
    const typeNorm = normalizeName(type.name);
    if (typeNorm.length >= 3 && norm.includes(typeNorm)) return type.id;
  }
  return defaultId;
}
