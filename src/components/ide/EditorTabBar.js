import FileIcon from "@/components/ui/FileIcon";
import { getExtensionById } from "@/data/extensions";

export default function EditorTabBar({
  tabStripRef,
  activeTab,
  openExtensionTabs,
  onTabSelect,
  onExtensionTabClose,
  tabs,
}) {
  return (
    <div
      ref={tabStripRef}
      className="flex flex-1 min-w-0 items-stretch overflow-x-auto scroll-smooth tab-scrollbar"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.href;
        return (
          <button
            key={tab.href}
            data-tab={tab.href}
            onClick={() => onTabSelect(tab.href)}
            className={`group relative flex items-center gap-1.5 pl-2 pr-2 text-[12px] border-r border-border whitespace-nowrap transition-colors ${
              isActive
                ? "bg-[#181a24] text-on-surface"
                : "text-on-surface-variant/90 hover:bg-surface-container-low hover:text-on-surface-variant"
            }`}
          >
            {isActive && <span className="absolute inset-x-0 top-0 h-px bg-primary" />}
            <span className={isActive ? "" : "opacity-60"}>
              <FileIcon ext={tab.ext} size={14} />
            </span>
            <span>{tab.label}</span>
            <span
              className={`material-symbols-outlined ml-0.5 rounded-sm p-0.5 hover:bg-surface-container-highest transition-opacity ${
                isActive ? "opacity-70" : "opacity-0 group-hover:opacity-70"
              }`}
            >
              close
            </span>
          </button>
        );
      })}

      {openExtensionTabs.map((extensionId) => {
        const extension = getExtensionById(extensionId);
        if (!extension) return null;
        const tabId = `extension:${extensionId}`;
        const isActive = activeTab === tabId;

        return (
          <button
            key={tabId}
            data-tab={tabId}
            onClick={() => onTabSelect(tabId)}
            className={`group relative flex items-center gap-1.5 pl-2 pr-2 text-[12px] border-r border-border whitespace-nowrap transition-colors ${
              isActive
                ? "bg-[#181a24] text-on-surface"
                : "text-on-surface-variant/90 hover:bg-surface-container-low hover:text-on-surface-variant"
            }`}
          >
            {isActive && <span className="absolute inset-x-0 top-0 h-px bg-primary" />}
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ color: isActive ? extension.iconColor : undefined, opacity: isActive ? 1 : 0.6 }}
            >
              {extension.icon}
            </span>
            <span>{extension.name}</span>
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => onExtensionTabClose(e, extensionId)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onExtensionTabClose(e, extensionId);
                }
              }}
              className={`material-symbols-outlined ml-0.5 rounded-sm p-0.5 hover:bg-surface-container-highest transition-opacity ${
                isActive ? "opacity-70" : "opacity-0 group-hover:opacity-70"
              }`}
            >
              close
            </span>
          </button>
        );
      })}
    </div>
  );
}
