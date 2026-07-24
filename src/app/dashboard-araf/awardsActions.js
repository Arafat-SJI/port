"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeAwardsContent } from "@/lib/awardsContent";
import { writeAwardsContentToSupabase } from "@/lib/awardsContentServer";

export async function saveAwardsContentAction(prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", success: false, content: null };
  }

  const itemsRaw = formData.get("items");
  const titleRaw = formData.get("title");
  let parsed;
  try {
    parsed = typeof itemsRaw === "string" ? JSON.parse(itemsRaw) : itemsRaw;
  } catch {
    return { error: "Invalid awards payload.", success: false, content: null };
  }

  const normalized = normalizeAwardsContent({
    title: typeof titleRaw === "string" ? titleRaw : "",
    items: parsed,
  });

  if (!normalized.title.trim()) {
    return {
      error: "Section header title is required.",
      success: false,
      content: null,
    };
  }

  if (!normalized.items.length) {
    return {
      error: "Add at least one award.",
      success: false,
      content: null,
    };
  }

  for (const item of normalized.items) {
    if (!item.title.trim()) {
      return {
        error: "Each award needs a title.",
        success: false,
        content: null,
      };
    }
  }

  try {
    const saved = await writeAwardsContentToSupabase(normalized, supabase);
    revalidatePath("/");
    revalidatePath("/dashboard-araf/awards");
    return {
      error: null,
      success: true,
      content: saved,
      message: "Awards saved.",
    };
  } catch {
    return {
      error: "Could not save Awards content.",
      success: false,
      content: null,
    };
  }
}
