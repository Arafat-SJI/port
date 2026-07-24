import { createAdminClient } from "@/lib/supabase/admin";
import {
  CLUBING_SETTINGS_KEY,
  DEFAULT_CLUBING_CONTENT,
  normalizeClubingContent,
} from "@/lib/clubingContent";

export async function readClubingContentFromSupabase() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", CLUBING_SETTINGS_KEY)
      .maybeSingle();

    if (error || !data?.value) {
      return normalizeClubingContent(DEFAULT_CLUBING_CONTENT);
    }

    return normalizeClubingContent(data.value);
  } catch {
    return normalizeClubingContent(DEFAULT_CLUBING_CONTENT);
  }
}

export async function writeClubingContentToSupabase(content, client) {
  const normalized = normalizeClubingContent(content);
  const supabase = client ?? createAdminClient();
  const { error } = await supabase.from("portfolio_settings").upsert(
    {
      key: CLUBING_SETTINGS_KEY,
      value: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message || "Could not save Clubing content");
  }

  const { syncAiKnowledgeFromDashboard } = await import("@/lib/aiKnowledgeServer");
  await syncAiKnowledgeFromDashboard();

  return normalized;
}
