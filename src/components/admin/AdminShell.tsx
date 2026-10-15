"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AdminLogo } from "@/components/admin/AdminLogo";
import {
  ADMIN_NAV_GROUPS,
  findActiveNavItem,
  type AdminNavItem,
} from "@/components/admin/admin-nav";
import { logoutAdminAction } from "@/app/admin/auth-actions";

export interface AdminShellUser {
  name: string;
  phone: string;
}

interface AdminShellProps {
  user: AdminShellUser;
  children: React.ReactNode;
}

/** Derive up-to-two-letter initials for the avatar. */
function getInitials(name: string): string {
  const cleaned = name.trim();
  if (!cleaned) return "AD";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const NavCollapsibleItem: React.FC<{
  item: AdminNavItem;
  pathname: string;
  onNavigate?: () => void;
}> = ({ item, pathname, onNavigate }) => {
  // Resolve the single best-matching nav entry so sibling routes that share a
  // prefix (e.g. /admin/ads and /admin/ads/pending) never highlight together.
  const activeHref = findActiveNavItem(pathname)?.href;
  const isAnyChildActive = item.children?.some((child) => child.href === activeHref);
  const [isOpen, setIsOpen] = useState(isAnyChildActive ?? false);

  useEffect(() => {
    if (isAnyChildActive) {
      setIsOpen(true);
    }
  }, [isAnyChildActive]);

  const Icon = item.icon;

  return (
    <li className="space-y-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={cn(
          "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40",
          isAnyChildActive
            ? "bg-white/[0.03] text-[#F5F5F5]"
            : "text-[#9BA3AE] hover:bg-white/[0.04] hover:text-[#F5F5F5]"
        )}
      >
        {isAnyChildActive && (
          <span className="absolute inset-y-2 start-0 w-1 rounded-full bg-[#FF6A00] shadow-[0_0_12px_#FF6A00]" />
        )}
        <Icon
          className={cn(
            "h-[18px] w-[18px] shrink-0 transition-colors",
            isAnyChildActive
              ? "text-[#FF8A2A]"
              : "text-[#5E6672] group-hover:text-[#FF8A2A]"
          )}
        />
        <span className="flex-1 text-start">{item.label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[#5E6672] transition-transform duration-200",
            isOpen ? "rotate-180 text-[#FF8A2A]" : "group-hover:text-[#9BA3AE]"
          )}
        />
      </button>

      {isOpen && item.children && (
        <ul className="admin-animate-fade space-y-1 pr-6 pt-1">
          {item.children.map((child) => {
            const isChildActive = child.href === activeHref;
            return (
              <li key={child.key}>
                <Link
                  href={child.href || "#"}
                  onClick={onNavigate}
                  aria-current={isChildActive ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40",
                    isChildActive
                      ? "bg-gradient-to-l from-[#FF6A00]/[0.12] to-transparent text-[#F5F5F5] font-bold"
                      : "text-[#8B93A1] hover:bg-white/[0.04] hover:text-[#F5F5F5]"
                  )}
                >
                  <span
                    className={cn(
                      "h-1 w-1 rounded-full transition-all",
                      isChildActive
                        ? "bg-[#FF6A00] shadow-[0_0_8px_#FF6A00]"
                        : "bg-[#42505F] group-hover:bg-[#FF8A2A]"
                    )}
                  />
                  <span className="flex-1">{child.label}</span>
                  {child.enLabel && (
                    <span
                      className={cn(
                        "font-mono text-[8px] tracking-widest transition-opacity",
                        isChildActive
                          ? "text-[#FF8A2A] opacity-100"
                          : "text-[#5E6672] opacity-0 group-hover:opacity-100"
                      )}
                    >
                      {child.enLabel}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

const SidebarContent: React.FC<{
  pathname: string;
  user: AdminShellUser;
  onNavigate?: () => void;
}> = ({ pathname, user, onNavigate }) => {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b border-white/[0.07] px-5">
        <AdminLogo />
      </div>

      {/* Navigation */}
      <nav
        aria-label="ناوبری پنل مدیریت"
        className="admin-scrollbar flex-1 overflow-y-auto px-3 py-5"
      >
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.key} className="mb-6 last:mb-0">
            <p className="px-3 pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5E6672]">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                if (item.children && item.children.length > 0) {
                  return (
                    <NavCollapsibleItem
                      key={item.key}
                      item={item}
                      pathname={pathname}
                      onNavigate={onNavigate}
                    />
                  );
                }

                const Icon = item.icon;
                const isActive =
                  item.href &&
                  (pathname === item.href || pathname.startsWith(`${item.href}/`));
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href || "#"}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40",
                        isActive
                          ? "bg-gradient-to-l from-[#FF6A00]/[0.18] to-[#FF6A00]/5 text-[#F5F5F5]"
                          : "text-[#9BA3AE] hover:bg-white/[0.04] hover:text-[#F5F5F5]"
                      )}
                    >
                      {isActive && (
                        <span className="absolute inset-y-2 start-0 w-1 rounded-full bg-[#FF6A00] shadow-[0_0_12px_#FF6A00]" />
                      )}
                      <Icon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0 transition-colors",
                          isActive
                            ? "text-[#FF8A2A]"
                            : "text-[#5E6672] group-hover:text-[#FF8A2A]"
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      <span
                        className={cn(
                          "font-mono text-[9px] tracking-widest transition-opacity",
                          isActive
                            ? "text-[#FF8A2A] opacity-100"
                            : "text-[#5E6672] opacity-0 group-hover:opacity-100"
                        )}
                      >
                        {item.enLabel}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer: account summary */}
      <div className="shrink-0 border-t border-white/[0.07] p-3">
        <div className="rounded-2xl border border-white/[0.07] bg-[#07090C]/60 p-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#FF6A00]/40 bg-[#FF6A00]/[0.12] font-mono text-xs font-bold text-[#FF8A2A]">
              {getInitials(user.name)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-[#F5F5F5]">
                {user.name}
              </span>
              <span
                dir="ltr"
                className="block truncate text-start font-mono text-[11px] text-[#9BA3AE]"
              >
                {user.phone}
              </span>
            </span>
          </div>

          <Link
            href="/"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#171B21]/70 px-3 py-2 text-xs font-semibold text-[#9BA3AE] transition-colors hover:border-[#FF6A00]/40 hover:text-[#F5F5F5]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>مشاهده سایت اصلی</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const AdminShell: React.FC<AdminShellProps> = ({ user, children }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeItem = findActiveNavItem(pathname);
  const pageTitle = activeItem?.label ?? "پنل مدیریت";

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Close the account menu on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileOpen]);

  return (
    <div className="admin-root min-h-screen">
      {/* Desktop sidebar (right-aligned in RTL) */}
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-72 border-e border-white/[0.07] bg-[#0D1117] lg:block">
        <SidebarContent pathname={pathname} user={user} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="بستن منو"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm admin-animate-fade"
          />
          <aside className="admin-animate-drawer absolute inset-y-0 start-0 flex w-72 max-w-[85vw] flex-col border-e border-white/[0.1] bg-[#0D1117] shadow-[0_0_60px_rgba(0,0,0,0.85)]">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="بستن منو"
              className="absolute -start-0 top-4 end-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.1] bg-[#171B21] text-[#9BA3AE] transition-colors hover:text-[#F5F5F5]"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent
              pathname={pathname}
              user={user}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Content column */}
      <div className="flex min-h-screen flex-col lg:ps-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/[0.07] bg-[#07090C]/85 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="باز کردن منو"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.1] bg-[#0D1117] text-[#9BA3AE] transition-colors hover:border-[#FF6A00]/40 hover:text-[#F5F5F5] lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page title / breadcrumb */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-[#5E6672]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#FF8A2A]" />
              <span className="hidden sm:inline">خودرو یاب</span>
              <span className="hidden sm:inline">/</span>
              <span className="font-mono tracking-wider">
                {activeItem?.enLabel ?? "ADMIN"}
              </span>
            </div>
            <h1 className="truncate text-base font-black text-[#F5F5F5] sm:text-lg">
              {pageTitle}
            </h1>
          </div>

          {/* Account menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#0D1117] px-2.5 py-1.5 transition-colors hover:border-[#FF6A00]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FF6A00]/40 bg-[#FF6A00]/[0.12] font-mono text-[11px] font-bold text-[#FF8A2A]">
                {getInitials(user.name)}
              </span>
              <span className="hidden max-w-[120px] flex-col items-start sm:flex">
                <span className="truncate text-xs font-bold text-[#F5F5F5]">
                  {user.name}
                </span>
                <span className="text-[10px] text-[#9BA3AE]">مدیر سیستم</span>
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-[#5E6672] transition-transform",
                  menuOpen && "rotate-180"
                )}
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="admin-animate-in absolute end-0 mt-2 w-60 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0D1117] shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
              >
                <div className="border-b border-white/[0.07] px-4 py-3">
                  <p className="text-sm font-bold text-[#F5F5F5]">
                    {user.name}
                  </p>
                  <p
                    dir="ltr"
                    className="mt-0.5 text-start font-mono text-[11px] text-[#9BA3AE]"
                  >
                    {user.phone}
                  </p>
                </div>
                <div className="p-1.5">
                  <Link
                    href="/"
                    role="menuitem"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#9BA3AE] transition-colors hover:bg-white/[0.05] hover:text-[#F5F5F5]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>مشاهده سایت اصلی</span>
                  </Link>
                  <form action={logoutAdminAction}>
                    <button
                      type="submit"
                      role="menuitem"
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>خروج از حساب</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content region (the public root layout provides the <main> landmark) */}
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminShell;
