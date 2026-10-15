"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SearchableSelectOption {
  value: string;
  label: string;
  /** Secondary line shown under the label. */
  description?: string;
  /** Extra text that should also match the search query. */
  keywords?: string;
}

interface SearchableSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  hasError?: boolean;
  clearable?: boolean;
  className?: string;
}

/** Lower-case and fold Persian/Arabic digits so searches match either keyboard. */
function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[ي]/g, "ی") // Arabic yeh → Persian yeh
    .replace(/[ك]/g, "ک") // Arabic kaf → Persian kaf
    .trim();
}

/**
 * Accessible searchable dropdown (combobox pattern).
 * - Click/Enter/Space opens; typing filters; Arrow keys move; Enter selects; Esc closes.
 * - Closes on outside click. Works inside the admin <Modal /> focus trap.
 */
export function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "انتخاب کنید…",
  searchPlaceholder = "جستجو…",
  emptyText = "موردی یافت نشد",
  disabled = false,
  hasError = false,
  clearable = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selected = options.find((option) => option.value === value) ?? null;

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return options;
    return options.filter((option) =>
      normalize(`${option.label} ${option.description ?? ""} ${option.keywords ?? ""}`).includes(q)
    );
  }, [options, query]);

  // Reset search + highlight whenever the menu opens.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    const selectedIndex = options.findIndex((option) => option.value === value);
    setHighlight(selectedIndex >= 0 ? selectedIndex : 0);
    const frame = requestAnimationFrame(() => searchRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open, options, value]);

  // Keep highlight in range when the filter changes.
  useEffect(() => {
    setHighlight((current) => Math.min(current, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  // Scroll the highlighted row into view.
  useEffect(() => {
    if (!open) return;
    const row = listRef.current?.children.item(highlight) as HTMLElement | null;
    row?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  function commit(option: SearchableSelectOption) {
    onChange(option.value);
    setOpen(false);
  }

  function onSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlight((h) => (filtered.length ? (h + 1) % filtered.length : 0));
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlight((h) => (filtered.length ? (h - 1 + filtered.length) % filtered.length : 0));
        break;
      case "Enter":
        event.preventDefault();
        if (filtered[highlight]) commit(filtered[highlight]);
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation(); // keep the parent modal open
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  function onTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!disabled) setOpen(true);
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div className="relative">
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-haspopup="listbox"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onTriggerKeyDown}
          className={cn(
            "flex h-12 w-full items-center gap-2 rounded-xl border bg-[#07090C] px-4 text-start text-sm outline-none transition-all",
            "focus-visible:border-[#FF6A00] focus-visible:ring-4 focus-visible:ring-[#FF6A00]/15",
            disabled && "cursor-not-allowed opacity-60",
            hasError ? "border-red-500/50" : open ? "border-[#FF6A00] ring-4 ring-[#FF6A00]/15" : "border-white/[0.12] hover:border-white/20",
            clearable && selected && "pe-20"
          )}
        >
          <span className={cn("min-w-0 flex-1 truncate", selected ? "text-[#F5F5F5]" : "text-[#5E6672]")}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 text-[#5E6672] transition-transform", open && "rotate-180 text-[#FF8A2A]")}
          />
        </button>
        {clearable && selected && !disabled && (
          <button
            type="button"
            aria-label="پاک کردن انتخاب"
            onClick={(event) => {
              event.stopPropagation();
              onChange("");
            }}
            className="absolute end-10 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#5E6672] transition-colors hover:bg-white/[0.06] hover:text-[#F5F5F5]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="admin-animate-fade absolute inset-x-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0D1117] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9)]">
          <div className="relative border-b border-white/[0.07] p-2">
            <Search className="pointer-events-none absolute end-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E6672]" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder={searchPlaceholder}
              aria-autocomplete="list"
              aria-controls={listId}
              className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#07090C] pe-10 ps-3 text-sm text-[#F5F5F5] outline-none placeholder:text-[#5E6672] focus:border-[#FF6A00]/60"
            />
          </div>

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className="admin-scrollbar max-h-64 overflow-y-auto p-1.5"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs font-semibold text-[#5E6672]">{emptyText}</li>
            ) : (
              filtered.map((option, index) => {
                const isSelected = option.value === value;
                const isHighlighted = index === highlight;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlight(index)}
                    onMouseDown={(event) => event.preventDefault()} // keep focus on the search box
                    onClick={() => commit(option)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                      isHighlighted ? "bg-[#FF6A00]/[0.12]" : "hover:bg-white/[0.04]"
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className={cn("block truncate text-sm font-semibold", isSelected ? "text-[#FF8A2A]" : "text-[#F5F5F5]")}>
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="mt-0.5 block truncate text-[11px] text-[#8B93A1]">{option.description}</span>
                      )}
                    </span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-[#FF8A2A]" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
