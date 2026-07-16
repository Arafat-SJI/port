"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_SECTION_ORDER,
  SECTION_ORDER_EVENT,
  broadcastSectionOrder,
  normalizeSectionOrder,
} from "@/lib/sectionOrder";

/**
 * @param {string[] | undefined} initialOrder — SSR/server-seeded order from Supabase.
 *   When provided, first paint matches DB (no default-order flash). Client fetch is skipped.
 */
export function useSectionOrder(initialOrder) {
  const [order, setOrder] = useState(() =>
    normalizeSectionOrder(initialOrder ?? DEFAULT_SECTION_ORDER)
  );

  useEffect(() => {
    let cancelled = false;

    // Only fetch when no server seed — avoids flash of DEFAULT then swap.
    if (initialOrder == null) {
      fetch("/api/section-order")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (cancelled || !data?.order) return;
          const normalized = normalizeSectionOrder(data.order);
          setOrder(normalized);
          broadcastSectionOrder(normalized);
        })
        .catch(() => {});
    }

    const syncFromEvent = (event) => {
      if (event?.detail) setOrder(normalizeSectionOrder(event.detail));
    };

    window.addEventListener(SECTION_ORDER_EVENT, syncFromEvent);
    return () => {
      cancelled = true;
      window.removeEventListener(SECTION_ORDER_EVENT, syncFromEvent);
    };
  }, [initialOrder]);

  const setAndBroadcast = useCallback((next) => {
    const normalized = normalizeSectionOrder(next);
    setOrder(normalized);
    broadcastSectionOrder(normalized);
    return normalized;
  }, []);

  return [order, setAndBroadcast];
}
