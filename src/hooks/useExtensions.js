"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";
import {
  DEFAULT_EXTENSION_STATE,
  applyExtensionStateToDocument,
  computeUiTheme,
  readExtensionState,
  writeExtensionState,
} from "@/lib/extensionStorage";
import {
  cloneUiExtensions,
  isExtensionActiveInState,
  normalizeUiExtensions,
  setCachedSiteUiDefaults,
} from "@/lib/uiExtensions";

const ExtensionsContext = createContext(null);

const WORKSPACE_THEME_IDS = new Set([
  "default-theme",
  "theme-pack",
  "macintosh-theme",
  "live-animation",
]);

function siteWorkspaceThemeSource(defaults) {
  return defaults?.activeThemeSource || "default";
}

export function ExtensionsProvider({ children, siteDefaults }) {
  const defaultsKey = JSON.stringify(siteDefaults ?? null);
  const defaults = useMemo(
    () => normalizeUiExtensions(siteDefaults ?? DEFAULT_EXTENSION_STATE),
    // Intentionally key off serialized defaults so SSR object identity does not re-hydrate forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultsKey]
  );

  useLayoutEffect(() => {
    setCachedSiteUiDefaults(defaults);
  }, [defaults]);
  const [state, setState] = useState(() => cloneUiExtensions(defaults));
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    const saved = readExtensionState(defaults);
    setState(saved);
    applyExtensionStateToDocument(saved);
    setHydrated(true);
  }, [defaults]);

  useLayoutEffect(() => {
    if (!hydrated) return;
    writeExtensionState(state);
    applyExtensionStateToDocument(state);
  }, [state, hydrated]);

  const isInstalled = useCallback(
    (id) => id === "default-theme" || state.installed.includes(id),
    [state.installed]
  );

  const isActive = useCallback(
    (id) => {
      if (id === "default-theme") return state.activeThemeSource === "default";
      if (id === "typograph") return state.activeTypography;
      if (id === "theme-pack") return state.activeThemeSource === "theme-pack";
      if (id === "macintosh-theme") return state.activeThemeSource === "macintosh-theme";
      if (id === "live-animation") return state.activeThemeSource === "live-animation";
      if (id === "terminal-theme") return state.activeTerminalTheme;
      if (id === "chat-theme") return state.activeChatTheme;
      return false;
    },
    [state.activeThemeSource, state.activeTypography, state.activeTerminalTheme, state.activeChatTheme]
  );

  const install = useCallback((id) => {
    if (id === "default-theme") return;
    setState((prev) => {
      if (prev.installed.includes(id)) return prev;
      return { ...prev, installed: [...prev.installed, id] };
    });
  }, []);

  const uninstall = useCallback((id) => {
    if (id === "default-theme") return;
    setState((prev) => {
      if (!prev.installed.includes(id)) return prev;
      let next = {
        ...prev,
        installed: prev.installed.filter((item) => item !== id),
      };
      if (id === "typograph" && next.activeTypography) {
        next = { ...next, activeTypography: false };
      }
      const siteTheme = siteWorkspaceThemeSource(defaults);
      if (id === "theme-pack" && next.activeThemeSource === "theme-pack") {
        next = { ...next, activeThemeSource: siteTheme };
      }
      if (id === "macintosh-theme" && next.activeThemeSource === "macintosh-theme") {
        next = { ...next, activeThemeSource: siteTheme };
      }
      if (id === "live-animation" && next.activeThemeSource === "live-animation") {
        next = { ...next, activeThemeSource: siteTheme };
      }
      if (id === "terminal-theme" && next.activeTerminalTheme) {
        next = { ...next, activeTerminalTheme: false };
      }
      if (id === "chat-theme" && next.activeChatTheme) {
        next = { ...next, activeChatTheme: false };
      }
      return next;
    });
  }, [defaults]);

  const activate = useCallback((id) => {
    setState((prev) => {
      if (id === "default-theme") {
        return { ...prev, activeThemeSource: "default" };
      }
      if (id === "typograph") {
        if (!prev.installed.includes("typograph")) return prev;
        return { ...prev, activeTypography: true };
      }
      if (id === "theme-pack") {
        if (!prev.installed.includes("theme-pack")) return prev;
        return { ...prev, activeThemeSource: "theme-pack" };
      }
      if (id === "macintosh-theme") {
        if (!prev.installed.includes("macintosh-theme")) return prev;
        return { ...prev, activeThemeSource: "macintosh-theme" };
      }
      if (id === "live-animation") {
        if (!prev.installed.includes("live-animation")) return prev;
        return { ...prev, activeThemeSource: "live-animation" };
      }
      if (id === "terminal-theme") {
        if (!prev.installed.includes("terminal-theme")) return prev;
        return { ...prev, activeTerminalTheme: true };
      }
      if (id === "chat-theme") {
        if (!prev.installed.includes("chat-theme")) return prev;
        return { ...prev, activeChatTheme: true };
      }
      return prev;
    });
  }, []);

  const deactivate = useCallback((id) => {
    setState((prev) => {
      if (id === "typograph") {
        return { ...prev, activeTypography: false };
      }
      if (WORKSPACE_THEME_IDS.has(id)) {
        const sourceKey = id === "default-theme" ? "default" : id;
        if (prev.activeThemeSource !== sourceKey) return prev;
        // Fall back to dashboard site default theme (not hardcoded Cursor Dark).
        return {
          ...prev,
          activeThemeSource: siteWorkspaceThemeSource(defaults),
          packTheme: defaults.packTheme,
          macVariant: defaults.macVariant,
          macTrafficLights: defaults.macTrafficLights,
          liveAnimation: defaults.liveAnimation,
        };
      }
      if (id === "terminal-theme") {
        return { ...prev, activeTerminalTheme: false };
      }
      if (id === "chat-theme") {
        return { ...prev, activeChatTheme: false };
      }
      return prev;
    });
  }, [defaults]);

  const isSiteDefault = useCallback(
    (id) => isExtensionActiveInState(defaults, id),
    [defaults]
  );

  const setFontPack = useCallback((fontPack) => {
    setState((prev) => ({ ...prev, fontPack }));
  }, []);

  const setPackTheme = useCallback((packTheme) => {
    setState((prev) => ({ ...prev, packTheme }));
  }, []);

  const setMacVariant = useCallback((macVariant) => {
    setState((prev) => ({ ...prev, macVariant }));
  }, []);

  const setMacTrafficLights = useCallback((macTrafficLights) => {
    setState((prev) => ({ ...prev, macTrafficLights }));
  }, []);

  const setLiveAnimation = useCallback((liveAnimation) => {
    setState((prev) => ({ ...prev, liveAnimation }));
  }, []);

  const setTerminalTheme = useCallback((terminalTheme) => {
    setState((prev) => ({ ...prev, terminalTheme }));
  }, []);

  const setChatTheme = useCallback((chatTheme) => {
    setState((prev) => ({ ...prev, chatTheme }));
  }, []);

  const applyExternalState = useCallback((next) => {
    if (!next) return;
    setState((prev) => normalizeUiExtensions({ ...prev, ...next }));
  }, []);

  const uiTheme = computeUiTheme(state);

  const value = useMemo(
    () => ({
      ...state,
      uiTheme,
      hydrated,
      siteDefaults: defaults,
      isInstalled,
      isActive,
      isSiteDefault,
      install,
      uninstall,
      activate,
      deactivate,
      setFontPack,
      setPackTheme,
      setMacVariant,
      setMacTrafficLights,
      setLiveAnimation,
      setTerminalTheme,
      setChatTheme,
      applyExternalState,
    }),
    [
      state,
      uiTheme,
      hydrated,
      defaults,
      isInstalled,
      isActive,
      isSiteDefault,
      install,
      uninstall,
      activate,
      deactivate,
      setFontPack,
      setPackTheme,
      setMacVariant,
      setMacTrafficLights,
      setLiveAnimation,
      setTerminalTheme,
      setChatTheme,
      applyExternalState,
    ]
  );

  return <ExtensionsContext.Provider value={value}>{children}</ExtensionsContext.Provider>;
}

export function useExtensions() {
  const ctx = useContext(ExtensionsContext);
  if (!ctx) throw new Error("useExtensions must be used within ExtensionsProvider");
  return ctx;
}
