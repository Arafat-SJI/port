/**
 * Pure helpers for the AI chat knowledge JSON.
 * Public portfolio content only — never auth / dashboard credentials.
 *
 * Source of truth: Supabase `portfolio_settings` key `ai_knowledge`.
 */

export const AI_KNOWLEDGE_SETTINGS_KEY = "ai_knowledge";

export const AI_CREDENTIALS_REFUSAL =
  "I am not going to provide you this kind of data";

export const AI_SECURITY_BLOCK = {
  password_and_credentials_policy:
    "If the user asks about password, login credentials, dashboard email/password, or any secret account data, reply exactly or equivalently: I am not going to provide you this kind of data",
};

function asSection(value, fallbackTitle, listKey = "items") {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  return {
    title: fallbackTitle,
    [listKey]: Array.isArray(value) ? value : [],
  };
}

/**
 * Build knowledge from dashboard public content only.
 * Omits visibility flags and any hidden About fields to keep tokens lean.
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

  return {
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
  };
}
