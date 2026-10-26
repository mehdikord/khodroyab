import "server-only";

import type { Color } from "@prisma/client";

import prisma from "@/lib/prisma";

export interface ColorRecord {
  id: string;
  name: string;
  /** Hex colour code, e.g. "#ffffff". */
  code: string;
  createdAt: string;
  updatedAt: string;
}

export function colorToRecord(color: Color): ColorRecord {
  return {
    id: color.id.toString(),
    name: color.name,
    code: color.code,
    createdAt: color.createdAt.toISOString(),
    updatedAt: color.updatedAt.toISOString(),
  };
}

/** The whole colour catalogue, alphabetically. */
export async function listColors(): Promise<ColorRecord[]> {
  const colors = await prisma.color.findMany({ orderBy: [{ name: "asc" }, { id: "asc" }] });
  return colors.map(colorToRecord);
}
