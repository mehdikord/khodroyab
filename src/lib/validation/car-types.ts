import { z } from "zod";

/**
 * Normalize a string into a safe, URL-friendly slug.
 * - Latin letters, digits and Persian/Arabic letters are preserved.
 * - Runs of other characters become a single hyphen.
 * - Leading/trailing hyphens are removed.
 * - Result is lower-cased and capped at 64 characters.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip Latin combining diacritics
    .toLowerCase()
    // Keep A–Z, 0–9 and the Persian/Arabic scripts; collapse rest to "-".
    .replace(
      /[^a-z0-9\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF]+/g,
      "-"
    )
    .replace(/^-+|-+$/g, "") // trim leading/trailing hyphens
    .replace(/-{2,}/g, "-") // collapse internal runs
    .slice(0, 64);
}

/** Fallback slug generator when slugify yields an empty string. */
export function fallbackSlug(): string {
  return `car-type-${Date.now()}`;
}

/** Determine final slug from user input or auto-generate from the name. */
export function resolveSlug(slug: string, name: string): string {
  const candidate = slug.trim();
  if (candidate) {
    return slugify(candidate);
  }
  const fromName = slugify(name.trim());
  return fromName || fallbackSlug();
}

/**
 * Core Zod schema for car type form values.
 */
const carTypeCoreSchema = z.object({
  name: z
    .string({ error: "نام نوع خودرو الزامی است" })
    .trim()
    .min(1, { error: "نام نوع خودرو الزامی است" })
    .max(255, { error: "نام نوع خودرو حداکثر ۲۵۵ کاراکتر می‌تواند باشد" }),
  slug: z
    .string()
    .trim()
    .max(255, { error: "اسلاگ حداکثر ۲۵۵ کاراکتر می‌تواند باشد" })
    .optional(),
  description: z
    .string()
    .trim()
    .max(255, { error: "توضیحات حداکثر ۲۵۵ کاراکتر می‌تواند باشد" })
    .optional(),
});

/** Shape of the validated form values returned by parseCarTypeForm. */
export interface CarTypeFormValues {
  name: string;
  slug: string;
  description: string;
}

/** Successful parse result containing validated values. */
export interface ParsedCarTypeFormSuccess {
  success: true;
  data: CarTypeFormValues;
}

/** Failed parse result with field-level errors. */
export interface ParsedCarTypeFormFailure {
  success: false;
  fieldErrors: Record<string, string>;
  message: string;
}

/** Discriminated union for the parser result. */
export type ParsedCarTypeForm =
  | ParsedCarTypeFormSuccess
  | ParsedCarTypeFormFailure;

/**
 * Parse a FormData payload from a car type create/update action.
 */
export function parseCarTypeForm(formData: FormData): ParsedCarTypeForm {
  const rawName = formData.get("name");
  const rawSlug = formData.get("slug");
  const rawDescription = formData.get("description");

  const parseResult = carTypeCoreSchema.safeParse({
    name: rawName,
    slug: rawSlug,
    description: rawDescription,
  });

  if (!parseResult.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parseResult.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) {
        fieldErrors[path] = issue.message;
      }
    }
    return {
      success: false,
      fieldErrors,
      message: "اطلاعات فرم نامعتبر است",
    };
  }

  const slug = resolveSlug(
    (parseResult.data.slug || "").trim(),
    parseResult.data.name.trim()
  );

  return {
    success: true,
    data: {
      name: parseResult.data.name.trim(),
      slug,
      description: parseResult.data.description?.trim() || "",
    },
  };
}
