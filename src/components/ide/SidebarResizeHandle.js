"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PREFS_CHANGED_EVENT,
  readSidebarWidth,
  writeSidebarWidth,
} from "@/lib/sidebarPrefs";

/**
 * IDE-style vertical resize handle for sidebars.
 * side="left" sits on the right edge of the left sidebar.
 * side="right" sits on the left edge of the right sidebar.
 */
export default function SidebarResizeHandle({ side = "left", onResize }) {
  const draggingRef = useRef(false);

  const onPointerDown = useCallback(
    (e) => {
      e.preventDefault();
      draggingRef.current = true;
      const startX = e.clientX;
      onResize?.({ type: "start", clientX: startX });

      const onMove = (ev) => {
        if (!draggingRef.current) return;
        onResize?.({ type: "move", clientX: ev.clientX, startX });
      };

      const onUp = () => {
        draggingRef.current = false;
        onResize?.({ type: "end" });
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [onResize]
  );

  const edgeClass =
    side === "left"
      ? "right-0 translate-x-1/2"
      : "left-0 -translate-x-1/2";

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={side === "left" ? "Resize left sidebar" : "Resize chat sidebar"}
      onPointerDown={onPointerDown}
      className={`absolute top-0 bottom-0 z-30 w-1 ${edgeClass} cursor-col-resize group`}
    >
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-transparent group-hover:bg-primary/50 group-active:bg-primary transition-colors" />
    </div>
  );
}

export function useSidebarWidth(defaultWidth, { min, max, storageKey, prefsKey } = {}) {
  const [width, setWidth] = useState(defaultWidth);
  const [hydrated, setHydrated] = useState(false);
  const startWidthRef = useRef(defaultWidth);
  const activeKeyRef = useRef(storageKey);

  useEffect(() => {
    activeKeyRef.current = storageKey;
    if (!storageKey) {
      setWidth(defaultWidth);
      setHydrated(true);
      return;
    }
    const saved = readSidebarWidth(storageKey, defaultWidth, { min, max });
    setWidth(saved);
    setHydrated(true);
  }, [storageKey, defaultWidth, min, max]);

  useEffect(() => {
    if (!storageKey || !hydrated) return;
    if (activeKeyRef.current !== storageKey) return;
    const clamped = Math.min(max, Math.max(min, width));
    if (clamped !== width) {
      setWidth(clamped);
      return;
    }
    writeSidebarWidth(storageKey, width);
  }, [storageKey, width, hydrated, min, max]);

  useEffect(() => {
    if (!prefsKey || !storageKey) return;

    const onPrefs = (event) => {
      const keys = event.detail?.keys;
      if (keys && !keys.includes(prefsKey)) return;
      const saved = readSidebarWidth(storageKey, defaultWidth, { min, max });
      setWidth(saved);
    };

    window.addEventListener(PREFS_CHANGED_EVENT, onPrefs);
    return () => window.removeEventListener(PREFS_CHANGED_EVENT, onPrefs);
  }, [prefsKey, storageKey, defaultWidth, min, max]);

  const handleResize = useCallback(
    (event, side) => {
      if (event.type === "start") {
        startWidthRef.current = width;
        return;
      }
      if (event.type !== "move") return;

      const delta =
        side === "left"
          ? event.clientX - event.startX
          : event.startX - event.clientX;
      const next = Math.min(max, Math.max(min, startWidthRef.current + delta));
      setWidth(next);
    },
    [width, min, max]
  );

  return { width, setWidth, handleResize };
}
