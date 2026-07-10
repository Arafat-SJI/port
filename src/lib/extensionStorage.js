export const EXTENSIONS_STORAGE_KEY = "portfolio-extensions-v4";
export const WORKSPACE_STORAGE_KEY = "portfolio-workspace-v1";

export const DEFAULT_EXTENSION_STATE = {
  installed: [],
  activeTypography: false,
  activeThemeSource: "default",
  packTheme: "default",
  fontPack: "inter",
  macVariant: "sonoma",
  macTrafficLights: true,
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
    "portfolio-extensions-v3",
    "portfolio-extensions-v2",
    "portfolio-extensions-v1",
  ];

  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    const parsed = safeParse(raw);
    if (!parsed) continue;

    return {
      ...DEFAULT_EXTENSION_STATE,
      installed: Array.isArray(parsed.installed) ? parsed.installed : [],
      activeTypography: Boolean(parsed.activeTypography),
      activeThemeSource: parsed.activeThemeSource ?? DEFAULT_EXTENSION_STATE.activeThemeSource,
      packTheme: parsed.packTheme ?? DEFAULT_EXTENSION_STATE.packTheme,
      fontPack: parsed.fontPack ?? DEFAULT_EXTENSION_STATE.fontPack,
      macVariant: parsed.macVariant ?? DEFAULT_EXTENSION_STATE.macVariant,
      macTrafficLights: parsed.macTrafficLights ?? DEFAULT_EXTENSION_STATE.macTrafficLights,
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
  html.dataset.uiTheme = computeUiTheme(state);
  html.dataset.fontPack = state.activeTypography ? state.fontPack : "inter";
  html.dataset.macVariant = macActive ? state.macVariant : "";
  html.dataset.glassUi = macActive ? "true" : "false";
  html.dataset.macWallpaper = macActive ? "true" : "false";
}
