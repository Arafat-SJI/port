/**
 * Pure helpers for the AI chat knowledge JSON.
 * Public portfolio content only — never auth / dashboard credentials.
 *
 * Source of truth: Supabase `portfolio_settings` key `ai_knowledge`.
 *
 * NEVER include:
 * - Dashboard Message inbox / `contact_messages` (visitor DMs)
 * - Dashboard AI Chat inbox / `ai_chat_messages` (visitor AI questions by IP)
 * - Auth credentials / settings
 */

export const AI_KNOWLEDGE_SETTINGS_KEY = "ai_knowledge";

/** Keys that must never appear in the AI knowledge payload. */
export const AI_KNOWLEDGE_EXCLUDED_KEYS = [
  "messages",
  "message",
  "contact_messages",
  "ai_chat_messages",
  "ai_chats",
  "inbox",
  "gemini_api_key",
  "gemini_api_keys",
  "apiKey",
  "api_key",
  "dashboard_secrets",
  "ui_extensions",
  "ui_extension",
  "default_extensions",
];

export const AI_CREDENTIALS_REFUSAL =
  "I am not going to provide you this kind of data";

export const AI_SECURITY_BLOCK = {
  password_and_credentials_policy:
    "If the user asks about password, login credentials, dashboard email/password, or any secret account data, reply exactly or equivalently: I am not going to provide you this kind of data",
  message_inbox_policy:
    "Visitor Message inbox and contact form submissions are private dashboard data and are never included in this knowledgebase.",
  ai_chat_inbox_policy:
    "Visitor AI Chat questions (logged by IP for the dashboard) are private and are never included in this knowledgebase.",
  api_keys_policy:
    "Gemini and other API keys are stored only in dashboard_secrets and must never appear in this knowledgebase.",
};

function asSection(value, fallbackTitle, listKey = "items") {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  return {
    title: fallbackTitle,
    [listKey]: Array.isArray(value) ? value : [],
  };
}

/** Strip Message-inbox / forbidden keys from a knowledge object. */
export function stripExcludedAiKnowledgeKeys(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return input;
  const out = { ...input };
  for (const key of AI_KNOWLEDGE_EXCLUDED_KEYS) {
    delete out[key];
  }
  return out;
}

/**
 * Build knowledge from dashboard public content only.
 * Omits visibility flags and any hidden About fields to keep tokens lean.
 * Does not include Message inbox / contact_messages or AI Chat inbox / ai_chat_messages.
 */
export function buildAiKnowledgePayload({
  about,
  experience,
  skills,
  projects,
  education,
  awards,
  publication,
  gallery,
  clubing,
  mentorship,
  contact,
  sectionOrder,
}) {
  const a = about && typeof about === "object" ? about : {};
  const vis = a.visibility && typeof a.visibility === "object" ? a.visibility : {};

  const aboutOut = {};

  if (vis.headline !== false) {
    aboutOut.headline = `${a.headlinePrefix ?? ""}${a.headlineHighlight ?? ""}${a.headlineSuffix ?? ""}`;
  }
  if (vis.intro !== false) {
    aboutOut.intro = String(a.introPlain ?? a.intro ?? "");
  }
  if (vis.summary !== false) {
    aboutOut.summary = String(a.summary ?? "");
  }
  if (vis.interests !== false) {
    aboutOut.interests = Array.isArray(a.interests)
      ? a.interests.map((i) => String(i ?? "").trim()).filter(Boolean)
      : [];
  }
  if (vis.primaryCta !== false && a.primaryCta) {
    aboutOut.primaryCta = String(a.primaryCta);
  }
  if (vis.secondaryCta !== false && a.secondaryCta) {
    aboutOut.secondaryCta = String(a.secondaryCta);
  }
  if (vis.image !== false && a.imageUrl) {
    aboutOut.imageUrl = String(a.imageUrl);
  }
  if (vis.secondaryCta !== false && a.cvUrl) {
    aboutOut.cvUrl = String(a.cvUrl);
  }

  return stripExcludedAiKnowledgeKeys({
    security: { ...AI_SECURITY_BLOCK },
    updatedAt: new Date().toISOString(),
    sectionOrder: Array.isArray(sectionOrder) ? [...sectionOrder] : [],
    about: aboutOut,
    experience: asSection(experience, "Experience"),
    skills: asSection(skills, "Tech Stack", "groups"),
    projects: asSection(projects, "Selected Projects"),
    education: asSection(education, "Education"),
    awards: asSection(awards, "Awards"),
    publication: asSection(publication, "Publication"),
    gallery: asSection(gallery, "Gallery"),
    clubing: asSection(clubing, "Clubing"),
    mentorship: asSection(mentorship, "Mentorship"),
    // Public Contact.sh only — never visitor Message inbox
    contact: contact && typeof contact === "object" ? contact : null,
  });
}
