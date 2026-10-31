import "server-only";

import type { Option, OptionItem } from "@prisma/client";

export type OptionTypeValue = "text" | "number" | "select" | "checkbox";

export interface OptionItemRecord {
  id: string;
  optionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface OptionRecord {
  id: string;
  name: string;
  type: OptionTypeValue;
  /** `select` only: several items may be chosen at once. */
  multiple: boolean;
  isRequired: boolean;
  isActive: boolean;
  description: string;
  /** Number of stored ad values; a used option cannot be deleted or change type. */
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  optionItems: OptionItemRecord[];
}

/** Relations every `optionToRecord` caller must include. */
export const optionRecordInclude = {
  optionItems: { orderBy: { id: "asc" } },
  _count: { select: { userCars: true } },
} as const;

export function optionItemToRecord(item: OptionItem): OptionItemRecord {
  return {
    id: item.id.toString(),
    optionId: item.optionId.toString(),
    title: item.title,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export function optionToRecord(
  option: Option & { optionItems: OptionItem[]; _count: { userCars: number } }
): OptionRecord {
  return {
    id: option.id.toString(),
    name: option.name,
    type: option.type,
    multiple: option.multiple,
    isRequired: option.isRequired,
    isActive: option.isActive,
    description: option.description,
    usageCount: option._count.userCars,
    createdAt: option.createdAt.toISOString(),
    updatedAt: option.updatedAt.toISOString(),
    optionItems: option.optionItems.map(optionItemToRecord),
  };
}
