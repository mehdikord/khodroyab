import "server-only";

import type { Option, OptionItem } from "@prisma/client";

export interface OptionItemRecord {
  id: string;
  optionId: string;
  title: string;
  item: string;
  createdAt: string;
  updatedAt: string;
}

export interface OptionRecord {
  id: string;
  name: string;
  type: "text" | "select" | "checkbox";
  placeholder: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  optionItems?: OptionItemRecord[];
}

export function optionItemToRecord(item: OptionItem): OptionItemRecord {
  return {
    id: item.id.toString(),
    optionId: item.optionId.toString(),
    title: item.title,
    item: item.item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export function optionToRecord(
  option: Option & { optionItems?: OptionItem[] }
): OptionRecord {
  return {
    id: option.id.toString(),
    name: option.name,
    type: option.type as "text" | "select" | "checkbox",
    placeholder: option.placeholder,
    description: option.description,
    createdAt: option.createdAt.toISOString(),
    updatedAt: option.updatedAt.toISOString(),
    optionItems: option.optionItems?.map(optionItemToRecord),
  };
}
