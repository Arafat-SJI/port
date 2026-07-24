/** Education section content — public portfolio only (Supabase `portfolio_settings` key `education`). */

export const EDUCATION_SETTINGS_KEY = "education";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `edu-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeHighlights(raw) {
  if (Array.isArray(raw)) {
    return raw.map((h) => String(h ?? "").trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(/\n/)
      .map((h) => h.replace(/^[•\-\*]\s*/, "").trim())
      .filter(Boolean);
  }
  return [];
}

/** Seed / fallback when Supabase has no education row yet. */
export const DEFAULT_EDUCATION_CONTENT = {
  title: "Education",
  items: [
    {
      id: "edu-buet",
      degree: "B.Sc. in Computer Science & Engineering",
      institution: "Bangladesh University of Engineering and Technology",
      period: "2016 — 2020",
      gpa: "3.85 / 4.00",
      highlights: ["Dean's List", "Thesis: Distributed Caching for Edge Networks"],
      visible: true,
    },
    {
      id: "edu-ndc",
      degree: "Higher Secondary Certificate",
      institution: "Notre Dame College, Dhaka",
      period: "2014 — 2016",
      gpa: "5.00 / 5.00",
      highlights: ["Science Division", "National Math Olympiad — Regional Finalist"],
      visible: true,
    },
  ],
};

export function normalizeEducationItem(input, index = 0) {
  const raw = input && typeof input === "object" ? input : {};
  return {
    id: String(raw.id ?? "").trim() || createId(),
    degree: String(raw.degree ?? "").trim(),
    institution: String(raw.institution ?? "").trim(),
    period: String(raw.period ?? "").trim(),
    gpa: String(raw.gpa ?? "").trim(),
    highlights: normalizeHighlights(raw.highlights),
    visible: raw.visible !== false,
  };
}

export function normalizeEducationContent(input) {
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
      : DEFAULT_EDUCATION_CONTENT.items;

  const titleRaw =
    !Array.isArray(raw) && raw && typeof raw === "object" ? raw.title : undefined;

  const items = itemsRaw
    .map((item, i) => normalizeEducationItem(item, i))
    .filter(
      (item) =>
        item.degree || item.institution || item.period || item.gpa || item.highlights.length
    );

  return {
    title:
      String(titleRaw ?? DEFAULT_EDUCATION_CONTENT.title).trim() ||
      DEFAULT_EDUCATION_CONTENT.title,
    items: items.length
      ? items
      : DEFAULT_EDUCATION_CONTENT.items.map((item, i) => normalizeEducationItem(item, i)),
  };
}

/** Items shown on the public portfolio (respects per-entry show/hide). */
export function getVisibleEducationItems(content) {
  return normalizeEducationContent(content).items.filter((item) => item.visible);
}

/** Lines used by portfolio search for #education. */
export function educationSearchLines(content) {
  const { title } = normalizeEducationContent(content);
  return [
    title,
    ...getVisibleEducationItems(content).flatMap((item) => [
      item.degree,
      item.institution,
      item.period,
      item.gpa,
      ...item.highlights,
    ]),
  ];
}

/** Public fields for AI knowledge (visible entries only; no UI-only flags). */
export function educationForAiKnowledge(content) {
  const { title } = normalizeEducationContent(content);
  return {
    title,
    items: getVisibleEducationItems(content).map((item) => ({
      degree: item.degree,
      institution: item.institution,
      period: item.period,
      gpa: item.gpa || null,
      highlights: item.highlights,
    })),
  };
}

export function createEmptyEducationItem() {
  return normalizeEducationItem({
    id: createId(),
    degree: "",
    institution: "",
    period: "",
    gpa: "",
    highlights: [],
    visible: true,
  });
}
