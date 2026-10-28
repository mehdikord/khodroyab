import { z } from "zod";

import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/lib/validation/brands";
import { normalizeDigits } from "@/lib/validation/admin";

export const SPONSOR_NAME_MAX_LENGTH = 120;
export const SPONSOR_SORT_ORDER_MAX = 9999;

/** Logo URL: absolute http(s) URL or a local path starting with "/". */
function isValidLogoUrl(value: string): boolean {
  if (!value) return true;
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const sponsorSchema = z.object({
  name: z
    .string({ error: "نام حامی الزامی است" })
    .trim()
    .min(1, { error: "نام حامی الزامی است" })
    .max(SPONSOR_NAME_MAX_LENGTH, { error: `نام حامی حداکثر ${SPONSOR_NAME_MAX_LENGTH} کاراکتر است` }),
  logo: z.string().trim().max(1024, { error: "آدرس لوگو طولانی است" }).refine(isValidLogoUrl, { error: "آدرس لوگو نامعتبر است" }),
  /** "" = let the server pick (end of the list). */
  sortOrder: z
    .string()
    .transform((value) => normalizeDigits(value))
    .refine((value) => value === "" || (/^\d+$/.test(value) && Number(value) <= SPONSOR_SORT_ORDER_MAX), {
      error: `ترتیب نمایش باید عددی بین ۰ تا ${SPONSOR_SORT_ORDER_MAX} باشد`,
    }),
  isActive: z.boolean(),
});

export interface SponsorFormValues {
  name: string;
  /** Logo URL/path typed by the admin ("" when a file is uploaded or the logo is cleared). */
  logo: string;
  /** `null` = append to the end of the list. */
  sortOrder: number | null;
  isActive: boolean;
}

export type ParsedSponsorForm =
  | { success: true; data: SponsorFormValues; file: File | null }
  | { success: false; message: string; fieldErrors: Record<string, string> };

/** Parse the sponsor create/edit form (fields: name, logo, sortOrder, isActive, logoFile). */
export function parseSponsorForm(formData: FormData): ParsedSponsorForm {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  const rawActive = formData.get("isActive");

  const result = sponsorSchema.safeParse({
    name: read("name"),
    logo: read("logo"),
    sortOrder: read("sortOrder"),
    isActive: rawActive === "true" || rawActive === "on" || rawActive === "1",
  });

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, message: "اطلاعات فرم نامعتبر است", fieldErrors };
  }

  const file = formData.get("logoFile");
  const upload = file instanceof File && file.size > 0 ? file : null;
  if (upload) {
    if (!(ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(upload.type)) {
      return {
        success: false,
        message: "فرمت فایل لوگو پشتیبانی نمی‌شود",
        fieldErrors: { logoFile: "فرمت فایل لوگو پشتیبانی نمی‌شود (PNG, JPG, WebP, AVIF)" },
      };
    }
    if (upload.size > MAX_IMAGE_SIZE_BYTES) {
      return { success: false, message: "حجم لوگو بیش از حد مجاز است", fieldErrors: { logoFile: "حجم لوگو نباید بیشتر از ۲ مگابایت باشد" } };
    }
  }

  return {
    success: true,
    data: {
      name: result.data.name,
      logo: result.data.logo,
      sortOrder: result.data.sortOrder === "" ? null : Number(result.data.sortOrder),
      isActive: result.data.isActive,
    },
    file: upload,
  };
}
