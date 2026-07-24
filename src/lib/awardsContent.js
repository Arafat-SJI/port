/** Awards section content — public portfolio only (Supabase `portfolio_settings` key `awards`). */

export const AWARDS_SETTINGS_KEY = "awards";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `award-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Seed / fallback when Supabase has no awards row yet. */
export const DEFAULT_AWARDS_CONTENT = {
  title: "Awards",
  items: [
    {
      id: "award-nexus",
      title: "Best Developer Tool",
      issuer: "DevFest Bangladesh",
      year: "2024",
      description: "Recognized for Nexus IDE — an open-source AI-powered code editor.",
      visible: true,
    },
    {
      id: "award-hackathon",
      title: "1st Place — Hackathon",
      issuer: "Google Developer Groups",
      year: "2023",
      description: "Built a real-time collaboration platform in 36 hours with a team of four.",
      visible: true,
    },
    {
      id: "award-graduate",
      title: "Outstanding Graduate",
      issuer: "BUET CSE Department",
      year: "2020",
      description: "Awarded for academic excellence and contributions to the programming club.",
      visible: true,
    },
    {
      id: "award-oss",
      title: "Open Source Contributor",
      issuer: "GitHub",
      year: "2022",
      description: "Arctic Vault contributor with 500+ merged PRs across ecosystem projects.",
      visible: true,
    },
  ],
};

export function normalizeAwardsItem(input, index = 0) {
  const raw = input && typeof input === "object" ? input : {};
  return {
    id: String(raw.id ?? "").trim() || createId(),
    title: String(raw.title ?? "").trim(),
    issuer: String(raw.issuer ?? "").trim(),
    year: String(raw.year ?? "").trim(),
    description: String(raw.description ?? "").trim(),
    visible: raw.visible !== false,
  };
}

export function normalizeAwardsContent(input) {
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
      : DEFAULT_AWARDS_CONTENT.items;

  const titleRaw =
    !Array.isArray(raw) && raw && typeof raw === "object" ? raw.title : undefined;

  const items = itemsRaw
    .map((item, i) => normalizeAwardsItem(item, i))
    .filter((item) => item.title || item.issuer || item.year || item.description);

  return {
    title:
      String(titleRaw ?? DEFAULT_AWARDS_CONTENT.title).trim() ||
      DEFAULT_AWARDS_CONTENT.title,
    items: items.length
      ? items
      : DEFAULT_AWARDS_CONTENT.items.map((item, i) => normalizeAwardsItem(item, i)),
  };
}

/** Items shown on the public portfolio (respects per-entry show/hide). */
export function getVisibleAwardsItems(content) {
  return normalizeAwardsContent(content).items.filter((item) => item.visible);
}

/** Lines used by portfolio search for #awards. */
export function awardsSearchLines(content) {
  const { title } = normalizeAwardsContent(content);
  return [
    title,
    ...getVisibleAwardsItems(content).flatMap((item) => [
      item.title,
      item.issuer,
      item.year,
      item.description,
    ]),
  ];
}

/** Public fields for AI knowledge (visible entries only; no UI-only flags). */
export function awardsForAiKnowledge(content) {
  const { title } = normalizeAwardsContent(content);
  return {
    title,
    items: getVisibleAwardsItems(content).map((item) => ({
      title: item.title,
      issuer: item.issuer,
      year: item.year || null,
      description: item.description,
    })),
  };
}

export function createEmptyAwardsItem() {
  return normalizeAwardsItem({
    id: createId(),
    title: "",
    issuer: "",
    year: "",
    description: "",
    visible: true,
  });
}
