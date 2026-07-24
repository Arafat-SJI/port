/** Publication section content — public portfolio only (Supabase `portfolio_settings` key `publication`). */

export const PUBLICATION_SETTINGS_KEY = "publication";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `pub-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeLink(raw) {
  const url = String(raw ?? "").trim();
  if (!url || url === "#") return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

/** Seed / fallback when Supabase has no publication row yet. */
export const DEFAULT_PUBLICATION_CONTENT = {
  title: "Publication",
  items: [
    {
      id: "pub-cold-starts",
      title: "Optimizing Cold Starts in Serverless Edge Runtimes",
      authors: "A. Rahman, J. Chen, M. Patel",
      venue: "IEEE Cloud Computing",
      year: "2024",
      type: "Journal",
      link: "",
      visible: true,
    },
    {
      id: "pub-llm-orchestration",
      title: "A Survey of LLM Orchestration Patterns for Developer Tools",
      authors: "A. Rahman, S. Kim",
      venue: "ACM SIGSOFT FSE Companion",
      year: "2023",
      type: "Conference",
      link: "",
      visible: true,
    },
    {
      id: "pub-payment-gateways",
      title: "Building Resilient Payment Gateways at Scale",
      authors: "A. Rahman",
      venue: "Medium Engineering Blog",
      year: "2022",
      type: "Article",
      link: "",
      visible: true,
    },
  ],
};

export function normalizePublicationItem(input, index = 0) {
  const raw = input && typeof input === "object" ? input : {};
  return {
    id: String(raw.id ?? "").trim() || createId(),
    title: String(raw.title ?? "").trim(),
    authors: String(raw.authors ?? "").trim(),
    venue: String(raw.venue ?? "").trim(),
    year: String(raw.year ?? "").trim(),
    type: String(raw.type ?? "").trim(),
    link: normalizeLink(raw.link),
    visible: raw.visible !== false,
  };
}

export function normalizePublicationContent(input) {
  let raw = input;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = {};
    }
  }

  const itemsRaw = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.items)
      ? raw.items
      : DEFAULT_PUBLICATION_CONTENT.items;

  const titleRaw =
    !Array.isArray(raw) && raw && typeof raw === "object" ? raw.title : undefined;

  const items = itemsRaw
    .map((item, i) => normalizePublicationItem(item, i))
    .filter(
      (item) =>
        item.title || item.authors || item.venue || item.year || item.type || item.link
    );

  return {
    title:
      String(titleRaw ?? DEFAULT_PUBLICATION_CONTENT.title).trim() ||
      DEFAULT_PUBLICATION_CONTENT.title,
    items: items.length
      ? items
      : DEFAULT_PUBLICATION_CONTENT.items.map((item, i) =>
          normalizePublicationItem(item, i)
        ),
  };
}

/** Items shown on the public portfolio (respects per-entry show/hide). */
export function getVisiblePublicationItems(content) {
  return normalizePublicationContent(content).items.filter((item) => item.visible);
}

/** Lines used by portfolio search for #publication. */
export function publicationSearchLines(content) {
  const { title } = normalizePublicationContent(content);
  return [
    title,
    ...getVisiblePublicationItems(content).flatMap((item) => [
      item.title,
      item.authors,
      item.venue,
      item.year,
      item.type,
    ]),
  ];
}

/** Public fields for AI knowledge (visible entries only; no UI-only flags). */
export function publicationForAiKnowledge(content) {
  const { title } = normalizePublicationContent(content);
  return {
    title,
    items: getVisiblePublicationItems(content).map((item) => ({
      title: item.title,
      authors: item.authors,
      venue: item.venue,
      year: item.year || null,
      type: item.type || null,
      link: item.link || null,
    })),
  };
}

export function createEmptyPublicationItem() {
  return normalizePublicationItem({
    id: createId(),
    title: "",
    authors: "",
    venue: "",
    year: "",
    type: "",
    link: "",
    visible: true,
  });
}
