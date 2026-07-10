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
}) {
  const sidebarTitle = ACTIVITY_LABELS[activeActivity] ?? ACTIVITY_LABELS.explorer;
  const { isActive, macTrafficLights } = useExtensions();
  const showTrafficLights = isActive("macintosh-theme") && macTrafficLights;

  return (
    <div className="flex h-7 shrink-0 bg-surface-container-lowest border-b border-border min-w-0">
      <div className="flex w-[280px] shrink-0 items-center justify-between px-4 border-r border-border ml-[-1px]">
        <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">keyboard_arrow_down</span>{" "}
          {sidebarTitle}
        </span>        <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
          more_horiz
        </span>
      </div>
      <EditorTabBar
        tabStripRef={tabStripRef}
        activeTab={activeTab}
        openExtensionTabs={openExtensionTabs}
        onTabSelect={onTabSelect}
        onExtensionTabClose={onExtensionTabClose}
      />
      <div className="hidden xl:flex w-[360px] shrink-0 items-stretch border-l border-border min-w-[360px] max-w-[360px]">
        <button
          type="button"
          className="relative flex items-center gap-1.5 px-3 text-[11px] text-on-surface bg-background shrink-0"
        >
          <span className="absolute inset-x-0 top-0 h-px bg-secondary" />
          <span className="material-symbols-outlined text-[14px] text-secondary">chat_bubble</span>
          Chat
        </button>
        <div className="flex items-center gap-0.5 px-1 text-on-surface-variant ml-auto shrink-0">
          <button className="material-symbols-outlined text-[16px] p-1 rounded hover:bg-surface-container-low hover:text-on-surface transition-colors">
            history
          </button>
          <button className="material-symbols-outlined text-[16px] p-1 rounded hover:bg-surface-container-low hover:text-on-surface transition-colors">
            more_horiz
          </button>
        </div>
        {showTrafficLights && <MacTrafficLights />}
      </div>
      {showTrafficLights && (
        <div className="flex xl:hidden shrink-0">
          <MacTrafficLights />
        </div>
      )}
    </div>
  );
}
