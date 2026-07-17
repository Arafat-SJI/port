import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_SKILLS_CONTENT,
  SKILLS_SETTINGS_KEY,
  normalizeSkillsContent,
} from "@/lib/skillsContent";

export async function readSkillsContentFromSupabase() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", SKILLS_SETTINGS_KEY)
      .maybeSingle();

    if (error || !data?.value) {
      return normalizeSkillsContent(DEFAULT_SKILLS_CONTENT);
    }

    return normalizeSkillsContent(data.value);
  } catch {
    return normalizeSkillsContent(DEFAULT_SKILLS_CONTENT);
  }
}

/**
 * Persist Skills content. Pass an authenticated Supabase client when available;
 * falls back to service-role upsert.
 */
export async function writeSkillsContentToSupabase(content, client) {
  const normalized = normalizeSkillsContent(content);
  const supabase = client ?? createAdminClient();
  const { error } = await supabase.from("portfolio_settings").upsert(
    {
      key: SKILLS_SETTINGS_KEY,
      value: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message || "Could not save Skills content");
  }

  const { syncAiKnowledgeFromDashboard } = await import("@/lib/aiKnowledgeServer");
  await syncAiKnowledgeFromDashboard();

  return normalized;
}
