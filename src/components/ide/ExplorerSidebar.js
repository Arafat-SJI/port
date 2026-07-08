import FileIcon from "@/components/ui/FileIcon";
import { NAV_ITEMS } from "@/data/portfolio";

export default function ExplorerSidebar({
  activeHref,
  portfolioExpanded,
  onPortfolioToggle,
  onNavClick,
}) {
  return (
    <aside className="flex w-[220px] shrink-0 flex-col bg-surface-container-lowest border-r border-border">
      <nav className="flex-1 overflow-y-auto py-1 custom-scrollbar">
        <button
          type="button"
          onClick={onPortfolioToggle}
          className="w-full px-4 py-0.5 flex items-center justify-between text-[10px] font-bold text-on-surface-variant opacity-60 uppercase hover:opacity-90 transition-opacity"
        >
          <span>PORTFOLIO</span>
          <span
            className={`material-symbols-outlined text-[14px] normal-case transition-transform duration-200 ease-in-out ${
              portfolioExpanded ? "" : "-rotate-90"
            }`}
          >
            keyboard_arrow_down
          </span>
        </button>
        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
            portfolioExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden min-h-0">
            <div>
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => onNavClick(e, item.href)}
                  className={`flex items-center gap-1.5 px-4 py-1 text-[12px] leading-tight transition-all ${
                    activeHref === item.href
                      ? "active-tab text-primary"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <FileIcon ext={item.ext} size={16} /> {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
