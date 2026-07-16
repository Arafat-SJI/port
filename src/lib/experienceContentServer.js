import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_EXPERIENCE_CONTENT,
  EXPERIENCE_SETTINGS_KEY,
  normalizeExperienceContent,
} from "@/lib/experienceContent";

export async function readExperienceContentFromSupabase() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", EXPERIENCE_SETTINGS_KEY)
      .maybeSingle();

    if (error || !data?.value) {
      return normalizeExperienceContent(DEFAULT_EXPERIENCE_CONTENT);
    }

    return normalizeExperienceContent(data.value);
  } catch {
    return normalizeExperienceContent(DEFAULT_EXPERIENCE_CONTENT);
  }
}

/**
 * Persist Experience content. Pass an authenticated Supabase client when available;
 * falls back to service-role upsert.
 */
export async function writeExperienceContentToSupabase(content, client) {
  const normalized = normalizeExperienceContent(content);
  const supabase = client ?? createAdminClient();
  const { error } = await supabase.from("portfolio_settings").upsert(
    {
      key: EXPERIENCE_SETTINGS_KEY,
      value: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message || "Could not save Experience content");
  }

  const { syncAiKnowledgeFromDashboard } = await import("@/lib/aiKnowledgeServer");
  await syncAiKnowledgeFromDashboard();

  return normalized;
}
