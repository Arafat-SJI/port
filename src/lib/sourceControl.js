import { EXTENSIONS } from "@/data/extensions";
import {
  applyExtensionStateToDocument,
  clearExtensionState,
  readExtensionState,
  writeExtensionState,
  writeStoredUiDefaultsRevision,
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
import {
  cloneUiExtensions,
  getCachedSiteUiDefaults,
  isExtensionActiveInState,
  normalizeUiExtensions,
} from "@/lib/uiExtensions";

const TRACKED_EXTENSION_IDS = [
  "default-theme",
  "typograph",
  "theme-pack",
  "macintosh-theme",
  "live-animation",
  "terminal-theme",
  "chat-theme",
];

export const WORKSPACE_THEME_EXTENSION_IDS = [
  "default-theme",
  "theme-pack",
  "macintosh-theme",
  "live-animation",
];

function extensionName(id) {
  return EXTENSIONS.find((ext) => ext.id === id)?.name ?? id;
}

function resolveSiteDefaults(siteDefaults) {
  if (siteDefaults) return normalizeUiExtensions(siteDefaults);
  return getCachedSiteUiDefaults();
}

/** Option-level drift while an extension stays active on both sides. */
function extensionOptionsDetail(id, visitor, site) {
  if (id === "typograph" && visitor.fontPack !== site.fontPack) {
    return `Font pack → ${visitor.fontPack}`;
  }
  if (id === "theme-pack" && visitor.packTheme !== site.packTheme) {
    return `Theme → ${visitor.packTheme}`;
  }
  if (id === "macintosh-theme") {
    const bits = [];
    if (visitor.macVariant !== site.macVariant) bits.push(`Variant → ${visitor.macVariant}`);
    if (Boolean(visitor.macTrafficLights) !== Boolean(site.macTrafficLights)) {
      bits.push(visitor.macTrafficLights ? "Traffic lights on" : "Traffic lights off");
    }
    return bits.length ? bits.join(" · ") : null;
  }
  if (id === "live-animation" && visitor.liveAnimation !== site.liveAnimation) {
    return `Animation → ${visitor.liveAnimation}`;
  }
  if (id === "terminal-theme" && visitor.terminalTheme !== site.terminalTheme) {
    return `Skin → ${visitor.terminalTheme}`;
  }
  if (id === "chat-theme" && visitor.chatTheme !== site.chatTheme) {
    return `Skin → ${visitor.chatTheme}`;
  }
  return null;
}

/**
 * Collect working-tree style changes vs site (dashboard) defaults.
 * Lists visitor activations / option changes vs dashboard — not the site
 * default they left (e.g. Aqua→Cursor Dark only shows Cursor Dark Activated).
 */
export function collectWorkspaceChanges(extensionState, siteDefaults) {
  const changes = [];
  const defaults = resolveSiteDefaults(siteDefaults);
  const extState = extensionState ?? readExtensionState(defaults);
  const layout = getSidebarLayout();

  for (const id of TRACKED_EXTENSION_IDS) {
    const visitorOn = isExtensionActiveInState(extState, id);
    const siteOn = isExtensionActiveInState(defaults, id);

    // Only surface what the visitor turned on / changed — not the site default they left.
    if (visitorOn && !siteOn) {
      const opt = extensionOptionsDetail(id, extState, defaults);
      changes.push({
        id: `extension:${id}`,
        kind: "extension",
        extensionId: id,
        path: `extensions/${extensionName(id)}`,
        detail: opt ? `Activated · ${opt}` : "Activated",
      });
      continue;
    }

    if (visitorOn && siteOn) {
      const opt = extensionOptionsDetail(id, extState, defaults);
      if (opt) {
        changes.push({
          id: `extension:${id}`,
          kind: "extension",
          extensionId: id,
          path: `extensions/${extensionName(id)}`,
          detail: opt,
        });
      }
    }
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

/** Restore one extension activation back to site defaults. */
function restoreExtensionToSiteDefaults(state, id, siteDefaults) {
  const defaults = resolveSiteDefaults(siteDefaults);
  let next = { ...state };

  if (id === "typograph") {
    next = {
      ...next,
      activeTypography: defaults.activeTypography,
      fontPack: defaults.fontPack,
    };
  } else if (
    id === "default-theme" ||
    id === "theme-pack" ||
    id === "macintosh-theme" ||
    id === "live-animation"
  ) {
    next = {
      ...next,
      activeThemeSource: defaults.activeThemeSource,
      packTheme: defaults.packTheme,
      macVariant: defaults.macVariant,
      macTrafficLights: defaults.macTrafficLights,
      liveAnimation: defaults.liveAnimation,
    };
  } else if (id === "terminal-theme") {
    next = {
      ...next,
      activeTerminalTheme: defaults.activeTerminalTheme,
      terminalTheme: defaults.terminalTheme,
    };
  } else if (id === "chat-theme") {
    next = {
      ...next,
      activeChatTheme: defaults.activeChatTheme,
      chatTheme: defaults.chatTheme,
    };
  }

  return normalizeUiExtensions(next);
}

/**
 * Discard one change. Returns keys that UI listeners should refresh.
 * For extension discards, also returns `nextExtensionState` for the provider.
 */
export function discardWorkspaceChange(changeId, extensionState, siteDefaults) {
  const keys = [];
  const defaults = resolveSiteDefaults(siteDefaults);
  let nextExtensionState = extensionState ?? readExtensionState(defaults);
  const layout = getSidebarLayout();

  if (changeId.startsWith("extension:")) {
    const extensionId = changeId.slice("extension:".length);
    nextExtensionState = restoreExtensionToSiteDefaults(
      nextExtensionState,
      extensionId,
      defaults
    );
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

export function discardAllWorkspaceChanges(extensionState, siteDefaults) {
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
  const defaults = resolveSiteDefaults(siteDefaults);
  const nextExtensionState = cloneUiExtensions(defaults);
  clearExtensionState();
  if (defaults.revision) writeStoredUiDefaultsRevision(defaults.revision);
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
