import { createAdminClient } from "@/lib/supabase/admin";
import {
  CONTACT_SETTINGS_KEY,
  DEFAULT_CONTACT_CONTENT,
  normalizeContactContent,
} from "@/lib/contactContent";

export async function readContactContentFromSupabase() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", CONTACT_SETTINGS_KEY)
      .maybeSingle();

    if (error || !data?.value) {
      return normalizeContactContent(DEFAULT_CONTACT_CONTENT);
    }

    return normalizeContactContent(data.value);
  } catch {
    return normalizeContactContent(DEFAULT_CONTACT_CONTENT);
  }
}

export async function writeContactContentToSupabase(content, client) {
  const normalized = normalizeContactContent(content);
  const { _legacySocial, ...payload } = normalized;
  const supabase = client ?? createAdminClient();
  const { error } = await supabase.from("portfolio_settings").upsert(
    {
      key: CONTACT_SETTINGS_KEY,
      value: payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message || "Could not save Contact content");
  }

  const { syncAiKnowledgeFromDashboard } = await import("@/lib/aiKnowledgeServer");
  await syncAiKnowledgeFromDashboard();

  return normalizeContactContent(payload);
}
