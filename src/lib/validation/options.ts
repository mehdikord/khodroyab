import { z } from "zod";

export const optionItemSchema = z.object({
  id: z.string().optional(),
  title: z
    .string({ error: "عنوان گزینه الزامی است" })
    .trim()
    .min(1, { error: "عنوان گزینه نمی‌تواند خالی باشد" })
    .max(255, { error: "عنوان گزینه حداکثر ۲۵۵ کاراکتر است" }),
  item: z
    .string({ error: "مقدار گزینه الزامی است" })
    .trim()
    .min(1, { error: "مقدار گزینه نمی‌تواند خالی باشد" })
    .max(255, { error: "مقدار گزینه حداکثر ۲۵۵ کاراکتر است" }),
});

export const optionCoreSchema = z.object({
  name: z
    .string({ error: "نام ویژگی الزامی است" })
    .trim()
    .min(1, { error: "نام ویژگی الزامی است" })
    .max(255, { error: "نام ویژگی حداکثر ۲۵۵ کاراکتر می‌تواند باشد" }),
  type: z.enum(["text", "select", "checkbox"], {
    error: "نوع ویژگی نامعتبر است",
  }),
  placeholder: z
    .string()
    .trim()
    .max(255, { error: "متن راهنما حداکثر ۲۵۵ کاراکتر است" })
    .default(""),
  description: z
    .string()
    .trim()
    .max(255, { error: "توضیحات حداکثر ۲۵۵ کاراکتر است" })
    .default(""),
  items: z.array(optionItemSchema).default([]),
});

export interface OptionFormValues {
  name: string;
  type: "text" | "select" | "checkbox";
  placeholder: string;
  description: string;
  items: Array<{ id?: string; title: string; item: string }>;
}

export type ParsedOptionForm =
  | { success: true; data: OptionFormValues }
  | { success: false; fieldErrors: Record<string, string>; message: string };

export function parseOptionForm(formData: FormData): ParsedOptionForm {
  const rawName = formData.get("name");
  const rawType = formData.get("type");
  const rawPlaceholder = formData.get("placeholder") ?? "";
  const rawDescription = formData.get("description") ?? "";
  const rawItemsJson = formData.get("items");

  let itemsParsed: unknown = [];
  if (typeof rawItemsJson === "string" && rawItemsJson.trim()) {
    try {
      itemsParsed = JSON.parse(rawItemsJson);
    } catch {
      return {
        success: false,
        fieldErrors: { items: "قالب گزینه‌ها نامعتبر است" },
        message: "قالب داده گزینه‌ها نامعتبر است",
      };
    }
  }

  const parseResult = optionCoreSchema.safeParse({
    name: rawName,
    type: rawType,
    placeholder: rawPlaceholder,
    description: rawDescription,
    items: itemsParsed,
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

  if (parseResult.data.type === "select" && parseResult.data.items.length === 0) {
    return {
      success: false,
      fieldErrors: {
        items: "برای ویژگی از نوع انتخابی (select)، ثبت حداقل یک گزینه الزامی است.",
      },
      message: "حداقل یک گزینه برای این ویژگی باید تعریف شود",
    };
  }

  return {
    success: true,
    data: parseResult.data,
  };
}
