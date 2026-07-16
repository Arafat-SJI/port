import ExplorerSidebar from "@/components/ide/ExplorerSidebar";
import ExtensionsSidebar from "@/components/ide/ExtensionsSidebar";
import SearchSidebar from "@/components/ide/SearchSidebar";
import SourceControlSidebar from "@/components/ide/SourceControlSidebar";
import ChatPanel from "@/components/ide/ChatPanel";

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
  navItems,
  aboutContent,
}) {
  switch (activeActivity) {
    case "search":
      return (
        <SearchSidebar
          selectedSearchMatch={selectedSearchMatch}
          onSearchResultClick={onSearchResultClick}
          onSearchQueryChange={onSearchQueryChange}
          aboutContent={aboutContent}
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
    case "chat":
      return <ChatPanel />;
    case "explorer":
    default:
      return (
        <ExplorerSidebar
          activeHref={activeHref}
          portfolioExpanded={portfolioExpanded}
          onPortfolioToggle={onPortfolioToggle}
          onNavClick={onNavClick}
          navItems={navItems}
        />
      );
  }
}
