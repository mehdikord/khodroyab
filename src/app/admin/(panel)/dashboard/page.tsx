import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "داشبورد | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

/**
 * Dashboard route for authenticated administrators.
 *
 * The central content area is intentionally empty in this phase — only the
 * protected route and shell foundation are provided here. Business widgets,
 * statistics and modules are introduced in later phases.
 */
export default function AdminDashboardPage() {
  return <div className="min-h-[60vh]" aria-hidden="true" />;
}
