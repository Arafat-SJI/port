"use client";

import { useEffect, useMemo, useState } from "react";
import { useExtensions } from "@/hooks/useExtensions";
import {
  collectWorkspaceChanges,
  discardAllWorkspaceChanges,
  discardWorkspaceChange,
  PREFS_CHANGED_EVENT,
} from "@/lib/sourceControl";

function ChangeRow({ change, onDiscard }) {
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 hover:bg-surface-container-hover-low">
      <span className="w-4 shrink-0 text-center text-[11px] font-semibold text-amber-400/90">
        M
      </span>
      <p className="min-w-0 flex-1 truncate text-[12px] leading-tight">
        <span className="text-on-surface-text opacity-85">{change.path}</span>
        <span className="text-on-surface-variant/55"> · {change.detail}</span>
      </p>
      <button
        type="button"
        title="Discard Changes"
        onClick={() => onDiscard(change.id)}
        className="shrink-0 flex h-6 w-6 items-center justify-center rounded text-on-surface-variant/70 hover:bg-surface-container-high hover:text-on-surface"
      >
        <span className="material-symbols-outlined !text-[16px]">undo</span>
      </button>
    </div>
  );
}

export default function SourceControlSidebar() {
  const extensions = useExtensions();
  const [tick, setTick] = useState(0);

  const extensionSnapshot = useMemo(
    () => ({
      installed: extensions.installed,
      activeTypography: extensions.activeTypography,
      activeThemeSource: extensions.activeThemeSource,
      packTheme: extensions.packTheme,
      fontPack: extensions.fontPack,
      macVariant: extensions.macVariant,
      macTrafficLights: extensions.macTrafficLights,
      liveAnimation: extensions.liveAnimation,
      activeTerminalTheme: extensions.activeTerminalTheme,
      terminalTheme: extensions.terminalTheme,
      activeChatTheme: extensions.activeChatTheme,
      chatTheme: extensions.chatTheme,
    }),
    [
      extensions.installed,
      extensions.activeTypography,
      extensions.activeThemeSource,
      extensions.packTheme,
      extensions.fontPack,
      extensions.macVariant,
      extensions.macTrafficLights,
      extensions.liveAnimation,
      extensions.activeTerminalTheme,
      extensions.terminalTheme,
      extensions.activeChatTheme,
      extensions.chatTheme,
    ]
  );

  const changes = useMemo(
    () => collectWorkspaceChanges(extensionSnapshot, extensions.siteDefaults),
    [extensionSnapshot, extensions.siteDefaults, tick]
  );

  useEffect(() => {
    const refresh = () => setTick((n) => n + 1);
    window.addEventListener(PREFS_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(PREFS_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const applyExtensionState = (next) => {
    if (!next || !extensions.applyExternalState) return;
    extensions.applyExternalState(next);
  };

  const handleDiscard = (changeId) => {
    const { nextExtensionState } = discardWorkspaceChange(
      changeId,
      extensionSnapshot,
      extensions.siteDefaults
    );
    applyExtensionState(nextExtensionState);
    setTick((n) => n + 1);
  };

  const handleDiscardAll = () => {
    if (changes.length === 0) return;
    const { nextExtensionState } = discardAllWorkspaceChanges(
      extensionSnapshot,
      extensions.siteDefaults
    );
    applyExtensionState(nextExtensionState);
    setTick((n) => n + 1);
  };

  return (
    <aside className="flex h-full w-full min-h-0 flex-col bg-surface-container-lowest border-r border-border">
      <div className="shrink-0 px-4 py-0.5 flex items-center justify-between">
        <p className="text-[11px] font-bold text-on-surface-variant opacity-80 uppercase">
          Source Control
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar py-1">
        {changes.length === 0 ? (
          <p className="px-4 py-6 text-[11px] text-on-surface-variant/70 leading-relaxed">
            No changes — working tree clean.
          </p>
        ) : (
          <div>
            <div className="px-4 py-1 flex items-center gap-2.5">
              <p className="text-[11px] font-bold text-on-surface-variant opacity-80 uppercase">
                Changes
                <span className="ml-1.5 opacity-70 normal-case font-medium">
                  {changes.length}
                </span>
              </p>
              <button
                type="button"
                title="Discard All Changes"
                onClick={handleDiscardAll}
                className="flex h-6 w-6 items-center justify-center rounded bg-surface-container-high/80 text-on-surface-variant/80 hover:bg-surface-container-highest hover:text-on-surface"
              >
                <span className="material-symbols-outlined !text-[16px]">undo</span>
              </button>
            </div>
            <div className="mt-0.5">
              {changes.map((change) => (
                <ChangeRow key={change.id} change={change} onDiscard={handleDiscard} />
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
