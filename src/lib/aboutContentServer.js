import { createAdminClient } from "@/lib/supabase/admin";
import {
  ABOUT_SETTINGS_KEY,
  DEFAULT_ABOUT_CONTENT,
  normalizeAboutContent,
} from "@/lib/aboutContent";

export async function readAboutContentFromSupabase() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", ABOUT_SETTINGS_KEY)
      .maybeSingle();

    if (error || !data?.value) {
      return normalizeAboutContent(DEFAULT_ABOUT_CONTENT);
    }

    return normalizeAboutContent(data.value);
  } catch {
    return normalizeAboutContent(DEFAULT_ABOUT_CONTENT);
  }
}

/**
 * Persist About content. Pass an authenticated Supabase client when available;
 * falls back to service-role upsert.
 */
export async function writeAboutContentToSupabase(content, client) {
  const normalized = normalizeAboutContent(content);
  const supabase = client ?? createAdminClient();
  const { error } = await supabase.from("portfolio_settings").upsert(
    {
      key: ABOUT_SETTINGS_KEY,
      value: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message || "Could not save About content");
  }

  return normalized;
}
