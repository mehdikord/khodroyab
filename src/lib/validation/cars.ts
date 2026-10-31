import { z } from "zod";
import { slugify, resolveSlug } from "@/lib/validation/car-types";

export const carCoreSchema = z.object({
  brandId: z
    .string({ error: "انتخاب برند الزامی است" })
    .min(1, { error: "انتخاب برند الزامی است" }),
  carTypeId: z
    .string({ error: "انتخاب نوع خودرو الزامی است" })
    .min(1, { error: "انتخاب نوع خودرو الزامی است" }),
  name: z
    .string({ error: "نام خودرو الزامی است" })
    .trim()
    .min(1, { error: "نام خودرو الزامی است" })
    .max(255, { error: "نام خودرو حداکثر ۲۵۵ کاراکتر است" }),
  slug: z
    .string()
    .trim()
    .max(255, { error: "اسلاگ حداکثر ۲۵۵ کاراکتر است" })
    .optional(),
  model: z
    .string({ error: "مدل خودرو الزامی است" })
    .trim()
    .min(1, { error: "مدل خودرو الزامی است" })
    .max(255, { error: "مدل خودرو حداکثر ۲۵۵ کاراکتر است" }),
});

export interface CarFormValues {
  brandId: string;
  carTypeId: string;
  name: string;
  slug: string;
  model: string;
}

export type ParsedCarForm =
  | { success: true; data: CarFormValues }
  | { success: false; fieldErrors: Record<string, string>; message: string };

export function parseCarForm(formData: FormData): ParsedCarForm {
  const rawBrandId = formData.get("brandId");
  const rawCarTypeId = formData.get("carTypeId");
  const rawName = formData.get("name");
  const rawSlug = formData.get("slug");
  const rawModel = formData.get("model");

  const parseResult = carCoreSchema.safeParse({
    brandId: rawBrandId,
    carTypeId: rawCarTypeId,
    name: rawName,
    slug: rawSlug,
    model: rawModel,
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
      message: "اطلاعات فرم خودرو نامعتبر است",
    };
  }

  const slug = resolveSlug(
    (parseResult.data.slug || "").trim(),
    parseResult.data.name.trim()
  );

  return {
    success: true,
    data: {
      ...parseResult.data,
      name: parseResult.data.name.trim(),
      slug,
      model: parseResult.data.model.trim(),
    },
  };
}
