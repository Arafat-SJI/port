import { stripIntroMarkup } from "@/lib/aboutContent";
import { readAboutContentFromSupabase } from "@/lib/aboutContentServer";
import {
  AI_KNOWLEDGE_SETTINGS_KEY,
  AI_SECURITY_BLOCK,
  buildAiKnowledgePayload,
} from "@/lib/aiKnowledge";
import { experienceForAiKnowledge } from "@/lib/experienceContent";
import { readExperienceContentFromSupabase } from "@/lib/experienceContentServer";
import { projectsForAiKnowledge } from "@/lib/projectsContent";
import { readProjectsContentFromSupabase } from "@/lib/projectsContentServer";
import { skillsForAiKnowledge } from "@/lib/skillsContent";
import { readSkillsContentFromSupabase } from "@/lib/skillsContentServer";
import { createAdminClient } from "@/lib/supabase/admin";
import { readSectionOrderFromSupabase } from "@/lib/sectionOrderServer";

/**
 * Rebuild AI knowledge from current dashboard public content and upsert to
 * Supabase `portfolio_settings` (`ai_knowledge`).
 * Does not throw — dashboard saves must not fail if sync has issues.
 */
export async function syncAiKnowledgeFromDashboard() {
  try {
    const [about, experience, skills, projects, sectionOrder] = await Promise.all([
      readAboutContentFromSupabase(),
      readExperienceContentFromSupabase(),
      readSkillsContentFromSupabase(),
      readProjectsContentFromSupabase(),
      readSectionOrderFromSupabase(),
    ]);

    const payload = buildAiKnowledgePayload({
      about: {
        ...about,
        introPlain: stripIntroMarkup(about.intro),
      },
      experience: experienceForAiKnowledge(experience),
      skills: skillsForAiKnowledge(skills),
      projects: projectsForAiKnowledge(projects),
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
 * Strips any legacy `visibility` keys so the dashboard viewer stays clean.
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
      return {
        security: { ...AI_SECURITY_BLOCK },
        updatedAt: null,
        sectionOrder: [],
        about: null,
        experience: [],
        skills: [],
        projects: [],
      };
    }

    const value = { ...data.value };
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
      experience: Array.isArray(value.experience) ? value.experience : [],
      skills: Array.isArray(value.skills) ? value.skills : [],
      projects: Array.isArray(value.projects) ? value.projects : [],
    };
  } catch {
    return {
      security: { ...AI_SECURITY_BLOCK },
      updatedAt: null,
      sectionOrder: [],
      about: null,
      experience: [],
      skills: [],
      projects: [],
    };
  }
}
