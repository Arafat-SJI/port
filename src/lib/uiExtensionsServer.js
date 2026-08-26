import { createAdminClient } from "@/lib/supabase/admin";
import {
  FALLBACK_UI_EXTENSIONS,
  UI_EXTENSIONS_SETTINGS_KEY,
  normalizeUiExtensions,
  uiExtensionsBodyEqual,
} from "@/lib/uiExtensions";

export async function readUiExtensionsFromSupabase() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", UI_EXTENSIONS_SETTINGS_KEY)
      .maybeSingle();

    if (error || !data?.value) {
      return normalizeUiExtensions(FALLBACK_UI_EXTENSIONS);
    }

    return normalizeUiExtensions(data.value);
  } catch {
    return normalizeUiExtensions(FALLBACK_UI_EXTENSIONS);
  }
}

/**
 * Persist site-wide UI / extension defaults.
 * Bumps `revision` only when the UI config actually changes so visitors'
 * localStorage is invalidated and they see the new defaults.
 * Does NOT sync AI knowledge (UI chrome only).
 */
export async function writeUiExtensionsToSupabase(content, client) {
  const incoming = normalizeUiExtensions(content);
  const supabase = client ?? createAdminClient();

  let previous = normalizeUiExtensions(FALLBACK_UI_EXTENSIONS);
  try {
    const { data } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", UI_EXTENSIONS_SETTINGS_KEY)
      .maybeSingle();
    if (data?.value) previous = normalizeUiExtensions(data.value);
  } catch {
    // keep fallback previous
  }

  const changed = !uiExtensionsBodyEqual(incoming, previous);
  const normalized = {
    ...incoming,
    revision: changed
      ? new Date().toISOString()
      : previous.revision || incoming.revision || new Date().toISOString(),
  };

  const { error } = await supabase.from("portfolio_settings").upsert(
    {
      key: UI_EXTENSIONS_SETTINGS_KEY,
      value: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message || "Could not save UI extension defaults");
  }

  return normalized;
}
