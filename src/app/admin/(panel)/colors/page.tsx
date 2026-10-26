import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { colorToRecord } from "@/lib/colors";
import { ColorsManager } from "@/components/admin/colors/ColorsManager";

export const metadata: Metadata = {
  title: "مدیریت رنگ‌ها | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/**
 * Colours management module — full CRUD against the `colors` table.
 */
export default async function AdminColorsPage() {
  await requireAdmin();

  const colors = await prisma.color.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return <ColorsManager initialColors={colors.map(colorToRecord)} />;
}
