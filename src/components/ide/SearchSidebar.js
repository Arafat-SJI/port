"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FileIcon from "@/components/ui/FileIcon";
import { searchPortfolio } from "@/lib/searchIndex";
import { readSearchSession, writeSearchSession } from "@/lib/searchSession";
import { PREFS_CHANGED_EVENT } from "@/lib/sidebarPrefs";

const searchInputClass =
  "w-full h-[26px] bg-surface-container-high/80  border border-border/50 rounded-[3px] pl-2 text-[12px] text-on-surface placeholder:text-on-surface-variant/45 focus:outline-none focus:border-primary/35";

function InlineToggle({ title, active, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`flex items-center justify-center h-[18px] min-w-[18px] px-0.5 rounded-[2px] transition-colors ${
        active
          ? "bg-surface-bright/90 text-on-surface"
          : "text-on-surface-variant/75 hover:text-on-surface hover:bg-surface-container-highest/70"
      }`}
    >
      {children}
    </button>
  );
}

function Highlight({ text, query, matchCase }) {
  if (!query) return text;

  const flags = matchCase ? "g" : "gi";
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, flags));

  return parts.map((part, i) =>
    (matchCase ? part === query : part.toLowerCase() === query.toLowerCase()) ? (
      <mark key={i} className="search-match-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function SearchSidebar({
  selectedSearchMatch,
  onSearchResultClick,
  onSearchQueryChange,
  aboutContent,
  experienceContent,
  skillsContent,
  projectsContent,
  educationContent,
  awardsContent,
  publicationContent,
  galleryContent,
  clubingContent,
  mentorshipContent,
  contactContent,
}) {
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const initialSession = useMemo(() => readSearchSession(), []);
  const [query, setQuery] = useState(initialSession.query);
  const [matchCase, setMatchCase] = useState(initialSession.matchCase);
  const [wholeWord, setWholeWord] = useState(initialSession.wholeWord);
  const [useRegex, setUseRegex] = useState(initialSession.useRegex);
  const [expandedFiles, setExpandedFiles] = useState({});

  const results = useMemo(
    () =>
      searchPortfolio(
        query,
        { matchCase, wholeWord, useRegex },
        {
          aboutContent,
          experienceContent,
          skillsContent,
          projectsContent,
          educationContent,
          awardsContent,
          publicationContent,
          galleryContent,
          clubingContent,
          mentorshipContent,
          contactContent,
        }
      ),
    [
      query,
      matchCase,
      wholeWord,
      useRegex,
      aboutContent,
      experienceContent,
      skillsContent,
      projectsContent,
      educationContent,
      awardsContent,
      publicationContent,
      galleryContent,
      clubingContent,
      mentorshipContent,
      contactContent,
    ]
  );

  useEffect(() => {
    writeSearchSession({ query, matchCase, wholeWord, useRegex });
  }, [query, matchCase, wholeWord, useRegex]);

  useEffect(() => {
    const onPrefs = (event) => {
      const keys = event.detail?.keys;
      if (keys && !keys.includes("file-search")) return;
      const saved = readSearchSession();
      setQuery(saved.query);
      setMatchCase(saved.matchCase);
      setWholeWord(saved.wholeWord);
      setUseRegex(saved.useRegex);
      if (!saved.query.trim()) onSearchQueryChange?.();
    };
    window.addEventListener(PREFS_CHANGED_EVENT, onPrefs);
    return () => window.removeEventListener(PREFS_CHANGED_EVENT, onPrefs);
  }, [onSearchQueryChange]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setExpandedFiles({});
      return;
    }
    setExpandedFiles(Object.fromEntries(results.map(({ file }) => [file.href, true])));
  }, [query, results]);

  useEffect(() => {
    if (!selectedSearchMatch?.matchKey || !resultsRef.current) return;
    const selectedEl = resultsRef.current.querySelector(
      `[data-match-key="${selectedSearchMatch.matchKey}"]`
    );
    selectedEl?.scrollIntoView({ block: "nearest" });
  }, [selectedSearchMatch]);

  const totalMatches = results.reduce((sum, r) => sum + r.matches.length, 0);

  const toggleFile = (href) => {
    setExpandedFiles((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const handleResultClick = (file, match, matchKey) => {
    onSearchResultClick?.({
      matchKey,
      href: file.href,
      text: match.text,
      line: match.line,
      query,
      matchCase,
      wholeWord,
      useRegex,
    });
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    if (!value.trim()) onSearchQueryChange?.();
  };

  return (
    <aside className="flex h-full w-full min-h-0 flex-col bg-surface-container-lowest border-r border-border">
      <div className="shrink-0 px-[10px] pt-[6px] pb-2 space-y-1">
        <div className="space-y-1">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search"
              className={`${searchInputClass} pr-[62px]`}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-px">
              <InlineToggle
                title="Match Case"
                active={matchCase}
                onClick={() => setMatchCase((v) => !v)}
              >
                <span className="text-[10px] font-semibold leading-none">Aa</span>
              </InlineToggle>
              <InlineToggle
                title="Match Whole Word"
                active={wholeWord}
                onClick={() => setWholeWord((v) => !v)}
              >
                <span className="text-[10px] font-semibold leading-none">
                  a<span className="underline decoration-1 underline-offset-2">b</span>
                </span>
              </InlineToggle>
              <InlineToggle
                title="Use Regular Expression"
                active={useRegex}
                onClick={() => setUseRegex((v) => !v)}
              >
                <span className="text-[10px] font-semibold leading-none">.*</span>
              </InlineToggle>
            </div>
          </div>
        </div>

        {query.trim() && (
          <p className="text-[11px] text-on-surface-variant/80 px-0.5 pt-0.5">
            {totalMatches} result{totalMatches === 1 ? "" : "s"} in {results.length} file
            {results.length === 1 ? "" : "s"}
          </p>
        )}
      </div>

      <div ref={resultsRef} className="flex-1 min-h-0 overflow-y-auto custom-scrollbar py-1">
        {!query.trim() ? (
          <p className="px-4 py-3 text-[11px] text-on-surface-variant/70 leading-relaxed">
            Search across portfolio files by name or content.
          </p>
        ) : results.length === 0 ? (
          <p className="px-4 py-3 text-[11px] text-on-surface-variant/70">
            No results found. Try a different search term.
          </p>
        ) : (
          results.map(({ file, matches }) => {
            const isExpanded = expandedFiles[file.href] !== false;
            return (
              <div key={file.href} className="mb-px last:mb-0">
                <button
                  type="button"
                  onClick={() => toggleFile(file.href)}
                  className="w-full flex items-center gap-1 px-2 h-[20px] text-[11px] text-on-surface hover:bg-surface-container-hover-low transition-colors"
                >
                  <span
                    className={`material-symbols-outlined text-[13px] text-on-surface-variant transition-transform sidebar-collapse-icon ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  >
                    chevron_right
                  </span>
                  <FileIcon ext={file.ext} size={13} />
                  <span className="truncate flex-1 text-left">{file.label}</span>
                  <span className="text-[10px] text-on-surface-variant shrink-0 bg-surface-container-high px-1 rounded-full min-w-[16px] text-center">
                    {matches.length}
                  </span>
                </button>

                {isExpanded &&
                  matches.map((match, i) => {
                    const matchKey = `${file.href}:${match.line}:${i}`;
                    const isSelected = selectedSearchMatch?.matchKey === matchKey;
                    return (
                      <button
                        key={matchKey}
                        type="button"
                        data-match-key={matchKey}
                        onClick={() => handleResultClick(file, match, matchKey)}
                        className={`w-full flex items-center text-left pl-6 pr-2 h-[18px] text-[11px] leading-none transition-colors ${
                          isSelected
                            ? "bg-[#2b2f40] text-on-surface"
                            : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface-text"
                        }`}
                      >
                        <span className="text-on-surface-variant/55 mr-1.5 tabular-nums shrink-0">
                          {match.line}
                        </span>
                        <span className="truncate min-w-0">
                          <Highlight text={match.text} query={query} matchCase={matchCase} />
                        </span>
                      </button>
                    );
                  })}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
