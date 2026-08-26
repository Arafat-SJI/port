import { useEffect, useState } from "react";
import { TERMINAL_MESSAGES } from "@/data/portfolio";
import { readExtensionState } from "@/lib/extensionStorage";
import { PREFS_CHANGED_EVENT } from "@/lib/sidebarPrefs";
import { collectWorkspaceChanges } from "@/lib/sourceControl";
import { getCachedSiteUiDefaults } from "@/lib/uiExtensions";

function readChangeCount() {
  if (typeof window === "undefined") return 0;
  const defaults = getCachedSiteUiDefaults();
  return collectWorkspaceChanges(readExtensionState(defaults), defaults).length;
}

function formatGitStatus(count) {
  if (count === 0) return "> git status... clean";
  return `> git status... ${count} modified`;
}

function messageAt(index, changeCount) {
  const raw = TERMINAL_MESSAGES[index] ?? TERMINAL_MESSAGES[0];
  if (raw.includes("git status")) return formatGitStatus(changeCount);
  return raw;
}

export function useTerminalMessages() {
  const [index, setIndex] = useState(1);
  const [changeCount, setChangeCount] = useState(0);

  useEffect(() => {
    const refresh = () => setChangeCount(readChangeCount());
    refresh();
    window.addEventListener(PREFS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(PREFS_CHANGED_EVENT, refresh);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeCount(readChangeCount());
      setIndex((current) => (current + 1) % TERMINAL_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return messageAt(index, changeCount);
}
