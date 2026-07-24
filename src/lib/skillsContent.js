/** Skills section content — public portfolio only (Supabase `portfolio_settings` key `skills`). */

export const SKILLS_SETTINGS_KEY = "skills";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `skill-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Seed / fallback when Supabase has no skills row yet. */
export const DEFAULT_SKILLS_CONTENT = {
  title: "Tech Stack",
  groups: [
    {
      id: "skill-frontend",
      title: "Frontend",
      items: ["React", "Next.js", "Vue", "Tailwind"],
      visible: true,
    },
    {
      id: "skill-backend",
      title: "Backend",
      items: ["Node.js", "Go", "PostgreSQL", "Redis"],
      visible: true,
    },
    {
      id: "skill-ai",
      title: "AI & Data",
      items: ["OpenAI", "LangChain", "PyTorch"],
      visible: true,
    },
    {
      id: "skill-cloud",
      title: "Cloud",
      items: ["AWS", "Docker", "K8s"],
      visible: true,
    },
  ],
};

function normalizeItems(raw) {
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item ?? "").trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function normalizeSkillsGroup(input, index = 0) {
  const raw = input && typeof input === "object" ? input : {};
  return {
    id: String(raw.id ?? "").trim() || createId(),
    title: String(raw.title ?? "").trim(),
    items: normalizeItems(raw.items),
    visible: raw.visible !== false,
  };
}

export function normalizeSkillsContent(input) {
  let raw = input;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = {};
    }
  }

  // Allow bare array of groups (legacy / seed shapes)
  const groupsRaw = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.groups)
      ? raw.groups
      : DEFAULT_SKILLS_CONTENT.groups;

  const groups = groupsRaw
    .map((group, i) => normalizeSkillsGroup(group, i))
    .filter((group) => group.title || group.items.length);

  const titleRaw =
    !Array.isArray(raw) && raw && typeof raw === "object" ? raw.title : undefined;

  return {
    title:
      String(titleRaw ?? DEFAULT_SKILLS_CONTENT.title).trim() ||
      DEFAULT_SKILLS_CONTENT.title,
    groups: groups.length
      ? groups
      : DEFAULT_SKILLS_CONTENT.groups.map((group, i) => normalizeSkillsGroup(group, i)),
  };
}

/** Groups shown on the public portfolio. */
export function getVisibleSkillsGroups(content) {
  return normalizeSkillsContent(content).groups.filter((group) => group.visible);
}

/** Lines used by portfolio search for #skills. */
export function skillsSearchLines(content) {
  const { title } = normalizeSkillsContent(content);
  return [
    title,
    ...getVisibleSkillsGroups(content).flatMap((group) => [group.title, ...group.items]),
  ];
}

/** Public fields for AI knowledge (visible groups only). */
export function skillsForAiKnowledge(content) {
  const { title } = normalizeSkillsContent(content);
  return {
    title,
    groups: getVisibleSkillsGroups(content).map((group) => ({
      title: group.title,
      items: group.items,
    })),
  };
}

export function createEmptySkillsGroup() {
  return normalizeSkillsGroup({
    id: createId(),
    title: "",
    items: [],
    visible: true,
  });
}
