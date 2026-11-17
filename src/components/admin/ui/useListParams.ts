"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * URL-driven list state for server-paginated pages: filters live in the
 * search params, so the server renders only the requested page.
 */
export function useListParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  /** Merge `patch` into the URL (empty values are removed) and reset to page 1. */
  function setParams(patch: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    const search = params.toString();
    startTransition(() => {
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    });
  }

  return { setParams, isPending, refresh: () => startTransition(() => router.refresh()) };
}

/** Search box text pushed to `?q=` after the user stops typing. */
export function useDebouncedQueryParam(current: string, setParams: (patch: Record<string, string>) => void, delay = 400) {
  const [query, setQuery] = useState(current);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query.trim() === current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setParams({ q: query.trim() }), delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return [query, setQuery] as const;
}
