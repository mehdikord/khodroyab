"use client";

import React, { useState } from "react";
import { LogIn, UserRoundPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { UserLoginForm } from "@/components/panel/UserLoginForm";
import { UserRegisterForm } from "@/components/panel/UserRegisterForm";

type Mode = "login" | "register";

/** Login / registration switcher shown on the `/panel` entry screen. */
export const UserAuthCard: React.FC = () => {
  const [mode, setMode] = useState<Mode>("login");

  const tabs: { key: Mode; label: string; icon: React.ElementType }[] = [
    { key: "login", label: "ورود", icon: LogIn },
    { key: "register", label: "ثبت‌نام", icon: UserRoundPlus },
  ];

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label="ورود یا ثبت‌نام" className="flex gap-1 rounded-2xl border border-panel-line/[0.1] bg-panel-bg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = mode === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`auth-tab-${tab.key}`}
              aria-selected={active}
              aria-controls={`auth-panel-${tab.key}`}
              onClick={() => setMode(tab.key)}
              className={cn(
                "flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl text-sm font-extrabold transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40",
                active
                  ? "bg-gradient-to-b from-[#FF6A00]/[0.22] to-[#FF6A00]/[0.08] text-panel-text shadow-orange-subtle"
                  : "text-panel-muted hover:bg-panel-line/[0.04] hover:text-panel-text"
              )}
            >
              <Icon className={cn("h-4 w-4", active && "text-panel-accent")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`auth-panel-${mode}`} aria-labelledby={`auth-tab-${mode}`} key={mode} className="admin-animate-in">
        {mode === "login" ? <UserLoginForm /> : <UserRegisterForm onSwitchToLogin={() => setMode("login")} />}
      </div>

      <p className="text-center text-xs text-panel-muted">
        {mode === "login" ? (
          <>
            حساب کاربری ندارید؟{" "}
            <button type="button" onClick={() => setMode("register")} className="font-extrabold text-panel-accent hover:underline">
              ثبت‌نام کنید
            </button>
          </>
        ) : (
          <>
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <button type="button" onClick={() => setMode("login")} className="font-extrabold text-panel-accent hover:underline">
              وارد شوید
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default UserAuthCard;
