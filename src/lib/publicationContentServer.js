import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_PUBLICATION_CONTENT,
  PUBLICATION_SETTINGS_KEY,
  normalizePublicationContent,
} from "@/lib/publicationContent";

export async function readPublicationContentFromSupabase() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", PUBLICATION_SETTINGS_KEY)
      .maybeSingle();

    if (error || !data?.value) {
      return normalizePublicationContent(DEFAULT_PUBLICATION_CONTENT);
    }

    return normalizePublicationContent(data.value);
  } catch {
    return normalizePublicationContent(DEFAULT_PUBLICATION_CONTENT);
  }
}

/**
 * Persist Publication content. Pass an authenticated Supabase client when available;
 * falls back to service-role upsert.
 */
export async function writePublicationContentToSupabase(content, client) {
  const normalized = normalizePublicationContent(content);
  const supabase = client ?? createAdminClient();
  const { error } = await supabase.from("portfolio_settings").upsert(
    {
      key: PUBLICATION_SETTINGS_KEY,
      value: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message || "Could not save Publication content");
  }

  const { syncAiKnowledgeFromDashboard } = await import("@/lib/aiKnowledgeServer");
  await syncAiKnowledgeFromDashboard();

  return normalized;
}
