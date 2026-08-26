import {
  FALLBACK_UI_EXTENSIONS,
  UI_DEFAULTS_REVISION_KEY,
  cloneUiExtensions,
  normalizeUiExtensions,
} from "@/lib/uiExtensions";

export const EXTENSIONS_STORAGE_KEY = "portfolio-extensions-v7";
export const WORKSPACE_STORAGE_KEY = "portfolio-workspace-v1";

/** @deprecated Prefer site defaults from Supabase; kept as offline fallback alias. */
export const DEFAULT_EXTENSION_STATE = FALLBACK_UI_EXTENSIONS;

export const DEFAULT_WORKSPACE_STATE = {
  openExtensionTabs: [],
  activeTab: "#about",
  activeActivity: "explorer",
};

const EXTENSION_STATE_KEYS = [
  EXTENSIONS_STORAGE_KEY,
  "portfolio-extensions-v6",
  "portfolio-extensions-v5",
  "portfolio-extensions-v4",
  "portfolio-extensions-v3",
  "portfolio-extensions-v2",
  "portfolio-extensions-v1",
];

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function resolveDefaults(siteDefaults) {
  return normalizeUiExtensions(siteDefaults ?? DEFAULT_EXTENSION_STATE);
}

export function readStoredUiDefaultsRevision() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(UI_DEFAULTS_REVISION_KEY) || "";
}

export function writeStoredUiDefaultsRevision(revision) {
  if (typeof window === "undefined") return;
  if (revision) localStorage.setItem(UI_DEFAULTS_REVISION_KEY, String(revision));
  else localStorage.removeItem(UI_DEFAULTS_REVISION_KEY);
}

/**
 * When dashboard site defaults get a new `revision`, wipe visitor extension
 * localStorage so they see the new defaults (they can customize again after).
 */
export function invalidateVisitorExtensionsIfDefaultsChanged(siteDefaults) {
  if (typeof window === "undefined") return false;
  const defaults = resolveDefaults(siteDefaults);
  const siteRev = defaults.revision || "";
  if (!siteRev) return false;
  const localRev = readStoredUiDefaultsRevision();
  if (localRev === siteRev) return false;
  clearExtensionState();
  writeStoredUiDefaultsRevision(siteRev);
  return true;
}

/**
 * Read visitor extension prefs from localStorage.
 * If none exist — or site defaults revision changed — return site defaults.
 */
export function readExtensionState(siteDefaults) {
  const defaults = resolveDefaults(siteDefaults);
  if (typeof window === "undefined") return cloneUiExtensions(defaults);

  invalidateVisitorExtensionsIfDefaultsChanged(defaults);

  if (!readStoredUiDefaultsRevision() && defaults.revision) {
    writeStoredUiDefaultsRevision(defaults.revision);
  }

  for (const key of EXTENSION_STATE_KEYS) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    const parsed = safeParse(raw);
    if (!parsed) continue;

    const installed =
      key === EXTENSIONS_STORAGE_KEY && Array.isArray(parsed.installed)
        ? parsed.installed
        : [...defaults.installed];

    return normalizeUiExtensions({
      ...defaults,
      ...parsed,
      installed,
      revision: defaults.revision,
    });
  }

  return cloneUiExtensions(defaults);
}

export function writeExtensionState(state) {
  if (typeof window === "undefined") return;
  const normalized = normalizeUiExtensions(state);
  localStorage.setItem(
    EXTENSIONS_STORAGE_KEY,
    JSON.stringify({
      installed: normalized.installed,
      activeTypography: normalized.activeTypography,
      activeThemeSource: normalized.activeThemeSource,
      packTheme: normalized.packTheme,
      fontPack: normalized.fontPack,
      macVariant: normalized.macVariant,
      macTrafficLights: normalized.macTrafficLights,
      liveAnimation: normalized.liveAnimation,
      activeTerminalTheme: normalized.activeTerminalTheme,
      terminalTheme: normalized.terminalTheme,
      activeChatTheme: normalized.activeChatTheme,
      chatTheme: normalized.chatTheme,
    })
  );
}

/** Remove stored prefs so the next read falls back to site defaults. Keeps revision key. */
export function clearExtensionState() {
  if (typeof window === "undefined") return;
  for (const key of EXTENSION_STATE_KEYS) {
    localStorage.removeItem(key);
  }
}

export function readWorkspaceState() {
  if (typeof window === "undefined") return DEFAULT_WORKSPACE_STATE;

  const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY);
  const parsed = raw ? safeParse(raw) : null;
  if (!parsed) return DEFAULT_WORKSPACE_STATE;

  return {
    openExtensionTabs: Array.isArray(parsed.openExtensionTabs) ? parsed.openExtensionTabs : [],
    activeTab: typeof parsed.activeTab === "string" ? parsed.activeTab : "#about",
    activeActivity: typeof parsed.activeActivity === "string" ? parsed.activeActivity : "explorer",
  };
}

export function writeWorkspaceState(state) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    WORKSPACE_STORAGE_KEY,
    JSON.stringify({
      openExtensionTabs: state.openExtensionTabs,
      activeTab: state.activeTab,
      activeActivity: state.activeActivity,
    })
  );
}

export function computeUiTheme(state) {
  if (state.activeThemeSource === "macintosh-theme") return "macos";
  if (state.activeThemeSource === "theme-pack") return state.packTheme;
  return "default";
}

export function applyExtensionStateToDocument(state) {
  const html = document.documentElement;
  const macActive = state.activeThemeSource === "macintosh-theme";
  const liveActive = state.activeThemeSource === "live-animation";
  html.dataset.uiTheme = computeUiTheme(state);
  html.dataset.fontPack = state.activeTypography ? state.fontPack : "inter";
  html.dataset.macVariant = macActive ? state.macVariant : "";
  html.dataset.glassUi = macActive ? "true" : "false";
  html.dataset.macWallpaper = macActive ? "true" : "false";
  html.dataset.liveAnimation = liveActive ? state.liveAnimation || "aurora" : "";
  html.dataset.terminalTheme = state.activeTerminalTheme
    ? state.terminalTheme || "slate"
    : "";
  html.dataset.chatTheme = state.activeChatTheme ? state.chatTheme || "midnight" : "";
}
