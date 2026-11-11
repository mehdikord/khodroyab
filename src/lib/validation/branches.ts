import { z } from "zod";

import { normalizeDigits } from "@/lib/validation/admin";

export const BRANCH_TITLE_MAX_LENGTH = 150;
export const BRANCH_MANAGER_MAX_LENGTH = 120;
export const BRANCH_ADDRESS_MAX_LENGTH = 500;
export const BRANCH_SORT_ORDER_MAX = 9999;

/** Persian / Arabic digits → ASCII, keeping every other character. */
function asciiDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/٫/g, ".");
}

const positiveId = (message: string) =>
  z
    .string()
    .transform((value) => normalizeDigits(value))
    .refine((value) => /^\d{1,9}$/.test(value) && Number(value) > 0, { error: message })
    .transform((value) => Number(value));

const coordinate = (max: number, message: string) =>
  z
    .string()
    .transform((value) => asciiDigits(value).trim())
    .refine((value) => /^-?\d{1,3}(\.\d+)?$/.test(value) && Math.abs(Number(value)) <= max, { error: message })
    .transform((value) => Math.round(Number(value) * 1e6) / 1e6);

const branchSchema = z.object({
  provinceId: positiveId("استان را انتخاب کنید"),
  cityId: positiveId("شهر را انتخاب کنید"),
  title: z
    .string()
    .trim()
    .min(1, { error: "عنوان شعبه الزامی است" })
    .max(BRANCH_TITLE_MAX_LENGTH, { error: `عنوان شعبه حداکثر ${BRANCH_TITLE_MAX_LENGTH} کاراکتر است` }),
  managerName: z
    .string()
    .trim()
    .min(1, { error: "نام مدیر شعبه الزامی است" })
    .max(BRANCH_MANAGER_MAX_LENGTH, { error: `نام مدیر حداکثر ${BRANCH_MANAGER_MAX_LENGTH} کاراکتر است` }),
  phone: z
    .string()
    .transform((value) => asciiDigits(value).trim().replace(/\s+/g, " "))
    .refine((value) => value.length > 0, { error: "شماره تماس الزامی است" })
    .refine((value) => /^\+?[\d\s\-()]{4,20}$/.test(value) && normalizeDigits(value).length >= 4, { error: "شماره تماس معتبر نیست" }),
  address: z
    .string()
    .transform((value) => value.replace(/\r\n/g, "\n").trim())
    .refine((value) => value.length <= BRANCH_ADDRESS_MAX_LENGTH, { error: `آدرس حداکثر ${BRANCH_ADDRESS_MAX_LENGTH} کاراکتر است` }),
  latitude: coordinate(90, "موقعیت شعبه را روی نقشه انتخاب کنید"),
  longitude: coordinate(180, "موقعیت شعبه را روی نقشه انتخاب کنید"),
  /** "" = let the server pick (end of the list). */
  sortOrder: z
    .string()
    .transform((value) => normalizeDigits(value))
    .refine((value) => value === "" || (/^\d+$/.test(value) && Number(value) <= BRANCH_SORT_ORDER_MAX), {
      error: `ترتیب نمایش باید عددی بین ۰ تا ${BRANCH_SORT_ORDER_MAX} باشد`,
    }),
  isActive: z.boolean(),
});

export interface BranchFormValues {
  provinceId: number;
  cityId: number;
  title: string;
  managerName: string;
  phone: string;
  /** null when blank. */
  address: string | null;
  latitude: number;
  longitude: number;
  /** null = append to the end of the list. */
  sortOrder: number | null;
  isActive: boolean;
}

export type ParsedBranchForm =
  | { success: true; data: BranchFormValues }
  | { success: false; message: string; fieldErrors: Record<string, string> };

/**
 * Parse the branch create/edit form (fields: provinceId, cityId, title,
 * managerName, phone, address, latitude, longitude, sortOrder, isActive).
 * A missing location is reported once, on the "location" field.
 */
export function parseBranchForm(formData: FormData): ParsedBranchForm {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  const rawActive = formData.get("isActive");

  const result = branchSchema.safeParse({
    provinceId: read("provinceId"),
    cityId: read("cityId"),
    title: read("title"),
    managerName: read("managerName"),
    phone: read("phone"),
    address: read("address"),
    latitude: read("latitude"),
    longitude: read("longitude"),
    sortOrder: read("sortOrder"),
    isActive: rawActive === "true" || rawActive === "on" || rawActive === "1",
  });

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      let key = String(issue.path[0] ?? "");
      if (key === "latitude" || key === "longitude") key = "location";
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, message: "لطفاً خطاهای فرم را برطرف کنید", fieldErrors };
  }

  const { sortOrder, address, ...rest } = result.data;
  return {
    success: true,
    data: { ...rest, address: address || null, sortOrder: sortOrder === "" ? null : Number(sortOrder) },
  };
}
