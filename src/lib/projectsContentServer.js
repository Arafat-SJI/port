import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_PROJECTS_CONTENT,
  PROJECTS_SETTINGS_KEY,
  normalizeProjectsContent,
} from "@/lib/projectsContent";

export async function readProjectsContentFromSupabase() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", PROJECTS_SETTINGS_KEY)
      .maybeSingle();

    if (error || !data?.value) {
      return normalizeProjectsContent(DEFAULT_PROJECTS_CONTENT);
    }

    return normalizeProjectsContent(data.value);
  } catch {
    return normalizeProjectsContent(DEFAULT_PROJECTS_CONTENT);
  }
}

/**
 * Persist Projects content. Pass an authenticated Supabase client when available;
 * falls back to service-role upsert.
 */
export async function writeProjectsContentToSupabase(content, client) {
  const normalized = normalizeProjectsContent(content);
  const supabase = client ?? createAdminClient();
  const { error } = await supabase.from("portfolio_settings").upsert(
    {
      key: PROJECTS_SETTINGS_KEY,
      value: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message || "Could not save Projects content");
  }

  const { syncAiKnowledgeFromDashboard } = await import("@/lib/aiKnowledgeServer");
  await syncAiKnowledgeFromDashboard();

  return normalized;
}
