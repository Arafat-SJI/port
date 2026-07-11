import { DEFAULT_INSTALLED_EXTENSION_IDS } from "@/data/extensions";

export const EXTENSIONS_STORAGE_KEY = "portfolio-extensions-v7";
export const WORKSPACE_STORAGE_KEY = "portfolio-workspace-v1";

export const DEFAULT_EXTENSION_STATE = {
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
};

export const DEFAULT_WORKSPACE_STATE = {
  openExtensionTabs: [],
  activeTab: "#about",
  activeActivity: "explorer",
};

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function readExtensionState() {
  if (typeof window === "undefined") return DEFAULT_EXTENSION_STATE;

  const keys = [
    EXTENSIONS_STORAGE_KEY,
    "portfolio-extensions-v6",
    "portfolio-extensions-v5",
    "portfolio-extensions-v4",
    "portfolio-extensions-v3",
    "portfolio-extensions-v2",
    "portfolio-extensions-v1",
  ];

  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    const parsed = safeParse(raw);
    if (!parsed) continue;

    const installed =
      key === EXTENSIONS_STORAGE_KEY && Array.isArray(parsed.installed)
        ? parsed.installed
        : [...DEFAULT_EXTENSION_STATE.installed];

    return {
      ...DEFAULT_EXTENSION_STATE,
      installed,
      activeTypography: Boolean(parsed.activeTypography),
      activeThemeSource: parsed.activeThemeSource ?? DEFAULT_EXTENSION_STATE.activeThemeSource,
      packTheme: parsed.packTheme ?? DEFAULT_EXTENSION_STATE.packTheme,
      fontPack: parsed.fontPack ?? DEFAULT_EXTENSION_STATE.fontPack,
      macVariant: parsed.macVariant ?? DEFAULT_EXTENSION_STATE.macVariant,
      macTrafficLights: parsed.macTrafficLights ?? DEFAULT_EXTENSION_STATE.macTrafficLights,
      liveAnimation: parsed.liveAnimation ?? DEFAULT_EXTENSION_STATE.liveAnimation,
      activeTerminalTheme: Boolean(parsed.activeTerminalTheme),
      terminalTheme: parsed.terminalTheme ?? DEFAULT_EXTENSION_STATE.terminalTheme,
      activeChatTheme: Boolean(parsed.activeChatTheme),
      chatTheme: parsed.chatTheme ?? DEFAULT_EXTENSION_STATE.chatTheme,
    };
  }

  return DEFAULT_EXTENSION_STATE;
}

export function writeExtensionState(state) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    EXTENSIONS_STORAGE_KEY,
    JSON.stringify({
      installed: state.installed,
      activeTypography: state.activeTypography,
      activeThemeSource: state.activeThemeSource,
      packTheme: state.packTheme,
      fontPack: state.fontPack,
      macVariant: state.macVariant,
      macTrafficLights: state.macTrafficLights,
      liveAnimation: state.liveAnimation,
      activeTerminalTheme: state.activeTerminalTheme,
      terminalTheme: state.terminalTheme,
      activeChatTheme: state.activeChatTheme,
      chatTheme: state.chatTheme,
    })
  );
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
