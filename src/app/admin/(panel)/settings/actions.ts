"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { adminActionDenied } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { getSystemSettings, saveSystemSettings, type SystemSettings } from "@/lib/system-settings";
import { applyRotationToActiveCodes } from "@/lib/user-codes";
import { parseSystemSettingsForm } from "@/lib/validation/system-settings";

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type SystemSettingsActionResult =
  | { ok: true; settings: SystemSettings }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/** Save the system settings (root administrator only). */
export async function saveSystemSettingsAction(formData: FormData): Promise<SystemSettingsActionResult> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const denied = await adminActionDenied("root");
  if (denied) return { ok: false, message: denied };

  const parsed = parseSystemSettingsForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };

  try {
    // Keep only provinces that exist.
    const existing = await prisma.province.findMany({
      where: { id: { in: parsed.data.activeProvinceIds ?? [] } },
      select: { id: true },
      orderBy: { id: "asc" },
    });
    if (existing.length === 0) {
      return { ok: false, message: "لطفاً خطاهای فرم را برطرف کنید", fieldErrors: { activeProvinceIds: "حداقل یک استان باید فعال باشد" } };
    }
    parsed.data.activeProvinceIds = existing.map((province) => province.id);

    const previous = await getSystemSettings();
    await saveSystemSettings(parsed.data);
    if (previous.userCodeRotationMinutes !== parsed.data.userCodeRotationMinutes) {
      await applyRotationToActiveCodes(parsed.data.userCodeRotationMinutes);
    }
    revalidatePath("/admin/settings");
    revalidatePath("/panel", "layout");
    return { ok: true, settings: parsed.data };
  } catch (error) {
    console.error("[settings:save] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
