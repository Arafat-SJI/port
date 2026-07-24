import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_GALLERY_CONTENT,
  GALLERY_SETTINGS_KEY,
  normalizeGalleryContent,
} from "@/lib/galleryContent";

export async function readGalleryContentFromSupabase() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", GALLERY_SETTINGS_KEY)
      .maybeSingle();

    if (error || !data?.value) {
      return normalizeGalleryContent(DEFAULT_GALLERY_CONTENT);
    }

    return normalizeGalleryContent(data.value);
  } catch {
    return normalizeGalleryContent(DEFAULT_GALLERY_CONTENT);
  }
}

export async function writeGalleryContentToSupabase(content, client) {
  const normalized = normalizeGalleryContent(content);
  const supabase = client ?? createAdminClient();
  const { error } = await supabase.from("portfolio_settings").upsert(
    {
      key: GALLERY_SETTINGS_KEY,
      value: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message || "Could not save Gallery content");
  }

  const { syncAiKnowledgeFromDashboard } = await import("@/lib/aiKnowledgeServer");
  await syncAiKnowledgeFromDashboard();

  return normalized;
}
