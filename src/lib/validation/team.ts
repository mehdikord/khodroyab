import { z } from "zod";

import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/lib/validation/brands";
import { normalizeDigits } from "@/lib/validation/admin";

export const TEAM_NAME_MAX_LENGTH = 120;
export const TEAM_POSITION_MAX_LENGTH = 120;
export const TEAM_BIO_MAX_LENGTH = 600;
export const TEAM_SORT_ORDER_MAX = 9999;

/** Photo URL: absolute http(s) URL or a local path starting with "/". */
function isValidPhotoUrl(value: string): boolean {
  if (!value) return true;
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const teamMemberSchema = z.object({
  name: z
    .string({ error: "نام الزامی است" })
    .trim()
    .min(1, { error: "نام الزامی است" })
    .max(TEAM_NAME_MAX_LENGTH, { error: `نام حداکثر ${TEAM_NAME_MAX_LENGTH} کاراکتر است` }),
  position: z
    .string({ error: "سمت در مجموعه الزامی است" })
    .trim()
    .min(1, { error: "سمت در مجموعه الزامی است" })
    .max(TEAM_POSITION_MAX_LENGTH, { error: `سمت حداکثر ${TEAM_POSITION_MAX_LENGTH} کاراکتر است` }),
  bio: z
    .string()
    .transform((value) => value.replace(/\r\n?/g, "\n").trim())
    .refine((value) => value.length <= TEAM_BIO_MAX_LENGTH, { error: `توضیحات حداکثر ${TEAM_BIO_MAX_LENGTH} کاراکتر است` }),
  photo: z.string().trim().max(1024, { error: "آدرس عکس طولانی است" }).refine(isValidPhotoUrl, { error: "آدرس عکس نامعتبر است" }),
  /** "" = let the server pick (end of the list). */
  sortOrder: z
    .string()
    .transform((value) => normalizeDigits(value))
    .refine((value) => value === "" || (/^\d+$/.test(value) && Number(value) <= TEAM_SORT_ORDER_MAX), {
      error: `ترتیب نمایش باید عددی بین ۰ تا ${TEAM_SORT_ORDER_MAX} باشد`,
    }),
  isActive: z.boolean(),
});

export interface TeamMemberFormValues {
  name: string;
  position: string;
  /** `null` when left empty. */
  bio: string | null;
  /** Photo URL/path typed by the admin ("" when a file is uploaded or the photo is cleared). */
  photo: string;
  /** `null` = append to the end of the list. */
  sortOrder: number | null;
  isActive: boolean;
}

export type ParsedTeamMemberForm =
  | { success: true; data: TeamMemberFormValues; file: File | null }
  | { success: false; message: string; fieldErrors: Record<string, string> };

/** Parse the team member create/edit form (fields: name, position, bio, photo, sortOrder, isActive, photoFile). */
export function parseTeamMemberForm(formData: FormData): ParsedTeamMemberForm {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  const rawActive = formData.get("isActive");

  const result = teamMemberSchema.safeParse({
    name: read("name"),
    position: read("position"),
    bio: read("bio"),
    photo: read("photo"),
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

  const file = formData.get("photoFile");
  const upload = file instanceof File && file.size > 0 ? file : null;
  if (upload) {
    if (!(ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(upload.type)) {
      return {
        success: false,
        message: "فرمت فایل عکس پشتیبانی نمی‌شود",
        fieldErrors: { photoFile: "فرمت فایل عکس پشتیبانی نمی‌شود (PNG, JPG, WebP, AVIF)" },
      };
    }
    if (upload.size > MAX_IMAGE_SIZE_BYTES) {
      return { success: false, message: "حجم عکس بیش از حد مجاز است", fieldErrors: { photoFile: "حجم عکس نباید بیشتر از ۲ مگابایت باشد" } };
    }
  }

  return {
    success: true,
    data: {
      name: result.data.name,
      position: result.data.position,
      bio: result.data.bio || null,
      photo: result.data.photo,
      sortOrder: result.data.sortOrder === "" ? null : Number(result.data.sortOrder),
      isActive: result.data.isActive,
    },
    file: upload,
  };
}
