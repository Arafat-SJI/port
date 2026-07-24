import { EXTENSIONS } from "@/data/extensions";
import {
  DEFAULT_EXTENSION_STATE,
  readExtensionState,
  writeExtensionState,
  applyExtensionStateToDocument,
} from "@/lib/extensionStorage";
import {
  clearExtensionSearchSession,
  clearSearchSession,
  isSearchSessionDirty,
  readExtensionSearchSession,
  readSearchSession,
} from "@/lib/searchSession";
import {
  clearChatSession,
  getChatSessionSummary,
  isChatSessionDirty,
  readChatSession,
} from "@/lib/chatSession";
import {
  clearExplorerPanels,
  clearOutlineExpanded,
  clearTimelineExpanded,
  isOutlineDirty,
  isTimelineDirty,
} from "@/lib/explorerPanels";
import {
  PREFS_CHANGED_EVENT,
  clearSidebarWidth,
  emitPrefsChanged,
  getSidebarLayout,
  readSidebarWidth,
} from "@/lib/sidebarPrefs";

function extensionName(id) {
  return EXTENSIONS.find((ext) => ext.id === id)?.name ?? id;
}

function getActiveExtensionIds(state) {
  const ids = [];
  if (state.activeTypography) ids.push("typograph");
  if (state.activeThemeSource === "theme-pack") ids.push("theme-pack");
  if (state.activeThemeSource === "macintosh-theme") ids.push("macintosh-theme");
  if (state.activeThemeSource === "live-animation") ids.push("live-animation");
  if (state.activeTerminalTheme) ids.push("terminal-theme");
  if (state.activeChatTheme) ids.push("chat-theme");
  return ids;
}

/**
 * Collect working-tree style changes vs portfolio defaults.
 * Pass live extension state when available so the SCM view stays in sync.
 */
export function collectWorkspaceChanges(extensionState) {
  const changes = [];
  const extState = extensionState ?? readExtensionState();
  const layout = getSidebarLayout();

  for (const id of getActiveExtensionIds(extState)) {
    changes.push({
      id: `extension:${id}`,
      kind: "extension",
      extensionId: id,
      path: `extensions/${extensionName(id)}`,
      detail: "Activated",
    });
  }

  const search = readSearchSession();
  if (isSearchSessionDirty(search)) {
    const bits = [];
    if (search.query.trim()) bits.push(`"${search.query.trim()}"`);
    if (search.matchCase) bits.push("Match Case");
    if (search.wholeWord) bits.push("Whole Word");
    if (search.useRegex) bits.push("Regex");
    changes.push({
      id: "search:file",
      kind: "file-search",
      path: "search/file-search",
      detail: bits.join(" · ") || "Options changed",
    });
  }

  const extQuery = readExtensionSearchSession().trim();
  if (extQuery) {
    changes.push({
      id: "search:extension",
      kind: "extension-search",
      path: "search/extension-search",
      detail: `"${extQuery}"`,
    });
  }

  const left = readSidebarWidth(layout.left.storageKey, layout.left.defaultWidth, {
    min: layout.left.min,
    max: layout.left.max,
  });
  if (!layout.left.fixed && left !== layout.left.defaultWidth) {
    changes.push({
      id: "layout:left-sidebar",
      kind: "left-sidebar",
      path: "layout/left-sidebar",
      detail: `${left}px (default ${layout.left.defaultWidth}px)`,
    });
  }

  const right = readSidebarWidth(layout.right.storageKey, layout.right.defaultWidth, {
    min: layout.right.min,
    max: layout.right.max,
  });
  if (!layout.right.fixed && right !== layout.right.defaultWidth) {
    changes.push({
      id: "layout:right-sidebar",
      kind: "right-sidebar",
      path: "layout/right-sidebar",
      detail: `${right}px (default ${layout.right.defaultWidth}px)`,
    });
  }

  const chat = readChatSession();
  if (isChatSessionDirty(chat)) {
    changes.push({
      id: "chat:thread",
      kind: "chat-session",
      path: "chat/thread",
      detail: getChatSessionSummary(chat),
    });
  }

  if (isOutlineDirty()) {
    changes.push({
      id: "explorer:outline",
      kind: "explorer-outline",
      path: "explorer/outline",
      detail: "Expanded",
    });
  }

  if (isTimelineDirty()) {
    changes.push({
      id: "explorer:timeline",
      kind: "explorer-timeline",
      path: "explorer/timeline",
      detail: "Expanded",
    });
  }

  return changes;
}

