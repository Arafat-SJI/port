/** Mentorship section content — public portfolio only (Supabase `portfolio_settings` key `mentorship`). */

export const MENTORSHIP_SETTINGS_KEY = "mentorship";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `mentor-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeTopics(raw) {
  if (Array.isArray(raw)) {
    return raw.map((t) => String(t ?? "").trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(/[\n,]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeStats(raw) {
  const stats = raw && typeof raw === "object" ? raw : {};
  return {
    mentees:
      String(stats.mentees ?? DEFAULT_MENTORSHIP_CONTENT.stats.mentees).trim() ||
      DEFAULT_MENTORSHIP_CONTENT.stats.mentees,
    programs:
      String(stats.programs ?? DEFAULT_MENTORSHIP_CONTENT.stats.programs).trim() ||
      DEFAULT_MENTORSHIP_CONTENT.stats.programs,
    active:
      String(stats.active ?? DEFAULT_MENTORSHIP_CONTENT.stats.active).trim() ||
      DEFAULT_MENTORSHIP_CONTENT.stats.active,
  };
}

/** Seed / fallback when Supabase has no mentorship row yet. */
export const DEFAULT_MENTORSHIP_CONTENT = {
  title: "Mentorship",
  stats: {
    mentees: "8+",
    programs: "3",
    active: "4yr",
  },
  items: [
    {
      id: "mentor-gsoc",
      program: "Google Summer of Code",
      role: "Mentor",
      period: "2023 — Present",
      mentees: "6",
      topics: ["Open Source", "Distributed Systems", "Documentation"],
      description:
        "Guide students through 12-week coding projects with weekly syncs, code reviews, and milestone planning.",
      visible: true,
    },
    {
      id: "mentor-outreachy",
      program: "Outreachy",
      role: "Mentor",
      period: "2022 — 2023",
      mentees: "2",
      topics: ["Frontend", "Accessibility", "React"],
      description:
        "Supported interns building accessible UI components and contributing to production codebases.",
      visible: true,
    },
    {
      id: "mentor-career",
      program: "University Career Workshops",
      role: "Guest Speaker",
      period: "2021 — Present",
      mentees: "120+",
      topics: ["Interview Prep", "System Design", "Career Growth"],
      description:
        "Conduct sessions on technical interviews, resume building, and navigating early-career engineering roles.",
      visible: true,
    },
  ],
};

export function normalizeMentorshipItem(input, index = 0) {
  const raw = input && typeof input === "object" ? input : {};
  return {
    id: String(raw.id ?? "").trim() || createId(),
    program: String(raw.program ?? "").trim(),
    role: String(raw.role ?? "").trim(),
    period: String(raw.period ?? "").trim(),
    mentees: String(raw.mentees ?? "").trim(),
    topics: normalizeTopics(raw.topics),
    description: String(raw.description ?? "").trim(),
    visible: raw.visible !== false,
  };
}

export function normalizeMentorshipContent(input) {
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
      : DEFAULT_MENTORSHIP_CONTENT.items;

  const titleRaw =
    !Array.isArray(raw) && raw && typeof raw === "object" ? raw.title : undefined;

  const items = itemsRaw
    .map((item, i) => normalizeMentorshipItem(item, i))
    .filter(
      (item) =>
        item.program ||
        item.role ||
        item.period ||
        item.mentees ||
        item.description ||
        item.topics.length
    );

  return {
    title:
      String(titleRaw ?? DEFAULT_MENTORSHIP_CONTENT.title).trim() ||
      DEFAULT_MENTORSHIP_CONTENT.title,
    stats: normalizeStats(
      !Array.isArray(raw) && raw && typeof raw === "object" ? raw.stats : undefined
    ),
    items: items.length
      ? items
      : DEFAULT_MENTORSHIP_CONTENT.items.map((item, i) =>
          normalizeMentorshipItem(item, i)
        ),
  };
}

export function getVisibleMentorshipItems(content) {
  return normalizeMentorshipContent(content).items.filter((item) => item.visible);
}

export function mentorshipSearchLines(content) {
  const { title, stats } = normalizeMentorshipContent(content);
  return [
    title,
    stats.mentees,
    stats.programs,
    stats.active,
    ...getVisibleMentorshipItems(content).flatMap((item) => [
      item.program,
      item.role,
      item.period,
      item.mentees,
      item.description,
      ...item.topics,
    ]),
  ];
}

export function mentorshipForAiKnowledge(content) {
  const { title, stats } = normalizeMentorshipContent(content);
  return {
    title,
    stats,
    items: getVisibleMentorshipItems(content).map((item) => ({
      program: item.program,
      role: item.role,
      period: item.period,
      mentees: item.mentees || null,
      topics: item.topics,
      description: item.description,
    })),
  };
}

export function createEmptyMentorshipItem() {
  return normalizeMentorshipItem({
    id: createId(),
    program: "",
    role: "",
    period: "",
    mentees: "",
    topics: [],
    description: "",
    visible: true,
  });
}
