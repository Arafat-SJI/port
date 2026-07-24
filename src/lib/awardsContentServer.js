import { createAdminClient } from "@/lib/supabase/admin";
import {
  AWARDS_SETTINGS_KEY,
  DEFAULT_AWARDS_CONTENT,
  normalizeAwardsContent,
} from "@/lib/awardsContent";

export async function readAwardsContentFromSupabase() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", AWARDS_SETTINGS_KEY)
      .maybeSingle();

    if (error || !data?.value) {
      return normalizeAwardsContent(DEFAULT_AWARDS_CONTENT);
    }

    return normalizeAwardsContent(data.value);
  } catch {
    return normalizeAwardsContent(DEFAULT_AWARDS_CONTENT);
  }
}

/**
 * Persist Awards content. Pass an authenticated Supabase client when available;
 * falls back to service-role upsert.
 */
export async function writeAwardsContentToSupabase(content, client) {
  const normalized = normalizeAwardsContent(content);
  const supabase = client ?? createAdminClient();
  const { error } = await supabase.from("portfolio_settings").upsert(
    {
      key: AWARDS_SETTINGS_KEY,
      value: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message || "Could not save Awards content");
  }

  const { syncAiKnowledgeFromDashboard } = await import("@/lib/aiKnowledgeServer");
  await syncAiKnowledgeFromDashboard();

  return normalized;
}
