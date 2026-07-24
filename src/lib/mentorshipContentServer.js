import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_MENTORSHIP_CONTENT,
  MENTORSHIP_SETTINGS_KEY,
  normalizeMentorshipContent,
} from "@/lib/mentorshipContent";

export async function readMentorshipContentFromSupabase() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", MENTORSHIP_SETTINGS_KEY)
      .maybeSingle();

    if (error || !data?.value) {
      return normalizeMentorshipContent(DEFAULT_MENTORSHIP_CONTENT);
    }

    return normalizeMentorshipContent(data.value);
  } catch {
    return normalizeMentorshipContent(DEFAULT_MENTORSHIP_CONTENT);
  }
}

export async function writeMentorshipContentToSupabase(content, client) {
  const normalized = normalizeMentorshipContent(content);
  const supabase = client ?? createAdminClient();
  const { error } = await supabase.from("portfolio_settings").upsert(
    {
      key: MENTORSHIP_SETTINGS_KEY,
      value: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message || "Could not save Mentorship content");
  }

  const { syncAiKnowledgeFromDashboard } = await import("@/lib/aiKnowledgeServer");
  await syncAiKnowledgeFromDashboard();

  return normalized;
}
