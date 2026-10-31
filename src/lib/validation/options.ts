import { z } from "zod";

export const optionItemSchema = z.object({
  id: z.string().optional(),
  title: z
    .string({ error: "عنوان گزینه الزامی است" })
    .trim()
    .min(1, { error: "عنوان گزینه نمی‌تواند خالی باشد" })
    .max(255, { error: "عنوان گزینه حداکثر ۲۵۵ کاراکتر است" }),
});

export const optionCoreSchema = z.object({
  name: z
    .string({ error: "عنوان ویژگی الزامی است" })
    .trim()
    .min(1, { error: "عنوان ویژگی الزامی است" })
    .max(255, { error: "عنوان ویژگی حداکثر ۲۵۵ کاراکتر می‌تواند باشد" }),
  type: z.enum(["text", "number", "select", "checkbox"], {
    error: "نوع ویژگی نامعتبر است",
  }),
  multiple: z.boolean().default(false),
  isRequired: z.boolean().default(false),
  description: z
    .string()
    .trim()
    .max(255, { error: "توضیح کوتاه حداکثر ۲۵۵ کاراکتر است" })
    .default(""),
  items: z.array(optionItemSchema).default([]),
});

export type OptionFormValues = z.output<typeof optionCoreSchema>;

export type ParsedOptionForm =
  | { success: true; data: OptionFormValues }
  | { success: false; fieldErrors: Record<string, string>; message: string };

export function parseOptionForm(formData: FormData): ParsedOptionForm {
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
    name: formData.get("name"),
    type: formData.get("type"),
    multiple: formData.get("multiple") === "true",
    isRequired: formData.get("isRequired") === "true",
    description: formData.get("description") ?? "",
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

  const data = parseResult.data;
  if (data.type === "select" && data.items.length === 0) {
    return {
      success: false,
      fieldErrors: {
        items: "برای ویژگی چند گزینه‌ای، ثبت حداقل یک گزینه الزامی است.",
      },
      message: "حداقل یک گزینه برای این ویژگی باید تعریف شود",
    };
  }

  const titles = data.items.map((item) => item.title);
  if (data.type === "select" && new Set(titles).size !== titles.length) {
    return {
      success: false,
      fieldErrors: { items: "عنوان گزینه‌ها نباید تکراری باشد." },
      message: "عنوان گزینه‌ها نباید تکراری باشد",
    };
  }

  return {
    success: true,
    data: {
      ...data,
      multiple: data.type === "select" && data.multiple,
      // Leaving a checkbox unticked is itself an answer, so it is never required.
      isRequired: data.type !== "checkbox" && data.isRequired,
      items: data.type === "select" ? data.items : [],
    },
  };
}
