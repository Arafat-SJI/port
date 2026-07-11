const SEARCH_STORAGE_KEY = "portfolio-search-session-v1";
const EXTENSION_SEARCH_STORAGE_KEY = "portfolio-extension-search-v1";

export const DEFAULT_SEARCH_SESSION = {
  query: "",
  matchCase: false,
  wholeWord: false,
  useRegex: false,
};

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function readSearchSession() {
  if (typeof window === "undefined") return { ...DEFAULT_SEARCH_SESSION };

  try {
    const raw =
      localStorage.getItem(SEARCH_STORAGE_KEY) ??
      sessionStorage.getItem(SEARCH_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SEARCH_SESSION };

    const parsed = safeParse(raw);
    if (!parsed) return { ...DEFAULT_SEARCH_SESSION };

    return {
      query: typeof parsed.query === "string" ? parsed.query : "",
      matchCase: Boolean(parsed.matchCase),
      wholeWord: Boolean(parsed.wholeWord),
      useRegex: Boolean(parsed.useRegex),
    };
  } catch {
    return { ...DEFAULT_SEARCH_SESSION };
  }
}

export function writeSearchSession(state) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    SEARCH_STORAGE_KEY,
    JSON.stringify({
      query: state.query ?? "",
      matchCase: Boolean(state.matchCase),
      wholeWord: Boolean(state.wholeWord),
      useRegex: Boolean(state.useRegex),
    })
  );
}

export function clearSearchSession() {
  if (typeof window === "undefined") return;
  writeSearchSession(DEFAULT_SEARCH_SESSION);
}

export function readExtensionSearchSession() {
  if (typeof window === "undefined") return "";

  try {
    const raw =
      localStorage.getItem(EXTENSION_SEARCH_STORAGE_KEY) ??
      sessionStorage.getItem(EXTENSION_SEARCH_STORAGE_KEY);
    if (!raw) return "";
    const parsed = safeParse(raw);
    return typeof parsed?.query === "string" ? parsed.query : "";
  } catch {
    return "";
  }
}

export function writeExtensionSearchSession(query) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    EXTENSION_SEARCH_STORAGE_KEY,
    JSON.stringify({ query: query ?? "" })
  );
}

export function clearExtensionSearchSession() {
  writeExtensionSearchSession("");
}

export function isSearchSessionDirty(session = readSearchSession()) {
  return (
    session.query.trim() !== "" ||
    session.matchCase ||
    session.wholeWord ||
    session.useRegex
  );
}