function deactivateExtensionInState(state, id) {
  let next = { ...state };
  if (id === "typograph") {
    next = { ...next, activeTypography: false };
  } else if (
    id === "theme-pack" ||
    id === "macintosh-theme" ||
    id === "live-animation"
  ) {
    if (next.activeThemeSource === id) {
      next = { ...next, activeThemeSource: "default" };
    }
  } else if (id === "terminal-theme") {
    next = { ...next, activeTerminalTheme: false };
  } else if (id === "chat-theme") {
    next = { ...next, activeChatTheme: false };
  }
  return next;
}

function resetExtensionActivations(state) {
  return {
    ...state,
    activeTypography: DEFAULT_EXTENSION_STATE.activeTypography,
    activeThemeSource: DEFAULT_EXTENSION_STATE.activeThemeSource,
    packTheme: DEFAULT_EXTENSION_STATE.packTheme,
    fontPack: DEFAULT_EXTENSION_STATE.fontPack,
    macVariant: DEFAULT_EXTENSION_STATE.macVariant,
    liveAnimation: DEFAULT_EXTENSION_STATE.liveAnimation,
    activeTerminalTheme: DEFAULT_EXTENSION_STATE.activeTerminalTheme,
    terminalTheme: DEFAULT_EXTENSION_STATE.terminalTheme,
    activeChatTheme: DEFAULT_EXTENSION_STATE.activeChatTheme,
    chatTheme: DEFAULT_EXTENSION_STATE.chatTheme,
  };
}

/**
 * Discard one change. Returns keys that UI listeners should refresh.
 * For extension discards, also returns `nextExtensionState` for the provider.
 */
export function discardWorkspaceChange(changeId, extensionState) {
  const keys = [];
  let nextExtensionState = extensionState ?? readExtensionState();
  const layout = getSidebarLayout();

  if (changeId.startsWith("extension:")) {
    const extensionId = changeId.slice("extension:".length);
    nextExtensionState = deactivateExtensionInState(nextExtensionState, extensionId);
    writeExtensionState(nextExtensionState);
    applyExtensionStateToDocument(nextExtensionState);
    keys.push("extensions");
  } else if (changeId === "search:file") {
    clearSearchSession();
    keys.push("file-search");
  } else if (changeId === "search:extension") {
    clearExtensionSearchSession();
    keys.push("extension-search");
  } else if (changeId === "layout:left-sidebar") {
    clearSidebarWidth(layout.left.storageKey, layout.left.defaultWidth);
    keys.push("left-sidebar");
  } else if (changeId === "layout:right-sidebar") {
    clearSidebarWidth(layout.right.storageKey, layout.right.defaultWidth);
    keys.push("right-sidebar");
  } else if (changeId === "chat:thread") {
    clearChatSession({ emit: false });
    keys.push("chat-session");
  } else if (changeId === "explorer:outline") {
    clearOutlineExpanded({ emit: false });
    keys.push("explorer-outline");
  } else if (changeId === "explorer:timeline") {
    clearTimelineExpanded({ emit: false });
    keys.push("explorer-timeline");
  }

  emitPrefsChanged({ keys, nextExtensionState });
  return { keys, nextExtensionState };
}

export function discardAllWorkspaceChanges(extensionState) {
  const keys = [
    "extensions",
    "file-search",
    "extension-search",
    "left-sidebar",
    "right-sidebar",
    "chat-session",
    "explorer-outline",
    "explorer-timeline",
  ];
  const layout = getSidebarLayout();
  let nextExtensionState = resetExtensionActivations(
    extensionState ?? readExtensionState()
  );
  writeExtensionState(nextExtensionState);
  applyExtensionStateToDocument(nextExtensionState);
  clearSearchSession();
  clearExtensionSearchSession();
  clearChatSession({ emit: false });
  clearExplorerPanels({ emit: false });
  clearSidebarWidth(layout.left.storageKey, layout.left.defaultWidth);
  clearSidebarWidth(layout.right.storageKey, layout.right.defaultWidth);
  emitPrefsChanged({ keys, nextExtensionState });
  return { keys, nextExtensionState };
}

export { PREFS_CHANGED_EVENT };
