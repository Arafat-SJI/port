export const SIDEBAR_BREAKPOINT_WIDE = 1305;
export const SIDEBAR_BREAKPOINT_FIXED = 1150;
/** Below this, left sidebar becomes a hamburger drawer */
export const SIDEBAR_DRAWER_BREAKPOINT = 820;

/** Legacy alias — wide/resizable threshold */
export const SIDEBAR_BREAKPOINT = SIDEBAR_BREAKPOINT_WIDE;

/** ≥ 1305px */
export const SIDEBAR_LAYOUT_WIDE = {
  mode: "wide",
  left: {
    defaultWidth: 280,
    min: 180,
    max: 480,
    storageKey: "portfolio-left-sidebar-width",
    fixed: false,
  },
  right: {
    defaultWidth: 360,
    min: 260,
    max: 560,
    storageKey: "portfolio-right-sidebar-width",
    fixed: false,
  },
};

/** 1150px – 1304px */
export const SIDEBAR_LAYOUT_COMPACT = {
  mode: "compact",
  left: {
    defaultWidth: 180,
    min: 160,
    max: 200,
    storageKey: "portfolio-left-sidebar-width-compact",
    fixed: false,
  },
  right: {
    defaultWidth: 260,
    min: 240,
    max: 280,
    storageKey: "portfolio-right-sidebar-width-compact",
    fixed: false,
  },
};

/** < 1150px — fixed widths, not resizable */
export const SIDEBAR_LAYOUT_FIXED = {
  mode: "fixed",
  left: {
    defaultWidth: 160,
    min: 160,
    max: 160,
    storageKey: null,
    fixed: true,
  },
  right: {
    defaultWidth: 200,
    min: 200,
    max: 200,
    storageKey: null,
    fixed: true,
  },
};

export const LEFT_SIDEBAR_DEFAULT = SIDEBAR_LAYOUT_WIDE.left.defaultWidth;
export const RIGHT_SIDEBAR_DEFAULT = SIDEBAR_LAYOUT_WIDE.right.defaultWidth;
export const LEFT_SIDEBAR_WIDTH_KEY = SIDEBAR_LAYOUT_WIDE.left.storageKey;
export const RIGHT_SIDEBAR_WIDTH_KEY = SIDEBAR_LAYOUT_WIDE.right.storageKey;

/** Fired when Source Control (or prefs helpers) discard / restore values. */
export const PREFS_CHANGED_EVENT = "portfolio-prefs-changed";

export function emitPrefsChanged(detail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PREFS_CHANGED_EVENT, { detail }));
}

export function getSidebarMode(
  width = typeof window !== "undefined" ? window.innerWidth : SIDEBAR_BREAKPOINT_WIDE
) {
  if (width < SIDEBAR_BREAKPOINT_FIXED) return "fixed";
  if (width < SIDEBAR_BREAKPOINT_WIDE) return "compact";
  return "wide";
}

/** @deprecated use getSidebarMode */
export function isCompactSidebarViewport(width) {
  return getSidebarMode(width) !== "wide";
}

export function getSidebarLayout(mode = getSidebarMode()) {
  if (mode === true) return SIDEBAR_LAYOUT_COMPACT;
  if (mode === false) return SIDEBAR_LAYOUT_WIDE;
  if (mode === "fixed") return SIDEBAR_LAYOUT_FIXED;
  if (mode === "compact") return SIDEBAR_LAYOUT_COMPACT;
  return SIDEBAR_LAYOUT_WIDE;
}

export function getSidebarSideConfig(side, mode = getSidebarMode()) {
  return getSidebarLayout(mode)[side];
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function readSidebarWidth(storageKey, defaultWidth, { min, max } = {}) {
  if (typeof window === "undefined" || !storageKey) return defaultWidth;
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

function prefsKeyForStorageKey(storageKey) {
  const layouts = [SIDEBAR_LAYOUT_WIDE, SIDEBAR_LAYOUT_COMPACT];
  for (const layout of layouts) {
    if (layout.left.storageKey === storageKey) return "left-sidebar";
    if (layout.right.storageKey === storageKey) return "right-sidebar";
  }
  return null;
}

export function writeSidebarWidth(storageKey, width) {
  if (typeof window === "undefined" || !storageKey) return;
  const next = String(width);
  const prev = localStorage.getItem(storageKey);
  if (prev === next) return;

  localStorage.setItem(storageKey, next);

  const prefsKey = prefsKeyForStorageKey(storageKey);
  emitPrefsChanged({ keys: prefsKey ? [prefsKey] : ["layout"] });
}

export function clearSidebarWidth(storageKey, defaultWidth) {
  if (!storageKey) return;
  writeSidebarWidth(storageKey, defaultWidth);
}
