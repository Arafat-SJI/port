"use client";

import { useLayoutEffect } from "react";
import {
  applyExtensionStateToDocument,
  readExtensionState,
} from "@/lib/extensionStorage";
import { getCachedSiteUiDefaults } from "@/lib/uiExtensions";

const DASHBOARD_HTML_DEFAULTS = {
  uiTheme: "default",
  fontPack: "inter",
};

function clearPortfolioThemeAttrs(html) {
  html.dataset.uiTheme = DASHBOARD_HTML_DEFAULTS.uiTheme;
  html.dataset.fontPack = DASHBOARD_HTML_DEFAULTS.fontPack;
  html.removeAttribute("data-mac-variant");
  html.removeAttribute("data-glass-ui");
  html.removeAttribute("data-mac-wallpaper");
  html.removeAttribute("data-live-animation");
  html.removeAttribute("data-terminal-theme");
  html.removeAttribute("data-chat-theme");
}

/**
 * Dashboard always uses the fixed Cursor Dark token set.
 * Portfolio extension / site-default themes must never restyle /dashboard-araf.
 */
export default function DashboardThemeLock() {
  useLayoutEffect(() => {
    const html = document.documentElement;
    clearPortfolioThemeAttrs(html);

    return () => {
      // Leaving dashboard → restore visitor / site portfolio theme.
      const defaults = getCachedSiteUiDefaults();
      applyExtensionStateToDocument(readExtensionState(defaults));
    };
  }, []);

  return null;
}
