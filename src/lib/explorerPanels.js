import { emitPrefsChanged } from "@/lib/sidebarPrefs";

export const OUTLINE_EXPANDED_KEY = "portfolio-explorer-outline-expanded";
export const TIMELINE_EXPANDED_KEY = "portfolio-explorer-timeline-expanded";

/** Default: both collapsed */
export const DEFAULT_EXPLORER_PANELS = {
  outlineExpanded: false,
  timelineExpanded: false,
};

function readFlag(key) {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return false;
    return raw === "1" || raw === "true";
  } catch {
    return false;
  }
}

function writeFlag(key, value) {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      localStorage.setItem(key, "1");
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }
}

export function readExplorerPanels() {
  return {
    outlineExpanded: readFlag(OUTLINE_EXPANDED_KEY),
    timelineExpanded: readFlag(TIMELINE_EXPANDED_KEY),
  };
}

export function writeOutlineExpanded(expanded, { emit = true } = {}) {
  writeFlag(OUTLINE_EXPANDED_KEY, Boolean(expanded));
  if (emit) emitPrefsChanged({ keys: ["explorer-outline"] });
}

export function writeTimelineExpanded(expanded, { emit = true } = {}) {
  writeFlag(TIMELINE_EXPANDED_KEY, Boolean(expanded));
  if (emit) emitPrefsChanged({ keys: ["explorer-timeline"] });
}

export function clearOutlineExpanded({ emit = true } = {}) {
  writeOutlineExpanded(false, { emit });
}

export function clearTimelineExpanded({ emit = true } = {}) {
  writeTimelineExpanded(false, { emit });
}

export function clearExplorerPanels({ emit = true } = {}) {
  writeFlag(OUTLINE_EXPANDED_KEY, false);
  writeFlag(TIMELINE_EXPANDED_KEY, false);
  if (emit) emitPrefsChanged({ keys: ["explorer-outline", "explorer-timeline"] });
}

export function isOutlineDirty() {
  return readExplorerPanels().outlineExpanded;
}

export function isTimelineDirty() {
  return readExplorerPanels().timelineExpanded;
}
