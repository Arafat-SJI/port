"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";
import {
  DEFAULT_EXTENSION_STATE,
  applyExtensionStateToDocument,
  computeUiTheme,
  readExtensionState,
  writeExtensionState,
} from "@/lib/extensionStorage";

const ExtensionsContext = createContext(null);

export function ExtensionsProvider({ children }) {
  const [state, setState] = useState(DEFAULT_EXTENSION_STATE);
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    const saved = readExtensionState();
    setState(saved);
    applyExtensionStateToDocument(saved);
    setHydrated(true);
  }, []);

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
      if (id === "theme-pack" && next.activeThemeSource === "theme-pack") {
        next = { ...next, activeThemeSource: "default" };
      }
      if (id === "macintosh-theme" && next.activeThemeSource === "macintosh-theme") {
        next = { ...next, activeThemeSource: "default" };
      }
      if (id === "live-animation" && next.activeThemeSource === "live-animation") {
        next = { ...next, activeThemeSource: "default" };
      }
      if (id === "terminal-theme" && next.activeTerminalTheme) {
        next = { ...next, activeTerminalTheme: false };
      }
      if (id === "chat-theme" && next.activeChatTheme) {
        next = { ...next, activeChatTheme: false };
      }
      return next;
    });
  }, []);

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
      if (id === "default-theme") return prev;
      if (id === "typograph") {
        return { ...prev, activeTypography: false };
      }
      if (
        id === "theme-pack" ||
        id === "macintosh-theme" ||
        id === "live-animation"
      ) {
        if (prev.activeThemeSource !== id) return prev;
        return { ...prev, activeThemeSource: "default" };
      }
      if (id === "terminal-theme") {
        return { ...prev, activeTerminalTheme: false };
      }
      if (id === "chat-theme") {
        return { ...prev, activeChatTheme: false };
      }
      return prev;
    });
  }, []);

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
    setState((prev) => ({ ...prev, ...next }));
  }, []);

  const uiTheme = computeUiTheme(state);

  const value = useMemo(
    () => ({
      ...state,
      uiTheme,
      hydrated,
      isInstalled,
      isActive,
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
      isInstalled,
      isActive,
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
