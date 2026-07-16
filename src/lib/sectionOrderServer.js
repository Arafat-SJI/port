import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_SECTION_ORDER,
  normalizeSectionOrder,
} from "@/lib/sectionOrder";

const SECTION_ORDER_KEY = "section_order";

export async function readSectionOrderFromSupabase() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("value")
      .eq("key", SECTION_ORDER_KEY)
      .maybeSingle();

    if (error || !data?.value) {
      return [...DEFAULT_SECTION_ORDER];
    }

    return normalizeSectionOrder(data.value);
  } catch {
    return [...DEFAULT_SECTION_ORDER];
  }
}

/** @deprecated Use readSectionOrderFromSupabase */
export async function readSectionOrderFromDisk() {
  return readSectionOrderFromSupabase();
}

/**
 * Persist section order. Pass an authenticated Supabase client when available
 * so RLS (authenticated write) applies; falls back to service-role upsert.
 */
export async function writeSectionOrderToSupabase(order, client) {
  const normalized = normalizeSectionOrder(order);
  const supabase = client ?? createAdminClient();
  const { error } = await supabase.from("portfolio_settings").upsert(
    {
      key: SECTION_ORDER_KEY,
      value: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message || "Could not save section order");
  }

  // Keep AI chat knowledge JSON in sync (public portfolio data only).
  const { syncAiKnowledgeFromDashboard } = await import("@/lib/aiKnowledgeServer");
  await syncAiKnowledgeFromDashboard();

  return normalized;
}

/** @deprecated Use writeSectionOrderToSupabase */
export async function writeSectionOrderToDisk(order) {
  return writeSectionOrderToSupabase(order);
}
