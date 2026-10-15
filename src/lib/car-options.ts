import "server-only";

import type { CarOption, Option, OptionItem } from "@prisma/client";

export interface CarOptionRecord {
  id: string;
  carId: string;
  optionId: string;
  optionName: string;
  optionType: "text" | "select" | "checkbox";
  val: string;
  displayValue: string; // The translated title if select, or "بله"/"خیر" if checkbox, or raw text
  createdAt: string;
  updatedAt: string;
}

export function carOptionToRecord(
  carOption: CarOption & {
    option: Option & { optionItems: OptionItem[] };
  }
): CarOptionRecord {
  let displayValue = carOption.val;

  if (carOption.option.type === "select") {
    const item = carOption.option.optionItems.find(
      (oi) => oi.id.toString() === carOption.val
    );
    displayValue = item ? item.title : carOption.val;
  } else if (carOption.option.type === "checkbox") {
    displayValue = carOption.val === "1" ? "بله" : "خیر";
  }

  return {
    id: carOption.id.toString(),
    carId: carOption.carId.toString(),
    optionId: carOption.optionId.toString(),
    optionName: carOption.option.name,
    optionType: carOption.option.type as "text" | "select" | "checkbox",
    val: carOption.val,
    displayValue,
    createdAt: carOption.createdAt.toISOString(),
    updatedAt: carOption.updatedAt.toISOString(),
  };
}
