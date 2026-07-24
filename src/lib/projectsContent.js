/** Projects section content — public portfolio only (Supabase `portfolio_settings` key `projects`). */

export const PROJECTS_SETTINGS_KEY = "projects";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `proj-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeUrl(raw) {
  const url = String(raw ?? "").trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function normalizeTags(raw) {
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

/** Seed / fallback when Supabase has no projects row yet. */
export const DEFAULT_PROJECTS_CONTENT = {
  title: "Selected Projects",
  subtitle: "Tools and platforms engineered for scale.",
  items: [
    {
      id: "proj-nexus-ide",
      title: "Nexus IDE",
      description:
        "An AI-first code editor built for the web with real-time collaborative features and integrated LLM code generation.",
      tags: ["React", "Next.js", "TypeScript"],
      liveUrl: "",
      codeUrl: "",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDGuYpex1AaA1tpiolhBgalyVsUkE5bQ6RAi28cqU2s5W-NvLolh2WOnhsMzZX7XXSfDbfFjzBn2UZwu5hzCDkU_SNKMMnljWhYvf0bguI8a999zYx8Lv9mDUVlVRiZ7gPnyvX-8oY6hBK9QuVGWMUGywG8any5gXmsIFcmUoDVaYvQW2TK_STVndixa9DlzvI4VlgYBs1yvkL-0kdMwEUvpWUdQ81-V1KYJBmqQ7OM5Bq3fXJoKsNoxp7bRK9gpjUd4jKX0GfLvAk",
      imageAlt:
        "A sleek dark-themed interface of a code editor, featuring sophisticated syntax highlighting in blues and teals.",
      visible: true,
    },
    {
      id: "proj-linear-clone",
      title: "Linear Clone",
      description:
        "A high-performance project management tool focused on keyboard-first navigation and extreme UI responsiveness.",
      tags: ["Rust", "Wasm", "PostgreSQL"],
      liveUrl: "",
      codeUrl: "",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBzAdWw8w4WeYUFLyG1hKC_HyYjqN07r2fYLlsDjY7yDWxupaKUSPTHj_PX75goZkVek6SRxkRkOuHnrhTopnW_G13xBq4g1uHMMRIlXvdLXDaKxjf1Zts-N7QbBOt4FTGX7e0JMl9h70XpJjecuoZMTpJD2ZPpLKiZGHKOhejEcZImTJr9akNt70OtmyxaIFHSQAvGlUqewe7XApbvOZFoXAxTXkD9l_umG0r0dh29ONGGfJIVlbeD3l5aF6o783vyEIToVUZF5P0",
      imageAlt:
        "A sophisticated project management dashboard layout featuring task cards, progress bars, and team avatars.",
      visible: true,
    },
    {
      id: "proj-pulse-analytics",
      title: "Pulse Analytics",
      description:
        "Real-time observability dashboard for microservices with custom alerting pipelines and anomaly detection.",
      tags: ["Go", "Grafana", "Kafka"],
      liveUrl: "",
      codeUrl: "",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDGuYpex1AaA1tpiolhBgalyVsUkE5bQ6RAi28cqU2s5W-NvLolh2WOnhsMzZX7XXSfDbfFjzBn2UZwu5hzCDkU_SNKMMnljWhYvf0bguI8a999zYx8Lv9mDUVlVRiZ7gPnyvX-8oY6hBK9QuVGWMUGywG8any5gXmsIFcmUoDVaYvQW2TK_STVndixa9DlzvI4VlgYBs1yvkL-0kdMwEUvpWUdQ81-V1KYJBmqQ7OM5Bq3fXJoKsNoxp7bRK9gpjUd4jKX0GfLvAk",
      imageAlt: "Analytics dashboard with charts and metrics on a dark interface.",
      visible: true,
    },
    {
      id: "proj-devkit-cli",
      title: "DevKit CLI",
      description:
        "Command-line toolkit for scaffolding monorepos, running health checks, and automating release workflows.",
      tags: ["Node.js", "CLI", "Docker"],
      liveUrl: "",
      codeUrl: "",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBzAdWw8w4WeYUFLyG1hKC_HyYjqN07r2fYLlsDjY7yDWxupaKUSPTHj_PX75goZkVek6SRxkRkOuHnrhTopnW_G13xBq4g1uHMMRIlXvdLXDaKxjf1Zts-N7QbBOt4FTGX7e0JMl9h70XpJjecuoZMTpJD2ZPpLKiZGHKOhejEcZImTJr9akNt70OtmyxaIFHSQAvGlUqewe7XApbvOZFoXAxTXkD9l_umG0r0dh29ONGGfJIVlbeD3l5aF6o783vyEIToVUZF5P0",
      imageAlt: "Terminal window showing CLI commands and output.",
      visible: true,
    },
  ],
};

export function normalizeProjectsItem(input, index = 0) {
  const raw = input && typeof input === "object" ? input : {};

  // Legacy demo shape used material icon names in `links`
  let liveUrl = normalizeUrl(raw.liveUrl ?? raw.url ?? "");
  let codeUrl = normalizeUrl(raw.codeUrl ?? raw.repoUrl ?? "");
  if (!liveUrl && !codeUrl && Array.isArray(raw.links)) {
    if (raw.links.includes("link")) liveUrl = normalizeUrl(raw.liveUrl || "");
    if (raw.links.includes("code")) codeUrl = normalizeUrl(raw.codeUrl || "");
  }

  return {
    id: String(raw.id ?? "").trim() || createId(),
    title: String(raw.title ?? "").trim(),
    description: String(raw.description ?? "").trim(),
    tags: normalizeTags(raw.tags),
    liveUrl,
    codeUrl,
    imageUrl: String(raw.imageUrl ?? raw.image ?? "").trim(),
    imageAlt: String(raw.imageAlt ?? raw.alt ?? "").trim(),
    visible: raw.visible !== false,
  };
}

export function normalizeProjectsContent(input) {
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
      : DEFAULT_PROJECTS_CONTENT.items;

  const items = itemsRaw
    .map((item, i) => normalizeProjectsItem(item, i))
    .filter((item) => item.title || item.description || item.tags.length);

  const titleRaw =
    !Array.isArray(raw) && raw && typeof raw === "object" ? raw.title : undefined;

  return {
    title:
      String(titleRaw ?? DEFAULT_PROJECTS_CONTENT.title).trim() ||
      DEFAULT_PROJECTS_CONTENT.title,
    subtitle: String(
      !Array.isArray(raw) && raw && typeof raw === "object"
        ? (raw.subtitle ?? DEFAULT_PROJECTS_CONTENT.subtitle)
        : DEFAULT_PROJECTS_CONTENT.subtitle
    ).trim(),
    items: items.length
      ? items
      : DEFAULT_PROJECTS_CONTENT.items.map((item, i) => normalizeProjectsItem(item, i)),
  };
}

export function getVisibleProjectsItems(content) {
  return normalizeProjectsContent(content).items.filter((item) => item.visible);
}

export function projectsSearchLines(content) {
  const { title, subtitle, items } = normalizeProjectsContent(content);
  const visible = items.filter((item) => item.visible);
  return [
    title,
    subtitle,
    ...visible.flatMap((item) => [
      item.title,
      item.description,
      item.imageAlt,
      ...item.tags,
    ]),
  ];
}

export function projectsForAiKnowledge(content) {
  const { title, subtitle } = normalizeProjectsContent(content);
  return {
    title,
    subtitle: subtitle || null,
    items: getVisibleProjectsItems(content).map((item) => ({
      title: item.title,
      description: item.description,
      tags: item.tags,
      liveUrl: item.liveUrl || null,
      codeUrl: item.codeUrl || null,
      imageUrl: item.imageUrl || null,
    })),
  };
}

export function createEmptyProjectsItem() {
  return normalizeProjectsItem({
    id: createId(),
    title: "",
    description: "",
    tags: [],
    liveUrl: "",
    codeUrl: "",
    imageUrl: "",
    imageAlt: "",
    visible: true,
  });
}
