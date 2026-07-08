import FileIcon from "@/components/ui/FileIcon";
import { OPEN_TABS } from "@/data/portfolio";

export default function EditorTabBar({ tabStripRef, activeHref, onNavClick }) {
  return (
    <div
      ref={tabStripRef}
      className="flex flex-1 min-w-0 items-stretch overflow-x-auto scroll-smooth tab-scrollbar"
    >
      {OPEN_TABS.map((tab) => {
        const isActive = activeHref === tab.href;
        return (
          <button
            key={tab.href}
            data-tab={tab.href}
            onClick={(e) => onNavClick(e, tab.href)}
            className={`group relative flex items-center gap-1.5 pl-2 pr-2 text-[12px] border-r border-border whitespace-nowrap transition-colors ${
              isActive
                ? "bg-background text-on-surface"
                : "text-on-surface-variant/70 hover:bg-surface-container-low hover:text-on-surface-variant"
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
    </div>
  );
}
