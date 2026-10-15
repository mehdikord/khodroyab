import React from "react";
import { cn } from "@/lib/utils";

interface AdminLogoProps {
  className?: string;
  /** Hide the textual wordmark, keeping only the emblem. */
  markOnly?: boolean;
  markClassName?: string;
}

/**
 * Khodroyab emblem + wordmark, reused across the admin panel so the admin
 * surface stays visually consistent with the public brand identity.
 */
export const AdminLogo: React.FC<AdminLogoProps> = ({
  className,
  markOnly = false,
  markClassName,
}) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#FF6A00]/45 bg-[#0D1117] shadow-[0_0_24px_rgba(255,106,0,0.22)]",
          markClassName
        )}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          className="h-6 w-6 text-[#FF6A00]"
          aria-hidden="true"
        >
          <path
            d="M6 23L11.5 12H24.5L30 23H25.5L23 17.5H13L10.5 23H6Z"
            fill="currentColor"
          />
          <path
            d="M4 25.5H32"
            stroke="#FF8A2A"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="18" cy="10" r="2" fill="#F5F5F5" />
        </svg>
        <span className="absolute -bottom-0.5 -left-0.5 h-2 w-2 rounded-full bg-[#FF6A00] ring-2 ring-[#07090C]" />
      </div>

      {!markOnly && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-tight text-[#F5F5F5]">
              خودرو یاب
            </span>
            <span className="rounded-md border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-widest text-[#FF8A2A]">
              ADMIN
            </span>
          </div>
          <span className="text-[11px] text-[#9BA3AE]">
            پنل مدیریت یکپارچه خودرو یاب
          </span>
        </div>
      )}
    </div>
  );
};

export default AdminLogo;
