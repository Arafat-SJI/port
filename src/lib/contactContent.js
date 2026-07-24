/** Contact section content — public portfolio only (Supabase `portfolio_settings` key `contact`). */

export const CONTACT_SETTINGS_KEY = "contact";

export const CONTACT_SOCIAL_PLATFORMS = [
  { id: "linkedin", label: "linkedin", color: "#0A66C2" },
  { id: "facebook", label: "facebook", color: "#1877F2" },
  { id: "whatsapp", label: "whatsapp", color: "#25D366" },
  { id: "telegram", label: "telegram", color: "#26A5E4" },
];

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `contact-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeUrl(raw) {
  const url = String(raw ?? "").trim();
  if (!url || url === "#") return "";
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
  return `https://${url}`;
}

function normalizeSocial(input, fallback) {
  const raw = input && typeof input === "object" ? input : {};
  const platformId = String(raw.platform ?? fallback?.id ?? "").trim() || fallback?.id || "linkedin";
  const meta =
    CONTACT_SOCIAL_PLATFORMS.find((p) => p.id === platformId) ??
    fallback ??
    CONTACT_SOCIAL_PLATFORMS[0];

  return {
    id: String(raw.id ?? "").trim() || meta.id || createId(),
    platform: meta.id,
    label: String(raw.label ?? meta.label).trim() || meta.label,
    url: normalizeUrl(raw.url),
    visible: raw.visible !== false,
  };
}

/** Seed / fallback when Supabase has no contact row yet. */
export const DEFAULT_CONTACT_CONTENT = {
  intro:
    "Happy to connect — whether it's a project idea, a quick question, or just saying hello. Reach out anytime.",
  email: "hello@arafat.workspace",
  githubLabel: "github",
  githubUrl: "",
  socials: CONTACT_SOCIAL_PLATFORMS.map((platform) => ({
    id: platform.id,
    platform: platform.id,
    label: platform.label,
    url: "",
    visible: true,
  })),
};

export function getSocialPlatformMeta(platformId) {
  return (
    CONTACT_SOCIAL_PLATFORMS.find((p) => p.id === platformId) ?? {
      id: platformId,
      label: platformId,
      color: "#adc6ff",
    }
  );
}

export function normalizeContactContent(input) {
  let raw = input;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = {};
    }
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    raw = {};
  }

  // Legacy static shape: { email, social, intro }
  const legacySocial = String(raw.social ?? "").trim();

  const socialsRaw = Array.isArray(raw.socials)
    ? raw.socials
    : DEFAULT_CONTACT_CONTENT.socials;

  const byPlatform = new Map(
    socialsRaw.map((item) => {
      const normalized = normalizeSocial(item);
      return [normalized.platform, normalized];
    })
  );

  const socials = CONTACT_SOCIAL_PLATFORMS.map((platform) => {
    const existing = byPlatform.get(platform.id);
    if (existing) return normalizeSocial(existing, platform);
    return normalizeSocial(
      {
        id: platform.id,
        platform: platform.id,
        label: platform.label,
        url: "",
        visible: true,
      },
      platform
    );
  });

  return {
    intro:
      String(raw.intro ?? DEFAULT_CONTACT_CONTENT.intro).trim() ||
      DEFAULT_CONTACT_CONTENT.intro,
    email: String(raw.email ?? DEFAULT_CONTACT_CONTENT.email).trim(),
    githubLabel:
      String(raw.githubLabel ?? DEFAULT_CONTACT_CONTENT.githubLabel).trim() ||
      "github",
    githubUrl: normalizeUrl(raw.githubUrl),
    socials,
    // Keep legacy handle out of public payload; only used if migrating display text
    _legacySocial: legacySocial || null,
  };
}

export function getVisibleContactSocials(content) {
  return normalizeContactContent(content).socials.filter(
    (item) => item.visible && item.url
  );
}

export function contactSearchLines(content) {
  const normalized = normalizeContactContent(content);
  return [
    normalized.intro,
    normalized.email,
    normalized.githubLabel,
    normalized.githubUrl,
    ...getVisibleContactSocials(normalized).flatMap((item) => [
      item.label,
      item.url,
    ]),
  ];
}

/** Public Contact.sh fields only — never visitor Message inbox / contact_messages. */
export function contactForAiKnowledge(content) {
  const normalized = normalizeContactContent(content);
  return {
    intro: normalized.intro,
    email: normalized.email || null,
    github: normalized.githubUrl
      ? { label: normalized.githubLabel, url: normalized.githubUrl }
      : null,
    socials: getVisibleContactSocials(normalized).map((item) => ({
      platform: item.platform,
      label: item.label,
      url: item.url,
    })),
  };
}
