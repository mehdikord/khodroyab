import { z } from "zod";

import { COLOR_CODE_PATTERN } from "@/lib/colors-shared";

const colorCoreSchema = z.object({
  name: z
    .string({ error: "نام رنگ الزامی است" })
    .trim()
    .min(1, { error: "نام رنگ الزامی است" })
    .max(255, { error: "نام رنگ حداکثر ۲۵۵ کاراکتر می‌تواند باشد" }),
  code: z
    .string({ error: "کد رنگ الزامی است" })
    .trim()
    .regex(COLOR_CODE_PATTERN, { error: "کد رنگ باید به شکل #RRGGBB باشد (مثلاً #FFFFFF)" }),
});

export interface ColorFormValues {
  name: string;
  code: string;
}

export type ParsedColorForm =
  | { success: true; data: ColorFormValues }
  | { success: false; fieldErrors: Record<string, string>; message: string };

/**
 * Parse a FormData payload from a colour create/update action.
 */
export function parseColorForm(formData: FormData): ParsedColorForm {
  const parseResult = colorCoreSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
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

  return {
    success: true,
    data: {
      name: parseResult.data.name.replace(/\s+/g, " ").trim(),
      code: parseResult.data.code.toLowerCase(),
    },
  };
}
