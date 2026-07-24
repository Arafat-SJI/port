/** Clubing section content — public portfolio only (Supabase `portfolio_settings` key `clubing`). */

export const CLUBING_SETTINGS_KEY = "clubing";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `club-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Seed / fallback when Supabase has no clubing row yet. */
export const DEFAULT_CLUBING_CONTENT = {
  title: "Clubing",
  items: [
    {
      id: "club-buetpc",
      name: "Buet Programming Club",
      role: "President",
      period: "2018 — 2020",
      description:
        "Led 200+ member community. Organized weekly contests, ICPC training camps, and annual intra-university hackathons.",
      visible: true,
    },
    {
      id: "club-gdsc",
      name: "Google Developer Student Clubs",
      role: "Core Organizer",
      period: "2019 — 2020",
      description:
        "Hosted study jams on Android, Cloud, and ML. Mentored 50+ students through their first open-source contributions.",
      visible: true,
    },
    {
      id: "club-ieee",
      name: "IEEE Computer Society — BUET",
      role: "Technical Lead",
      period: "2017 — 2019",
      description:
        "Coordinated technical workshops on web development, competitive programming, and system design fundamentals.",
      visible: true,
    },
    {
      id: "club-oss",
      name: "Open Source Collective",
      role: "Contributor",
      period: "2021 — Present",
      description:
        "Active maintainer across React ecosystem packages. Reviews PRs and triages issues for downstream dependents.",
      visible: true,
    },
  ],
};

export function normalizeClubingItem(input, index = 0) {
  const raw = input && typeof input === "object" ? input : {};
  return {
    id: String(raw.id ?? "").trim() || createId(),
    name: String(raw.name ?? "").trim(),
    role: String(raw.role ?? "").trim(),
    period: String(raw.period ?? "").trim(),
    description: String(raw.description ?? "").trim(),
    visible: raw.visible !== false,
  };
}

export function normalizeClubingContent(input) {
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
      : DEFAULT_CLUBING_CONTENT.items;

  const titleRaw =
    !Array.isArray(raw) && raw && typeof raw === "object" ? raw.title : undefined;

  const items = itemsRaw
    .map((item, i) => normalizeClubingItem(item, i))
    .filter((item) => item.name || item.role || item.period || item.description);

  return {
    title:
      String(titleRaw ?? DEFAULT_CLUBING_CONTENT.title).trim() ||
      DEFAULT_CLUBING_CONTENT.title,
    items: items.length
      ? items
      : DEFAULT_CLUBING_CONTENT.items.map((item, i) => normalizeClubingItem(item, i)),
  };
}

export function getVisibleClubingItems(content) {
  return normalizeClubingContent(content).items.filter((item) => item.visible);
}

export function clubingSearchLines(content) {
  const { title } = normalizeClubingContent(content);
  return [
    title,
    ...getVisibleClubingItems(content).flatMap((item) => [
      item.name,
      item.role,
      item.period,
      item.description,
    ]),
  ];
}

export function clubingForAiKnowledge(content) {
  const { title } = normalizeClubingContent(content);
  return {
    title,
    items: getVisibleClubingItems(content).map((item) => ({
      name: item.name,
      role: item.role,
      period: item.period,
      description: item.description,
    })),
  };
}

export function createEmptyClubingItem() {
  return normalizeClubingItem({
    id: createId(),
    name: "",
    role: "",
    period: "",
    description: "",
    visible: true,
  });
}
