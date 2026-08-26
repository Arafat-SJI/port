import {
  CHAT_THEME_OPTIONS,
  DEFAULT_INSTALLED_EXTENSION_IDS,
  FONT_PACK_OPTIONS,
  LIVE_ANIMATION_OPTIONS,
  MAC_THEME_VARIANTS,
  TERMINAL_THEME_OPTIONS,
  THEME_PACK_OPTIONS,
} from "@/data/extensions";

/** Supabase `portfolio_settings` key — site-wide default extension / UI state. */
export const UI_EXTENSIONS_SETTINGS_KEY = "ui_extensions";

const THEME_SOURCES = new Set(["default", "theme-pack", "macintosh-theme", "live-animation"]);
const FONT_VALUES = new Set(FONT_PACK_OPTIONS.map((o) => o.value));
const PACK_THEME_VALUES = new Set(THEME_PACK_OPTIONS.map((o) => o.value));
const MAC_VALUES = new Set(MAC_THEME_VARIANTS.map((o) => o.value));
const LIVE_VALUES = new Set(LIVE_ANIMATION_OPTIONS.map((o) => o.value));
const TERMINAL_VALUES = new Set(TERMINAL_THEME_OPTIONS.map((o) => o.value));
const CHAT_VALUES = new Set(CHAT_THEME_OPTIONS.map((o) => o.value));
const INSTALLABLE_IDS = new Set(DEFAULT_INSTALLED_EXTENSION_IDS);

/** Hardcoded fallback only when Supabase has no row yet / read fails. */
export const FALLBACK_UI_EXTENSIONS = {
  installed: [...DEFAULT_INSTALLED_EXTENSION_IDS],
  activeTypography: false,
  activeThemeSource: "default",
  packTheme: "default",
  fontPack: "inter",
  macVariant: "sonoma",
  macTrafficLights: true,
  liveAnimation: "aurora",
  activeTerminalTheme: false,
  terminalTheme: "slate",
  activeChatTheme: false,
  chatTheme: "midnight",
  revision: "",
};

/** localStorage key: last site `ui_extensions.revision` applied for this browser. */
export const UI_DEFAULTS_REVISION_KEY = "portfolio-ui-defaults-rev";

/** Client-side cache of SSR site defaults (set by ExtensionsProvider). */
let cachedSiteDefaults = null;

export function setCachedSiteUiDefaults(defaults) {
  cachedSiteDefaults = normalizeUiExtensions(defaults ?? FALLBACK_UI_EXTENSIONS);
}

export function getCachedSiteUiDefaults() {
  return cachedSiteDefaults
    ? cloneUiExtensions(cachedSiteDefaults)
    : cloneUiExtensions(FALLBACK_UI_EXTENSIONS);
}

function asString(value, allowed, fallback) {
  return typeof value === "string" && allowed.has(value) ? value : fallback;
}

function normalizeInstalled(input) {
  const source = Array.isArray(input) ? input : FALLBACK_UI_EXTENSIONS.installed;
  const out = [];
  for (const id of source) {
    if (typeof id !== "string" || id === "default-theme") continue;
    if (!INSTALLABLE_IDS.has(id)) continue;
    if (out.includes(id)) continue;
    out.push(id);
  }
  return out;
}

/** Ensure theme / skin extensions used by the state are marked installed. */
function ensureInstalledForState(state) {
  const installed = [...state.installed];
  const need = [];
  if (state.activeTypography) need.push("typograph");
  if (state.activeThemeSource === "theme-pack") need.push("theme-pack");
  if (state.activeThemeSource === "macintosh-theme") need.push("macintosh-theme");
  if (state.activeThemeSource === "live-animation") need.push("live-animation");
  if (state.activeTerminalTheme) need.push("terminal-theme");
  if (state.activeChatTheme) need.push("chat-theme");
  for (const id of need) {
    if (!installed.includes(id)) installed.push(id);
  }
  return installed;
}

export function normalizeUiExtensions(input) {
  const raw = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const base = { ...FALLBACK_UI_EXTENSIONS, ...raw };
  const normalized = {
    installed: normalizeInstalled(base.installed),
    activeTypography: Boolean(base.activeTypography),
    activeThemeSource: asString(base.activeThemeSource, THEME_SOURCES, "default"),
    packTheme: asString(base.packTheme, PACK_THEME_VALUES, FALLBACK_UI_EXTENSIONS.packTheme),
    fontPack: asString(base.fontPack, FONT_VALUES, FALLBACK_UI_EXTENSIONS.fontPack),
    macVariant: asString(base.macVariant, MAC_VALUES, FALLBACK_UI_EXTENSIONS.macVariant),
    macTrafficLights: base.macTrafficLights !== false,
    liveAnimation: asString(
      base.liveAnimation,
      LIVE_VALUES,
      FALLBACK_UI_EXTENSIONS.liveAnimation
    ),
    activeTerminalTheme: Boolean(base.activeTerminalTheme),
    terminalTheme: asString(
      base.terminalTheme,
      TERMINAL_VALUES,
      FALLBACK_UI_EXTENSIONS.terminalTheme
    ),
    activeChatTheme: Boolean(base.activeChatTheme),
    chatTheme: asString(base.chatTheme, CHAT_VALUES, FALLBACK_UI_EXTENSIONS.chatTheme),
    revision: typeof base.revision === "string" ? base.revision : "",
  };
  normalized.installed = ensureInstalledForState(normalized);
  return normalized;
}

/** Compare UI defaults ignoring revision (for bump-on-real-change). */
export function uiExtensionsBodyEqual(a, b) {
  const left = normalizeUiExtensions(a);
  const right = normalizeUiExtensions(b);
  const { revision: _r1, ...bodyA } = left;
  const { revision: _r2, ...bodyB } = right;
  return JSON.stringify(bodyA) === JSON.stringify(bodyB);
}

export function cloneUiExtensions(state) {
  const normalized = normalizeUiExtensions(state);
  return {
    ...normalized,
    installed: [...normalized.installed],
  };
}

export function isExtensionActiveInState(state, id) {
  if (!state) return false;
  if (id === "default-theme") return state.activeThemeSource === "default";
  if (id === "typograph") return Boolean(state.activeTypography);
  if (id === "theme-pack") return state.activeThemeSource === "theme-pack";
  if (id === "macintosh-theme") return state.activeThemeSource === "macintosh-theme";
  if (id === "live-animation") return state.activeThemeSource === "live-animation";
  if (id === "terminal-theme") return Boolean(state.activeTerminalTheme);
  if (id === "chat-theme") return Boolean(state.activeChatTheme);
  return false;
}
