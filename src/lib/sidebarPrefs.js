export const LEFT_SIDEBAR_DEFAULT = 280;
export const RIGHT_SIDEBAR_DEFAULT = 360;

export const LEFT_SIDEBAR_WIDTH_KEY = "portfolio-left-sidebar-width";
export const RIGHT_SIDEBAR_WIDTH_KEY = "portfolio-right-sidebar-width";

/** Fired when Source Control (or prefs helpers) discard / restore values. */
export const PREFS_CHANGED_EVENT = "portfolio-prefs-changed";

export function emitPrefsChanged(detail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PREFS_CHANGED_EVENT, { detail }));
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function readSidebarWidth(storageKey, defaultWidth, { min, max } = {}) {
  if (typeof window === "undefined") return defaultWidth;
  try {
    const raw = localStorage.getItem(storageKey);
    const n = raw ? Number(raw) : NaN;
    if (!Number.isFinite(n)) return defaultWidth;
    if (min != null && max != null) return clamp(n, min, max);
    return n;
  } catch {
    return defaultWidth;
  }
}

export function writeSidebarWidth(storageKey, width) {
  if (typeof window === "undefined") return;
  const next = String(width);
  const prev = localStorage.getItem(storageKey);
  if (prev === next) return;

  localStorage.setItem(storageKey, next);

  const prefsKey =
    storageKey === LEFT_SIDEBAR_WIDTH_KEY
      ? "left-sidebar"
      : storageKey === RIGHT_SIDEBAR_WIDTH_KEY
        ? "right-sidebar"
        : null;
  emitPrefsChanged({ keys: prefsKey ? [prefsKey] : ["layout"] });
}

export function clearSidebarWidth(storageKey, defaultWidth) {
  writeSidebarWidth(storageKey, defaultWidth);
}
