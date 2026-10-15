import { z } from "zod";

/**
 * Allowed MIME types for brand image uploads.
 * SVG is intentionally omitted to prevent XSS via inline SVG.
 */
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
] as const;

export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

/**
 * Normalize a string into a safe, URL-friendly slug.
 * - Latin letters, digits and Persian/Arabic letters are preserved.
 * - Runs of other characters become a single hyphen.
 * - Leading/trailing hyphens are removed.
 * - Result is lower-cased and capped at 64 characters.
 *
 * Uses explicit Unicode ranges (no `u`-flag regex) to stay compatible with
 * the project's ES5 compilation target.
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
  return `brand-${Date.now()}`;
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

/** Validate an image URL: allow https://, http:// or a local path starting with /. */
function isValidImageUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return true; // optional
  if (v.startsWith("/")) return true; // local path like /uploads/brands/...
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Core Zod schema for brand form values (without the file).
 * The file is handled separately because FormData entries for files are not
 * covered by standard field validation.
 */
const brandCoreSchema = z.object({
  name: z
    .string({ error: "نام برند الزامی است" })
    .trim()
    .min(1, { error: "نام برند الزامی است" })
    .max(255, { error: "نام برند حداکثر ۲۵۵ کاراکتر می‌تواند باشد" }),
  slug: z
    .string()
    .trim()
    .max(255, { error: "اسلاگ حداکثر ۲۵۵ کاراکتر می‌تواند باشد" })
    .optional(),
  image: z
    .string()
    .trim()
    .max(1024, { error: "آدرس تصویر طولانی است" })
    .refine(isValidImageUrl, { error: "آدرس تصویر نامعتبر است" })
    .optional(),
  isActive: z.boolean({ error: "وضعیت فعال‌سازی نامعتبر است" }),
});

/** Shape of the validated form values returned by parseBrandForm. */
export interface BrandFormValues {
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
}

/** Successful parse result containing validated values and optional uploaded file. */
export interface ParsedBrandFormSuccess {
  success: true;
  data: BrandFormValues;
  file: File | null;
}

/** Failed parse result with field-level errors. */
export interface ParsedBrandFormFailure {
  success: false;
  fieldErrors: Record<string, string>;
  message: string;
}

/** Discriminated union for the parser result. */
export type ParsedBrandForm =
  | ParsedBrandFormSuccess
  | ParsedBrandFormFailure;

/**
 * Parse a FormData payload from a brand create/update action.
 * Validates text fields, optionally validates and returns the uploaded image file.
 */
export function parseBrandForm(formData: FormData): ParsedBrandForm {
  const rawName = formData.get("name");
  const rawSlug = formData.get("slug");
  const rawImage = formData.get("image");
  const rawActive = formData.get("isActive");
  const file = formData.get("imageFile");

  const parseResult = brandCoreSchema.safeParse({
    name: rawName,
    slug: rawSlug,
    image: rawImage,
    isActive:
      rawActive === "true" || rawActive === "on" || rawActive === "1",
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

  // Validate uploaded file (if present and non-empty)
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as any)) {
      return {
        success: false,
        fieldErrors: {
          imageFile: "فرمت فایل تصویر پشتیبانی نمی‌شود (PNG, JPG, WebP, AVIF)",
        },
        message: "فرمت فایل تصویر پشتیبانی نمی‌شود",
      };
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return {
        success: false,
        fieldErrors: {
          imageFile: "حجم تصویر نباید بیشتر از ۲ مگابایت باشد",
        },
        message: "حجم تصویر بیش از حد مجاز است",
      };
    }
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
      image: parseResult.data.image?.trim() || "",
      isActive: parseResult.data.isActive,
    },
    file: file instanceof File && file.size > 0 ? file : null,
  };
}