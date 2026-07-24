import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_EDUCATION_CONTENT,
  EDUCATION_SETTINGS_KEY,
  normalizeEducationContent,
} from "@/lib/educationContent";

export async function readEducationContentFromSupabase() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", EDUCATION_SETTINGS_KEY)
      .maybeSingle();

    if (error || !data?.value) {
      return normalizeEducationContent(DEFAULT_EDUCATION_CONTENT);
    }

    return normalizeEducationContent(data.value);
  } catch {
    return normalizeEducationContent(DEFAULT_EDUCATION_CONTENT);
  }
}

/**
 * Persist Education content. Pass an authenticated Supabase client when available;
 * falls back to service-role upsert.
 */
export async function writeEducationContentToSupabase(content, client) {
  const normalized = normalizeEducationContent(content);
  const supabase = client ?? createAdminClient();
  const { error } = await supabase.from("portfolio_settings").upsert(
    {
      key: EDUCATION_SETTINGS_KEY,
      value: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message || "Could not save Education content");
  }

  const { syncAiKnowledgeFromDashboard } = await import("@/lib/aiKnowledgeServer");
  await syncAiKnowledgeFromDashboard();

  return normalized;
}
