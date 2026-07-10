import ExplorerSidebar from "@/components/ide/ExplorerSidebar";
import ExtensionsSidebar from "@/components/ide/ExtensionsSidebar";
import SearchSidebar from "@/components/ide/SearchSidebar";

function PlaceholderSidebar({ title, message }) {
  return (
    <aside className="flex w-[280px] shrink-0 flex-col min-h-0 bg-surface-container-lowest border-r border-border">
      <div className="px-4 py-6 text-[11px] text-on-surface-variant/70 leading-relaxed">
        <p className="font-bold text-on-surface-variant uppercase text-[10px] mb-2">{title}</p>
        <p>{message}</p>
      </div>
    </aside>
  );
}

export default function ActivitySidebar({
  activeActivity,
  activeHref,
  portfolioExpanded,
  onPortfolioToggle,
  onNavClick,
  selectedSearchMatch,
  onSearchResultClick,
  onSearchQueryChange,
  selectedExtensionId,
  onExtensionSelect,
}) {
  switch (activeActivity) {
    case "search":
      return (
        <SearchSidebar
          selectedSearchMatch={selectedSearchMatch}
          onSearchResultClick={onSearchResultClick}
          onSearchQueryChange={onSearchQueryChange}
        />
      );
    case "source-control":
      return (
        <PlaceholderSidebar
          title="Source Control"
          message="No source control providers registered."
        />
      );
    case "extensions":
      return (
        <ExtensionsSidebar
          selectedExtensionId={selectedExtensionId}
          onExtensionSelect={onExtensionSelect}
        />
      );
    case "explorer":
    default:
      return (
        <ExplorerSidebar
          activeHref={activeHref}
          portfolioExpanded={portfolioExpanded}
          onPortfolioToggle={onPortfolioToggle}
          onNavClick={onNavClick}
        />
      );
  }
}
