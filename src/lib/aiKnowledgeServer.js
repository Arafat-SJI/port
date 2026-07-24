import { stripIntroMarkup } from "@/lib/aboutContent";
import { readAboutContentFromSupabase } from "@/lib/aboutContentServer";
import {
  AI_KNOWLEDGE_SETTINGS_KEY,
  AI_SECURITY_BLOCK,
  buildAiKnowledgePayload,
  stripExcludedAiKnowledgeKeys,
} from "@/lib/aiKnowledge";
import { awardsForAiKnowledge } from "@/lib/awardsContent";
import { readAwardsContentFromSupabase } from "@/lib/awardsContentServer";
import { clubingForAiKnowledge } from "@/lib/clubingContent";
import { readClubingContentFromSupabase } from "@/lib/clubingContentServer";
import { contactForAiKnowledge } from "@/lib/contactContent";
import { readContactContentFromSupabase } from "@/lib/contactContentServer";
import { educationForAiKnowledge } from "@/lib/educationContent";
import { readEducationContentFromSupabase } from "@/lib/educationContentServer";
import { experienceForAiKnowledge } from "@/lib/experienceContent";
import { readExperienceContentFromSupabase } from "@/lib/experienceContentServer";
import { galleryForAiKnowledge } from "@/lib/galleryContent";
import { readGalleryContentFromSupabase } from "@/lib/galleryContentServer";
import { mentorshipForAiKnowledge } from "@/lib/mentorshipContent";
import { readMentorshipContentFromSupabase } from "@/lib/mentorshipContentServer";
import { projectsForAiKnowledge } from "@/lib/projectsContent";
import { readProjectsContentFromSupabase } from "@/lib/projectsContentServer";
import { publicationForAiKnowledge } from "@/lib/publicationContent";
import { readPublicationContentFromSupabase } from "@/lib/publicationContentServer";
import { skillsForAiKnowledge } from "@/lib/skillsContent";
import { readSkillsContentFromSupabase } from "@/lib/skillsContentServer";
import { createAdminClient } from "@/lib/supabase/admin";
import { readSectionOrderFromSupabase } from "@/lib/sectionOrderServer";

const EMPTY_KNOWLEDGE = {
  security: { ...AI_SECURITY_BLOCK },
  updatedAt: null,
  sectionOrder: [],
  about: null,
  experience: { title: "Experience", items: [] },
  skills: { title: "Tech Stack", groups: [] },
  projects: { title: "Selected Projects", subtitle: null, items: [] },
  education: { title: "Education", items: [] },
  awards: { title: "Awards", items: [] },
  publication: { title: "Publication", items: [] },
  gallery: { title: "Gallery", items: [] },
  clubing: { title: "Clubing", items: [] },
  mentorship: { title: "Mentorship", stats: {}, items: [] },
  contact: null,
};

function coerceSection(value, fallbackTitle, listKey = "items") {
  if (Array.isArray(value)) {
    return { title: fallbackTitle, [listKey]: value };
  }
  if (value && typeof value === "object") return value;
  return { title: fallbackTitle, [listKey]: [] };
}

/**
 * Rebuild AI knowledge from current dashboard public content and upsert to
 * Supabase `portfolio_settings` (`ai_knowledge`).
 * Never reads or writes Message inbox / contact_messages or AI Chat inbox / ai_chat_messages.
 * Does not throw — dashboard saves must not fail if sync has issues.
 */
export async function syncAiKnowledgeFromDashboard() {
  try {
    const [
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
    ] = await Promise.all([
      readAboutContentFromSupabase(),
      readExperienceContentFromSupabase(),
      readSkillsContentFromSupabase(),
      readProjectsContentFromSupabase(),
      readEducationContentFromSupabase(),
      readAwardsContentFromSupabase(),
      readPublicationContentFromSupabase(),
      readGalleryContentFromSupabase(),
      readClubingContentFromSupabase(),
      readMentorshipContentFromSupabase(),
      readContactContentFromSupabase(),
      readSectionOrderFromSupabase(),
    ]);

    // Message / AI Chat inboxes intentionally omitted — private, never AI context.
    const payload = buildAiKnowledgePayload({
      about: {
        ...about,
        introPlain: stripIntroMarkup(about.intro),
      },
      experience: experienceForAiKnowledge(experience),
      skills: skillsForAiKnowledge(skills),
      projects: projectsForAiKnowledge(projects),
      education: educationForAiKnowledge(education),
      awards: awardsForAiKnowledge(awards),
      publication: publicationForAiKnowledge(publication),
      gallery: galleryForAiKnowledge(gallery),
      clubing: clubingForAiKnowledge(clubing),
      mentorship: mentorshipForAiKnowledge(mentorship),
      contact: contactForAiKnowledge(contact),
      sectionOrder,
    });

    const supabase = createAdminClient();
    const { error } = await supabase.from("portfolio_settings").upsert(
      {
        key: AI_KNOWLEDGE_SETTINGS_KEY,
        value: payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    if (error) {
      console.error("[ai-knowledge] Supabase upsert failed:", error.message);
      return null;
    }

    return payload;
  } catch (err) {
    console.error("[ai-knowledge] sync failed:", err?.message || err);
    return null;
  }
}

/**
 * Read cached AI knowledge from Supabase.
 * Strips visibility flags and any Message-inbox keys so the viewer stays clean.
 */
export async function readAiKnowledgeFromSupabase() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", AI_KNOWLEDGE_SETTINGS_KEY)
      .maybeSingle();

    if (error || !data?.value || typeof data.value !== "object") {
      return { ...EMPTY_KNOWLEDGE };
    }

    const value = stripExcludedAiKnowledgeKeys({ ...data.value });
    if (value.about && typeof value.about === "object") {
      const { visibility: _visibility, ...aboutRest } = value.about;
      value.about = aboutRest;
    }

    return {
      ...value,
      security: {
        ...AI_SECURITY_BLOCK,
        ...(value.security && typeof value.security === "object" ? value.security : {}),
      },
      experience: coerceSection(value.experience, "Experience"),
      skills: coerceSection(value.skills, "Tech Stack", "groups"),
      projects: coerceSection(value.projects, "Selected Projects"),
      education: coerceSection(value.education, "Education"),
      awards: coerceSection(value.awards, "Awards"),
      publication: coerceSection(value.publication, "Publication"),
      gallery: coerceSection(value.gallery, "Gallery"),
      clubing: coerceSection(value.clubing, "Clubing"),
      mentorship: coerceSection(value.mentorship, "Mentorship"),
      contact: value.contact && typeof value.contact === "object" ? value.contact : null,
    };
  } catch {
    return { ...EMPTY_KNOWLEDGE };
  }
}
