import ExplorerSidebar from "@/components/ide/ExplorerSidebar";
import ExtensionsSidebar from "@/components/ide/ExtensionsSidebar";
import SearchSidebar from "@/components/ide/SearchSidebar";
import SourceControlSidebar from "@/components/ide/SourceControlSidebar";

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
      return <SourceControlSidebar />;
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
