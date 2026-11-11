import "server-only";

import { cache } from "react";

import prisma from "@/lib/prisma";
import {
  DEFAULT_SYSTEM_SETTINGS,
  MAX_USER_CODE_ROTATION_MINUTES,
  MIN_USER_CODE_ROTATION_MINUTES,
  SYSTEM_SETTING_KEYS,
  type SystemSettings,
} from "@/lib/system-settings-shared";

export * from "@/lib/system-settings-shared";

function parseRotationMinutes(value: string | undefined): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < MIN_USER_CODE_ROTATION_MINUTES || n > MAX_USER_CODE_ROTATION_MINUTES) {
    return DEFAULT_SYSTEM_SETTINGS.userCodeRotationMinutes;
  }
  return n;
}

/** Every system setting, with defaults for the ones never saved. Cached per request. */
export const getSystemSettings = cache(async (): Promise<SystemSettings> => {
  const rows = await prisma.systemSetting.findMany({
    where: { key: { in: Object.values(SYSTEM_SETTING_KEYS) } },
  });
  const byKey = new Map(rows.map((row) => [row.key, row.value]));
  const text = (key: string) => byKey.get(key)?.trim() ?? "";
  return {
    userCodeRotationMinutes: parseRotationMinutes(byKey.get(SYSTEM_SETTING_KEYS.userCodeRotationMinutes)),
    consultationPhone: byKey.get(SYSTEM_SETTING_KEYS.consultationPhone)?.trim() ?? DEFAULT_SYSTEM_SETTINGS.consultationPhone,
    adPageNotice: byKey.get(SYSTEM_SETTING_KEYS.adPageNotice)?.trim() ?? DEFAULT_SYSTEM_SETTINGS.adPageNotice,
    aboutText: byKey.get(SYSTEM_SETTING_KEYS.aboutText)?.trim() ?? DEFAULT_SYSTEM_SETTINGS.aboutText,
    contactPhone: text(SYSTEM_SETTING_KEYS.contactPhone),
    contactPostalCode: text(SYSTEM_SETTING_KEYS.contactPostalCode),
    contactAddress: text(SYSTEM_SETTING_KEYS.contactAddress),
    contactTelegram: text(SYSTEM_SETTING_KEYS.contactTelegram),
    contactWhatsapp: text(SYSTEM_SETTING_KEYS.contactWhatsapp),
    contactInstagram: text(SYSTEM_SETTING_KEYS.contactInstagram),
    contactLocation: text(SYSTEM_SETTING_KEYS.contactLocation),
  };
});

/** Save every setting in one transaction. Values must already be validated. */
export async function saveSystemSettings(settings: SystemSettings): Promise<void> {
  const entries: [string, string][] = [
    [SYSTEM_SETTING_KEYS.userCodeRotationMinutes, String(settings.userCodeRotationMinutes)],
    [SYSTEM_SETTING_KEYS.consultationPhone, settings.consultationPhone],
    [SYSTEM_SETTING_KEYS.adPageNotice, settings.adPageNotice],
    [SYSTEM_SETTING_KEYS.aboutText, settings.aboutText],
    [SYSTEM_SETTING_KEYS.contactPhone, settings.contactPhone],
    [SYSTEM_SETTING_KEYS.contactPostalCode, settings.contactPostalCode],
    [SYSTEM_SETTING_KEYS.contactAddress, settings.contactAddress],
    [SYSTEM_SETTING_KEYS.contactTelegram, settings.contactTelegram],
    [SYSTEM_SETTING_KEYS.contactWhatsapp, settings.contactWhatsapp],
    [SYSTEM_SETTING_KEYS.contactInstagram, settings.contactInstagram],
    [SYSTEM_SETTING_KEYS.contactLocation, settings.contactLocation],
  ];
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.systemSetting.upsert({ where: { key }, create: { key, value }, update: { value } })
    )
  );
}
