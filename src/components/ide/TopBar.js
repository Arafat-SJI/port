"use client";

import { ACTIVITY_LABELS } from "@/data/portfolio";
import { useExtensions } from "@/hooks/useExtensions";
import MacTrafficLights from "@/components/ui/MacTrafficLights";
import EditorTabBar from "./EditorTabBar";

export default function TopBar({
  tabStripRef,
  activeTab,
  openExtensionTabs,
  activeActivity,
  onTabSelect,
  onExtensionTabClose,
  leftSidebarWidth = 280,
  rightSidebarWidth = 360,
  drawerMode = false,
  drawerOpen = false,
  onToggleDrawer,
  tabs,
}) {
  const sidebarTitle = ACTIVITY_LABELS[activeActivity] ?? ACTIVITY_LABELS.explorer;
  const { isActive, macTrafficLights } = useExtensions();
  const showTrafficLights = isActive("macintosh-theme") && macTrafficLights;

  return (
    <div className="flex h-7 shrink-0 bg-surface-container-lowest border-b border-border min-w-0">
      {drawerMode && (
        <button
          type="button"
          title={drawerOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={drawerOpen}
          onClick={onToggleDrawer}
          className={`flex h-7 w-8 shrink-0 items-center justify-center border-r border-border transition-colors ${
            drawerOpen
              ? "bg-error/30 text-error hover:bg-error/30"
              : "bg-secondary/20 text-secondary hover:bg-secondary/30"
          }`}
        >
          <span className="material-symbols-outlined !text-[18px]">
            {drawerOpen ? "close" : "menu"}
          </span>
        </button>
      )}
      {!drawerMode && (
        <div
          className="flex shrink-0 items-center justify-between px-4 border-r border-border ml-[-1px] min-w-0"
          style={{ width: leftSidebarWidth }}
        >
          <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase flex items-center gap-1 truncate">
            <span className="material-symbols-outlined text-[14px]">keyboard_arrow_down</span>{" "}
            {sidebarTitle}
          </span>
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant shrink-0">
            more_horiz
          </span>
        </div>
      )}
      <EditorTabBar
        tabStripRef={tabStripRef}
        activeTab={activeTab}
        openExtensionTabs={openExtensionTabs}
        onTabSelect={onTabSelect}
        onExtensionTabClose={onExtensionTabClose}
        tabs={tabs}
      />
      <div
        className="hidden min-[1020px]:flex shrink-0 items-stretch border-l border-border min-w-0"
        style={{ width: rightSidebarWidth }}
      >
        <button
          type="button"
          className="relative flex items-center gap-1.5 px-3 text-[11px] text-on-surface bg-background shrink-0"
        >
          <span className="absolute inset-x-0 top-0 h-px bg-secondary" />
          <span className="material-symbols-outlined text-[14px] text-secondary">chat_bubble</span>
          Chat
        </button>
        <div className="flex items-center gap-0.5 px-1 text-on-surface-variant ml-auto shrink-0">
          <button
            type="button"
            className="material-symbols-outlined text-[16px] p-1 rounded hover:bg-surface-container-low hover:text-on-surface transition-colors"
          >
            history
          </button>
          <button
            type="button"
            className="material-symbols-outlined text-[16px] p-1 rounded hover:bg-surface-container-low hover:text-on-surface transition-colors"
          >
            more_horiz
          </button>
        </div>
        {showTrafficLights && <MacTrafficLights />}
      </div>
      {showTrafficLights && (
        <div className="flex min-[1020px]:hidden shrink-0">
          <MacTrafficLights />
        </div>
      )}
    </div>
  );
}
