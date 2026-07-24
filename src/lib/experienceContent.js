/** Experience section content — public portfolio only (Supabase `portfolio_settings` key `experience`). */

export const EXPERIENCE_SETTINGS_KEY = "experience";

export const WORK_MODE_OPTIONS = ["On-site", "Remote"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_INDEX = Object.fromEntries(
  MONTH_NAMES.map((name, i) => [name.toLowerCase(), i + 1])
);

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `exp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Seed / fallback when Supabase has no experience row yet. */
export const DEFAULT_EXPERIENCE_CONTENT = {
  title: "Experience",
  items: [
    {
      id: "exp-sj-innovation",
      company: "SJ Innovation",
      companyUrl: "",
      role: "Jr. Software Engineer",
      workMode: "On-site",
      employmentType: "Full-time",
      startDate: "June 25, 2024",
      endDate: "Present",
      current: true,
      location: "Dhaka, Bangladesh",
      visible: true,
      bullets: [
        'Collaborated on the "CollabAI" project as a key team member. Integrated important features such as WorkBoard, Google SSO, Domain control, and more for enhanced functionality.',
        "Worked on multiple DXP and CMS projects with WordPress, Contentful, Contentstack, focused on optimizing performance, scalability, and user engagement.",
        "Conducted book reading sessions to encourage knowledge sharing and collaboration among team members.",
      ],
    },
  ],
};

/** Parse stored date → { y, m, d } or null. Accepts ISO or "June 25, 2024". */
export function parseExperienceDate(value) {
  const s = String(value ?? "").trim();
  if (!s || /^present$/i.test(s)) return null;

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (iso) {
    return { y: Number(iso[1]), m: Number(iso[2]), d: Number(iso[3]) };
  }

  const named = /^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/.exec(s);
  if (named) {
    const m = MONTH_INDEX[named[1].toLowerCase()];
    if (m) return { y: Number(named[3]), m, d: Number(named[2]) };
  }

  return null;
}

/** Display form used on portfolio + dashboard: "June 25, 2024". */
export function formatExperienceDateDisplay(value) {
  const parsed = parseExperienceDate(value);
  if (!parsed) return String(value ?? "").trim();
  return `${MONTH_NAMES[parsed.m - 1]} ${parsed.d}, ${parsed.y}`;
}

/** Value for `<input type="date">` (YYYY-MM-DD). */
export function toDateInputValue(value) {
  const parsed = parseExperienceDate(value);
  if (!parsed) return "";
  return `${parsed.y}-${String(parsed.m).padStart(2, "0")}-${String(parsed.d).padStart(2, "0")}`;
}

/** Convert date-input value to display string. */
export function fromDateInputValue(iso) {
  const parsed = parseExperienceDate(iso);
  if (!parsed) return "";
  return formatExperienceDateDisplay(iso);
}

export function formatExperiencePeriod(item) {
  const start = formatExperienceDateDisplay(item?.startDate);
  if (item?.current) {
    return start ? `${start} - Present` : "Present";
  }
  const end = formatExperienceDateDisplay(item?.endDate);
  if (start && end) return `${start} - ${end}`;
  return start || end || "";
}

export function formatExperienceRole(item) {
  const role = String(item?.role ?? "").trim();
  const mode = String(item?.workMode ?? "").trim();
  if (role && mode) return `${role} (${mode})`;
  return role || mode || "";
}

export function formatExperienceMeta(item) {
  const type = String(item?.employmentType ?? "").trim();
  const location = String(item?.location ?? "").trim();
  if (type && location) return `${type} | ${location}`;
  return type || location || "";
}

function normalizeBullets(raw) {
  if (Array.isArray(raw)) {
    return raw.map((b) => String(b ?? "").trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(/\n/)
      .map((b) => b.replace(/^[•\-\*]\s*/, "").trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeCompanyUrl(raw) {
  const url = String(raw ?? "").trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function normalizeWorkMode(raw) {
  const mode = String(raw ?? "").trim();
  if (WORK_MODE_OPTIONS.includes(mode)) return mode;
  if (/^on[\s-]?site$/i.test(mode)) return "On-site";
  if (/^remote$/i.test(mode)) return "Remote";
  return "";
}

function splitRoleAndWorkMode(roleRaw, workModeRaw) {
  let role = String(roleRaw ?? "").trim();
  let workMode = normalizeWorkMode(workModeRaw);
  if (!workMode) {
    const match = /\((On-site|Remote)\)\s*$/i.exec(role);
    if (match) {
      workMode = normalizeWorkMode(match[1]);
      role = role.slice(0, match.index).trim();
    }
  }
  return { role, workMode };
}

export function normalizeExperienceItem(input, index = 0) {
  const raw = input && typeof input === "object" ? input : {};
  const current = Boolean(raw.current);
  const startDate = formatExperienceDateDisplay(raw.startDate) || String(raw.startDate ?? "").trim();
  let endDate = String(raw.endDate ?? "").trim();
  if (current) endDate = "Present";
  else endDate = formatExperienceDateDisplay(endDate) || endDate;

  // Legacy demo shape: period + description string
  if (!startDate && typeof raw.period === "string" && raw.period.trim()) {
    const period = raw.period.trim();
    const isPresent = /present/i.test(period);
    const [legacyStart, legacyEnd] = period.split(/\s*[—–-]\s*/);
    return normalizeExperienceItem(
      {
        id: raw.id,
        company: raw.company,
        companyUrl: raw.companyUrl,
        role: raw.role,
        workMode: raw.workMode,
        employmentType: raw.employmentType || "",
        startDate: legacyStart || period,
        endDate: isPresent ? "Present" : legacyEnd || "",
        current: isPresent || Boolean(raw.current),
        location: raw.location || "",
        visible: raw.visible,
        bullets: raw.bullets ?? (raw.description ? [raw.description] : []),
      },
      index
    );
  }

  const { role, workMode } = splitRoleAndWorkMode(raw.role, raw.workMode);

  return {
    id: String(raw.id ?? "").trim() || createId(),
    company: String(raw.company ?? "").trim(),
    companyUrl: normalizeCompanyUrl(raw.companyUrl),
    role,
    workMode,
    employmentType: String(raw.employmentType ?? "").trim(),
    startDate,
    endDate: current ? "Present" : endDate,
    current,
    location: String(raw.location ?? "").trim(),
    visible: raw.visible !== false,
    bullets: normalizeBullets(raw.bullets),
  };
}

export function normalizeExperienceContent(input) {
  let raw = input;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = {};
    }
  }

  // Allow storing a bare array
  const itemsRaw = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.items)
      ? raw.items
      : DEFAULT_EXPERIENCE_CONTENT.items;

  const items = itemsRaw.map((item, i) => normalizeExperienceItem(item, i)).filter(
    (item) => item.company || item.role || item.bullets.length
  );

  const titleRaw =
    !Array.isArray(raw) && raw && typeof raw === "object" ? raw.title : undefined;

  return {
    title:
      String(titleRaw ?? DEFAULT_EXPERIENCE_CONTENT.title).trim() ||
      DEFAULT_EXPERIENCE_CONTENT.title,
    items: items.length ? items : DEFAULT_EXPERIENCE_CONTENT.items.map((item, i) =>
      normalizeExperienceItem(item, i)
    ),
  };
}

/** Items shown on the public portfolio (respects per-entry show/hide). */
export function getVisibleExperienceItems(content) {
  return normalizeExperienceContent(content).items.filter((item) => item.visible);
}

/** Lines used by portfolio search for #experience. */
export function experienceSearchLines(content) {
  const { title } = normalizeExperienceContent(content);
  return [
    title,
    ...getVisibleExperienceItems(content).flatMap((item) => [
      formatExperienceRole(item),
      item.company,
      item.employmentType,
      item.workMode,
      formatExperiencePeriod(item),
      item.location,
      ...item.bullets,
    ]),
  ];
}

/** Public fields for AI knowledge (visible entries only; no UI-only flags). */
export function experienceForAiKnowledge(content) {
  const { title } = normalizeExperienceContent(content);
  return {
    title,
    items: getVisibleExperienceItems(content).map((item) => ({
      company: item.company,
      companyUrl: item.companyUrl || null,
      role: formatExperienceRole(item),
      employmentType: item.employmentType,
      workMode: item.workMode || null,
      period: formatExperiencePeriod(item),
      location: item.location,
      current: item.current,
      bullets: item.bullets,
    })),
  };
}

export function createEmptyExperienceItem() {
  return normalizeExperienceItem({
    id: createId(),
    company: "",
    companyUrl: "",
    role: "",
    workMode: "On-site",
    employmentType: "Full-time",
    startDate: "",
    endDate: "",
    current: false,
    location: "",
    visible: true,
    bullets: [],
  });
}
