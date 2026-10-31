import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { optionRecordInclude, optionToRecord } from "@/lib/options";
import { OptionsManager } from "@/components/admin/options/OptionsManager";

export const metadata: Metadata = {
  title: "فرم ثبت خودرو | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default async function AdminCarFormPage() {
  await requireAdmin();

  const options = await prisma.option.findMany({
    include: optionRecordInclude,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return (
    <OptionsManager initialOptions={options.map(optionToRecord)} />
  );
}
