const SEARCH_SESSION_KEY = "portfolio-search-session-v1";

export const DEFAULT_SEARCH_SESSION = {
  query: "",
  matchCase: false,
  wholeWord: false,
  useRegex: false,
};

let bootstrapped = false;

/** Wipe prior-page search once per full page load; keep writes for in-tab remounts. */
function bootstrap() {
  if (bootstrapped || typeof window === "undefined") return;
  bootstrapped = true;
  sessionStorage.removeItem(SEARCH_SESSION_KEY);
}

export function readSearchSession() {
  bootstrap();
  if (typeof window === "undefined") return { ...DEFAULT_SEARCH_SESSION };

  try {
    const raw = sessionStorage.getItem(SEARCH_SESSION_KEY);
    if (!raw) return { ...DEFAULT_SEARCH_SESSION };

    const parsed = JSON.parse(raw);
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
  bootstrap();
  if (typeof window === "undefined") return;

  sessionStorage.setItem(
    SEARCH_SESSION_KEY,
    JSON.stringify({
      query: state.query ?? "",
      matchCase: Boolean(state.matchCase),
      wholeWord: Boolean(state.wholeWord),
      useRegex: Boolean(state.useRegex),
    })
  );
}
