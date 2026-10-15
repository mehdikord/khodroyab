import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { optionToRecord } from "@/lib/options";
import { OptionsManager } from "@/components/admin/options/OptionsManager";

export const metadata: Metadata = {
  title: "مدیریت ویژگی‌ها | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default async function AdminOptionsPage() {
  await requireAdmin();

  const options = await prisma.option.findMany({
    include: {
      optionItems: true,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return (
    <OptionsManager initialOptions={options.map(optionToRecord)} />
  );
}
