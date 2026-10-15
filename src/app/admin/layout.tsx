import React from "react";

/**
 * Root wrapper for every `/admin/*` route.
 *
 * The `.admin-root` class establishes the isolated admin design tokens and
 * scopes admin styling away from the public website. The public Navbar,
 * Footer and mobile dock are suppressed for `/admin/*` routes.
 */
export default function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-root admin-scrollbar">{children}</div>;
}
